import { parseMidi, noteName, midiToFreq } from './midi.js';
import { notesFromMags, dbToMags, analysePcm } from './pitch.js';
import { compare } from './compare.js';
import { parseCommand } from './commands.js';
import { encodeWav } from './wav.js';
import { CHORDS, TUNING, matchChord, FLUTE, FLUTE_RANGE } from './instruments.js';
import { LANGS, setLang, lang, t } from './i18n.js';
import { parseYouTubeId, fmtTime, staffPos, nearest } from './util.js';

const $ = id => document.getElementById(id);
const TICK = 140; // ms between analysis/render frames

// ---------- state ----------
const st = { speed: 1, sync: 0, loopA: null, loopB: null, loopOn: false, inst: 'piano', source: null, bpm: 90, beats: 4 };
let ref = [];            // MIDI notes {midi,time,end}
let detected = [];       // onsets heard from audio {midi,time,end}
let lastHeard = [];
let player = null;       // {play,pause,seek,time,duration,playing,setRate}
let selectMode = 0;      // 0 off, 1 waiting A, 2 waiting B

// ---------- toast / speech ----------
let toastTimer;
function toast(msg) {
  const el = $('toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}
function speak(lines) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  for (const line of lines) { const u = new SpeechSynthesisUtterance(line); u.lang = LANGS[lang()]; speechSynthesis.speak(u); }
}

// ---------- audio graph + earshot sfx ----------
const ac = new (window.AudioContext || window.webkitAudioContext)();
const an = ac.createAnalyser(); an.fftSize = 8192; an.smoothingTimeConstant = 0.3;
const fbuf = new Float32Array(an.frequencyBinCount);
const sfxGain = ac.createGain(); sfxGain.connect(ac.destination);
const SFX = {};
for (const n of ['tick', 'accent', 'success', 'error', 'wake', 'rec'])
  fetch(`sounds/${n}.mp3`).then(r => r.arrayBuffer()).then(b => ac.decodeAudioData(b)).then(b => { SFX[n] = b; }).catch(() => {});
function sfx(name, when = 0, gain = 1) {
  if (!SFX[name]) return 0;
  const s = ac.createBufferSource(), g = ac.createGain();
  s.buffer = SFX[name]; g.gain.value = gain; s.connect(g).connect(sfxGain); s.start(when || ac.currentTime);
  return SFX[name].duration;
}
document.addEventListener('pointerdown', () => ac.state === 'suspended' && ac.resume(), { capture: true });

function pluck(midi, when = ac.currentTime, dur = 1.6, gain = 0.25) { // Karplus-Strong string
  const rate = ac.sampleRate, len = Math.floor(rate * dur), p = Math.round(rate / midiToFreq(midi));
  const b = ac.createBuffer(1, len, rate), d = b.getChannelData(0);
  for (let i = 0; i < p; i++) d[i] = Math.random() * 2 - 1;
  for (let i = p; i < len; i++) d[i] = 0.498 * (d[i - p] + d[i - p + 1]);
  const s = ac.createBufferSource(), g = ac.createGain(); g.gain.value = gain;
  s.buffer = b; s.connect(g).connect(ac.destination); s.start(when);
}
function tone(midi) {
  const o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), now = ac.currentTime;
  o.frequency.value = midiToFreq(midi); o2.frequency.value = midiToFreq(midi) * 2; o2.type = 'triangle';
  g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.3, now + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
  o.connect(g); o2.connect(g); g.connect(ac.destination); o.start(); o2.start(); o.stop(now + 1.3); o2.stop(now + 1.3);
}

// ---------- i18n ----------
function applyLang(l) {
  setLang(l); $('lang').value = lang();
  document.documentElement.lang = lang(); document.title = t('brand');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  refreshLabels();
  if (voiceOn) { rec.stop(); } // restarts in the new language via onend
}
function refreshLabels() {
  $('recBtn').textContent = t(recorder?.state === 'recording' ? 'recStop' : 'recStart');
  $('loopToggle').textContent = t(st.loopOn ? 'loopOff' : 'loopOn');
  $('loopToggle').setAttribute('aria-pressed', st.loopOn);
  $('voiceBtn').textContent = t(voiceOn ? 'voiceOff' : 'voiceOn');
  $('metroBtn').textContent = t(metroTimer ? 'stop' : 'start');
}
$('lang').onchange = e => { applyLang(e.target.value); save(); };

