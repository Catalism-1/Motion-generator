# 05 — Motion Graphics untuk Editan Video (elemen & format)

> Katalog di [02](02-katalog-style.md) = **gaya visual** (Glitch, Swiss, Liquid, dll).
> Katalog ini = **jenis elemen/penerapan** yang ditempel ke editan video (Reels, TikTok, YouTube).
> Satu elemen bisa dibuat dengan gaya apa pun. Contoh: *lower third* gaya Swiss, *caption* gaya Brutalist.
>
> Label: **[sumber]** didukung sumber yang dikutip · **[umum]** pengetahuan editing umum, belum ada sumber dari riset ini.

## Contoh produk serupa: Motion Format
[motionformat.com](https://motionformat.com/) ("Ngobrol jadi motion") menjual **Full AI Motion Course**: kelas online
bikin motion graphics lewat chat dengan Claude Code (brief → sound → animasi → render MP4), untuk format 9:16
(Reels/Shorts/TikTok) dan 16:9 (explainer YouTube). Isinya skill siap install, video materi berurutan, dan
"prompt helper tool". Bayar sekali Rp 249rb, akses selamanya, ramah pemula. **[sumber: ringkasan hasil pencarian;
halaman kursusnya tidak bisa dibuka dari sesi ini]**

→ Strukturnya sama dengan proyek ini: **skill** (`.claude/skills/motion-generator`) + **prompt helper** (dashboard).
Pembedanya bisa ada di katalog elemen untuk editan (dokumen ini) dan ekspor overlay transparan.

---

## A. Teks & caption

| Elemen | Fungsi di editan | Gaya cocok | SFX |
|---|---|---|---|
| **Caption animasi kata-per-kata** | subtitle yang menyorot kata yang sedang diucapkan. Disebut salah satu caption paling efektif untuk retensi. **[sumber: E1, E2]** | Kinetic, Brutalist, Opus Showreel | tick halus / tanpa SFX |
| **Keyword highlight** | kata kunci diberi warna/kotak/ukuran besar **[sumber: E1, E3]** | Kinetic, Flat | pop |
| **Emoji pop** | emoji muncul di momen emosional **[sumber: E1]** | Flat, Opus Showreel | pop / bubble |
| **Judul kinetik / hook text** | teks besar di 0–3 detik pertama sebagai hook **[sumber: E2]** | Kinetic, Glitch, Brutalist | whoosh + hit |
| **Text behind subject** | teks di belakang orang/objek (butuh masking subjek) **[umum]** | Swiss, Kinetic | whoosh |
| **Quote card** | kutipan di kartu, untuk konten motivasi/podcast **[umum]** | Glass, Paper Cut-out | shimmer |

Aturan: jauhkan grafis dari area caption, dan sisakan zona caption di bawah sebelum menaruh grafis lain. **[sumber: E5]**

## B. Overlay informasi (penjelas)

| Elemen | Fungsi | Gaya cocok | SFX |
|---|---|---|---|
| **Lower third** | nama/jabatan/lokasi di bagian bawah layar; bisa statis atau animasi (posisi, opacity, scale, mask). Biasanya dibuat jadi template yang tinggal ganti teks/warna. **[sumber: E4, E5, E6]** | Swiss, Glass | swoosh pelan |
| **Callout / pointer** | panah + label ke bagian gambar. Beda dengan lower third; pakai hanya saat pembicara menyebut hal itu. **[sumber: E5]** | Flat, Hand-drawn | ui click |
| **Lingkaran / coretan highlight** | lingkari atau garis bawahi sesuatu di footage **[umum]** | Hand-drawn | pencil scratch |
| **Infographic overlay** | chart batang/lingkaran, papan skor **[sumber: E6]** | Data Viz | data blip, tick |
| **Counter angka** | angka berjalan 0 → 1.000.000 **[umum]** | Data Viz, Kinetic | tick cepat + ding |
| **Progress bar / chapter marker** | posisi di video, pindah bab. Untuk explainer: infografis bersih, bullet animasi, transisi halus antar bab. **[sumber: E3]** | Swiss, Flat | click |
| **Animasi peta / rute** | garis rute dari kota A ke B, zoom ke lokasi **[umum]** | Flat, Isometric, 3D | whoosh panjang |
| **Timeline / sejarah** | titik waktu bermunculan **[umum]** | Swiss, Paper Cut-out | tick |
| **Listicle number** | "#5 … #1" untuk video top-N **[sumber: F1 (format list)]** | Brutalist, Kinetic | hit |
| **Border / highlight / ikon yang bergerak halus** | menghidupkan frame statis **[sumber: E3]** | Glass, Liquid | — |

## C. Transisi & ritme

| Elemen | Fungsi | SFX |
|---|---|---|
| **Zoom punch-in** | zoom cepat di momen penting; pakai konsisten di jenis penekanan yang sama **[sumber: E2, E3]** | hit / bass |
| **Pattern interrupt** | sesuatu yang baru tiap ±1–3 detik: cut cepat, zoom, B-roll padat **[sumber: E3]** | whoosh bervariasi |
| **Whip pan / whoosh transition** | pindah scene dengan blur gerak **[umum]** | whoosh |
| **Shape / mask wipe** | bentuk menutup layar lalu membuka scene baru **[umum]** | swoosh |
| **Glitch transition** | cut digital sesaat **[umum]** | glitch burst |
| **Match cut / morph** | bentuk di scene A berubah jadi bentuk di scene B **[sumber: P1]** | swoosh |

## D. Produk & brand

| Elemen | Fungsi | Gaya cocok |
|---|---|---|
| **App UI walkthrough** | rekaman layar asli + overlay: gerak kursor, callout zoom, label fitur **[sumber: P1, P2]** | Glass, Flat, Swiss |
| **Floating UI cards / dashboard melayang** | hero landing page, loop **[sumber: P1, P3]** | Glass, 3D |
| **3D product reveal** | produk diputar dari semua sudut tanpa foto ulang **[sumber: P1]** | 3D |
| **Logo reveal / end card** | penutup dengan logo + CTA **[sumber: P3 (black logo card)]** | semua |
| **Pricing / price tag** | harga muncul, diskon dicoret **[sumber: P4 (kategori pricing animation)]** | Flat, Brutalist |
| **Before / after slider** | perbandingan geser **[umum]** | Swiss, Flat |
| **Testimonial card** | ulasan + bintang **[umum]** | Glass, Paper Cut-out |
| **Feature list / checklist** | centang muncul satu per satu **[umum]** | Flat, Swiss |

## E. Format video utuh (faceless)

| Format | Isi | Catatan |
|---|---|---|
| **Explainer** | narasi + teks di layar + diagram **[sumber: F1]** | paling cocok untuk motion graphics penuh |
| **Listicle (top N)** | daftar bernomor **[sumber: F1]** | listicle number + transisi |
| **Dokumenter** | narasi di atas footage (sejarah, true crime, sains) **[sumber: F1]** | map, timeline, lower third |
| **Screen recording / tutorial** | rekaman layar + callout **[sumber: F2]** | UI walkthrough |
| **Text-on-screen story** | cerita lewat teks saja **[sumber: F2]** | caption kinetik |

⚠️ Satu sumber vendor mengklaim YouTube (2026) men-demonetisasi konten "stock footage + suara robot" tanpa lapisan
editorial. Klaim ini belum diverifikasi; cek halaman kebijakan resmi YouTube. **[sumber: F3]**
Motion graphics buatan sendiri adalah "lapisan editorial" itu.

---

## Cara pakai di editan (teknis)

| Mode ekspor | Kapan | Cara |
|---|---|---|
| **Full frame** | video utuh, intro, explainer | MP4 H.264 seperti biasa |
| **Overlay transparan** | lower third, caption, callout, emoji, counter | latar transparan → **WebM VP9 alpha** atau **MOV ProRes 4444**. Premiere, DaVinci, dan After Effects mendukung ProRes 4444. **[umum]** |
| **Green screen** | editor yang tidak bisa membaca video alpha (cek dukungan di CapCut versi kamu) | latar #00FF00 polos → chroma key di editor **[umum]** |

Karena film kita = fungsi murni dari `t`, elemen overlay cukup **tidak menggambar latar** (`clearRect`), lalu
render PNG ber-alpha → ffmpeg (`-c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le` atau `-c:v libvpx-vp9 -pix_fmt yuva420p`).

## Sumber
- [E1] [OpusClip — 11 Editing Aesthetics Dominating Short-Form in 2026](https://www.opus.pro/blog/editing-aesthetics-dominating-short-form-2026) · [OpusClip — Short-Form Video Trends 2026](https://www.opus.pro/blog/short-form-video-trends-reshaping-creator-marketing-2026)
- [E2] [clipcreator.ai — 10 Video Editing Effects for Viral Shorts in 2026](https://clipcreator.ai/blog/video-editing-effects) · [viral.new — Short Form Video Trends](https://viral.new/blog/short-form-video-trends) · [shortgenius.com](https://shortgenius.com/blog/short-form-video-trends)
- [E3] [olafmotion.com — Best YouTube Editing Styles 2026](https://olafmotion.com/trends-inspiration/best-youtube-editing-styles-2026/) · [veedyou.com — Video Editing Trends](https://www.veedyou.com/video-editing-trends/) · [monkyvision.com](https://monkyvision.com/blog/video-editing-trends/) · [shortvids.co](https://shortvids.co/short-form-video-trends/)
- [E4] [Adobe — Lower third animations (After Effects)](https://helpx.adobe.com/vn_vi/after-effects/how-to/lower-third-animations.html) · [creatoressentials — Lower Third](https://www.creatoressentials.com/glossary/lower-third/)
- [E5] [hera.video — overlay motion graphics](https://hera.video/use-cases/overlay-motion-graphics) · [hera.video — overlay pack](https://hera.video/templates/overlay-motion-graphics-pack) · [Motion Array — lower thirds](https://motionarray.com/motion-graphics-templates/lower-thirds/)
- [E6] [Adobe Express page (kategori grafis)](https://express.adobe.com/page/0b3zKoTs1yMJs) · [Storyblocks — lower thirds](https://www.storyblocks.com/video/after-effects-templates/lower-thirds)
- [P1] [kwiboo.com — Motion, 3D & Video](https://kwiboo.com/services/motion-3d-video) · [hera.video — UI animation video for software marketing](https://hera.video/blog/ui-animation-video-for-software-marketing)
- [P2] [advids.co — walkthrough video examples](https://advids.co/blog/30-user-centric-motion-graphics-walkthrough-video-examples-for-improved-user-experience) · [Evil Martians — highlight features for launch weeks](https://evilmartians.com/chronicles/three-smart-ways-to-highlight-features-for-landing-pages-or-launch-weeks)
- [P3] [topview.ai — Motion Studio](https://www.topview.ai/motion-studio)
- [P4] [Dribbble — SaaS Explainer & 2D Product Demo](https://dribbble.com/services/260701-SaaS-Explainer-2D-Product-Demo-Videos)
- [F1] [murf.ai — faceless YouTube channel](https://murf.ai/blog/how-to-start-a-faceless-youtube-channel) · [stackinfluence.com](https://stackinfluence.com/blog/faceless-youtube-channel-ideas) · [atlabs.ai](https://www.atlabs.ai/blog/how-to-build-a-faceless-youtube-channel-with-ai-in-2026)
- [F2] [vidrush.ai — beginner guide](https://vidrush.ai/blog/how-to-start-a-faceless-youtube-channel-beginner-guide) · [flowshorts.app](https://www.flowshorts.app/blog/faceless-videos-guide)
- [F3] [outlierkit.com — faceless YouTube growth strategy](https://outlierkit.com/resources/faceless-youtube-growth-strategy/) · [bytecap.io](https://www.bytecap.io/blog/faceless-youtube-channel-that-makes-money-2026)
- [Motion Format](https://motionformat.com/) · pembanding: [Motion Design School — AI Motion](https://motiondesign.school/courses/ai-motion/) · [School of Motion — AI Foundations for Motion](https://schoolofmotion.com/courses/ai-foundations-for-motion)
