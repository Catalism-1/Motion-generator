// Turns dashboard state into the Motion Brief markdown (contract between human and AI).
(function () {
  const TRANSITION_SFX = {
    cut: "hit", wipe: "whoosh", zoom: "whoosh", slide: "swoosh", morph: "swoosh",
    glitch: "glitch", fade: "shimmer", "match-cut": "ui click",
  };
  const MUSIC = { synth: "Sintesis (buat musik sendiri dengan kode / Web Audio)", file: "File dari user", none: "Tanpa musik (SFX saja)" };
  const SFX_MODE = {
    agent: "Agent mencari SFX online (lalu unduh ke folder film)",
    synth: "Sintesis lokal saja (Web Audio / DSP, tanpa internet)",
    mix: "Cari online dulu; kalau tidak ketemu/lisensi tidak cocok → sintesis",
  };
  const FORMAT = {
    "html-canvas": "Single-file HTML + Canvas 2D (`window.seek(t)` murni fungsi waktu)",
    remotion: "Remotion (React/TypeScript composition)",
    threejs: "HTML + Three.js (scene 3D, tetap `window.seek(t)`)",
  };
  const INTENSITY = ["", "sangat tenang", "tenang", "seimbang", "energik", "agresif"];

  const slugify = (s) => (s || "film").toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").slice(0, 48) || "film";
  const f2 = (n) => (Math.round(n * 100) / 100).toFixed(2);
  const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  const yamlStr = (s) => JSON.stringify(String(s ?? ""));

  function timeline(state) {
    const beat = 60 / (Number(state.project.bpm) || 120);
    let b = 0;
    return state.scenes.map((s, i) => {
      const beats = Math.max(1, Number(s.beats) || 4);
      const text = String(s.text ?? "").replace(/\{judul\}/gi, state.project.title || "Judul");
      const row = { ...s, text, index: i + 1, beats, startBeat: b, endBeat: b + beats, start: b * beat, end: (b + beats) * beat };
      b += beats;
      return row;
    });
  }

  function hits(state, tl, style) {
    const beat = 60 / (Number(state.project.bpm) || 120);
    const flavor = style?.sfx_query || "";
    const out = [];
    tl.forEach((s, i) => {
      if (i > 0 && !(tl.length >= 2 && i === tl.length - 1)) {
        const prev = tl[i - 1];
        const cat = TRANSITION_SFX[prev.transition] || "whoosh";
        out.push({ t: s.start, beat: s.startBeat, label: `transisi ${prev.index}→${s.index} (${prev.transition})`, cat });
      }
      if (s.text && s.text.trim()) out.push({ t: s.start + beat * 0.5, beat: s.startBeat + 0.5, label: `teks muncul: "${s.text.trim().slice(0, 32)}"`, cat: "ui click" });
    });
    if (tl.length >= 2) {
      const last = tl[tl.length - 1];
      const rs = Math.max(0, last.startBeat - 4);
      out.push({ t: rs * beat, beat: rs, label: "riser menuju scene terakhir", cat: "riser" });
      out.push({ t: last.start, beat: last.startBeat, label: "impact / reveal akhir", cat: "impact" });
    }
    const allowed = state.sound.categories || [];
    return out
      .filter((h) => !allowed.length || allowed.includes(h.cat))
      .map((h) => ({ ...h, query: `${h.cat} ${flavor}`.trim() }))
      .sort((a, b) => a.t - b.t);
  }

  function build(state, styles) {
    const p = state.project, st = state.style, snd = state.sound, o = state.output;
    const style = styles.find((s) => s.id === st.id) || styles[0];
    const slug = p.slug || slugify(p.title);
    const tl = timeline(state);
    const H = hits(state, tl, style);
    const total = tl.length ? tl[tl.length - 1].end : 0;
    const dur = Number(p.duration) || 15;
    const palette = (st.palette && st.palette.length ? st.palette : style.palette);
    const L = [];

    L.push("---");
    L.push("generator: motion-generator/v1");
    L.push(`slug: ${slug}`);
    L.push(`title: ${yamlStr(p.title || "Untitled")}`);
    L.push(`style: ${style.id}`);
    L.push(`duration_s: ${dur}`);
    L.push(`aspect: "${p.aspect}"`);
    L.push(`fps: ${p.fps}`);
    L.push(`bpm: ${p.bpm}`);
    L.push(`language: ${p.lang}`);
    L.push(`output: ${o.format}`);
    L.push("---", "");
    L.push(`# Motion Brief: ${p.title || "Untitled"}`, "");
    L.push("> Brief ini dibuat oleh dashboard Motion Generator. Kerjakan dengan skill `motion-generator`.",
      "> Semua keputusan di bawah adalah keputusan user. Jangan diganti tanpa bertanya.", "");

    L.push("## 1. Brief", "");
    L.push(p.brief?.trim() || "_(tidak ada brief, buat showreel bebas yang menunjukkan kemampuan motion design)_", "");
    if (p.audience?.trim()) L.push(`**Audiens:** ${p.audience.trim()}`, "");

    L.push("## 2. Spesifikasi teknis", "");
    L.push("| Item | Nilai |", "|---|---|");
    L.push(`| Durasi | ${dur} detik |`);
    L.push(`| Rasio | ${p.aspect} (${({ "16:9": "1920×1080", "9:16": "1080×1920", "1:1": "1080×1080", "4:5": "1080×1350" })[p.aspect] || ""}) |`);
    L.push(`| FPS | ${p.fps} |`);
    L.push(`| Tempo | ${p.bpm} BPM (1 beat = ${f2(60 / p.bpm)} s, 1 bar = ${f2(240 / p.bpm)} s) |`);
    L.push(`| Bahasa teks | ${p.lang} |`);
    L.push(`| Format kode | ${FORMAT[o.format]} |`);
    L.push("");
    if (Math.abs(total - dur) > 0.05) {
      L.push(`> ⚠️ Total scene = **${f2(total)} s**, durasi target = **${dur} s**. Sesuaikan panjang scene secara proporsional agar pas ${dur} s, dengan cut tetap di beat.`, "");
    }

    L.push(`## 3. Style: ${style.name}`, "");
    L.push(`${style.summary}.`, "");
    L.push(`- **Palet:** ${palette.map((c) => "`" + c + "`").join(" ")} (urutan: latar, utama, sekunder, aksen…)`);
    L.push(`- **Tipografi:** ${st.font?.trim() || style.type}`);
    L.push(`- **Intensitas gerak:** ${st.intensity}/5 (${INTENSITY[st.intensity]})`);
    L.push(`- **Aturan gerak:** ${style.motion.join("; ")}`);
    L.push(`- **Hindari:** ${(style.avoid || []).join("; ")}`);
    L.push(`- **Engine yang disarankan:** ${style.engine}`);
    L.push(`- **Referensi:** \`sources/02-katalog-style.md\` bagian "${style.name}", dan \`sources/03-prinsip-gerak.md\``);
    if (st.notes?.trim()) L.push(`- **Catatan style dari user:** ${st.notes.trim()}`);
    L.push("");

    L.push("## 4. Shot list (sketsa)", "");
    L.push("| # | Scene | Beat | Waktu (s) | Teks di layar | Visual | Transisi keluar |", "|---|---|---|---|---|---|---|");
    tl.forEach((s) => {
      L.push(`| ${s.index} | ${esc(s.name)} | ${s.startBeat}–${s.endBeat} | ${f2(s.start)}–${f2(s.end)} | ${esc(s.text) || "_(AI tulis copy dari brief)_"} | ${esc(s.visual) || "—"} | ${s.index === tl.length ? "— (akhir)" : s.transition} |`);
    });
    L.push("");

    L.push("## 5. Timeline HITS", "");
    L.push("Setiap aksen visual **dan** suara dijadwalkan dari daftar ini (satu sumber kebenaran).", "");
    L.push("| Waktu (s) | Beat | Momen | Kategori SFX | Query pencarian |", "|---|---|---|---|---|");
    H.forEach((h) => L.push(`| ${f2(h.t)} | ${h.beat} | ${esc(h.label)} | ${h.cat} | \`${h.query}\` |`));
    L.push("");
    L.push("```js", "// salin ke kode film", "const HITS = [");
    H.forEach((h) => L.push(`  [${f2(h.t)}, ${JSON.stringify(h.label)}, ${JSON.stringify(h.cat)}],`));
    L.push("];", "```", "");

    L.push("## 6. Rencana suara", "");
    L.push(`- **Musik:** ${MUSIC[snd.music]}${snd.music === "file" && snd.musicFile ? ` → \`${snd.musicFile}\`` : ""}${snd.musicMood?.trim() ? ` · mood: ${snd.musicMood.trim()}` : ""}`);
    L.push(`- **Mode SFX:** ${SFX_MODE[snd.sfxMode]}`);
    if (snd.sfxMode !== "synth") {
      L.push(`- **Sumber online:** ${(snd.sources || []).join(", ") || "openverse"}`);
      L.push(`- **Lisensi yang diizinkan:** ${(snd.license || []).join(", ") || "cc0"}. Catat judul, kreator, URL, dan lisensi tiap file di \`films/${slug}/audio/CREDITS.md\`.`);
    }
    L.push(`- **Kategori SFX yang dipakai:** ${(snd.categories || []).join(", ") || "semua"}`);
    L.push(`- **Karakter SFX style ini:** ${style.sfx.join(", ")}`);
    L.push("- **Mix:** musik di bawah SFX; target loudness sekitar −14 LUFS; SFX tidak boleh clipping.", "");

    L.push("## 7. Deliverables", "");
    L.push(`Semua di \`films/${slug}/\`:`, "");
    L.push(`- [ ] Kode film (${FORMAT[o.format]})`);
    L.push("- [ ] `audio/` berisi SFX yang dipakai + `CREDITS.md`");
    if (o.storyboard) L.push("- [ ] `storyboard.png`: contact sheet 1 frame per scene (sketsa untuk direview)");
    if (o.mp4) L.push(`- [ ] \`out/${slug}.mp4\` (${p.aspect}, ${p.fps} fps, dengan audio)`);
    L.push("");
    if (o.extra?.trim()) { L.push("### Catatan tambahan dari user", "", o.extra.trim(), ""); }

    L.push("## 8. Checklist kualitas", "");
    L.push("- [ ] Setiap frame = fungsi murni dari waktu (`seek(t)` bisa lompat ke frame mana pun).");
    L.push("- [ ] Semua cut & aksen jatuh di waktu pada Timeline HITS (toleransi ±1 frame).");
    L.push("- [ ] Palet hanya dari §3; aturan \"Hindari\" dipatuhi.");
    L.push("- [ ] Teks terbaca di layar HP (cek di setengah ukuran).");
    L.push("- [ ] Tidak ada SFX tanpa lisensi yang jelas.");
    L.push("- [ ] Storyboard dikirim ke user sebelum render final (kalau diminta).");
    L.push("");
    return { markdown: L.join("\n"), slug, total, hits: H, timeline: tl };
  }

  window.MotionBrief = { build, slugify, timeline, TRANSITION_SFX };
})();
