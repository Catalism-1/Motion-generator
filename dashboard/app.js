(function () {
  const STYLES = (window.STYLE_DATA && window.STYLE_DATA.styles) || [];
  const KEY = "motion-generator/state/v1";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const TRANSITIONS = ["cut", "wipe", "zoom", "slide", "morph", "glitch", "fade", "match-cut"];

  const defaults = () => ({
    project: { title: "", brief: "", audience: "", duration: 15, bpm: 120, aspect: "16:9", fps: 60, lang: "Indonesia" },
    style: { id: STYLES[0]?.id || "opus-showreel", palette: [...(STYLES[0]?.palette || [])], font: "", intensity: 3, notes: "" },
    scenes: [],
    sound: { music: "synth", musicFile: "", musicMood: "", sfxMode: "mix", sources: ["openverse"], license: ["cc0", "by"], categories: ["whoosh", "swoosh", "hit", "impact", "riser", "ui click", "glitch", "shimmer"] },
    output: { format: "html-canvas", storyboard: true, mp4: true, extra: "" },
  });

  let state;
  let step = 0;

  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.project) return merge(defaults(), s); } catch (e) {}
    const d = defaults(); d.scenes = autoScenes(d); return d;
  }
  function merge(base, s) { for (const k of Object.keys(base)) if (s[k] !== undefined) base[k] = Array.isArray(base[k]) ? s[k] : (typeof base[k] === "object" ? { ...base[k], ...s[k] } : s[k]); return base; }
  let saveT; function save() { clearTimeout(saveT); saveT = setTimeout(() => localStorage.setItem(KEY, JSON.stringify(state)), 150); }
  const get = (path) => path.split(".").reduce((o, k) => o?.[k], state);
  const set = (path, v) => { const ks = path.split("."); const last = ks.pop(); ks.reduce((o, k) => o[k], state)[last] = v; };
  const style = () => STYLES.find((s) => s.id === state.style.id) || STYLES[0];
  const totalBeats = (st = state) => Math.max(1, Math.round((Number(st.project.duration) || 15) * (Number(st.project.bpm) || 120) / 60));

  function autoScenes(st) {
    const title = "{judul}"; // diganti otomatis dengan judul proyek
    const tpl = [
      ["Hook", title, "hook: teks besar masuk dengan punch, latar bergerak", "wipe"],
      ["Masalah / ide", "", "kenapa ini penting? elemen pendukung muncul satu per satu (AI tulis copy dari brief)", "slide"],
      ["Poin utama 1", "", "manfaat/fitur pertama: ilustrasi atau UI dianimasikan (AI tulis copy dari brief)", "zoom"],
      ["Poin utama 2", "", "manfaat/fitur kedua: morph dari scene sebelumnya (AI tulis copy dari brief)", "cut"],
      ["Reveal + CTA", title, "logo/nama reveal, aksen warna, hold 1 bar", "cut"],
    ];
    const tb = totalBeats(st), w = [0.16, 0.18, 0.22, 0.22, 0.22];
    const beats = w.map((x) => Math.max(1, Math.round(x * tb)));
    beats[beats.length - 1] += tb - beats.reduce((a, b) => a + b, 0);
    return tpl.map(([name, text, visual, transition], i) => ({ name, text, visual, transition, beats: Math.max(1, beats[i]) }));
  }
  function fitScenes() {
    const tb = totalBeats(), cur = state.scenes.reduce((a, s) => a + (Number(s.beats) || 1), 0);
    if (!state.scenes.length) return;
    let acc = 0;
    state.scenes.forEach((s, i) => {
      if (i === state.scenes.length - 1) s.beats = Math.max(1, tb - acc);
      else { s.beats = Math.max(1, Math.round((Number(s.beats) || 1) * tb / cur)); acc += s.beats; }
    });
  }

  // ---------- binding ----------
  function bindInputs() {
    $$("[data-bind]").forEach((el) => {
      const path = el.dataset.bind, num = el.hasAttribute("data-num");
      const v = get(path);
      if (el.type === "checkbox") el.checked = !!v; else el.value = v ?? "";
      el.oninput = el.onchange = () => {
        set(path, el.type === "checkbox" ? el.checked : num ? Number(el.value) : el.value);
        update(path);
      };
    });
    $$("[data-seg]").forEach((el) => {
      const path = el.dataset.seg, num = el.hasAttribute("data-num");
      $$("button", el).forEach((b) => {
        b.classList.toggle("on", String(get(path)) === b.dataset.v);
        b.onclick = () => { set(path, num ? Number(b.dataset.v) : b.dataset.v); $$("button", el).forEach((x) => x.classList.toggle("on", x === b)); update(path); };
      });
    });
    $$("[data-chips]").forEach((el) => {
      const path = el.dataset.chips;
      $$("button", el).forEach((b) => {
        b.classList.toggle("on", (get(path) || []).includes(b.dataset.v));
        b.onclick = () => {
          const arr = new Set(get(path) || []); arr.has(b.dataset.v) ? arr.delete(b.dataset.v) : arr.add(b.dataset.v);
          set(path, [...arr]); b.classList.toggle("on"); update(path);
        };
      });
    });
  }
  function applyShows() {
    $$("[data-show]").forEach((el) => {
      const m = el.dataset.show.match(/^([\w.]+)(!?=)(.+)$/); if (!m) return;
      const v = String(get(m[1])); el.hidden = m[2] === "=" ? v !== m[3] : v === m[3];
    });
  }

  // ---------- steps ----------
  function goto(i) {
    step = Math.max(0, Math.min(4, i));
    $$(".panel").forEach((p) => (p.hidden = Number(p.dataset.panel) !== step));
    $$(".step").forEach((s) => { const n = Number(s.dataset.step); s.classList.toggle("active", n === step); s.classList.toggle("done", n < step); });
    $("#btn-prev").style.visibility = step === 0 ? "hidden" : "visible";
    $("#btn-next").textContent = step === 4 ? "Download .md" : "Lanjut →";
    $("#form").scrollTop = 0;
  }

  // ---------- style step ----------
  const cardCanvases = [];
  function renderStyles() {
    const grid = $("#style-grid"); grid.innerHTML = ""; cardCanvases.length = 0;
    STYLES.forEach((s) => {
      const b = document.createElement("button");
      b.className = "style-card" + (s.id === state.style.id ? " on" : "");
      b.innerHTML = `<canvas width="300" height="188"></canvas><div class="meta"><b>${s.name}</b><small>${s.engine}</small><span class="conf ${s.confidence === "umum" ? "umum" : ""}">${s.confidence}</span></div>`;
      b.onclick = () => {
        state.style.id = s.id; state.style.palette = [...s.palette];
        $$(".style-card").forEach((x) => x.classList.toggle("on", x === b));
        renderStyleDetail(); renderPalette(); update("style.id");
      };
      grid.appendChild(b);
      cardCanvases.push({ id: s.id, canvas: $("canvas", b), palette: s.palette });
    });
    renderStyleDetail(); renderPalette();
  }
  function renderStyleDetail() {
    const s = style();
    $("#style-detail").innerHTML = `<b>${s.name}</b>: ${s.summary}.
      <ul><li><b>Gerak:</b> ${s.motion.join(" · ")}</li><li><b>SFX:</b> ${s.sfx.join(" · ")}</li>
      <li><b>Hindari:</b> ${(s.avoid || []).join(" · ")}</li><li><b>Tipe:</b> ${s.type}</li></ul>`;
  }
  function renderPalette() {
    const el = $("#palette"); el.innerHTML = "";
    state.style.palette.forEach((c, i) => {
      const sw = document.createElement("label"); sw.className = "swatch"; sw.style.background = c; sw.title = c;
      const inp = document.createElement("input"); inp.type = "color"; inp.value = c;
      inp.oninput = () => { state.style.palette[i] = inp.value; sw.style.background = inp.value; sw.title = inp.value; update("style.palette"); };
      sw.appendChild(inp); el.appendChild(sw);
    });
    const reset = document.createElement("button"); reset.className = "btn small ghost"; reset.textContent = "Reset palet";
    reset.onclick = () => { state.style.palette = [...style().palette]; renderPalette(); update("style.palette"); };
    el.appendChild(reset);
  }

  // ---------- scenes ----------
  function renderScenes() {
    const box = $("#scenes"); box.innerHTML = "";
    const tl = window.MotionBrief.timeline(state);
    state.scenes.forEach((s, i) => {
      const row = document.createElement("div"); row.className = "scene";
      const r = tl[i];
      row.innerHTML = `
        <div class="idx">${i + 1}</div>
        <label class="field">Nama scene<input data-k="name" value="${attr(s.name)}" /></label>
        <label class="field">Beat<input type="number" min="1" data-k="beats" value="${s.beats}" /></label>
        <label class="field">Transisi keluar<select data-k="transition">${TRANSITIONS.map((t) => `<option ${t === s.transition ? "selected" : ""}>${t}</option>`).join("")}</select></label>
        <div class="tools">
          <button class="btn small ghost" data-a="up" title="naik">↑</button>
          <button class="btn small ghost" data-a="down" title="turun">↓</button>
          <button class="btn small ghost danger" data-a="del" title="hapus">✕</button>
        </div>
        <span></span>
        <label class="field wide">Teks di layar<input data-k="text" value="${attr(s.text)}" placeholder="kosong = AI tulis copy · {judul} = judul proyek" /></label>
        <span></span><span></span>
        <label class="field wide">Visual / gerak<textarea rows="2" data-k="visual" placeholder="apa yang terlihat & bergerak">${html(s.visual)}</textarea>
          <span class="time">${r.start.toFixed(2)}s → ${r.end.toFixed(2)}s · beat ${r.startBeat}–${r.endBeat}</span></label>`;
      $$("[data-k]", row).forEach((el) => {
        el.oninput = el.onchange = () => {
          s[el.dataset.k] = el.dataset.k === "beats" ? Math.max(1, Number(el.value) || 1) : el.value;
          if (el.dataset.k === "beats") { updateSceneTimes(); }
          update("scenes", true);
        };
      });
      $$("[data-a]", row).forEach((b) => (b.onclick = () => {
        const a = b.dataset.a, arr = state.scenes;
        if (a === "del") arr.splice(i, 1);
        if (a === "up" && i > 0) [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        if (a === "down" && i < arr.length - 1) [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
        renderScenes(); update("scenes");
      }));
      box.appendChild(row);
    });
    updateSceneTotal();
  }
  function updateSceneTimes() {
    const tl = window.MotionBrief.timeline(state);
    $$("#scenes .scene .time").forEach((el, i) => { const r = tl[i]; if (r) el.textContent = `${r.start.toFixed(2)}s → ${r.end.toFixed(2)}s · beat ${r.startBeat}–${r.endBeat}`; });
    updateSceneTotal();
  }
  function updateSceneTotal() {
    const tl = window.MotionBrief.timeline(state), tot = tl.length ? tl[tl.length - 1].end : 0;
    const d = Number(state.project.duration) || 15, ok = Math.abs(tot - d) < 0.05;
    $("#scene-total").textContent = `· total ${tot.toFixed(2)} s / target ${d} s ${ok ? "✓" : "(klik 'Pas-kan ke durasi')"}`;
  }
  const attr = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const html = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");

  // ---------- hits + markdown ----------
  let built;
  function rebuild() {
    built = window.MotionBrief.build(state, STYLES);
    $("#hits").innerHTML = built.hits.length
      ? built.hits.map((h) => `<div class="hit"><span class="t">${h.t.toFixed(2)}s</span><span>${html(h.label)}</span><span class="c">${h.cat}</span></div>`).join("")
      : `<div class="hit"><span></span><span>Belum ada hit. Tambahkan scene dulu.</span><span></span></div>`;
    $("#md").innerHTML = highlight(built.markdown);
    $("#cmd-hint").textContent = `buat video dari prompts/${built.slug}.md`;
  }
  function highlight(md) {
    let inFm = false, n = 0;
    return md.split("\n").map((line) => {
      const e = html(line);
      if (line === "---" && n++ < 2) { inFm = n === 1; return `<span class="fm">${e}</span>`; }
      if (inFm) return `<span class="fm">${e}</span>`;
      if (/^#{1,3} /.test(line)) return `<span class="h">${e}</span>`;
      if (/^\|/.test(line)) return `<span class="tb">${e}</span>`;
      return e;
    }).join("\n");
  }

  function update(path, skipScenes) {
    if (path === "project.duration" || path === "project.bpm") { if (!skipScenes) renderScenes(); }
    if (path === "style.intensity" || !path) $("#intensity-label").textContent = ["", "sangat tenang", "tenang", "seimbang", "energik", "agresif"][state.style.intensity];
    applyShows(); rebuild(); resizePreview(); save();
  }

  // ---------- preview loop ----------
  const pv = $("#preview"), pctx = pv.getContext("2d");
  let PW = 480, PH = 270;
  function resizePreview() {
    const [a, b] = (state.project.aspect || "16:9").split(":").map(Number);
    const maxW = 460, maxH = 260; let w = maxW, h = (maxW * b) / a; if (h > maxH) { h = maxH; w = (maxH * a) / b; }
    if (Math.round(w) === PW && Math.round(h) === PH && pv.width) return;
    PW = Math.round(w); PH = Math.round(h);
    const dpr = window.devicePixelRatio || 1; pv.width = PW * dpr; pv.height = PH * dpr; pv.style.width = PW + "px"; pv.style.height = PH + "px";
  }
  function frame(now) {
    const t = now / 1000;
    // main preview: cycle through scenes on the real timeline
    const tl = built?.timeline || []; const total = tl.length ? tl[tl.length - 1].end : 4;
    const lt = t % Math.max(total, 0.5); const sc = tl.find((s) => lt >= s.start && lt < s.end) || tl[0];
    const dpr = window.devicePixelRatio || 1;
    pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    window.drawStylePreview(state.style.id, pctx, sc ? (lt - sc.start) : t, PW, PH, state.style.palette, sc?.text || state.project.title);
    $("#preview-scene").textContent = sc ? `scene ${sc.index}/${tl.length} · ${sc.name} · ${lt.toFixed(1)}s` : "";
    // cards (only when style step visible)
    if (step === 1) cardCanvases.forEach((c) => {
      const ctx = c.canvas.getContext("2d"); ctx.setTransform(1, 0, 0, 1, 0, 0);
      window.drawStylePreview(c.id, ctx, t, c.canvas.width, c.canvas.height, c.palette, state.project.title || c.id);
    });
    requestAnimationFrame(frame);
  }

  // ---------- actions ----------
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 1800); }
  function download(name, text, type) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function downloadMd() { download(`${built.slug}.md`, built.markdown, "text/markdown"); toast(`${built.slug}.md diunduh → simpan ke folder prompts/`); }

  $$(".step").forEach((s) => (s.onclick = () => goto(Number(s.dataset.step))));
  $("#btn-prev").onclick = () => goto(step - 1);
  $("#btn-next").onclick = () => (step === 4 ? downloadMd() : goto(step + 1));
  $("#btn-download").onclick = downloadMd;
  $("#btn-copy").onclick = async () => {
    try { await navigator.clipboard.writeText(built.markdown); toast("Markdown disalin ✓"); }
    catch (e) { const ta = document.createElement("textarea"); ta.value = built.markdown; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); toast("Markdown disalin ✓"); }
  };
  $("#btn-autoscenes").onclick = () => { if (state.scenes.length && !confirm("Ganti scene yang ada dengan 5 scene otomatis?")) return; state.scenes = autoScenes(state); renderScenes(); update("scenes"); };
  $("#btn-fit").onclick = () => { fitScenes(); renderScenes(); update("scenes"); toast("Scene dipas-kan ke durasi"); };
  $("#btn-addscene").onclick = () => { state.scenes.push({ name: `Scene ${state.scenes.length + 1}`, text: "", visual: "", transition: "cut", beats: 4 }); renderScenes(); update("scenes"); };
  $("#btn-export").onclick = () => download(`${built.slug}.motion.json`, JSON.stringify(state, null, 2), "application/json");
  $("#btn-import").onclick = () => $("#file-import").click();
  $("#file-import").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { state = merge(defaults(), JSON.parse(await f.text())); init(); toast("Proyek diimpor ✓"); } catch (err) { toast("File tidak valid"); }
    e.target.value = "";
  };
  $("#btn-reset").onclick = () => { if (!confirm("Reset semua isian?")) return; state = defaults(); state.scenes = autoScenes(state); init(); };

  function init() { bindInputs(); renderStyles(); renderScenes(); update(); goto(step); }
  if (!STYLES.length) { document.body.innerHTML = "<p style='padding:40px'>data/styles.js tidak ditemukan. Jalankan <code>node scripts/build-styles.mjs</code>.</p>"; return; }
  state = load();
  init();
  requestAnimationFrame(frame);
})();
