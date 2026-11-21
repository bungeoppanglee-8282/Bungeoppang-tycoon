// Run: node music-teacher/tests/run.mjs
import assert from 'node:assert/strict';
import { parseMidi, noteName } from '../js/midi.js';
import { analysePcm } from '../js/pitch.js';
import { compare } from '../js/compare.js';
import { parseCommand } from '../js/commands.js';
import { encodeWav } from '../js/wav.js';
import { STRINGS } from '../js/i18n.js';
import { FLUTE, FLUTE_RANGE, matchChord, chordNotes } from '../js/instruments.js';
import { parseYouTubeId, staffPos } from '../js/util.js';

let n = 0; const ok = (name, fn) => { fn(); n++; console.log('ok -', name); };

ok('midi: format 1, PPQ 480, tempo 120 -> 60 bpm change, running status', () => {
  const vlq = v => { const b = [v & 0x7f]; while ((v >>= 7)) b.unshift((v & 0x7f) | 0x80); return b; };
  const trk = ev => { const d = ev.flat(); return [0x4d, 0x54, 0x72, 0x6b, 0, 0, d.length >> 8, d.length & 255, ...d]; };
  const t0 = trk([[0, 0xff, 0x51, 3, 0x07, 0xa1, 0x20], [...vlq(960), 0xff, 0x51, 3, 0x0f, 0x42, 0x40], [0, 0xff, 0x2f, 0]]);
  // C4 at 0 for 480 ticks; E4 at 960 (running status note-off via vel 0)
  const t1 = trk([[0, 0x90, 60, 100], [...vlq(480), 60, 0], [...vlq(480), 0x90, 64, 90], [...vlq(480), 0x80, 64, 0], [0, 0xff, 0x2f, 0]]);
  const bytes = new Uint8Array([0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 1, 0, 2, 0x01, 0xe0, ...t0, ...t1]);
  const notes = parseMidi(bytes.buffer);
  assert.equal(notes.length, 2);
  assert.deepEqual(notes.map(x => [x.midi, +x.time.toFixed(3), +x.end.toFixed(3)]), [[60, 0, 0.5], [64, 1, 2]]);
  assert.throws(() => parseMidi(new Uint8Array([0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 2, 0, 1, 0x01, 0xe0]).buffer), /format 2/);
});

ok('pitch: C major triad (C4 E4 G4) from synthetic piano-like tones', () => {
  const rate = 16000, pcm = new Float32Array(rate);
  for (const m of [60, 64, 67]) { const f = 440 * 2 ** ((m - 69) / 12); for (let i = 0; i < pcm.length; i++) for (let h = 1; h <= 3; h++) pcm[i] += Math.sin(2 * Math.PI * f * h * i / rate) / (h * 3); }
  const frames = analysePcm(pcm, rate, 0.14, 4096);
  assert.ok(frames.length > 3);
  assert.deepEqual(frames[2].notes, [60, 64, 67]);
});

ok('pitch: silence yields no notes', () => {
  assert.deepEqual(analysePcm(new Float32Array(16000), 16000, 0.14, 4096)[0].notes, []);
});

ok('compare: ok / missed / late / early', () => {
  const ref = [{ midi: 60, time: 1 }, { midi: 62, time: 2 }, { midi: 64, time: 3 }, { midi: 65, time: 4 }];
  const fr = [{ t: 1.05, notes: [60] }, { t: 3.5, notes: [64] }, { t: 3.6, notes: [65] }];
  const r = compare(ref, fr);
  assert.equal(r.ok, 1); assert.equal(r.score, 25);
  assert.deepEqual(r.issues.map(i => i.kind), ['missed', 'late', 'early']);
  assert.equal(compare([], fr).score, 0);
});

ok('commands: 4 languages, wake word required, specific before generic', () => {
  assert.equal(parseCommand('재생', 'ko'), null);
  assert.deepEqual(parseCommand('선생님 재생', 'ko'), { cmd: 'play', value: undefined });
  assert.deepEqual(parseCommand('선생님 속도 0.5배', 'ko'), { cmd: 'speed', value: 0.5 });
  assert.equal(parseCommand('선생님 녹음 시작', 'ko').cmd, 'recStart');
  assert.equal(parseCommand('선생님 구간 시작', 'ko').cmd, 'loopStart');
  assert.equal(parseCommand('선생님 녹음 재생', 'ko').cmd, 'recPlay');
  assert.equal(parseCommand('선생님 메트로놈 켜', 'ko').cmd, 'metroOn');
  assert.deepEqual(parseCommand('선생님 템포 120', 'ko'), { cmd: 'tempo', value: 120 });
  assert.equal(parseCommand('선생님 합쳐 듣기', 'ko').cmd, 'mixPlay');
  assert.equal(parseCommand('Teacher start recording', 'en').cmd, 'recStart');
  assert.equal(parseCommand('teacher metronome off', 'en').cmd, 'metroOff');
  assert.equal(parseCommand('老师 播放', 'zh').cmd, 'play');
  assert.equal(parseCommand('老師 開始錄音', 'zh').cmd, 'recStart');
  assert.equal(parseCommand('先生 録音開始', 'ja').cmd, 'recStart');
  assert.equal(parseCommand('先生 フルート', 'ja').cmd, 'flute');
  assert.equal(parseCommand('선생님 아무말', 'ko').cmd, 'unknown');
});

ok('youtube ids: watch, youtu.be, shorts, embed, live, junk', () => {
  const id = 'dQw4w9WgXcQ';
  for (const u of [`https://www.youtube.com/watch?v=${id}&t=3`, `youtu.be/${id}`, `https://youtube.com/shorts/${id}`, `https://www.youtube.com/embed/${id}`, `https://m.youtube.com/live/${id}?si=x`, id])
    assert.equal(parseYouTubeId(u), id, u);
  assert.equal(parseYouTubeId('https://evil.com/watch?v=' + id), null);
  assert.equal(parseYouTubeId('hello'), null);
});

ok('wav: header + clamped samples', () => {
  const ch = [Float32Array.from([0, 1, -1, 2])];
  const v = new DataView(encodeWav({ numberOfChannels: 1, sampleRate: 8000, length: 4, getChannelData: c => ch[c] }));
  assert.equal(v.byteLength, 52); assert.equal(v.getUint32(24, true), 8000);
  assert.deepEqual([0, 1, 2, 3].map(i => v.getInt16(44 + i * 2, true)), [0, 32767, -32768, 32767]);
});

ok('i18n: every language has every Korean key', () => {
  for (const l of ['en', 'zh', 'ja']) assert.deepEqual(Object.keys(STRINGS[l]).filter(k => !(k in STRINGS.ko)), [], l), assert.deepEqual(Object.keys(STRINGS.ko).filter(k => !(k in STRINGS[l])), [], l);
});

ok('flute: chromatic C4..C6 covered', () => {
  for (let m = FLUTE_RANGE[0]; m <= FLUTE_RANGE[1]; m++) assert.ok(FLUTE[m], noteName(m));
});

ok('guitar: chord match + staff geometry', () => {
  assert.equal(matchChord(chordNotes('G')), 'G');
  assert.equal(matchChord([57, 60, 64]), 'Am');
  assert.equal(matchChord([60]), null);
  assert.equal(staffPos(64).y, 100); assert.equal(staffPos(77).y, 60); assert.deepEqual(staffPos(60).ledgers, [110]);
  assert.equal(staffPos(43).y, 180); assert.equal(staffPos(61).sharp, true);
});

console.log(`${n} checks passed`);