// ---------- players ----------
let ytReady;
function loadYTApi() {
  if (!ytReady) ytReady = new Promise(res => {
    window.onYouTubeIframeAPIReady = res;
    const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.append(s);
  });
  return ytReady;
}
let yt = null;
async function openYouTube(id, startAt = 0) {
  await loadYTApi();
  $('video').pause(); $('video').hidden = true; $('empty').hidden = true;
  st.source = { type: 'yt', id };
  const ready = new Promise(res => {
    if (yt) { yt.loadVideoById({ videoId: id, startSeconds: startAt }); res(); return; }
    yt = new YT.Player('yt', {
      videoId: id, playerVars: { playsinline: 1, rel: 0, start: Math.floor(startAt) },
      events: { onReady: res, onError: () => { toast(t('ytFail')); sfx('error'); }, onStateChange: syncPlayIcon },
    });
  });
  await ready;
  $('yt').hidden = false;
  player = {
    play: () => yt.playVideo(), pause: () => yt.pauseVideo(), seek: s => yt.seekTo(Math.max(0, s), true),
    time: () => yt.getCurrentTime?.() || 0, duration: () => yt.getDuration?.() || 0,
    playing: () => yt.getPlayerState?.() === 1,
    setRate: r => {
      const rates = yt.getAvailablePlaybackRates?.() || [1];
      const v = nearest(rates, r); yt.setPlaybackRate(v);
      if (Math.abs(v - r) > 1e-6) toast(t('speedYT', { v }));
    },
  };
  player.setRate(st.speed);
}
let mediaNode = null;
function openFile(blob, name, startAt = 0) {
  const v = $('video');
  if (yt) { yt.pauseVideo(); $('yt').hidden = true; }
  v.src = URL.createObjectURL(blob); v.hidden = false; $('empty').hidden = true;
  if (!mediaNode) { mediaNode = ac.createMediaElementSource(v); mediaNode.connect(ac.destination); mediaNode.connect(an); }
  st.source = { type: 'file', name };
  player = {
    play: () => { ac.resume(); return v.play(); }, pause: () => v.pause(), seek: s => { v.currentTime = Math.max(0, s); },
    time: () => v.currentTime, duration: () => v.duration || 0, playing: () => !v.paused,
    setRate: r => { v.playbackRate = r; v.preservesPitch = true; },
  };
  v.onplay = v.onpause = syncPlayIcon;
  v.onloadedmetadata = () => { v.currentTime = startAt; player.setRate(st.speed); };
}
function syncPlayIcon() { $('playIcon').setAttribute('d', player?.playing() ? 'M7 4h4v16H7zM14 4h4v16h-4z' : 'M7 4l13 8-13 8z'); }

$('urlForm').onsubmit = e => {
  e.preventDefault();
  const id = parseYouTubeId($('url').value);
  if (!id) { toast(t('badUrl')); sfx('error'); return; }
  openYouTube(id); save();
};
$('mediaFile').onchange = e => {
  const f = e.target.files[0]; if (!f) return;
  openFile(f, f.name); idbPut('media', f); save();
};
$('midiFile').onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  try { loadMidi(await f.arrayBuffer()); idbPut('midi', f); }
  catch (err) { toast(t('midiFail', { e: err.message })); sfx('error'); }
};
function loadMidi(buf) {
  ref = parseMidi(buf);
  toast(t('midiLoaded', { n: ref.length }));
}

$('play').onclick = () => { if (!player) return; player.playing() ? player.pause() : player.play(); setTimeout(syncPlayIcon, 200); };
$('back').onclick = () => player?.seek(player.time() - 5);
$('fwd').onclick = () => player?.seek(player.time() + 5);

// Tab audio: lets the analyser hear a YouTube tab (shared via the browser picker).
let tabNode = null;
$('tabAudio').onclick = async () => {
  try {
    const s = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    if (!s.getAudioTracks().length) { s.getTracks().forEach(x => x.stop()); throw new Error('no audio'); }
    s.getVideoTracks().forEach(x => x.stop());
    tabNode?.disconnect();
    tabNode = ac.createMediaStreamSource(s); tabNode.connect(an); ac.resume();
    toast(t('tabAudioOn'));
  } catch { toast(t('tabAudioFail')); sfx('error'); }
};

