# 01 — Tren Viral: Motion Graphics dari Claude Opus 5.5

> Dikumpulkan: 31 Okt 2026. Sebagian besar sumber adalah galeri/blog pihak ketiga (bukan Anthropic),
> jadi angka (jumlah video, view count, tanggal) anggap sebagai klaim sumber, bukan fakta terverifikasi.

## Ringkasan

- **Claude tidak menghasilkan video secara langsung.** Claude menulis *kode* (HTML, CSS, Canvas 2D, SVG,
  Three.js, atau komposisi Remotion/HyperFrames), lalu kode itu di-render jadi MP4 oleh browser atau
  tool render. [S2, S5]
- **Tren dimulai sekitar peluncuran Opus 5.5 (disebut 22 Sep 2026).** Dalam beberapa hari, ratusan video
  diunggah di X. Satu galeri menghitung 83 video, galeri lain 110, ada yang klaim 418. [S2, S3, S7, S8]
- **Satu prompt pendek yang memicu sebagian besar tren:** kira-kira *"buat video motion graphics dinamis
  15 detik yang menunjukkan betapa hebatnya kamu sebagai motion designer, seperti showreel untuk CV."*
  Satu indeks menyebut 87 dari 457 prompt yang dibagikan adalah variasi dari brief ini. Prompt itu tidak
  memberi subjek apa pun, hanya jabatan dan standar kualitas. [S2, S7]
- **Klip paling viral** disebut showreel 15 detik dari @stephanlivera (>2 juta view). Contoh lain: timeline
  AI bergambar, showreel bertema matematika 20 detik, konsep "satu garis pensil yang terus ada di layar". [S7]

## Pipeline teknis yang dipakai (pola umum)

1. **Rencanakan sekuens** (shot list / beat). [S7]
2. **Tulis kode animasi** — film sebagai *fungsi murni dari waktu*: setiap frame = `seek(t)`. Jadi frame mana
   pun bisa di-render ulang secara deterministik. [S1, S6]
3. **Render frame satu per satu** di headless browser (mis. 450 frame untuk 15 detik @30fps). [S1]
4. **Gabung frame jadi MP4** dengan FFmpeg. [S1]
5. **Suara**: musik/SFX kadang juga ditulis oleh model (contoh: showreel dengan HyperFrames + GSAP yang
   musiknya dibuat model sendiri). [S7]

Catatan dari sumber:
- Kalau dibiarkan, Opus 5.5 cenderung memilih rute paling sederhana: satu file HTML + fungsi `seek` +
  Playwright untuk capture frame, walaupun ada framework yang lebih terstruktur seperti Remotion.
  Kalau mau Remotion, harus diminta secara eksplisit. [S2]
- Satu uji coba (Claude Code headless + Opus 5.5) mendapati sebagian besar dari 9 menit prosesnya bukan
  waktu "berpikir" model, melainkan render. Disarankan memasang "Remotion skills" dulu. [S2]
- Kritik yang beredar: kode animasi hasil generate tetap kode. Kalau tidak ada yang bisa membacanya,
  perubahan besar berikutnya berarti generate ulang dari nol. [S0]
- Sumber berbeda pendapat: satu sumber menyebut fitur "Claude Motion" beta terpisah di plan Team/Enterprise
  dengan ekspor MP4 dari chat. Ini beda dari rute Claude Code + Remotion. [S2]

## Gaya visual yang sering muncul di galeri Opus 5.5

Dari koleksi prompt [S9] dan galeri [S3, S7]:

| Contoh | Gaya | Teknik |
|---|---|---|
| Showreel 15 detik (prompt viral) | Tipografi tebal, shape, partikel, transisi cepat | HTML/Canvas, render headless |
| Video branded 30 detik | Tipografi tebal, 3D motion, UI animasi, transisi cepat, logo reveal | — |
| AI orb UI motion | Minimal ala Dribbble: satu shape putih yang morph antar state, orb GLSL iridescent mutiara, font Geist, kanvas abu hangat, tanpa glow di UI | WebGL/GLSL → canvas 2D, spring physics, Playwright + ffmpeg |
| Video bertema Spotify | Panggung near-black, gradien hijau, tipe putih/abu, aksen hijau, album art pearlescent | 16:9 @60fps + musik + SFX |
| 3D sphere drop sinkron beat | Scene berganti mengikuti musik, objek menyala tiap beat | Three.js |
| Data center → atom | Kamera terbang dari skala besar ke atom, rail skala metrik + label | 3D di browser, single file |
| Octo Jelly / Jelly Press | Soft-body translucent "permen jeli", studio off-white, UI editorial | WebGPU/WGSL, XPBD, Web Audio prosedural |
| Floating mine mini-world | Pulau isometrik melayang, loop mulus, suara sinkron aksi | Blender + Python |

**Pelajaran untuk Motion Generator kita:**
- Pola "**film = fungsi dari t**" + daftar **HITS** (momen aksen) adalah inti: visual dan suara sama-sama
  dijadwalkan dari timeline yang sama, jadi SFX tidak bisa meleset dari gambar.
- Gaya yang viral = **tipografi kinetik + geometri + partikel + transisi cepat**, palet terbatas, satu aksen warna.
- Single-file HTML + Canvas sudah cukup untuk prototipe lokal (tidak wajib Remotion).

## Sumber

- [S0] dsebastien.net — [Claude Opus 5.5: Ask for a video, get a program you can edit](https://www.dsebastien.net/2026-10-04-claude-opus-5-5-ask-for-a-video-get-a-program-you-can-edit/)
- [S1] Ringkasan beberapa artikel tentang pipeline (design system page → kode → 450 frame → FFmpeg), lihat S0 dan [nocode.mba](https://www.nocode.mba/articles/claude-opus-5-5-motion-graphics)
- [S2] [Opus 5.5 generates motion design videos by writing a program that draws every frame](https://pasqualepillitteri.it/en/news/19007/opus-5-5-motion-design-video-en) (judul dari hasil pencarian; halaman tidak bisa diakses dari sesi ini) · [wireflow.ai — One Prompt, a 12-Second Clip and What It Cost](https://www.wireflow.ai/blog/claude-motion-graphics) · [skillry.dev](https://skillry.dev/ai-videos/opus-5-5)
- [S3] [fliki.ai — Claude Motion Graphics: 83 AI Motion Videos + Prompts](https://fliki.ai/features/claude-motion-graphics)
- [S4] [Digg — Claude Opus 5.5 reportedly creates a motion graphics video entirely with code](https://digg.com/ai/nnqpmb0w)
- [S5] [claudevideo.org](https://claudevideo.org/) · [nanobananavideo.com guide](https://nanobananavideo.com/blog/claude-opus-ai-video-generator-2026)
- [S6] [learnwithmeai.com — I Built a Claude Skill That Makes the Viral Opus 5.5 Motion Graphics](https://www.learnwithmeai.com/p/claude-code-motion-skill) (judul dari hasil pencarian; halaman tidak bisa diakses dari sesi ini)
- [S7] [motion-graphics.org — Viral Videos & Their Prompts](https://motion-graphics.org/) · [revid.ai — 64 Videos + Prompts](https://www.revid.ai/claude-motion-graphics) · [promptmotion.art](https://promptmotion.art/video/opus-5-5) · [aiidelist.com](https://aiidelist.com/blog/opus-5-5-motion-design) · [iart.ai — 5 Opus 5.5 Prompts](https://www.iart.ai/blog/claude-motion-graphics) · [ayautomate.com](https://www.ayautomate.com/resources/claude-opus-5-5-motion-graphics)
- [S8] Wiki komunitas: [awesome-opus-5.5-video](https://github.com/zhuyansen/awesome-opus-5.5-video/wiki) · [awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos/wiki) · [awesome-claude-video](https://github.com/opusvideo/awesome-claude-video/wiki) · [awesome-opus-5-5-video-prompts](https://leaddeopenlab.github.io/awesome-opus-5-5-video-prompts/)
- [S9] [GitHub — TripoGrowthLab/awesome-opus-5-5-prompts](https://github.com/TripoGrowthLab/awesome-opus-5-5-prompts) (dibaca langsung)
