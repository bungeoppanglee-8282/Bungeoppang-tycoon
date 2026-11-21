// Compare reference MIDI notes with detected frames [{t, notes}].
export const WINDOW = 0.7, LATE = 0.26;

export function compare(ref, frames, from = 0, to = Infinity) {
  const target = ref.filter(n => n.time >= from && n.time <= to);
  const issues = [];
  let ok = 0;
  for (const n of target) {
    let bestDt = null;
    for (const f of frames) {
      const dt = f.t - n.time;
      if (Math.abs(dt) <= WINDOW && f.notes.includes(n.midi) && (bestDt === null || Math.abs(dt) < Math.abs(bestDt))) bestDt = dt;
    }
    if (bestDt === null) issues.push({ time: n.time, midi: n.midi, kind: 'missed' });
    else if (bestDt > LATE) issues.push({ time: n.time, midi: n.midi, kind: 'late', dt: bestDt });
    else if (bestDt < -LATE) issues.push({ time: n.time, midi: n.midi, kind: 'early', dt: bestDt });
    else ok++;
  }
  return { total: target.length, ok, score: target.length ? Math.round(ok / target.length * 100) : 0, issues };
}