// ---------- speed / loop / sync ----------
function setSpeed(v) {
  st.speed = Math.round(Math.min(2, Math.max(0.1, v)) * 10) / 10;
  $('speed').value = st.speed; $('speedOut').textContent = st.speed.toFixed(1) + '×';
  player?.setRate(st.speed);
}
$('speed').oninput = e => setSpeed(+e.target.value);
$('slower').onclick = () => setSpeed(st.speed - 0.1);
$('faster').onclick = () => setSpeed(st.speed + 0.1);
function setSync(v) { st.sync = Math.round(v * 10) / 10; $('sync').value = st.sync; $('syncOut').textContent = st.sync.toFixed(1) + 's'; }
$('sync').oninput = e => setSync(+e.target.value);

function showLoop() {
  $('loopOut').textContent = st.loopA == null ? '—' : `${fmtTime(st.loopA)} → ${st.loopB == null ? '…' : fmtTime(st.loopB)}`;
  refreshLabels();
}
function setLoop(a, b) {
  st.loopA = a; st.loopB = b;
  if (a != null && b != null && b < a) [st.loopA, st.loopB] = [b, a];
  showLoop();
}
$('setA').onclick = () => player && setLoop(player.time(), st.loopB);
$('setB').onclick = () => player && setLoop(st.loopA, player.time());
$('loopToggle').onclick = () => toggleLoop(!st.loopOn);
function toggleLoop(on) {
  if (on && (st.loopA == null || st.loopB == null)) { toast(t('loopNeedAB')); return; }
  st.loopOn = on; refreshLabels();
}
$('loopClear').onclick = () => { st.loopOn = false; setLoop(null, null); };
$('selectMode').onclick = () => {
  selectMode = selectMode ? 0 : 1;
  $('selectMode').setAttribute('aria-pressed', !!selectMode);
  if (selectMode) toast(t('selectA'));
};

// ---------- keyboard ----------
const keyEls = new Map();
(function buildKeys() {
  const box = $('keys'), whites = [];
  for (let m = 21; m <= 108; m++) if (![1, 3, 6, 8, 10].includes(m % 12)) whites.push(m);
  const w = 100 / whites.length;
  for (let m = 21; m <= 108; m++) {
    const black = [1, 3, 6, 8, 10].includes(m % 12);
    const k = document.createElement('button');
    k.className = 'key' + (black ? ' b' : ''); k.setAttribute('aria-label', noteName(m));
    if (black) k.style.left = `calc(${whites.indexOf(m - 1) * w + w}% - 0.6%)`;
    else if (m % 12 === 0) k.innerHTML = `<span>C${m / 12 - 1}</span>`;
    k.onclick = () => { ac.resume(); tone(m); };
    box.append(k); keyEls.set(m, k);
  }
  setTimeout(() => { const c4 = keyEls.get(48); box.parentElement.scrollLeft = c4.offsetLeft - 20; });
})();
let litRef = [], litHit = [];
function lightKeys(refNow, heard) {
  litRef.forEach(m => keyEls.get(m)?.classList.remove('ref')); litHit.forEach(m => keyEls.get(m)?.classList.remove('hit'));
  litRef = refNow; litHit = heard;
  refNow.forEach(m => keyEls.get(m)?.classList.add('ref')); heard.forEach(m => keyEls.get(m)?.classList.add('hit'));
  const all = [...new Set([...refNow, ...heard])];
  $('nowNotes').textContent = all.length ? all.map(noteName).join(' ') : '—';
}

