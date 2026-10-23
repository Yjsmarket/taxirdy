/* Gedeelde sfeeranimaties voor de subpagina's:
   lichtsporen over wegen in de hero, en onderdelen die bij het scrollen invloeien. */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Lichtsporen over wegen (canvas) ---------- */
  function wegen(cv, paden) {
    const ctx = cv.getContext("2d");
    let w = 0, h = 0, roads = [];
    function layout() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      roads = paden.map((p, i) => ({ p: p.map(([x, y]) => [x * w, y * h]), t: (roads[i] && roads[i].t) || Math.random() }));
    }
    const bez = (p, t) => { const u = 1 - t; return [0, 1].map(k => u*u*u*p[0][k] + 3*u*u*t*p[1][k] + 3*u*t*t*p[2][k] + t*t*t*p[3][k]); };
    function draw(dt) {
      ctx.clearRect(0, 0, w, h);
      for (const r of roads) {
        ctx.beginPath(); ctx.moveTo(...r.p[0]); ctx.bezierCurveTo(...r.p[1], ...r.p[2], ...r.p[3]);
        ctx.strokeStyle = "rgba(255,255,255,0.045)"; ctx.lineWidth = 12; ctx.stroke();
        ctx.setLineDash([8, 12]); ctx.strokeStyle = "rgba(212,185,127,0.16)"; ctx.lineWidth = 1.3; ctx.stroke(); ctx.setLineDash([]);
        if (!reduce) r.t = (r.t + dt * 0.00005) % 1;
        for (let i = 0; i < 28; i++) {
          const t = r.t - i * 0.006; if (t < 0) continue;
          const [x, y] = bez(r.p, t), a = 1 - i / 28;
          ctx.beginPath(); ctx.arc(x, y, i === 0 ? 3.2 : 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(234,215,169,${0.85 * a * a})`;
          ctx.shadowColor = "rgba(234,215,169,0.8)"; ctx.shadowBlur = i === 0 ? 16 : 0; ctx.fill(); ctx.shadowBlur = 0;
        }
      }
    }
    layout(); new ResizeObserver(() => { layout(); draw(0); }).observe(cv);
    let last = performance.now(), zichtbaar = true;
    new IntersectionObserver(([e]) => { zichtbaar = e.isIntersecting; }).observe(cv);
    if (reduce) draw(0);
    else (function loop(now) { const dt = Math.min(now - last, 60); last = now; if (zichtbaar) draw(dt); requestAnimationFrame(loop); })(last);
  }

  document.querySelectorAll("canvas[data-wegen]").forEach(cv => {
    try { wegen(cv, JSON.parse(cv.dataset.wegen)); } catch (e) { cv.hidden = true; }
  });

  /* ---------- Invloeien bij scrollen ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".rv").forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 70 + "ms";
    io.observe(el);
  });
})();
