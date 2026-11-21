// Standard MIDI File parser: formats 0/1, PPQ timing. Returns notes in seconds.
export function parseMidi(buf) {
  const d = new DataView(buf instanceof ArrayBuffer ? buf : buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  let p = 0;
  const str = n => { let s = ''; for (let i = 0; i < n; i++) s += String.fromCharCode(d.getUint8(p++)); return s; };
  const u32 = () => { const v = d.getUint32(p); p += 4; return v; };
  const u16 = () => { const v = d.getUint16(p); p += 2; return v; };
  const vlq = () => { let v = 0, b; do { b = d.getUint8(p++); v = (v << 7) | (b & 0x7f); } while (b & 0x80); return v; };

  if (str(4) !== 'MThd') throw new Error('not a MIDI file');
  const hlen = u32(), format = u16(), ntrks = u16(), div = u16();
  p += hlen - 6;
  if (format === 2) throw new Error('MIDI format 2 is not supported');
  if (div & 0x8000) throw new Error('SMPTE timing is not supported');

  const tempos = [{ tick: 0, uspq: 500000 }];
  const raw = []; // {tick, end, note, vel, track}
  for (let t = 0; t < ntrks && p < d.byteLength; t++) {
    if (str(4) !== 'MTrk') throw new Error('bad track chunk');
    const len = u32(), end = p + len;
    let tick = 0, status = 0;
    const open = new Map();
    while (p < end) {
      tick += vlq();
      let b = d.getUint8(p);
      if (b & 0x80) { status = b; p++; } // else running status
      const type = status & 0xf0;
      if (status === 0xff) {
        const mt = d.getUint8(p++), len = vlq();
        if (mt === 0x51) tempos.push({ tick, uspq: (d.getUint8(p) << 16) | (d.getUint8(p + 1) << 8) | d.getUint8(p + 2) });
        p += len;
      } else if (status === 0xf0 || status === 0xf7) {
        p += vlq();
      } else if (type === 0x90 || type === 0x80) {
        const note = d.getUint8(p++), vel = d.getUint8(p++);
        const key = (status & 0x0f) * 128 + note;
        if (type === 0x90 && vel > 0) {
          if (!open.has(key)) open.set(key, []);
          open.get(key).push({ tick, note, vel, track: t });
        } else {
          const st = open.get(key)?.shift();
          if (st) raw.push({ ...st, end: tick });
        }
      } else if (type === 0xc0 || type === 0xd0) p += 1;
      else p += 2;
    }
    p = end;
  }

  tempos.sort((a, b) => a.tick - b.tick);
  const toSec = tick => {
    let sec = 0, last = tempos[0];
    for (const tp of tempos) {
      if (tp.tick > tick) break;
      sec += (tp.tick - last.tick) * last.uspq / 1e6 / div;
      last = tp;
    }
    return sec + (tick - last.tick) * last.uspq / 1e6 / div;
  };
  return raw.map(n => ({ midi: n.note, time: toSec(n.tick), end: toSec(n.end), vel: n.vel, track: n.track }))
    .sort((a, b) => a.time - b.time || a.midi - b.midi);
}

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const noteName = m => NAMES[m % 12] + (Math.floor(m / 12) - 1);
export const midiToFreq = m => 440 * 2 ** ((m - 69) / 12);
export const freqToMidi = f => Math.round(69 + 12 * Math.log2(f / 440));
