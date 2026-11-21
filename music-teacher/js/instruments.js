// Guitar chord shapes: frets low E -> high e, -1 = muted. Standard tuning MIDI.
export const TUNING = [40, 45, 50, 55, 59, 64];
export const CHORDS = {
  C: [-1, 3, 2, 0, 1, 0], G: [3, 2, 0, 0, 0, 3], Am: [-1, 0, 2, 2, 1, 0], F: [1, 3, 3, 2, 1, 1],
  Dm: [-1, -1, 0, 2, 3, 1], Em: [0, 2, 2, 0, 0, 0], D: [-1, -1, 0, 2, 3, 2], A: [-1, 0, 2, 2, 2, 0],
  E: [0, 2, 2, 1, 0, 0], G7: [3, 2, 0, 0, 0, 1], C7: [-1, 3, 2, 3, 1, 0], Bm: [-1, 2, 4, 4, 3, 2],
};
export const chordNotes = name => CHORDS[name].map((f, i) => (f < 0 ? null : TUNING[i] + f)).filter(n => n !== null);
export const pitchClasses = notes => [...new Set(notes.map(n => n % 12))].sort((a, b) => a - b);

// Best chord whose pitch classes cover the detected ones (needs >= 2 distinct classes).
export function matchChord(notes) {
  const pcs = pitchClasses(notes);
  if (pcs.length < 2) return null;
  let best = null, bestScore = 0;
  for (const name of Object.keys(CHORDS)) {
    const c = pitchClasses(chordNotes(name));
    const hit = pcs.filter(p => c.includes(p)).length;
    const score = hit / Math.max(pcs.length, c.length);
    if (hit === pcs.length && score > bestScore) { best = name; bestScore = score; }
  }
  return best;
}

// Boehm flute basic fingerings C4..C6. Keys: T thumb B, Tb thumb Bb, L1 L2 L3, Gs (L pinky G#),
// R1 R2 R3, Eb (R pinky), foot: 'C' | 'C#' roller keys.
const F = (keys, foot) => ({ keys: keys.split(' ').filter(Boolean), foot });
const LOW = {
  60: F('T L1 L2 L3 R1 R2 R3', 'C'), 61: F('T L1 L2 L3 R1 R2 R3', 'C#'), 62: F('T L1 L2 L3 R1 R2 R3'),
  63: F('T L1 L2 L3 R1 R2 R3 Eb'), 64: F('T L1 L2 L3 R1 R2 Eb'), 65: F('T L1 L2 L3 R1 Eb'),
  66: F('T L1 L2 L3 R3 Eb'), 67: F('T L1 L2 L3 Eb'), 68: F('T L1 L2 L3 Gs Eb'), 69: F('T L1 L2 Eb'),
  70: F('Tb L1 Eb'), 71: F('T L1 Eb'), 72: F('L1 Eb'), 73: F('Eb'),
};
export const FLUTE = {
  ...LOW,
  74: F('T L2 L3 R1 R2 R3'), 75: F('T L2 L3 R1 R2 R3 Eb'),
  ...Object.fromEntries([64, 65, 66, 67, 68, 69, 70, 71, 72].map(n => [n + 12, LOW[n]])),
};
export const FLUTE_RANGE = [60, 84];
