# 06 — Riset: Gaya Visual Claude, Workflow Kreator, & UX Form

> Dikumpulkan 31 Okt 2026. Dipakai untuk redesign dashboard v2 ("lebih mudah dipakai").

## A. Gaya visual Claude / Anthropic
Tidak ada dokumen design system resmi yang ditemukan. Semua angka di bawah berasal dari ekstraksi pihak ketiga, dan
sumber-sumbernya saling berbeda. Yang dipakai hanya nilai yang **muncul berulang** di beberapa sumber. [C1–C5]

| Token | Nilai | Keyakinan |
|---|---|---|
| Ink (teks) | `#141413` | berulang di beberapa sumber |
| Ivory (latar) | `#FAF9F5` | berulang |
| Terracotta / oranye Claude (aksen) | `#D97757` (varian lebih gelap `#C6613F`) | berulang |
| Aksen sekunder | biru `#6A9BCC`, hijau `#788C5D` | satu sumber (skill brand guidelines) |
| Font | Anthropic Serif / Sans / Mono. Pengganti: Georgia/Tiempos (serif), Inter (sans), JetBrains Mono. Fallback eksternal: Poppins + Lora | beberapa sumber, belum resmi |

Pola antarmuka claude.ai yang dipakai di dashboard: chat utama di kiri, artifact di panel kanan [C6]; salam besar
ber-font serif + satu kotak input besar di tengah; tombol aksen oranye; banyak ruang kosong. **[umum: pengamatan produk]**

## B. Bagaimana kreator membuat motion dengan Claude (YouTube & artikel)
- **Video YouTube:** "Claude Code Motion Graphics Tutorial: Pro Product Videos with Opus 5.5". Premisnya: prompt cuma
  sebagian kecil dari hasil. Isi langkah per langkahnya tidak terindeks, jadi harus ditonton langsung. [Y1]
- **Remotion + Claude Code:** pasang Remotion sebagai skill, beri gambar referensi, minta dibuat ulang jadi komposisi.
  Mulai dengan instruksi minimal lalu iterasi. FFmpeg dipakai untuk ekstrak frame karena Claude tidak bisa membaca video. [Y2]
- **motion-graphics-skills (charlie947):** 15 skill. *brand-intake* dijalankan sekali dan menulis `brand.md` + `MOTION.md`.
  Lalu ada skill per tahap (launch-video, vox-explainer, animated-chart, milestone-reveal, title-sequence-3d, reel-export 1080×1920…).
  Cek 1 frame tengah per scene untuk teks terpotong/tumpang tindih. [Y3]
- **claude-video-2 (MIT, 21 look):** alurnya paling sederhana [Y4]:
  1. Pilih look di galeri.
  2. Jawab **5 pertanyaan**, semuanya punya **default** (untuk apa + durasi, teks di layar, loop?, brand, media asli).
     Cukup jawab "go" untuk semua default.
  3. Storyboard → **3 still untuk disetujui** → render → cek pacing dari frame asli (+ cek loop piksel).
  4. Tiap look punya `STYLE.md`: palet hex, font gratis, **angka easing (detik)**, aturan gerak, *signature moves*, daftar larangan.
- **MindStudio / HyperFrames:** teks & subtitle animasi lewat bahasa natural, aturan brand di `CLAUDE.md`. [Y5]
- **Motion Format (ID):** skill + video materi + prompt helper (lihat [05](05-motion-untuk-editan-video.md)).

### 8 look yang diadaptasi ke `data/styles.json` (dari claude-video-2, MIT)
| id | Untuk | Inti |
|---|---|---|
| `poster-pop` | hook, Shorts, "3 hal" | kuning `#FFD400` + hitam, League Gothic raksasa, slam 0,2 s, 1 kata per beat |
| `risograph` | promo, event, musik | 2 tinta (pink `#FF48B0` + biru `#0078BF`) multiply, misregistration 3–6 px, stamp tanpa fade |
| `blueprint` | cara kerja, produk | navy `#0E3A66`, garis tergambar 0,6–1,2 s, exploded view, 1 bagian kuning |
| `midnight-grid` | tech/AI, diagram | `#0B1220` + dot grid, 1 biru `#3D8BFF` untuk node aktif, land 0,5 s |
| `editorial-paper` | data, "apa kata angka" | kertas salmon `#FFF1E5`, Playfair, garis draw 1,2–2 s + angka menghitung |
| `graphite-ui` | demo app, launch software | graphite `#0E0F12`, 1 hijau `#3DD68C`, mask reveal, tanpa bounce |
| `ink-line` | brand sting, logo, santai | satu garis kuas tak putus, on 2s (15 fps), stempel merah sekali di akhir |
| `particle-field` | opener AI/data, musik | titik mengalir (tak pernah pop), 5% titik cyan `#6FD3E8` |