// ---------- staff (SVG grand staff, scrolling window) ----------
const SVGNS = 'http://www.w3.org/2000/svg';
const PAST = 1.5, SPAN = 6, X0 = 70, XW = 520;
const el = (tag, attrs, text) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text) e.textContent = text; return e; };
const xOf = (time, now) => X0 + (time - now + PAST) / SPAN * XW;
function renderStaff(t0) {
  const svg = $('staff'); svg.replaceChildren();
  for (const y of [60, 70, 80, 90, 100, 140, 150, 160, 170, 180]) svg.append(el('line', { x1: 10, x2: 590, y1: y, y2: y }));
  svg.append(el('text', { x: 14, y: 103, class: 'clef' }, '𝄞'), el('text', { x: 14, y: 172, class: 'clef' }, '𝄢'));
  const useRef = ref.length > 0, notes = useRef ? ref : detected, off = useRef ? st.sync : 0;
  const now = t0 - off; // timeline of the notes
  if (st.loopA != null && st.loopB != null) {
    const a = xOf(st.loopA - off, now), b = xOf(st.loopB - off, now);
    svg.append(el('rect', { x: Math.max(X0, a), y: 40, width: Math.max(0, Math.min(590, b) - Math.max(X0, a)), height: 160, class: 'band' }));
  }
  for (const n of notes) {
    if (n.time < now - PAST || n.time > now - PAST + SPAN) continue;
    const x = xOf(n.time, now), { y, sharp, ledgers } = staffPos(n.midi);
    const on = n.time <= now && now < n.end;
    for (const ly of ledgers) svg.append(el('line', { x1: x - 9, x2: x + 9, y1: ly, y2: ly }));
    if (sharp) svg.append(el('text', { x: x - 18, y: y + 5, class: 'acc' }, '♯'));
    const head = el('ellipse', { cx: x, cy: y, rx: 6, ry: 4.5, class: 'n' + (on ? ' on' : '') + (n.time + off === st.loopA ? ' sel' : ''), tabindex: -1 });
    head.append(el('title', {}, `${noteName(n.midi)} · ${fmtTime(n.time + off)}`));
    head.onclick = () => noteClick(n, off);
    svg.append(head, el('line', { x1: x + 5.5, x2: x + 5.5, y1: y, y2: y - 28, class: 'stem' + (on ? ' on' : '') }));
  }
  svg.append(el('line', { x1: xOf(now, now), x2: xOf(now, now), y1: 40, y2: 200, class: 'now' }));
}
function noteClick(n, off) {
  if (selectMode === 1) { setLoop(n.time + off, null); selectMode = 2; toast(t('selectB')); return; }
  if (selectMode === 2) {
    setLoop(st.loopA, n.end + off); selectMode = 0; $('selectMode').setAttribute('aria-pressed', false);
    toggleLoop(true); toast(t('loopSet')); return;
  }
  player?.seek(n.time + off);
}

// ---------- main loop: analyse, light keys, staff, loop, autosave ----------
let lastSave = 0;
setInterval(() => {
  const now = player ? player.time() : 0;
  if (player && st.loopOn && st.loopB != null && now >= st.loopB) player.seek(st.loopA);
  $('clock').textContent = `${fmtTime(now)} / ${fmtTime(player?.duration())}`;

  an.getFloatFrequencyData(fbuf);
  const heard = (player?.playing() || tabNode) ? notesFromMags(dbToMags(fbuf), ac.sampleRate, an.fftSize) : [];
  if (player?.playing()) { // note onsets for the staff when no MIDI is linked
    for (const m of heard) if (!lastHeard.includes(m)) detected.push({ midi: m, time: now, end: now + 0.3 });
    for (const d of detected) if (heard.includes(d.midi) && d.end >= now - 0.2) d.end = now + 0.15;
    if (detected.length > 3000) detected = detected.slice(-2000);
  }
  lastHeard = heard;
  const mt = now - st.sync;
  const refNow = ref.filter(n => n.time <= mt && mt < n.end).map(n => n.midi);
  lightKeys(refNow, heard);
  renderStaff(now);
  if (st.inst === 'guitar') { const c = matchChord(refNow.length ? refNow : heard); if (c) { $('chordAuto').textContent = t('chordAuto', { c }); drawChord(c); } }
  if (st.inst === 'flute') { const n = (refNow.length ? refNow : heard).find(m => FLUTE[m]); if (n) drawFlute(n); }
  if (recorder?.state === 'recording') captureMic();
  if (Date.now() - lastSave > 1000) { lastSave = Date.now(); save(); }
}, TICK);

