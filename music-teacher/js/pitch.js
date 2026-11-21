// Polyphonic note estimate from a magnitude spectrum (harmonic sum + iterative peeling).
// shortcut: heuristic, misreads dense chords/accompaniment; swap for a trained transcriber if accuracy matters.
export const LOW = 36, HIGH = 96; // C2..C7 detection range

export function notesFromMags(mags, sampleRate, fftSize, max = 4) {
  const m = Float32Array.from(mags);
  const binHz = sampleRate / fftSize;
  let mean = 0; for (const v of m) mean += v; mean /= m.length;
  const floor = mean * 10 + 1e-9;
  const peak = f => { const b = Math.round(f / binHz); let v = 0, at = b; for (let i = b - 1; i <= b + 1; i++) if (i > 0 && i < m.length && m[i] > v) { v = m[i]; at = i; } return [v, at]; };
  const out = [];
  let first = 0;
  for (let k = 0; k < max; k++) {
    let best = 0, bestNote = -1;
    for (let n = LOW; n <= HIGH; n++) {
      const f = 440 * 2 ** ((n - 69) / 12);
      const [v1] = peak(f);
      if (v1 < floor) continue; // fundamental must be present
      let s = 0;
      for (let h = 1; h <= 4; h++) s += peak(f * h)[0] / h;
      if (s > best) { best = s; bestNote = n; }
    }
    if (bestNote < 0 || best < first * 0.35) break;
    if (!first) first = best;
    out.push(bestNote);
    const f = 440 * 2 ** ((bestNote - 69) / 12);
    for (let h = 1; h <= 8; h++) { const [, at] = peak(f * h); for (let i = at - 2; i <= at + 2; i++) if (i > 0 && i < m.length) m[i] = 0; }
  }
  return out.sort((a, b) => a - b);
}

export const dbToMags = db => Float32Array.from(db, v => (v === -Infinity ? 0 : 10 ** (v / 20)));

// In-place radix-2 FFT, used for offline analysis of uploaded recordings.
export function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let j = 0; j < len / 2; j++) {
        const k = i + j + len / 2;
        const tr = re[k] * cr - im[k] * ci, ti = re[k] * ci + im[k] * cr;
        re[k] = re[i + j] - tr; im[k] = im[i + j] - ti;
        re[i + j] += tr; im[i + j] += ti;
        [cr, ci] = [cr * wr - ci * wi, cr * wi + ci * wr];
      }
    }
  }
}

// Mono PCM -> [{t, notes}] every hop seconds (same timeline as live capture).
export function analysePcm(pcm, sampleRate, hop = 0.14, size = 8192) {
  const out = [], win = new Float32Array(size);
  for (let i = 0; i < size; i++) win[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / size);
  for (let t = 0; t * sampleRate + size <= pcm.length; t += hop) {
    const s = Math.round(t * sampleRate);
    const re = new Float32Array(size), im = new Float32Array(size);
    for (let i = 0; i < size; i++) re[i] = pcm[s + i] * win[i];
    fft(re, im);
    const mags = new Float32Array(size / 2);
    for (let i = 0; i < size / 2; i++) mags[i] = Math.hypot(re[i], im[i]);
    out.push({ t: t + size / sampleRate / 2, notes: notesFromMags(mags, sampleRate, size) });
  }
  return out;
}
