# Motion Generator

Dashboard lokal untuk merancang video motion graphics, lalu mengubahnya jadi **prompt markdown**
yang dikerjakan Claude (skill `motion-generator`): kode animasi, SFX yang dicari agent, storyboard, MP4.

```
Dashboard (form + style)  →  prompts/<slug>.md  →  Claude Code + skill  →  films/<slug>/ + out/<slug>.mp4
```

## Cara pakai
1. Buka `dashboard/index.html` di browser (double-click saja, tanpa install).
2. Tulis idenya di kotak besar, **atau klik template** (Reels promo, Intro YouTube, Explainer, Data, Demo app,
   Logo reveal, Caption untuk editan, Lower third). Semua pengaturan langsung terisi default.
3. Pilih style (22 pilihan, ada label *Rekomendasi*) → cek **Detail cepat** → klik **Salin prompt** atau **Download .md** (simpan ke `prompts/`).
4. Buka Claude Code di folder repo ini, lalu ketik:
   ```
   buat video dari prompts/<slug>.md
   ```

Contoh hasil: [`prompts/contoh-launch-kopi-senja.md`](prompts/contoh-launch-kopi-senja.md).

## Isi repo
| Path | Isi |
|---|---|
| `dashboard/` | Brief builder (HTML/CSS/JS murni, gaya visual Claude, ramah HP) |
| `data/styles.json` | 22 style (8 diadaptasi dari [claude-video-2](https://github.com/ItsssssJack/claude-video-2), MIT) |
| `data/elements.json` | 27 elemen untuk editan video (caption, lower third, callout, …). Setelah edit data, jalankan `node scripts/build-styles.mjs` |
| `.claude/skills/motion-generator/` | Skill: mengajari Claude cara mengerjakan brief |
| `sources/` | Riset: tren Opus 5.5, katalog style, prinsip gerak, SFX |
| `docs/RANCANGAN.md` | Rancangan sistem & format brief |
| `prompts/` | Brief hasil dashboard |