// ---------- instruments ----------
document.querySelectorAll('.tab').forEach(b => b.onclick = () => setInst(b.dataset.inst));
function setInst(inst) {
  st.inst = inst;
  document.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', b.dataset.inst === inst));
  for (const p of ['piano', 'guitar', 'flute']) $('pane-' + p).hidden = p !== inst;
}
for (const c of Object.keys(CHORDS)) $('chord').append(new Option(c, c));
$('chord').onchange = e => drawChord(e.target.value);
function drawChord(name) {
  $('chord').value = name;
  const svg = $('fret'); svg.replaceChildren();
  const fr = CHORDS[name], base = Math.max(1, Math.min(...fr.filter(f => f > 0)) > 3 ? Math.min(...fr.filter(f => f > 0)) : 1);
  for (let s = 0; s < 6; s++) svg.append(el('line', { x1: 20 + s * 20, x2: 20 + s * 20, y1: 30, y2: 140 }));
  for (let f = 0; f <= 5; f++) svg.append(el('line', { x1: 20, x2: 120, y1: 30 + f * 22, y2: 30 + f * 22, 'stroke-width': f === 0 && base === 1 ? 4 : 1 }));
  if (base > 1) svg.append(el('text', { x: 124, y: 45 }, base + 'fr'));
  fr.forEach((f, s) => {
    const x = 20 + s * 20;
    if (f < 0) svg.append(el('text', { x: x - 4, y: 22 }, '×'));
    else if (f === 0) svg.append(el('circle', { cx: x, cy: 18, r: 5 }));
    else svg.append(el('circle', { cx: x, cy: 30 + (f - base + 0.5) * 22, r: 7, class: 'dot' }));
  });
}
drawChord('C');
const strum = ['↓', '−', '↓', '↑', '−', '↑', '↓', '↑'];
const CYCLE = { '↓': '↑', '↑': '−', '−': '↓' };
strum.forEach((s, i) => {
  const b = document.createElement('button'); b.className = 'btn'; b.textContent = s; b.setAttribute('aria-label', `${i + 1}: ${s}`);
  b.onclick = () => { strum[i] = CYCLE[strum[i]]; b.textContent = strum[i]; b.setAttribute('aria-label', `${i + 1}: ${strum[i]}`); };
  $('strum').append(b);
});
$('strumPlay').onclick = () => {
  ac.resume();
  const step = 60 / st.bpm / 2, notes = CHORDS[$('chord').value].map((f, i) => (f < 0 ? null : TUNING[i] + f)).filter(n => n != null);
  const cells = $('strum').children;
  strum.forEach((s, i) => {
    const at = ac.currentTime + 0.05 + i * step;
    setTimeout(() => { [...cells].forEach((c, j) => c.classList.toggle('now', j === i)); }, (at - ac.currentTime) * 1000);
    if (s === '−') return;
    (s === '↓' ? notes : [...notes].reverse()).forEach((n, k) => pluck(n, at + k * 0.012, 1.2, s === '↓' ? 0.2 : 0.14));
  });
  setTimeout(() => [...cells].forEach(c => c.classList.remove('now')), strum.length * step * 1000 + 200);
};
for (let m = FLUTE_RANGE[0]; m <= FLUTE_RANGE[1]; m++) $('fluteNote').append(new Option(noteName(m), m));
$('fluteNote').onchange = e => drawFlute(+e.target.value);
function drawFlute(m) {
  $('fluteNote').value = m;
  const f = FLUTE[m], svg = $('flute'); svg.replaceChildren();
  const on = k => f.keys.includes(k);
  svg.append(el('rect', { x: 4, y: 34, width: 312, height: 22, rx: 11 }));
  const holes = [['L1', 60], ['L2', 90], ['L3', 120], ['R1', 175], ['R2', 205], ['R3', 235]];
  for (const [k, x] of holes) svg.append(el('circle', { cx: x, cy: 45, r: 9, class: on(k) ? 'closed' : '' }), el('text', { x: x - 7, y: 78 }, k));
  svg.append(el('rect', { x: 140, y: 38, width: 12, height: 14, rx: 3, class: on('Gs') ? 'closed' : '' }), el('text', { x: 136, y: 78 }, 'G♯'));
  svg.append(el('rect', { x: 255, y: 38, width: 14, height: 14, rx: 3, class: on('Eb') ? 'closed' : '' }), el('text', { x: 252, y: 78 }, 'E♭'));
  svg.append(el('circle', { cx: 75, cy: 18, r: 7, class: on('T') || on('Tb') ? 'closed' : '' }), el('text', { x: 86, y: 22 }, on('Tb') ? 'B♭ thumb' : 'thumb'));
  svg.append(el('text', { x: 280, y: 22 }, f.foot ? `${f.foot} foot` : ''), el('text', { x: 4, y: 22 }, noteName(m)));
}
drawFlute(67);

