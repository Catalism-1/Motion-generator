# Motion Generator

Dashboard lokal untuk merancang video motion graphics, lalu mengubahnya jadi **prompt markdown**
yang dikerjakan Claude (skill `motion-generator`): kode animasi, SFX yang dicari agent, storyboard, MP4.

```
Dashboard (form + style)  →  prompts/<slug>.md  →  Claude Code + skill  →  films/<slug>/ + out/<slug>.mp4
```

## Cara pakai
1. Buka `dashboard/index.html` di browser (double-click saja, tanpa install).
2. Isi 5 langkah: **Proyek → Style → Scene → Suara → Output**. Prompt markdown tampil live di kanan.
3. Klik **Download .md**, lalu simpan ke folder `prompts/`.
4. Buka Claude Code di folder repo ini, lalu ketik:
   ```
   buat video dari prompts/<slug>.md
   ```

Contoh hasil: [`prompts/contoh-launch-kopi-senja.md`](prompts/contoh-launch-kopi-senja.md).

## Isi repo
| Path | Isi |
|---|---|
| `dashboard/` | Form builder (HTML/CSS/JS murni, gaya visual Claude) |
| `data/styles.json` | 14 style: palet, gerak, SFX, larangan. Setelah edit, jalankan `node scripts/build-styles.mjs` |
| `.claude/skills/motion-generator/` | Skill: mengajari Claude cara mengerjakan brief |
| `sources/` | Riset: tren Opus 5.5, katalog style, prinsip gerak, SFX |
| `docs/RANCANGAN.md` | Rancangan sistem & format brief |
| `prompts/` | Brief hasil dashboard |
