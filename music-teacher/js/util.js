// Small pure helpers shared by the UI (tested in tests/run.mjs).
export function parseYouTubeId(input) {
  const s = String(input).trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  let u;
  try { u = new URL(s.includes('://') ? s : 'https://' + s); } catch { return null; }
  const host = u.hostname.replace(/^(www|m|music)\./, '');
  if (host === 'youtu.be') return valid(u.pathname.split('/')[1]);
  if (host !== 'youtube.com' && host !== 'youtube-nocookie.com') return null;
  if (u.searchParams.get('v')) return valid(u.searchParams.get('v'));
  const m = u.pathname.match(/^\/(shorts|embed|live|v)\/([\w-]{11})/);
  return m ? m[2] : null;
}
const valid = id => (/^[\w-]{11}$/.test(id || '') ? id : null);

export const fmtTime = s => {
  s = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// Diatonic position: C4 = 28. Sharps spelled on the lower letter.
const PC = [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [3, 0], [3, 1], [4, 0], [4, 1], [5, 0], [5, 1], [6, 0]];
export const diatonic = midi => {
  const [letter, sharp] = PC[midi % 12];
  return { d: (Math.floor(midi / 12) - 1) * 7 + letter, sharp: !!sharp };
};

// Grand staff geometry: treble E4(d30) at y=100, F5(d38) at 60; bass A3(d26) at 140, G2(d18) at 180.
export function staffPos(midi) {
  const { d, sharp } = diatonic(midi);
  const treble = midi >= 60;
  const y = treble ? 100 - (d - 30) * 5 : 140 + (26 - d) * 5;
  const ledgers = [];
  if (treble) { for (let l = 28; l >= d; l -= 2) ledgers.push(100 - (l - 30) * 5); for (let l = 40; l <= d; l += 2) ledgers.push(100 - (l - 30) * 5); }
  else { for (let l = 16; l >= d; l -= 2) ledgers.push(140 + (26 - l) * 5); for (let l = 28; l <= d; l += 2) ledgers.push(140 + (26 - l) * 5); }
  return { y, sharp, ledgers };
}

export const nearest = (list, v) => list.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));
