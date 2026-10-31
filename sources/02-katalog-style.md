# 02 — Katalog Style Motion Graphics

> Satu style = satu "preset" untuk generator: ciri visual, aturan gerak, palet, tipografi,
> SFX yang cocok, dan cara membuatnya dengan kode. Versi mesin-terbacanya ada di
> [`../data/styles.json`](../data/styles.json).
>
> Label kepercayaan:
> - **[sumber]** = didukung langsung oleh sumber yang dikutip.
> - **[umum]** = pengetahuan desain umum yang tidak ditemukan sumber spesifiknya dalam riset ini.
>   Perlu dicek lagi kalau mau dijadikan acuan.

---

## 1. Opus Showreel (gaya viral default)
- **Apa:** gaya yang muncul dari prompt viral "showreel 15 detik". Campuran tipografi tebal, shape
  geometris, partikel, UI animasi, transisi cepat, ditutup logo reveal. **[sumber: 01-S7, 01-S9]**
- **Gerak:** cut cepat tiap 1–2 beat, spring dengan overshoot, mask wipe, zoom-through.
- **Palet:** latar gelap (near-black), 1 warna aksen cerah, putih/abu untuk teks.
- **Tipe:** grotesk tebal (Inter/Geist/Helvetica Bold), ukuran besar.
- **SFX:** whoosh di transisi, impact/hit di reveal, riser sebelum klimaks, UI click di elemen kecil.
- **Kode:** Canvas 2D, `seek(t)`, spring closed-form.

## 2. Kinetic Typography
- **Apa:** huruf/kata bergerak: geser, fade, zoom, berubah bentuk. Di 2026 makin responsif ke suara dan
  interaksi. After Effects 26.0 bisa menganimasikan sampai 8 sumbu variable font per layer. **[sumber: K1, K2, K3]**
- **Varian:** *Elastic typography*, yaitu bentuk hurufnya sendiri yang melengkung/meregang (beda dengan
  kinetic yang memindahkan kata utuh). **[sumber: K4]**
- **Gerak:** per-glyph stagger 20–40 ms, scale punch di kata kunci, tracking yang mengencang.
- **SFX:** tick/typewriter per huruf, hit di kata kunci, whoosh di pergantian kalimat.
- **Kode:** layout teks per glyph di canvas; variable font via CSS `font-variation-settings`; GSAP untuk web. **[sumber: K3]**

## 3. Swiss / International Typographic Style
- **Apa:** grid yang dibangun secara matematis, komposisi asimetris, sans-serif, rata kiri, foto & copy objektif. **[sumber: W1, W2]**
- **Gerak:** wipe linear yang mengikuti grid, slide presisi, perubahan state instan, **tanpa** gerak elastis
  atau ornamen. (Ini rekomendasi design system modern, bukan fakta sejarah.) **[sumber: W3]**
  Grid-nya cocok dengan sifat rektilinear CSS (contoh: poster Swiss yang dianimasikan di CodePen oleh Jon Yablonski). **[sumber: W4]**
- **Palet:** putih/krem, hitam, 1 merah primer.
- **Tipe:** Helvetica / Akzidenz-Grotesk / Inter, hierarki ukuran ekstrem.
- **SFX:** klik kering, tick metronom, "paper slide" pelan. Minim reverb. **[umum]**
- **Kode:** grid 12 kolom, animasi `clip-rect`, easing `easeInOutQuart` atau langsung step.

## 4. Glitch / Cyber
- **Apa:** RGB channel split (tepi merah/cyan bergeser), scanline & artefak VHS, pixel-sorting, fragmen
  sinyal rusak, datamosh smear (artefak kompresi gerak). **[sumber: G1, G2]**
- **Aturan:** satu efek glitch utama + satu gerak kamera per scene, supaya tidak berisik. **[sumber: G1]**
- **Gerak:** jitter acak berbasis seed, freeze-frame sesaat, tearing horizontal.
- **Palet:** hitam, cyan #00F0FF, magenta #FF2A6D, putih.
- **Tipe:** monospace / grotesk condensed.
- **SFX:** glitch burst, bitcrush, static noise, digital stutter, sub drop. **[sumber: SFX1]**
- **Kode:** gambar layer 3x dengan offset per channel (`globalCompositeOperation='lighter'`), slice
  horizontal acak dengan `drawImage` ke diri sendiri, noise di pass `post`.

## 5. Liquid / Morph
- **Apa:** gerak yang terasa seperti air; objek/scene berubah bentuk jadi objek lain dengan gerak hampir cair. **[sumber: L1, L2]**
- **Gerak:** blob metaball, morph path, ease-in-out panjang, follow-through.
- **Palet:** gradien jenuh (ungu → oranye), atau pastel.
- **SFX:** swoosh lembut, "bloop"/droplet, pad ambient. **[umum]**
- **Kode:** metaball dengan noise di canvas, atau interpolasi titik path (resample ke N titik lalu lerp).

