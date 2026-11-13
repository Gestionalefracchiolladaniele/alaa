// Il modello "si compone": all'inizio non si vede nulla, poi i pezzi arrivano dall'alto uno dopo l'altro.
// Anima solo position.y degli oggetti (leggero) e ridisegna solo mentre l'animazione e' in corso.
// groups: array di array di oggetti three.js, nell'ordine di arrivo.
// offsetOf(obj): restituisce lo spostamento verticale da cui parte ogni oggetto.
// rest(obj): posizione verticale di arrivo (di norma quella originale).
export function hideAll(groups) {
  groups.flat().forEach((o) => { o.visible = false; });
}

export function assemble(viewer, groups, { lift = 1.5, stagger = 0.28, dur = 0.75, rest } = {}) {
  const items = groups.flatMap((g, i) => g.map((o) => ({
    o, start: i * stagger, y1: rest ? rest(o) : o.position.y,
  })));
  items.forEach((it) => { it.y0 = it.y1 + lift; it.o.visible = false; });
  const total = (groups.length - 1) * stagger + dur;
  const out = (t) => 1 - Math.pow(1 - t, 3);
  return new Promise((resolve) => {
    let t0 = null;
    const step = (now) => {
      if (t0 === null) t0 = now;
      const t = (now - t0) / 1000;
      for (const it of items) {
        const k = (t - it.start) / dur;
        if (k <= 0) continue;
        it.o.visible = it.o.userData.hiddenByUser ? false : true;
        it.o.position.y = it.y0 + (it.y1 - it.y0) * out(Math.min(1, k));
      }
      viewer.invalidate();
      if (t < total) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

// mostra / nasconde un gruppo di pezzi (pulsanti "togli pezzo")
export function setShown(viewer, objs, shown) {
  objs.forEach((o) => { o.userData.hiddenByUser = !shown; o.visible = shown; });
  viewer.invalidate();
}