// ---------- recording + teacher ----------
let recorder = null, micStream = null, micAn = null, micBuf = null, frames = [], recBlob = null, recStartAt = 0, lastResult = null;
$('recBtn').onclick = () => (recorder?.state === 'recording' ? stopRec() : startRec());
async function startRec() {
  if (!window.MediaRecorder) { toast(t('recUnsupported')); return; }
  try { micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } }); }
  catch { toast(t('micFail')); sfx('error'); return; }
  ac.resume();
  const d = sfx('rec'); await new Promise(r => setTimeout(r, d * 1000)); // cue sound ends before capture starts
  micAn = ac.createAnalyser(); micAn.fftSize = 8192; micBuf = new Float32Array(micAn.frequencyBinCount);
  ac.createMediaStreamSource(micStream).connect(micAn);
  const mime = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg'].find(m => MediaRecorder.isTypeSupported(m)) || '';
  recorder = new MediaRecorder(micStream, mime ? { mimeType: mime } : {});
  const chunks = [];
  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    recBlob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
    $('recAudio').src = URL.createObjectURL(recBlob); $('recAudio').hidden = false;
    ['recSave', 'analyze', 'mixAddRec'].forEach(id => { $(id).disabled = false; });
    micStream.getTracks().forEach(x => x.stop());
    refreshLabels();
  };
  frames = []; recStartAt = performance.now();
  recorder.start(); refreshLabels(); toast(t('recording'));
}
function stopRec() { if (recorder?.state === 'recording') recorder.stop(); }
function captureMic() {
  micAn.getFloatFrequencyData(micBuf);
  // timeline = score time while the player runs, else seconds since record start
  const tt = player?.playing() ? player.time() - st.sync : (performance.now() - recStartAt) / 1000;
  frames.push({ t: tt, notes: notesFromMags(dbToMags(micBuf), ac.sampleRate, micAn.fftSize) });
}
const extOf = type => (type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : 'webm');
const stamp = () => new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');
function download(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
$('recSave').onclick = () => recBlob && download(recBlob, `music-teacher-${stamp()}.${extOf(recBlob.type)}`);
$('analyze').onclick = () => runCompare(frames);
$('upRec').onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  if (!ref.length) { toast(t('noMidi')); return; }
  toast(t('analyzing'));
  try { runCompare(analysePcm(await toMono16k(await f.arrayBuffer()), 16000, 0.14, 4096)); }
  catch { toast(t('decodeFail')); sfx('error'); }
  e.target.value = '';
};
async function toMono16k(bytes) {
  const b = await ac.decodeAudioData(bytes);
  const off = new OfflineAudioContext(1, Math.ceil(b.duration * 16000), 16000);
  const s = off.createBufferSource(); s.buffer = b; s.connect(off.destination); s.start();
  return (await off.startRendering()).getChannelData(0);
}
function runCompare(fr) {
  if (!ref.length) { toast(t('noMidi')); sfx('error'); return; }
  if (!fr.length) return;
  const from = Math.min(...fr.map(f => f.t)), to = Math.max(...fr.map(f => f.t));
  lastResult = compare(ref, fr, from, to);
  $('score').textContent = lastResult.score + '%';
  const list = $('issues'); list.replaceChildren();
  for (const is of lastResult.issues.slice(0, 8)) {
    const li = document.createElement('li'), b = document.createElement('button');
    b.className = 'btn';
    b.innerHTML = `<span class="mono">${fmtTime(is.time + st.sync)}</span> <b>${noteName(is.midi)}</b> <span class="kind">${is.kind}</span>`;
    b.onclick = () => { player?.seek(is.time + st.sync - 2); };
    li.append(b); list.append(li);
  }
  $('readBtn').disabled = false;
  sfx(lastResult.score >= 80 ? 'success' : 'error', 0, 0.7);
  readResult();
}
function resultLines(r) {
  const head = r.issues.length ? t('summary', { score: r.score, n: r.issues.length }) : t('allGood', { score: r.score });
  const key = { missed: 'issueMissed', late: 'issueLate', early: 'issueEarly' };
  return [head, ...r.issues.slice(0, 5).map(i => t(key[i.kind], { t: (i.time + st.sync).toFixed(1), note: noteName(i.midi) }))];
}
function readResult() { if (lastResult) speak(resultLines(lastResult)); }
$('readBtn').onclick = readResult;
$('stopRead').onclick = () => speechSynthesis?.cancel();

