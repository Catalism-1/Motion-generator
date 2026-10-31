# Rancangan — Motion Generator

## Ide besar

```
┌──────────────────────┐     ┌────────────────────┐     ┌──────────────────────────────┐
│  Dashboard (lokal)   │ ──▶ │  Prompt Markdown   │ ──▶ │  Claude + skill              │
│  form + pilih style  │     │  prompts/<slug>.md │     │  "motion-generator"          │
│  (tanpa AI)          │     │  (brief lengkap)   │     │  baca .md → kode → SFX → MP4 │
└──────────────────────┘     └────────────────────┘     └──────────────────────────────┘
```

- **Dashboard** = alat bantu manusia. Isi form, pilih style, susun scene. Tidak memanggil AI sama sekali,
  jadi bisa jalan offline dengan cara dibuka langsung dari file.
- **Prompt Markdown** = kontrak antara manusia dan AI. Semua keputusan (style, palet, durasi, scene, SFX,
  output) ditulis eksplisit. AI tidak perlu menebak.
- **Skill Claude** (`.claude/skills/motion-generator/SKILL.md`) = hanya mengajari Claude *cara memakai*
  file markdown itu: urutan kerja, struktur kode film, cara cari SFX, cara render.

## Alur pemakaian

1. Buka `dashboard/index.html` di browser.
2. Isi 5 langkah form (lihat di bawah). Panel kanan menampilkan markdown secara live.
3. Klik **Download .md**, lalu simpan ke `prompts/`. Atau **Copy**, lalu tempel ke Claude.
4. Di Claude Code (folder repo ini), ketik misalnya: `buat video dari prompts/launch-kopi.md`.
   Skill akan aktif dan Claude mengerjakan sesuai brief.

## Form (5 langkah)

| Langkah | Field | Catatan |
|---|---|---|
| 1. Proyek | judul, brief/tujuan, audiens, durasi (detik), rasio (16:9 / 9:16 / 1:1), fps, BPM, bahasa | BPM dipakai untuk menghitung beat → detik |
| 2. Style | pilih 1 dari 14 kartu (preview animasi), palet warna bisa diubah, font, intensitas gerak (tenang ↔ agresif) | data dari `data/styles.json` |
| 3. Scene (sketsa) | daftar scene: nama, panjang (beat), teks di layar, deskripsi visual, transisi keluar | tombol "isi otomatis" membuat 5 scene dasar |
| 4. Suara | musik (sintesis / file sendiri / tanpa), mode SFX (agent cari online / sintesis lokal / campur), kategori SFX, sumber (Openverse, Freesound), lisensi yang diizinkan | timeline HITS dibuat otomatis dari scene |
| 5. Output | format kode (single HTML Canvas / Remotion / Three.js), render MP4, storyboard PNG, catatan tambahan | |

Data form tersimpan otomatis di `localStorage`, bisa juga ekspor/impor sebagai `.json`.

## Format markdown yang dihasilkan

```markdown
---
generator: motion-generator/v1
slug: launch-kopi
style: glitch
duration_s: 15
aspect: "16:9"
fps: 60
bpm: 120
---
# Motion Brief: Launch Kopi
## 1. Brief
## 2. Spesifikasi teknis
## 3. Style: Glitch / Cyber      ← palet, font, aturan gerak, larangan
## 4. Shot list (sketsa)         ← tabel scene + waktu mulai/akhir (detik & beat)
## 5. Timeline HITS              ← [waktu, label, kategori SFX, query pencarian]
## 6. Rencana suara              ← musik, sumber SFX, lisensi, fallback
## 7. Deliverables               ← file apa saja yang harus jadi
## 8. Checklist kualitas         ← dicek AI sebelum selesai
```

Frontmatter YAML membuat file mudah dibaca mesin; isi markdown membuat AI paham konteksnya.

## Desain antarmuka (gaya Claude)

- Latar krem hangat `#F5F4EE`, permukaan `#FFFFFF`/`#FAF9F5`, teks `#1F1E1D`, garis `#E6E3DA`.
- Aksen terracotta `#C96442` (hover `#B5573A`), aksen lembut `#F0E6DF`.
- Judul serif (Georgia / ui-serif), isi sans (system-ui), kode monospace.
- Sudut membulat 12–16 px, bayangan sangat halus, banyak ruang kosong.
- Layout: sidebar langkah (kiri) · form (tengah) · preview markdown + preview animasi (kanan).

## Struktur repo

```
dashboard/        index.html, app.css, app.js, previews.js, markdown.js
data/             styles.json (sumber), styles.js (hasil build untuk file://)
scripts/          build-styles.mjs
prompts/          hasil markdown dari dashboard
films/            hasil kerja Claude (satu folder per slug)
sources/          riset
.claude/skills/motion-generator/SKILL.md
```

## Tahap berikutnya (belum dibuat)
- Tombol "kirim ke Claude" langsung dari dashboard (butuh server lokal + API key).
- Library SFX lokal hasil unduhan agent (`sfx/`), bisa dipakai ulang.
- Preview storyboard dari kode film yang sudah dibuat Claude.

---

## Update v2: UI lebih mudah (lihat `sources/06-riset-ui-claude-dan-workflow.md`)

| v1 | v2 |
|---|---|
| Wizard 5 tab + sidebar, semua field terlihat | Satu halaman mengalir: **kotak ide → template → style → detail cepat → salin** |
| Harus isi scene manual | Scene **otomatis** dari template / "kata-kata di layar" (satu baris = satu scene); editor scene di "Pengaturan lanjutan" |
| 14 style tanpa panduan | 22 style + filter "cocok untuk" + label **Rekomendasi** |
| Hanya video full | Mode **Elemen untuk editan** (27 elemen) + ekspor transparan / green screen |
| Markdown selalu tampil | Tombol besar **Salin prompt**; markdown di "Lihat isi prompt" |
| Desktop saja | Responsif HP: bar bawah "Salin prompt", target sentuh ≥ 44 px |

Frontmatter brief v2 menambah: `mode`, `element`, `loop`, `export`.