## C. UX: kenapa dashboard v1 terasa ribet → prinsip v2
- **Progressive disclosure:** tampilkan beberapa opsi terpenting dulu, sisanya saat diminta. Ini cara memuaskan pemula
  dan ahli sekaligus. Menunda materi sekunder juga pedoman utama untuk mobile. [U1, U2]
- **Wizard:** selalu izinkan kembali mengedit langkah yang selesai, tapi tidak semua tugas cocok jadi wizard. [U3, U4]
- **Smart defaults + kumpulkan inti dulu, sisanya nanti.** [U2]
- **Target sentuh** minimal 44×44 px (48 lebih nyaman). [U2]

**Keputusan desain v2:**
1. Mulai dari **satu kotak ide** (seperti chat Claude) + **template sekali klik** (Reels promo, Intro YouTube, Explainer,
   Data, Caption untuk editan, Lower third, Logo reveal, Demo app). Template mengisi semua default.
2. **Galeri style** dengan filter "cocok untuk" dan label *Rekomendasi*.
3. **5 pertanyaan cepat** ala claude-video-2, semua ada default.
4. Scene, BPM, lisensi, format kode → **"Pengaturan lanjutan"** (tertutup).
5. Hasil: **satu tombol besar "Salin prompt"** + instruksi langkah berikutnya. Markdown lengkap disembunyikan di "Lihat prompt".
6. Mode baru **"Elemen untuk editan"** (caption, lower third, callout, …) dengan ekspor overlay transparan.

## Sumber
- [C1] [shadcn.io — Anthropic Design System](https://www.shadcn.io/design/anthropic) (tidak bisa dibuka dari sesi ini; dari ringkasan pencarian)
- [C2] [dembrandt.com — Anthropic Design Tokens](https://www.dembrandt.com/explorer/anthropic) · [characterquilt.com](https://www.characterquilt.com/branding/anthropic)
- [C3] [coloracci.ai — Anthropic Brand Colors](https://coloracci.ai/brands/anthropic) · [utilitiestools.com](https://utilitiestools.com/anthropic-color-palette/) · [loftlyy.com](https://www.loftlyy.com/es/anthropic)
- [C4] [lobehub — anthropic-brand-guidelines skill](https://lobehub.com/skills/jst-well-dan-skill-box-anthropic-brand-guidelines) · [skillsdirectory — Brand Guidelines](https://www.skillsdirectory.com/skills/prat011-brand-guidelines)
- [C5] [beginswithai.com — Claude logo colors & fonts](https://beginswithai.com/claude-ai-logo-color-codes-fonts-downloadable-assets/)
- [C6] [Zapier — Claude Artifacts](https://zapier.com/blog/claude-artifacts/) · [MindStudio — generative UI vs artifacts](https://www.mindstudio.ai/blog/claude-on-demand-generative-ui-vs-canvas-artifacts)
- [Y1] [YouTube — Claude Code Motion Graphics Tutorial: Pro Product Videos with Opus 5.5](https://www.youtube.com/watch?v=6dQYT8Eb_C8)
- [Y2] [Louise de Sadeleer — Claude Code + Remotion](https://louisedesadeleer.substack.com/p/how-i-make-custom-motion-graphics) · [Medium — Claude and Remotion](https://medium.com/@tahirbalarabe2/build-ai-motion-graphics-with-claude-and-remotion-0990e6bbf773)
- [Y3] [GitHub — charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)
- [Y4] [GitHub — ItsssssJack/claude-video-2](https://github.com/ItsssssJack/claude-video-2) (MIT, dibaca langsung termasuk `questions.md` dan `styles/*/STYLE.md`)
- [Y5] [MindStudio — Claude Code for video editing](https://www.mindstudio.ai/blog/claude-code-video-editing-motion-graphics) · [Creative Haven — full workflow](https://www.thecreativehaven.com/insights/how-to-create-motion-graphics-amp-animation-with-claude-code-full-workflow) · [awesomeclaude.ai — 17 styles](https://awesomeclaude.ai/claude-motion-graphics) (tidak bisa dibuka) · [Medium — Full Motion Graphics Studio prompt](https://medium.com/coding-nexus/this-prompt-turns-claude-into-a-full-motion-graphics-studio-5526dd9441a9)
- [U1] [NN/g — Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
- [U2] [UXPin — Progressive Disclosure (2026)](https://www.uxpin.com/studio/?p=41489) · [ezud.com](https://ezud.com/progressive-disclosure-showing-complexity/) · [lollypop.design](https://lollypop.design/blog/2025/may/progressive-disclosure/?p=18043)
- [U3] [Visa Design System — Wizard](https://design.visa.com/patterns/wizard/usage/)
- [U4] [UX Planet — How to design a magical form wizard](https://uxplanet.org/how-to-design-a-magical-form-wizard-e0c6458f6318)
