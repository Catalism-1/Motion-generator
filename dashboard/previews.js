// Mini animated previews per style. Every preview is a pure function of time:
// draw(ctx, t, W, H, palette, text). Loops every LOOP seconds.
(function () {
  const LOOP = 4;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const easeInOut = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const spring = (t, k = 170, d = 14) => {
    if (t <= 0) return 0;
    const w0 = Math.sqrt(k), z = d / (2 * Math.sqrt(k));
    if (z < 1) { const wd = w0 * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t)); }
    return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  };
  const rnd = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const bg = (ctx, W, H, c) => { ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); };
  const txt = (ctx, s, x, y, size, color, font = "system-ui, sans-serif", weight = 800, align = "center") => {
    ctx.font = `${weight} ${size}px ${font}`;
    const maxW = (ctx.canvas.width / (ctx.getTransform().a || 1)) * 0.88, w = ctx.measureText(s).width;
    if (w > maxW) { size = size * maxW / w; ctx.font = `${weight} ${size}px ${font}`; }
    ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.fillText(s, x, y);
  };
  const short = (s, n = 22) => (s || "MOTION").toUpperCase().slice(0, n);

  const P = {};

  P["opus-showreel"] = (ctx, t, W, H, c, text) => {
    bg(ctx, W, H, c[0]);
    const u = t % LOOP;
    // particles
    for (let i = 0; i < 40; i++) {
      const a = rnd(i) * Math.PI * 2, r = (u * 60 + rnd(i + 9) * W) % W;
      ctx.fillStyle = i % 5 ? c[2] : c[3];
      ctx.globalAlpha = 0.6; ctx.fillRect(W / 2 + Math.cos(a) * r, H / 2 + Math.sin(a) * r * 0.6, 2, 2);
    }
    ctx.globalAlpha = 1;
    // mask wipe block
    const w = easeInOut(u / 0.8) * W - easeInOut((u - 2.8) / 0.8) * W;
    ctx.fillStyle = c[3]; ctx.fillRect(0, H * 0.62, Math.max(0, w), 6);
    const s = spring(u - 0.3);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(s, s);
    txt(ctx, short(text), 0, 0, W * 0.11, c[1]); ctx.restore();
    const ring = easeOut((u - 0.2) / 1.2);
    ctx.strokeStyle = c[3]; ctx.lineWidth = 2; ctx.globalAlpha = 1 - ring;
    ctx.beginPath(); ctx.arc(W / 2, H / 2, ring * W * 0.45, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
  };

  P["kinetic-type"] = (ctx, t, W, H, c, text) => {
    bg(ctx, W, H, c[0]);
    const u = t % LOOP, s = short(text);
    let size = W * 0.12; ctx.font = `900 ${size}px system-ui`;
    if (ctx.measureText(s).width > W * 0.88) { size *= (W * 0.88) / ctx.measureText(s).width; ctx.font = `900 ${size}px system-ui`; }
    const total = ctx.measureText(s).width;
    let x = W / 2 - total / 2;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i], cw = ctx.measureText(ch).width;
      const k = spring(u - i * 0.05, 220, 12);
      const out = easeInOut((u - 3.2 - i * 0.02) / 0.4);
      txt(ctx, ch, x + cw / 2, H / 2 + (1 - k) * H * 0.4 - out * H * 0.6, size, i === 0 ? c[2] : c[1], "system-ui", 900);
      x += cw;
    }
    ctx.fillStyle = c[2]; ctx.fillRect(W / 2 - total / 2, H / 2 + size * 0.6, total * easeOut((u - 0.6) / 0.6), 4);
  };

  P["swiss"] = (ctx, t, W, H, c, text) => {
    bg(ctx, W, H, c[0]);
    const u = t % LOOP, cols = 6;
    ctx.strokeStyle = "rgba(0,0,0,.08)"; ctx.lineWidth = 1;
    for (let i = 1; i < cols; i++) { ctx.beginPath(); ctx.moveTo((W / cols) * i, 0); ctx.lineTo((W / cols) * i, H); ctx.stroke(); }
    const step = Math.floor(u * 2) / 2; // immediate state changes
    ctx.fillStyle = c[2]; ctx.fillRect(0, 0, (W / cols) * Math.min(cols, 1 + step * 1.5), H * 0.28);
    const w = easeInOut((u - 0.5) / 0.6);
    ctx.save(); ctx.beginPath(); ctx.rect(W / cols, H * 0.4, W * w, H * 0.4); ctx.clip();
    txt(ctx, short(text), W / cols, H * 0.52, W * 0.07, c[1], "Helvetica, Arial, sans-serif", 800, "left");
    txt(ctx, "INTERNATIONAL / 01", W / cols, H * 0.68, W * 0.03, c[1], "Helvetica, Arial, sans-serif", 500, "left");
    ctx.restore();
  };

  P["glitch"] = (ctx, t, W, H, c, text) => {
    bg(ctx, W, H, c[0]);
    const u = t % LOOP, f = Math.floor(t * 12), burst = rnd(f) > 0.7;
    const off = burst ? (rnd(f + 1) - 0.5) * 16 : 2;
    const s = short(text), size = W * 0.11;
    ctx.globalCompositeOperation = "lighter";
    txt(ctx, s, W / 2 - off, H / 2, size, c[1], "ui-monospace, monospace");
    txt(ctx, s, W / 2 + off, H / 2, size, c[2], "ui-monospace, monospace");
    ctx.globalCompositeOperation = "source-over";
    txt(ctx, s, W / 2, H / 2, size, burst ? c[3] : "rgba(255,255,255,.85)", "ui-monospace, monospace");
    if (burst) for (let i = 0; i < 4; i++) {
      const y = rnd(f + i * 3) * H, h = 4 + rnd(f + i) * 14, dx = (rnd(f + i * 7) - 0.5) * 40;
      ctx.drawImage(ctx.canvas, 0, y * (ctx.canvas.height / H), ctx.canvas.width, h * (ctx.canvas.height / H), dx, y, W, h);
    }
    ctx.fillStyle = "rgba(255,255,255,.05)";
    for (let y = (u * 40) % 4; y < H; y += 4) ctx.fillRect(0, y, W, 1);
  };

  P["liquid"] = (ctx, t, W, H, c, text) => {
    const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, c[0]); g.addColorStop(1, c[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = c[2];
    ctx.beginPath();
    const N = 64, R = Math.min(W, H) * 0.28;
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2;
      const r = R * (1 + 0.12 * Math.sin(a * 3 + t * 2) + 0.08 * Math.sin(a * 5 - t * 3));
      const x = W / 2 + Math.cos(a) * r, y = H / 2 + Math.sin(a) * r;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.fill();
    ctx.fillStyle = c[3];
    const bx = W / 2 + Math.cos(t * 1.3) * R * 1.2, by = H / 2 + Math.sin(t * 1.7) * R * 0.7;
    ctx.beginPath(); ctx.arc(bx, by, R * 0.3, 0, Math.PI * 2); ctx.fill();
    txt(ctx, short(text), W / 2, H / 2, W * 0.08, "#fff", "ui-rounded, system-ui", 800);
  };

  P["flat"] = (ctx, t, W, H, c, text) => {
    bg(ctx, W, H, c[4] || "#8ECAE6");
    const u = t % LOOP;
    const shapes = [[0.25, 0.4, 0], [0.5, 0.35, 1], [0.75, 0.42, 2]];
    shapes.forEach(([x, y, i], k) => {
      const s = spring(u - k * 0.15, 200, 10) * (1 - easeInOut((u - 3.3) / 0.4));
      ctx.save(); ctx.translate(W * x, H * y); ctx.rotate(u * (k - 1)); ctx.scale(s, s); ctx.fillStyle = c[i];
      const r = W * 0.08;
      if (k === 0) { ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); }
      else if (k === 1) ctx.fillRect(-r, -r, r * 2, r * 2);
      else { ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r, r); ctx.lineTo(-r, r); ctx.fill(); }
      ctx.restore();
    });
    txt(ctx, short(text), W / 2, H * 0.78, W * 0.07, c[3]);
  };

  P["isometric"] = (ctx, t, W, H, c, text) => {
    bg(ctx, W, H, c[0]);
    const u = t % LOOP, s = W * 0.06, cx = W / 2, cy = H * 0.55;
    const iso = (x, y, z) => [cx + (x - y) * s * 0.866, cy + (x + y) * s * 0.5 - z * s];
    const cube = (x, y, h, col) => {
      const p = (a, b, z) => iso(a, b, z);
      const poly = (pts, f) => { ctx.fillStyle = f; ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(...q) : ctx.moveTo(...q))); ctx.fill(); };
      poly([p(x, y, h), p(x + 1, y, h), p(x + 1, y + 1, h), p(x, y + 1, h)], c[2]);
      poly([p(x, y + 1, h), p(x + 1, y + 1, h), p(x + 1, y + 1, 0), p(x, y + 1, 0)], col);
      poly([p(x + 1, y, h), p(x + 1, y + 1, h), p(x + 1, y + 1, 0), p(x + 1, y, 0)], c[1]);
    };
    const blocks = [[-1, -1, 1], [0, -1, 2], [1, -1, 1.4], [-1, 0, 1.8], [0, 0, 2.6], [1, 0, 1], [-1, 1, 1.2], [0, 1, 1.6], [1, 1, 2.2]];
    blocks.forEach(([x, y, h], i) => cube(x, y, Math.max(0.05, h * spring(u - i * 0.08, 180, 12)), i === 4 ? c[3] : "#9FB4BF"));
    txt(ctx, short(text), W / 2, H * 0.12, W * 0.05, c[1]);
  };

  P["hand-drawn"] = (ctx, t, W, H, c, text) => {
    bg(ctx, W, H, c[0]);
    const u = t % LOOP, boil = Math.floor(t * 12); // on 2s at 24fps
    ctx.strokeStyle = c[1]; ctx.lineWidth = 2.5; ctx.lineCap = "round";
    const prog = easeInOut(u / 1.6), N = 80;
    ctx.beginPath();
    for (let i = 0; i <= N * prog; i++) {
      const a = (i / N) * Math.PI * 2, r = Math.min(W, H) * 0.3 + (rnd(i + boil * 13) - 0.5) * 4;
      const x = W / 2 + Math.cos(a) * r * 1.3, y = H / 2 + Math.sin(a) * r;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
    ctx.save(); ctx.translate((rnd(boil) - 0.5) * 2, (rnd(boil + 1) - 0.5) * 2);
    txt(ctx, (text || "sketch").slice(0, 14), W / 2, H / 2, W * 0.08, c[2], "'Comic Sans MS', 'Marker Felt', cursive", 700);
    ctx.restore();
    for (let i = 0; i < 300; i++) { ctx.fillStyle = `rgba(0,0,0,${rnd(i + boil) * 0.06})`; ctx.fillRect(rnd(i * 3 + boil) * W, rnd(i * 7 + boil) * H, 1.5, 1.5); }
  };

  P["paper-cutout"] = (ctx, t, W, H, c, text) => {
    bg(ctx, W, H, c[0]);
    const st = Math.floor(t * 10) / 10, u = st % LOOP; // stop-motion 10fps
    const layers = [[c[1], 0.75, 0.4], [c[2], 0.82, 0.7], [c[3], 0.9, 1]];
    layers.forEach(([col, y, sp], i) => {
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.25)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-10, H);
      for (let x = -10; x <= W + 10; x += W / 8) ctx.lineTo(x, H * y + Math.sin(x * 0.02 + u * sp * 2 + i) * 12 + (rnd(x + i) - 0.5) * 6);
      ctx.lineTo(W + 10, H); ctx.fill(); ctx.restore();
    });
    ctx.save(); ctx.translate(W / 2, H * 0.35); ctx.rotate((rnd(Math.floor(t * 10)) - 0.5) * 0.05);
    ctx.fillStyle = "#fff"; ctx.shadowColor = "rgba(0,0,0,.2)"; ctx.shadowBlur = 6; ctx.fillRect(-W * 0.3, -H * 0.1, W * 0.6, H * 0.2);
    ctx.shadowBlur = 0; txt(ctx, (text || "Paper").slice(0, 14), 0, 0, W * 0.06, c[3], "Georgia, serif", 700); ctx.restore();
  };

  P["synthwave"] = (ctx, t, W, H, c, text) => {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c[0]); g.addColorStop(0.6, c[1]); g.addColorStop(1, c[0]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const hz = H * 0.6, sr = W * 0.18;
    const sg = ctx.createLinearGradient(0, hz - sr * 2, 0, hz); sg.addColorStop(0, c[4] || "#FF8142"); sg.addColorStop(1, c[2]);
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(W / 2, hz, sr, Math.PI, 0); ctx.fill();
    ctx.fillStyle = c[0]; for (let i = 0; i < 5; i++) ctx.fillRect(W / 2 - sr, hz - i * sr * 0.18 - 4, sr * 2, 2 + i);
    ctx.strokeStyle = c[2]; ctx.lineWidth = 1.5; ctx.shadowColor = c[2]; ctx.shadowBlur = 8;
    for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 8, hz); ctx.lineTo(W / 2 + i * W * 0.15, H); ctx.stroke(); }
    for (let k = 0; k < 8; k++) { const z = ((k + (t * 1.5) % 1) / 8); const y = hz + Math.pow(z, 2) * (H - hz); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.shadowBlur = 14 + Math.sin(t * Math.PI * 4) * 6; ctx.shadowColor = c[3];
    txt(ctx, short(text), W / 2, H * 0.25, W * 0.08, c[3], "system-ui", 900); ctx.shadowBlur = 0;
  };

  P["glass"] = (ctx, t, W, H, c, text) => {
    bg(ctx, W, H, c[0]);
    const r = Math.min(W, H) * 0.32;
    const x = W / 2 + Math.cos(t * 0.8) * 10, y = H / 2 + Math.sin(t * 0.6) * 8;
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    g.addColorStop(0, "#ffffff"); g.addColorStop(0.45, c[3]); g.addColorStop(1, c[2]);
    ctx.save(); ctx.filter = "blur(2px)"; ctx.fillStyle = g; ctx.beginPath();
    const N = 48; for (let i = 0; i <= N; i++) { const a = (i / N) * Math.PI * 2; const rr = r * (1 + 0.05 * Math.sin(a * 3 + t * 1.5)); const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.fill(); ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.strokeStyle = "rgba(255,255,255,.9)";
    const pw = W * 0.5, ph = H * 0.16; ctx.beginPath(); ctx.roundRect(W / 2 - pw / 2, H * 0.72, pw, ph, 14); ctx.fill(); ctx.stroke();
    txt(ctx, (text || "Soft glow").slice(0, 18), W / 2, H * 0.72 + ph / 2, W * 0.04, c[1], "system-ui", 600);
  };

  P["3d"] = (ctx, t, W, H, c, text) => {
    bg(ctx, W, H, c[0]);
    const pts = [], a = t * 0.8, b = t * 0.5, s = Math.min(W, H) * 0.25;
    for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) pts.push([x, y, z]);
    const proj = ([x, y, z]) => {
      let X = x * Math.cos(a) - z * Math.sin(a), Z = x * Math.sin(a) + z * Math.cos(a);
      let Y = y * Math.cos(b) - Z * Math.sin(b); Z = y * Math.sin(b) + Z * Math.cos(b);
      const p = 3 / (3 + Z); return [W / 2 + X * s * p, H / 2 + Y * s * p];
    };
    const P2 = pts.map(proj), beat = Math.pow(1 - ((t * 2) % 1), 3);
    ctx.strokeStyle = c[1]; ctx.lineWidth = 2 + beat * 3; ctx.shadowColor = c[1]; ctx.shadowBlur = 10 * beat;
    for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
      const d = pts[i].reduce((acc, v, k) => acc + Math.abs(v - pts[j][k]), 0);
      if (d === 2) { ctx.beginPath(); ctx.moveTo(...P2[i]); ctx.lineTo(...P2[j]); ctx.stroke(); }
    }
    ctx.shadowBlur = 0; txt(ctx, short(text), W / 2, H * 0.88, W * 0.05, c[3]);
  };

  P["dataviz"] = (ctx, t, W, H, c, text) => {
    bg(ctx, W, H, c[0]);
    const u = t % LOOP, vals = [0.35, 0.6, 0.45, 0.85, 0.7], bw = W * 0.1, base = H * 0.8;
    vals.forEach((v, i) => {
      const h = v * H * 0.55 * easeOut((u - i * 0.12) / 0.8);
      ctx.fillStyle = i === 3 ? c[3] : c[1]; ctx.fillRect(W * 0.15 + i * bw * 1.4, base - h, bw, h);
    });
    ctx.fillStyle = c[2]; ctx.fillRect(W * 0.12, base, W * 0.76, 2);
    const n = Math.round(85 * easeOut((u - 0.4) / 1.2));
    txt(ctx, n + "%", W * 0.82, H * 0.2, W * 0.08, c[2], "ui-monospace, monospace", 700, "right");
    txt(ctx, (text || "Growth").slice(0, 16), W * 0.15, H * 0.2, W * 0.04, c[2], "system-ui", 600, "left");
  };

  P["brutalist"] = (ctx, t, W, H, c, text) => {
    const f = Math.floor(t * 4) % 4; // hard cuts
    bg(ctx, W, H, c[f % 2 ? 1 : 0]);
    const fg = f % 2 ? c[0] : c[1];
    ctx.fillStyle = c[3]; ctx.fillRect(f * W * 0.1, H * 0.68, W * 0.5, H * 0.14);
    const shake = rnd(Math.floor(t * 24)) * 6 - 3;
    ctx.strokeStyle = fg; ctx.lineWidth = 6; ctx.strokeRect(10, 10, W - 20, H - 20);
    txt(ctx, short(text), W / 2 + shake, H * 0.42, W * 0.16, fg, "Impact, 'Arial Black', sans-serif", 900);
  };

  window.STYLE_PREVIEWS = P;
  window.drawStylePreview = function (id, ctx, t, W, H, palette, text) {
    const fn = P[id] || P["opus-showreel"];
    ctx.save(); ctx.clearRect(0, 0, W, H);
    try { fn(ctx, t, W, H, palette, text); } catch (e) { /* preview only */ }
    ctx.restore();
  };
})();