// ---------- metronome (lookahead scheduler, earshot clicks) ----------
let metroTimer = null, nextAt = 0, beat = 0;
function renderDots() { $('beatDots').replaceChildren(...Array.from({ length: st.beats }, (_, i) => { const d = document.createElement('i'); if (!i) d.className = 'first'; return d; })); }
function setBpm(v) { st.bpm = Math.min(240, Math.max(30, Math.round(v))); $('bpm').value = st.bpm; $('bpmOut').textContent = st.bpm; }
$('bpm').oninput = e => setBpm(+e.target.value);
$('beats').onchange = e => { st.beats = +e.target.value; beat = 0; renderDots(); };
function metro(on) {
  clearInterval(metroTimer); metroTimer = null;
  if (on) {
    ac.resume(); nextAt = ac.currentTime + 0.05; beat = 0;
    metroTimer = setInterval(() => {
      while (nextAt < ac.currentTime + 0.12) {
        const b = beat, at = nextAt;
        sfx(b === 0 ? 'accent' : 'tick', at, b === 0 ? 1 : 0.8);
        setTimeout(() => [...$('beatDots').children].forEach((d, i) => d.classList.toggle('on', i === b)), Math.max(0, (at - ac.currentTime) * 1000));
        beat = (beat + 1) % st.beats; nextAt += 60 / st.bpm;
      }
    }, 25);
  } else [...$('beatDots').children].forEach(d => d.classList.remove('on'));
  refreshLabels();
}
$('metroBtn').onclick = () => metro(!metroTimer);
renderDots();

// ---------- mix: layer files and takes, play together / in order, export WAV ----------
const tracks = []; let mixSrc = [];
function renderMix() {
  $('mixList').replaceChildren(...tracks.map((tr, i) => {
    const li = document.createElement('li'), s = document.createElement('span'), b = document.createElement('button');
    s.textContent = `${tr.name} · ${fmtTime(tr.buf.duration)}`; b.className = 'btn sm ghost'; b.textContent = t('remove');
    b.onclick = () => { tracks.splice(i, 1); renderMix(); };
    li.append(s, b); return li;
  }));
}
async function addTrack(bytes, name) {
  try { tracks.push({ name, buf: await ac.decodeAudioData(bytes) }); renderMix(); }
  catch { toast(t('decodeFail')); sfx('error'); }
}
$('mixFiles').onchange = async e => { for (const f of e.target.files) await addTrack(await f.arrayBuffer(), f.name); e.target.value = ''; };
$('mixAddRec').onclick = async () => recBlob && addTrack(await recBlob.arrayBuffer(), `take-${stamp()}`);
function mixStop() { mixSrc.forEach(s => { try { s.stop(); } catch {} }); mixSrc = []; }
function schedule(ctx, seq) {
  let at = ctx.currentTime + 0.05;
  const g = ctx.createGain(); g.gain.value = seq ? 1 : 1 / Math.max(1, tracks.length); g.connect(ctx.destination);
  return tracks.map(tr => {
    const s = ctx.createBufferSource(); s.buffer = tr.buf; s.connect(g); s.start(at);
    if (seq) at += tr.buf.duration;
    return s;
  });
}
function mixPlay(seq) {
  if (!tracks.length) { toast(t('mixEmpty')); return; }
  mixStop(); ac.resume(); mixSrc = schedule(ac, seq);
}
async function mixExport() {
  if (!tracks.length) { toast(t('mixEmpty')); return; }
  const rate = 44100, len = Math.ceil(Math.max(...tracks.map(x => x.buf.duration)) * rate) + rate;
  const off = new OfflineAudioContext(2, len, rate);
  schedule(off, false);
  download(new Blob([encodeWav(await off.startRendering())], { type: 'audio/wav' }), `music-teacher-mix-${stamp()}.wav`);
  toast(t('mixExported')); sfx('success', 0, 0.6);
}
$('mixTogether').onclick = () => mixPlay(false);
$('mixSeq').onclick = () => mixPlay(true);
$('mixStop').onclick = mixStop;
$('mixExport').onclick = mixExport;

// ---------- speaker (output device) ----------
$('speakerBtn').onclick = async () => {
  try {
    if (!navigator.mediaDevices?.selectAudioOutput) throw new Error();
    const dev = await navigator.mediaDevices.selectAudioOutput();
    await Promise.all([$('video'), $('recAudio')].map(m => m.setSinkId?.(dev.deviceId)));
    await ac.setSinkId?.(dev.deviceId);
    $('speakerOut').textContent = t('speakerSet', { name: dev.label || dev.deviceId.slice(0, 8) });
  } catch { toast(t('speakerUnsupported')); }
};