## 6. Flat 2D / Geometric
- **Apa:** shading minimal, bentuk bersih, warna sederhana, komposisi sangat mudah dibaca. **[sumber: F1]**
- **Gerak:** pop-in dengan overshoot, rotasi shape, garis yang "menggambar diri" (stroke-dashoffset).
- **Palet:** 4–5 warna flat (mis. #FFB703, #FB8500, #219EBC, #023047, #8ECAE6).
- **SFX:** pop, bubble, klik UI pendek (<0,2 detik). **[sumber: SFX2]**
- **Kode:** primitive canvas (rect, arc, path) + spring.

## 7. Isometric
- **Apa:** 2D yang memberi kesan kedalaman 3D, digambar di sudut 30°. Cocok untuk menunjukkan banyak hal
  sekaligus atau sistem dengan banyak bagian terhubung. **[sumber: F1, F2]**
- **Gerak:** blok naik dari lantai, kamera pan diagonal, aliran data antar node.
- **SFX:** mechanical click, "build" thunk, ambient hum. **[umum]**
- **Kode:** proyeksi iso `x' = (x - y)·cos30`, `y' = (x + y)·sin30 - z`; gambar 3 sisi kubus dengan 3 tingkat terang.

## 8. Hand-drawn / Analog Texture
- **Apa:** garis tidak rata, jitter halus, tekstur kertas, grain, coretan. Disebut sebagai reaksi terhadap
  karya "AI yang terlalu mulus". **[sumber: K1, T1]**
- **Gerak:** "boiling line" (garis bergetar tiap 2 frame / animasi on 2s), stroke yang tergambar progresif.
- **Palet:** kertas krem, tinta hitam/biru, 1 highlight.
- **SFX:** goresan pensil, gesekan kertas, tap. **[umum]**
- **Kode:** jitter titik path dengan seed yang berganti tiap 1/12 detik; grain di pass `post`.

## 9. Paper Cut-out / Collage
- **Apa:** artwork flat bertekstur: lapisan kertas, grain, sapuan kuas, bayangan lembut. **[sumber: F3]**
  (Collage sebagai style tersendiri tidak ditemukan sumber spesifiknya.) **[umum]**
- **Gerak:** gerak stop-motion (step 8–12 fps), layer parallax, sedikit rotasi acak.
- **SFX:** kertas sobek, lipat, stop-motion clack. **[umum]**
- **Kode:** shape dengan drop shadow + noise, `floor(t*12)/12` untuk efek stop-motion.

## 10. Retro / Synthwave
- **Apa:** efek grain + palet warna terbatas. **[sumber: F4]** Synthwave (grid neon, matahari bergaris,
  chrome) tidak dibahas sumber mana pun. **[umum]**
- **Gerak:** grid lantai scroll ke kamera, scanline, glow pulse sesuai beat.
- **Palet:** #2B0F54, #AB1F65, #FF4F69, #FFF7F8, #FF8142.
- **SFX:** synth arp, laser zap, tape stop, gated reverb snare. **[umum]**
- **Kode:** proyeksi perspektif garis grid, `shadowBlur` untuk glow.

## 11. Glass / Soft Cinematic Glow
- **Apa:** soft glow, palet sinematik, gradien halus **[sumber: K1]**; glass UI **[sumber: T2]**; orb GLSL
  iridescent mutiara di kanvas abu hangat, tanpa glow di UI chrome **[sumber: 01-S9]**.
- **Gerak:** morph lambat, spring kritis (tanpa overshoot), blur-in.
- **SFX:** shimmer, chime lembut, airy whoosh, pad. **[umum]**
- **Kode:** radial gradient + `filter: blur()`, atau shader fragment untuk orb.

## 12. 3D / Voxel / 3D Type
- **Apa:** 3D type, glass UI, voxel termasuk dalam daftar 7 style trending 2026. **[sumber: T2]**
  Di galeri Opus 5.5: sphere sinkron beat, planet kartun, perjalanan skala data center → atom (Three.js). **[sumber: 01-S9]**
- **Gerak:** orbit kamera, dolly zoom, objek menyala tiap beat.
- **SFX:** sub boom, metallic hit, whoosh doppler. **[umum]**
- **Kode:** Three.js; untuk prototipe tanpa dependensi: proyeksi 3D manual di canvas 2D.

## 13. Data Viz / Infographic
- **Apa:** angka, chart, rail skala, label. (Contoh di galeri: rail skala metrik + label.) **[sumber: 01-S9]**
- **Gerak:** bar tumbuh, counter angka berjalan, garis chart tergambar, highlight satu titik data.
- **SFX:** tick per angka, data blip, "ding" saat mencapai target. **[sumber: SFX1 (kategori DATA SFX)]**
- **Kode:** skala linear, ease-out untuk bar, interpolasi angka dengan `toFixed`.

## 14. Brutalist
- **Apa:** blok warna kasar, tipe sangat besar, border tebal, layout "salah" yang disengaja, kontras ekstrem.
  **[umum: tidak ada sumber yang ditemukan dalam riset ini]**
- **Gerak:** hard cut, tanpa easing (step), shake keras, teks raksasa melintas.
- **Palet:** #FFFF00, #000000, #FFFFFF, #FF0000.
- **SFX:** hit keras, buzzer, noise burst, stomp. **[umum]**
- **Kode:** rect penuh, step function, `shake()` pada impact.

---

## Tren lintas style (2026)
- **Vertical-first & mixed media**: potongan kinetic pendek untuk tiap platform (9:16, 1:1, 16:9). **[sumber: K1]**
- **Reaksi anti "AI polish"**: tekstur analog, jitter, grain makin dicari. **[sumber: K1, T1]**
- **Sumber trend kebanyakan blog komersial**, jadi klaim tren anggap sebagai arah, bukan data terukur.

## Sumber

- [K1] [artofstyleframe.com — Motion Graphics Trends for 2026: What the Sources Show](https://artofstyleframe.com/blog/motion-graphics-trends-2026-sources/)
- [K2] [criticatv.com — Motion Graphics Trends 2026](https://www.criticatv.com/motion-graphics-trends-how-visual-storytelling-is-evolving-in-2026/) · [tangence.com](https://www.tangence.com/blog/top-motion-graphic-trends-in-2026-every-brand-should-know/)
- [K3] [upskillist.com — Kinetic Typography Trends](https://www.upskillist.com/blog/top-7-kinetic-typography-trends-2025/) · [designmonks.co — Typography Trends 2026](https://www.designmonks.co/blog/typography-trends-2026)
- [K4] [andacademy.com — 11 Typography Trends to Follow in 2026](https://www.andacademy.com/resources/blog/graphic-design/typography-trends/)
- [T1] [impressivemagazine.com — 15 Graphic Design Trends in 2026](https://impressivemagazine.com/graphic-design-trends-2026/) · [zeenesia.com](https://zeenesia.com/2025/11/23/how-motion-graphics-are-transforming-digital-marketing-in-2026/)
- [T2] [trydemotion.com — 7 Trending Motion Graphic Styles in 2026](https://trydemotion.com/blog/trending-motion-graphic-styles)
- [W1] [Wikipedia — Swiss Style (design)](https://en.wikipedia.org/wiki/Swiss_Style_(design)) · [LibreTexts — International Typographic Style](https://workforce.libretexts.org/Bookshelves/Arts_Audio_Visual_Technology_and_Communications/Book%3A_Graphic_Design_and_Print_Production_Fundamentals/01%3A_Design_History/1.06%3A_International_Typographic_Style)
- [W2] [MasterClass — Swiss Design](https://www.masterclass.com/articles/swiss-design) · [Ulster blog](https://blogs.ulster.ac.uk/caragreene/2020/12/08/international-typographic-style-the-swiss-style/)
- [W3] [daisyUI trends — Swiss Style](https://trends.daisyui.com/trend/swiss-style/)
- [W4] [Webdesigner Depot — Swiss in CSS: Animating the International Typographic Style](https://www.webdesignerdepot.com/2016/01/swiss-in-css-animating-the-international-typographic-style/) · [FEVR — The Influence of Swiss Design in Motion Graphics](https://wearefevr.com/the-influence-of-swiss-design)
- [G1] [morphic.com — Glitch Art Animation](https://morphic.com/resources/videos/glitch-art-animation-videos) · [carat.im — glitch art](https://carat.im/prompt-gallery/glitch-art) (halaman marketing tool AI; hanya untuk kosakata efek)
- [G2] [analogia.itch.io — GLITCH CAMERA](https://analogia.itch.io/glitchcamera) · [videobolt.net — Glitch Logo Reveal](https://videobolt.net/author/mr.rabbit/glitch-logo-reveal)
- [L1] [linearity.io — 10 motion design trends](https://www.linearity.io/blog/motion-design-trends/)
- [L2] [click2view.com — Motion Graphics Trends](https://click2view.com/insights/motion-graphics)
- [F1] [vidico.com — 9 2D Animation Styles (2026)](https://vidico.com/news/2d-animation-styles/) · [alchemybranding.studio](https://alchemybranding.studio/amazing-2d-animation-styles-with-examples-and-why-they-work)
- [F2] [pixune.com — 29 Types of 2D Animation](https://pixune.com/blog/types-of-2d-animation/) · [studiopigeon.com](https://studiopigeon.com/blog/2d-animation-styles-examples/)
- [F3] [magicmotionstudio.com — 2D Animation Styles](https://magicmotionstudio.com/2d-animation-styles/) · [arigatovideos.com](https://www.arigatovideos.com/blog/2d-animation-styles/)
- [F4] [theanimationguys.com — Animation Art Styles](https://www.theanimationguys.com/animation-art-styles/)
- [SFX1] [selar.com — 1000+ Premium SFX for Motion Designers](https://selar.com/20q5zm6u01) · [aftermagics — AM sfxpack](https://aftermagics.gumroad.com/l/AM-sfxpack)
- [SFX2] [selar.com — CX Content SFX Pack](https://selar.com/h29183m8l2)
- [01-S7], [01-S9] → lihat [01-tren-viral-claude-motion.md](01-tren-viral-claude-motion.md)
