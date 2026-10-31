(function () {
  const STYLES = (window.STYLE_DATA && window.STYLE_DATA.styles) || [];
  const TAGS = (window.STYLE_DATA && window.STYLE_DATA.tags) || {};
  const ELEMENTS = (window.ELEMENT_DATA && window.ELEMENT_DATA.elements) || [];
  const KEY = "motion-generator/state/v2";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const TRANSITIONS = ["cut", "wipe", "zoom", "slide", "morph", "glitch", "fade", "match-cut"];
  const ALL_SFX = ["whoosh", "swoosh", "hit", "impact", "riser", "ui click", "glitch", "shimmer"];

  // ---------- templates (one click = all defaults) ----------
  const TEMPLATES = [
    { id: "reels", ic: "📱", name: "Reels / TikTok promo", mode: "full", aspect: "9:16", duration: 15, style: "poster-pop", kind: "promo", tags: ["promo", "hook"] },
    { id: "yt-intro", ic: "▶️", name: "Intro YouTube", mode: "full", aspect: "16:9", duration: 8, style: "particle-field", kind: "intro", tags: ["tech", "brand"] },
    { id: "explainer", ic: "💡", name: "Explainer", mode: "full", aspect: "16:9", duration: 30, style: "midnight-grid", kind: "explainer", bpm: 100, tags: ["explainer", "tech"] },
    { id: "data", ic: "📊", name: "Data & angka", mode: "full", aspect: "16:9", duration: 12, style: "editorial-paper", kind: "data", tags: ["data"] },
    { id: "app", ic: "💻", name: "Demo aplikasi", mode: "full", aspect: "16:9", duration: 20, style: "graphite-ui", kind: "promo", tags: ["app", "tech"] },
    { id: "logo", ic: "✨", name: "Logo reveal", mode: "full", aspect: "16:9", duration: 6, style: "ink-line", kind: "intro", tags: ["brand", "logo"] },
    { id: "caption", ic: "💬", name: "Caption untuk editan", mode: "overlay", element: "caption-kata", aspect: "9:16", duration: 10, style: "kinetic-type", kind: "element", tags: ["caption", "hook"] },
    { id: "lower", ic: "🏷️", name: "Lower third", mode: "overlay", element: "lower-third", aspect: "16:9", duration: 6, style: "swiss", kind: "element", tags: ["editan"] },
  ];
  const KINDS = {
    promo: [["Hook", "{judul}", "teks besar masuk dengan punch, latar bergerak", "wipe", 0.16], ["Masalah / ide", "", "kenapa ini penting? elemen muncul satu per satu", "slide", 0.18], ["Poin 1", "", "manfaat/fitur pertama dianimasikan", "zoom", 0.22], ["Poin 2", "", "manfaat/fitur kedua, morph dari scene sebelumnya", "cut", 0.22], ["Reveal + CTA", "{judul}", "nama/logo reveal + ajakan, hold 1 bar", "cut", 0.22]],
    intro: [["Build", "", "elemen abstrak berkumpul / tergambar", "morph", 0.45], ["Reveal", "{judul}", "judul/logo muncul jelas", "fade", 0.35], ["Hold", "{judul}", "diam sebentar, aksen kecil", "cut", 0.2]],
    explainer: [["Pertanyaan", "", "pertanyaan pembuka yang memancing", "wipe", 0.15], ["Konsep", "", "diagram konsep utama dibangun", "slide", 0.25], ["Langkah 1", "", "langkah pertama, node demi node", "slide", 0.2], ["Langkah 2", "", "langkah kedua", "zoom", 0.2], ["Ringkasan", "{judul}", "ringkasan + penutup", "cut", 0.2]],
    data: [["Judul", "", "judul data muncul", "wipe", 0.2], ["Chart", "", "garis/bar tergambar, angka menghitung", "zoom", 0.45], ["Insight", "", "satu angka penting disorot", "cut", 0.35]],
    element: [["Masuk", "{judul}", "elemen masuk", "cut", 0.2], ["Tahan", "{judul}", "elemen diam, terbaca jelas", "cut", 0.6], ["Keluar", "", "elemen keluar bersih", "cut", 0.2]],
  };

  const defaults = () => ({
    project: { title: "", brief: "", lines: "", audience: "", duration: 15, bpm: 120, aspect: "9:16", fps: 60, lang: "Indonesia", mode: "full", element: "caption-kata", loop: false, template: "" },
    style: { id: "poster-pop", palette: [...(STYLES.find((s) => s.id === "poster-pop")?.palette || STYLES[0].palette)], font: "", intensity: 3, notes: "" },
    scenes: [], scenesEdited: false, kind: "promo",
    sound: { preset: "full", music: "synth", musicFile: "", musicMood: "", sfxMode: "mix", sources: ["openverse"], license: ["cc0", "by"], categories: [...ALL_SFX] },
    output: { format: "html-canvas", storyboard: true, mp4: true, extra: "", alpha: "alpha" },
    ui: { filter: "rec", tplTags: ["promo", "hook"] },
  });

  let state;
  const get = (path) => path.split(".").reduce((o, k) => o?.[k], state);
  const set = (path, v) => { const ks = path.split("."); const last = ks.pop(); ks.reduce((o, k) => o[k], state)[last] = v; };
  const style = () => STYLES.find((s) => s.id === state.style.id) || STYLES[0];
  const element = () => ELEMENTS.find((e) => e.id === state.project.element);
  const totalBeats = () => Math.max(1, Math.round((Number(state.project.duration) || 15) * (Number(state.project.bpm) || 120) / 60));
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

  function safeGet() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function load() {
    try {
      const s = JSON.parse(safeGet());
      if (s && s.project) { const d = defaults(); for (const k of Object.keys(d)) if (s[k] !== undefined) d[k] = (typeof d[k] === "object" && !Array.isArray(d[k])) ? { ...d[k], ...s[k] } : s[k]; return d; }
    } catch (e) {}
    const d = defaults(); state = d; autoScenes(); return d;
  }
  let saveT;
  function save() { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); $("#saved").textContent = "Tersimpan otomatis ✓"; } catch (e) { $("#saved").textContent = ""; } }, 200); $("#saved").textContent = "Menyimpan…"; }

  // ---------- scenes ----------
  function autoScenes() {
    const tb = totalBeats();
    const lines = (state.project.lines || "").split("\n").map((x) => x.trim()).filter(Boolean);
    let rows;
    if (lines.length) rows = lines.map((l, i) => [`Scene ${i + 1}`, l, "", i === lines.length - 1 ? "cut" : ["wipe", "slide", "zoom", "cut"][i % 4], 1 / lines.length]);
    else rows = KINDS[state.project.mode === "overlay" ? "element" : (state.kind || "promo")] || KINDS.promo;
    const beats = rows.map((r) => Math.max(1, Math.round(r[4] * tb)));
    beats[beats.length - 1] = Math.max(1, beats[beats.length - 1] + tb - beats.reduce((a, b) => a + b, 0));
    state.scenes = rows.map(([name, text, visual, transition], i) => ({ name, text, visual, transition, beats: beats[i] }));
    state.scenesEdited = false;
  }
  function fitScenes() {
    const tb = totalBeats(), cur = state.scenes.reduce((a, s) => a + (Number(s.beats) || 1), 0); let acc = 0;
    state.scenes.forEach((s, i) => { if (i === state.scenes.length - 1) s.beats = Math.max(1, tb - acc); else { s.beats = Math.max(1, Math.round((Number(s.beats) || 1) * tb / cur)); acc += s.beats; } });
  }
  function maybeAuto() { if (!state.scenesEdited) autoScenes(); else fitScenes(); renderScenes(); }

  // ---------- generic bindings ----------
  function bind() {
    $$("[data-bind]").forEach((el) => {
      const path = el.dataset.bind, num = el.hasAttribute("data-num"), v = get(path);
      if (el.type === "checkbox") el.checked = !!v; else el.value = v ?? "";
      el.oninput = el.onchange = () => { set(path, el.type === "checkbox" ? el.checked : num ? Number(el.value) : el.value); changed(path); };
    });
    $$("[data-seg]").forEach((el) => {
      const path = el.dataset.seg, num = el.hasAttribute("data-num"), bool = el.hasAttribute("data-bool");
      $$("button", el).forEach((b) => {
        b.onclick = () => { set(path, num ? Number(b.dataset.v) : bool ? b.dataset.v === "true" : b.dataset.v); changed(path); };
      });
    });
    $$("[data-chips]").forEach((el) => {
      const path = el.dataset.chips;
      $$("button", el).forEach((b) => (b.onclick = () => {
        const arr = new Set(get(path) || []); arr.has(b.dataset.v) ? arr.delete(b.dataset.v) : arr.add(b.dataset.v); set(path, [...arr]); changed(path);
      }));
    });
    $("#idea").value = state.project.brief; $("#idea").oninput = (e) => { state.project.brief = e.target.value; changed("project.brief"); };
    $("#title").value = state.project.title; $("#title").oninput = (e) => { state.project.title = e.target.value; changed("project.title"); };
    $("#lines").value = state.project.lines; $("#lines").oninput = (e) => { state.project.lines = e.target.value; state.scenesEdited = false; changed("project.lines"); };
    $$("#mode button").forEach((b) => (b.onclick = () => { state.project.mode = b.dataset.v; changed("project.mode"); }));
  }
  function syncControls() {
    $$("[data-seg]").forEach((el) => { const v = String(get(el.dataset.seg)); $$("button", el).forEach((b) => b.classList.toggle("on", b.dataset.v === v)); });
    $$("[data-chips]").forEach((el) => { const v = get(el.dataset.chips) || []; $$("button", el).forEach((b) => b.classList.toggle("on", v.includes(b.dataset.v))); });
    $$("[data-bind]").forEach((el) => { if (document.activeElement === el) return; const v = get(el.dataset.bind); if (el.type === "checkbox") el.checked = !!v; else el.value = v ?? ""; });
    $$("#mode button").forEach((b) => b.classList.toggle("on", b.dataset.v === state.project.mode));
    $$("[data-show]").forEach((el) => { const m = el.dataset.show.match(/^([\w.]+)(!?=)(.+)$/); const v = String(get(m[1])); el.hidden = m[2] === "=" ? v !== m[3] : v === m[3]; });
    $("#block-element").hidden = state.project.mode !== "overlay";
    $("#n-quick").textContent = state.project.mode === "overlay" ? "3" : "2";
    $("#intensity-label").textContent = ["", "sangat tenang", "tenang", "seimbang", "energik", "agresif"][state.style.intensity] || "";
    $$(".tpl").forEach((b) => b.classList.toggle("on", b.dataset.id === state.project.template));
  }

  // ---------- templates ----------
  function renderTemplates() {
    $("#templates").innerHTML = TEMPLATES.map((t) => `<button class="tpl" data-id="${t.id}"><span class="ic">${t.ic}</span>${t.name}</button>`).join("");
    $$(".tpl").forEach((b) => (b.onclick = () => applyTemplate(TEMPLATES.find((t) => t.id === b.dataset.id))));
  }
  function applyTemplate(t) {
    Object.assign(state.project, { template: t.name, mode: t.mode, aspect: t.aspect, duration: t.duration, bpm: t.bpm || 120 });
    if (t.element) state.project.element = t.element;
    state.kind = t.kind; state.ui.tplTags = t.tags; state.ui.filter = "rec";
    pickStyle(t.style, true);
    autoScenes(); renderScenes(); renderElements();
    changed("template");
    toast(`Template "${t.name}" dipakai. Semua sudah diisi default.`);
  }

  // ---------- styles ----------
  function recommended() {
    const ids = new Set();
    if (state.project.mode === "overlay" && element()) element().styles.forEach((x) => ids.add(x));
    const tags = state.ui.tplTags || [];
    STYLES.forEach((s) => { if ((s.best_for || []).some((b) => tags.includes(b))) ids.add(s.id); });
    return ids;
  }
  const cards = [];
  function renderFilters() {
    const used = new Set(STYLES.flatMap((s) => s.best_for || []));
    const keys = ["promo", "hook", "explainer", "data", "tech", "app", "brand", "santai", "musik", "editan"].filter((k) => used.has(k));
    $("#filters").innerHTML = `<button data-f="rec">⭐ Rekomendasi</button><button data-f="all">Semua (${STYLES.length})</button>` + keys.map((k) => `<button data-f="${k}">${TAGS[k] || k}</button>`).join("");
    $$("#filters button").forEach((b) => (b.onclick = () => { state.ui.filter = b.dataset.f; renderStyles(); save(); }));
  }
  function renderStyles() {
    const rec = recommended(), f = state.ui.filter;
    let list = STYLES.filter((s) => f === "all" || (f === "rec" ? rec.has(s.id) || s.id === state.style.id : (s.best_for || []).includes(f)));
    if (!list.length) list = STYLES;
    list = [...list].sort((a, b) => (rec.has(b.id) - rec.has(a.id)));
    $$("#filters button").forEach((b) => b.classList.toggle("on", b.dataset.f === f));
    const grid = $("#style-grid"); grid.innerHTML = ""; cards.length = 0;
    list.forEach((s) => {
      const b = document.createElement("button");
      b.className = "style-card" + (s.id === state.style.id ? " on" : "");
      b.innerHTML = `<canvas width="320" height="200"></canvas>${rec.has(s.id) ? '<span class="rec">Rekomendasi</span>' : ""}<span class="tick">✓</span>
        <div class="meta"><b>${s.name}</b><small>${(s.best_for || []).map((x) => TAGS[x] || x).slice(0, 2).join(" · ")}</small></div>`;
      b.onclick = () => { pickStyle(s.id); changed("style.id"); };
      grid.appendChild(b); cards.push({ id: s.id, canvas: $("canvas", b), palette: s.palette, el: b });
    });
    renderStyleDetail();
  }
  function pickStyle(id, silent) {
    const s = STYLES.find((x) => x.id === id); if (!s) return;
    state.style.id = id; state.style.palette = [...s.palette];
    cards.forEach((c) => c.el.classList.toggle("on", c.id === id));
    renderStyleDetail(); renderPalette();
    if (!silent) renderStyles();
  }
  function renderStyleDetail() {
    const s = style();
    $("#style-detail").innerHTML = `<b>${s.name}</b>: ${s.summary}.
      <ul><li><b>Gerak:</b> ${s.motion.slice(0, 3).join(" · ")}</li><li><b>Hindari:</b> ${(s.avoid || []).join(" · ")}</li><li><b>SFX:</b> ${s.sfx.join(" · ")}</li></ul>`;
  }
  function renderPalette() {
    const el = $("#palette"); el.innerHTML = "";
    state.style.palette.forEach((c, i) => {
      const sw = document.createElement("label"); sw.className = "swatch"; sw.style.background = c; sw.title = c;
      const inp = document.createElement("input"); inp.type = "color"; inp.value = c;
      inp.oninput = () => { state.style.palette[i] = inp.value; sw.style.background = inp.value; changed("style.palette"); };
      sw.appendChild(inp); el.appendChild(sw);
    });
    const r = document.createElement("button"); r.className = "btn small ghost"; r.textContent = "↺ warna asli style";
    r.onclick = () => { state.style.palette = [...style().palette]; renderPalette(); changed("style.palette"); };
    el.appendChild(r);
  }

  // ---------- elements ----------
  function renderElements() {
    const groups = [...new Set(ELEMENTS.map((e) => e.group))];
    $("#elements").innerHTML = groups.map((g) => `<div class="el-group"><h4>${g}</h4><div class="el-grid">${ELEMENTS.filter((e) => e.group === g)
      .map((e) => `<button class="el${e.id === state.project.element ? " on" : ""}" data-id="${e.id}"><b>${e.name}</b><small>${e.desc}</small></button>`).join("")}</div></div>`).join("");
    $$("#elements .el").forEach((b) => (b.onclick = () => {
      state.project.element = b.dataset.id; state.ui.filter = "rec";
      const e = element(); if (e && !e.styles.includes(state.style.id)) pickStyle(e.styles[0], true);
      renderElements(); renderStyles(); changed("project.element");
    }));
  }

  // ---------- scene editor ----------
  function renderScenes() {
    const tl = window.MotionBrief.timeline(state), box = $("#scenes"); box.innerHTML = "";
    state.scenes.forEach((s, i) => {
      const r = tl[i], row = document.createElement("div"); row.className = "scene";
      row.innerHTML = `<div class="idx">${i + 1}</div>
        <label class="field">Nama<input data-k="name" value="${esc(s.name)}" /></label>
        <label class="field">Beat<input type="number" min="1" data-k="beats" value="${s.beats}" /></label>
        <label class="field">Transisi<select data-k="transition">${TRANSITIONS.map((t) => `<option ${t === s.transition ? "selected" : ""}>${t}</option>`).join("")}</select></label>
        <div class="tools"><button class="btn tiny ghost" data-a="up">↑</button><button class="btn tiny ghost" data-a="down">↓</button><button class="btn tiny ghost danger" data-a="del">✕</button></div>
        <label class="field wide">Teks di layar<input data-k="text" value="${esc(s.text)}" placeholder="kosong = AI tulis · {judul} = judul" /></label>
        <label class="field wide">Visual / gerak<input data-k="visual" value="${esc(s.visual)}" /></label>
        <div class="time">${r.start.toFixed(2)}s → ${r.end.toFixed(2)}s</div>`;
      $$("[data-k]", row).forEach((el) => (el.oninput = el.onchange = () => {
        s[el.dataset.k] = el.dataset.k === "beats" ? Math.max(1, Number(el.value) || 1) : el.value;
        state.scenesEdited = true; updateTimes(); changed("scenes");
      }));
      $$("[data-a]", row).forEach((b) => (b.onclick = () => {
        const a = b.dataset.a, arr = state.scenes;
        if (a === "del") arr.splice(i, 1);
        if (a === "up" && i > 0) [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        if (a === "down" && i < arr.length - 1) [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
        state.scenesEdited = true; renderScenes(); changed("scenes");
      }));
      box.appendChild(row);
    });
    updateTimes();
  }
  function updateTimes() {
    const tl = window.MotionBrief.timeline(state);
    $$("#scenes .time").forEach((el, i) => tl[i] && (el.textContent = `${tl[i].start.toFixed(2)}s → ${tl[i].end.toFixed(2)}s`));
    const tot = tl.length ? tl[tl.length - 1].end : 0, d = Number(state.project.duration) || 15;
    $("#scene-total").textContent = `${state.scenes.length} scene · ${tot.toFixed(1)} / ${d} dtk ${Math.abs(tot - d) < 0.05 ? "✓" : "(klik Pas-kan)"} · ${state.scenesEdited ? "diedit manual" : "otomatis"}`;
  }

  // ---------- sound preset ----------
  function applySoundPreset() {
    const p = state.sound.preset;
    state.sound.music = p === "full" ? (state.sound.musicFile ? "file" : "synth") : "none";
    if (p === "none") state.sound.sfxMode = "synth";
  }

  // ---------- build ----------
  let built;
  function rebuild() {
    built = window.MotionBrief.build(state, STYLES, ELEMENTS);
    $("#md").innerHTML = highlight(built.markdown);
    $("#cmd").textContent = `buat video dari prompts/${built.slug}.md`;
    $("#hits").innerHTML = built.hits.map((h) => `<div class="hit"><span class="t">${h.t.toFixed(2)}s</span><span>${esc(h.label)}</span><span class="c">${h.cat}</span></div>`).join("");
    const s = style(), e = element(), ov = state.project.mode === "overlay";
    const sum = [`<span class="acc">${s.name}</span>`, `<span>${state.project.aspect}</span>`, `<span>${state.project.duration} dtk</span>`,
      `<span>${ov ? "🧩 " + (e ? e.name : "elemen") : "🎬 video full"}</span>`, state.project.loop ? "<span>loop</span>" : "",
      `<span>${({ full: "musik + SFX", sfx: "SFX saja", none: "tanpa suara" })[state.sound.preset]}</span>`].join("");
    $("#summary").innerHTML = sum;
    $("#mobile-sum").textContent = `${s.name} · ${state.project.aspect} · ${state.project.duration} dtk`;
  }
  function highlight(md) {
    let n = 0, fm = false;
    return md.split("\n").map((line) => {
      const e = esc(line);
      if (line === "---" && n < 2) { n++; fm = n === 1; return `<span class="fm">${e}</span>`; }
      if (fm) return `<span class="fm">${e}</span>`;
      if (/^#{1,3} /.test(line)) return `<span class="h">${e}</span>`;
      if (/^\|/.test(line)) return `<span class="tb">${e}</span>`;
      return e;
    }).join("\n");
  }

  function changed(path) {
    if (path === "project.duration" || path === "project.bpm" || path === "project.lines" || path === "project.mode") maybeAuto();
    if (path === "project.mode") { state.ui.filter = "rec"; if (state.project.mode === "overlay") { renderElements(); const e = element(); if (e && !e.styles.includes(state.style.id)) pickStyle(e.styles[0], true); } renderStyles(); }
    if (path === "sound.preset" || path === "sound.musicFile") applySoundPreset();
    syncControls(); rebuild(); sizePreview(); save();
  }

  // ---------- preview ----------
  const pv = $("#preview"), pctx = pv.getContext("2d"); let PW = 0, PH = 0;
  function sizePreview() {
    const [a, b] = state.project.aspect.split(":").map(Number), maxW = 330, maxH = window.innerWidth < 980 ? 240 : 400;
    let w = maxW, h = (maxW * b) / a; if (h > maxH) { h = maxH; w = (maxH * a) / b; }
    if (Math.round(w) === PW && Math.round(h) === PH) return;
    PW = Math.round(w); PH = Math.round(h); const dpr = window.devicePixelRatio || 1;
    pv.width = PW * dpr; pv.height = PH * dpr; pv.style.width = PW + "px"; pv.style.height = PH + "px";
  }
  const checker = (ctx, W, H) => { for (let y = 0; y < H; y += 12) for (let x = 0; x < W; x += 12) { ctx.fillStyle = ((x + y) / 12) % 2 ? "#3a3a38" : "#2c2c2a"; ctx.fillRect(x, y, 12, 12); } };
  function frame(now) {
    const t = now / 1000, tl = built?.timeline || [], total = tl.length ? tl[tl.length - 1].end : 4;
    const lt = t % Math.max(total, 0.5), sc = tl.find((s) => lt >= s.start && lt < s.end) || tl[0];
    const dpr = window.devicePixelRatio || 1; pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const text = sc?.text || state.project.title || state.project.brief.split(/[.,\n]/)[0] || "Motion";
    if (state.project.mode === "overlay") {
      // show the element over a fake footage background so the user understands it's an overlay
      pctx.clearRect(0, 0, PW, PH); checker(pctx, PW, PH);
      const w = PW, h = PH * 0.32; const off = document.createElement("canvas");
      off.width = w * dpr; off.height = h * dpr; const o = off.getContext("2d"); o.setTransform(dpr, 0, 0, dpr, 0, 0);
      window.drawStylePreview(state.style.id, o, sc ? lt - sc.start : t, w, h, state.style.palette, text);
      pctx.drawImage(off, 0, PH - h - PH * 0.12, w, h);
      pctx.fillStyle = "rgba(255,255,255,.55)"; pctx.font = "600 11px system-ui"; pctx.textAlign = "left"; pctx.fillText("contoh footage (overlay ditumpuk di sini)", 10, 18);
    } else window.drawStylePreview(state.style.id, pctx, sc ? lt - sc.start : t, PW, PH, state.style.palette, text);
    $("#scene-now").textContent = sc ? `scene ${sc.index}/${tl.length} · ${sc.name} · ${lt.toFixed(1)}s` : "";
    cards.forEach((c) => {
      const r = c.canvas.getBoundingClientRect(); if (c.drawn && (r.bottom < 0 || r.top > innerHeight)) return; c.drawn = true;
      const ctx = c.canvas.getContext("2d"); ctx.setTransform(1, 0, 0, 1, 0, 0);
      window.drawStylePreview(c.id, ctx, t, c.canvas.width, c.canvas.height, c.palette, state.project.title || c.id.replace(/-/g, " "));
    });
    requestAnimationFrame(frame);
  }

  // ---------- actions ----------
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2200); }
  function download(name, text, type) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); } catch (e) { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
    toast(msg);
  }
  $$("[data-copy]").forEach((b) => (b.onclick = () => copy(built.markdown, "Prompt disalin ✓ Tempel ke Claude Code")));
  $("#copy-cmd").onclick = () => copy($("#cmd").textContent, "Perintah disalin ✓");
  $("#btn-download").onclick = () => { download(`${built.slug}.md`, built.markdown, "text/markdown"); toast(`${built.slug}.md diunduh → simpan ke prompts/`); };
  $("#btn-auto").onclick = () => { autoScenes(); renderScenes(); changed("scenes"); };
  $("#btn-fit").onclick = () => { fitScenes(); renderScenes(); changed("scenes"); };
  $("#btn-add").onclick = () => { state.scenes.push({ name: `Scene ${state.scenes.length + 1}`, text: "", visual: "", transition: "cut", beats: 4 }); state.scenesEdited = true; renderScenes(); changed("scenes"); };
  $("#menu-btn").onclick = (e) => { e.stopPropagation(); $("#menu-pop").hidden = !$("#menu-pop").hidden; };
  document.addEventListener("click", () => ($("#menu-pop").hidden = true));
  $("#btn-export").onclick = () => download(`${built.slug}.motion.json`, JSON.stringify(state, null, 2), "application/json");
  $("#btn-import").onclick = () => $("#file-import").click();
  $("#file-import").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { const txt = await f.text(); JSON.parse(txt); try { localStorage.setItem(KEY, txt); } catch (_) {} state = load(); if (!safeGet()) { const d = JSON.parse(txt); Object.assign(state, d); } init(); toast("Proyek diimpor ✓"); } catch (err) { toast("File tidak valid"); }
    e.target.value = "";
  };
  $("#btn-reset").onclick = () => { if (!confirm("Hapus semua isian dan mulai dari awal?")) return; try { localStorage.removeItem(KEY); } catch (e) {} state = load(); init(); window.scrollTo({ top: 0, behavior: "smooth" }); };
  window.addEventListener("resize", sizePreview);

  function greet() {
    const h = new Date().getHours();
    const w = h < 11 ? "Selamat pagi" : h < 15 ? "Selamat siang" : h < 19 ? "Selamat sore" : "Selamat malam";
    $("#greet").textContent = `${w}, mau bikin motion apa?`;
  }

  function init() { bind(); renderTemplates(); renderFilters(); renderElements(); renderStyles(); renderPalette(); renderScenes(); applySoundPreset(); changed(); }
  if (!STYLES.length) { document.body.innerHTML = "<p style='padding:40px'>data/styles.js tidak ditemukan. Jalankan <code>node scripts/build-styles.mjs</code>.</p>"; return; }
  state = load(); greet(); init(); requestAnimationFrame(frame);
})();