// ---------- voice control ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, voiceOn = false;
$('voiceBtn').onclick = () => {
  if (!SR) { toast(t('voiceUnsupported')); return; }
  voiceOn = !voiceOn; $('voiceBtn').setAttribute('aria-pressed', voiceOn); refreshLabels();
  if (voiceOn) startVoice(); else rec?.stop();
};
function startVoice() {
  rec = new SR(); rec.lang = LANGS[lang()]; rec.continuous = true; rec.interimResults = false;
  rec.onresult = e => {
    const text = e.results[e.results.length - 1][0].transcript;
    $('heard').textContent = text;
    const c = parseCommand(text, lang());
    if (!c) return;
    if (c.cmd === 'unknown') { sfx('error', 0, 0.5); toast(t('unknownCmd')); return; }
    sfx('wake', 0, 0.4); run(c);
  };
  rec.onend = () => { if (voiceOn) setTimeout(startVoice, 250); };
  rec.onerror = e => { if (e.error === 'not-allowed') { voiceOn = false; refreshLabels(); toast(t('micFail')); } };
  try { rec.start(); } catch {}
}
function run({ cmd, value }) {
  const A = {
    play: () => player?.play(), pause: () => player?.pause(),
    back: () => player?.seek(player.time() - 5), forward: () => player?.seek(player.time() + 5),
    speed: () => value != null && setSpeed(value), slower: () => setSpeed(st.speed - 0.1), faster: () => setSpeed(st.speed + 0.1),
    loopStart: () => player && setLoop(player.time(), st.loopB), loopEnd: () => player && setLoop(st.loopA, player.time()),
    loopOn: () => toggleLoop(true), loopOff: () => toggleLoop(false),
    recStart: () => recorder?.state !== 'recording' && startRec(), recStop: stopRec,
    recSave: () => $('recSave').click(), recPlay: () => $('recAudio').src && $('recAudio').play(),
    analyze: () => runCompare(frames), read: readResult, stopRead: () => speechSynthesis?.cancel(),
    guitar: () => setInst('guitar'), flute: () => setInst('flute'), piano: () => setInst('piano'),
    metroOn: () => metro(true), metroOff: () => metro(false), tempo: () => value != null && setBpm(value),
    mixPlay: () => mixPlay(false), mixExport, resume: () => $('resume').click(),
  };
  A[cmd]?.();
  setTimeout(syncPlayIcon, 300);
}

// ---------- autosave + resume (localStorage + IndexedDB for files) ----------
const KEY = 'musicTeacher.session';
function save() {
  try { localStorage.setItem(KEY, JSON.stringify({ ...st, time: player?.time() || 0, lang: lang() })); } catch {}
}
addEventListener('pagehide', save);
const idb = new Promise(res => {
  try {
    const r = indexedDB.open('music-teacher', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('files');
    r.onsuccess = () => res(r.result); r.onerror = () => res(null);
  } catch { res(null); }
});
async function idbPut(k, v) { const db = await idb; db?.transaction('files', 'readwrite').objectStore('files').put(v, k); }
async function idbGet(k) {
  const db = await idb; if (!db) return null;
  return new Promise(res => { const r = db.transaction('files').objectStore('files').get(k); r.onsuccess = () => res(r.result || null); r.onerror = () => res(null); });
}
let saved = null;
try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch {}
applyLang(saved?.lang || (navigator.language || 'ko').slice(0, 2));
if (saved?.source) $('resume').hidden = false;
$('resume').onclick = async () => {
  if (!saved) return;
  $('resume').hidden = true;
  setSpeed(saved.speed ?? 1); setSync(saved.sync ?? 0); setBpm(saved.bpm ?? 90);
  st.beats = saved.beats ?? 4; $('beats').value = st.beats; renderDots();
  setInst(saved.inst || 'piano'); setLoop(saved.loopA ?? null, saved.loopB ?? null);
  st.loopOn = !!saved.loopOn && st.loopA != null && st.loopB != null; refreshLabels();
  const midi = await idbGet('midi');
  if (midi) try { loadMidi(await midi.arrayBuffer()); } catch {}
  if (saved.source.type === 'yt') { $('url').value = `https://youtu.be/${saved.source.id}`; await openYouTube(saved.source.id, saved.time || 0); }
  else { const f = await idbGet('media'); if (f) openFile(f, saved.source.name, saved.time || 0); else { toast(t('fileLost')); return; } }
  toast(t('resumed'));
};
