# 04 — Sound Design & Sumber SFX (untuk Agent)

## Taksonomi SFX motion graphics
Paket SFX untuk motion design biasanya membundel **whoosh, riser, impact, UI click, glitch**. Paket untuk
konten pendek menambah notification & cartoon effect [SFX1]; paket lain menambah **data, paper, sweep,
keyboard, swoosh, cinematic clicks, hits** [SFX2].

| Kategori | Kapan dipakai | Catatan |
|---|---|---|
| Whoosh / swoosh | transisi, objek melintas | panjang ≈ durasi gerak |
| Riser | build-up sebelum reveal/drop | mulai 1–2 bar sebelumnya **[umum]** |
| Impact / hit | reveal, logo, kata kunci | sering dipasangkan dengan riser |
| UI click / pop | elemen kecil muncul | **< 0,2 detik**, attack lembut, tanpa reverb/distorsi [SFX3] |
| Glitch | style glitch, cut digital | sinkron dengan kedipan opacity [SFX4] |
| Data / tick | counter angka, chart | |
| Paper / pencil | style hand-drawn & cut-out | |
| Sub drop / boom | 3D, klimaks | |

## Aturan sinkronisasi
- **Riser → impact di beat yang sama** adalah pola paling umum; banyak dijual sebagai satu cue paket. [SFX5]
- Contoh prompt: "rising whoosh → powerful impact at 2.2s" untuk logo reveal. [SFX4]
- Glitch: pulsa berkedip yang mengikuti fade opacity teks. [SFX4]
- **[umum]** Simpan semua aksen di satu daftar `HITS = [[waktu, label, kategoriSFX], ...]`; visual dan audio
  sama-sama membaca daftar ini supaya tidak pernah meleset.

## Sumber SFX yang bisa dicari agent

| Sumber | Akses | Catatan |
|---|---|---|
| **Freesound API v2** | `GET https://freesound.org/apiv2/search/text/?query=whoosh&token=API_KEY` | Butuh API key (daftar di freesound.org/apiv2/apply). Hasil punya objek `previews` (`preview-hq-mp3`, `preview-lq-mp3`). Content Search sudah deprecated, pakai text search. [A1, A2] |
| **Openverse** (audio) | `GET https://api.openverse.org/v1/audio/?q=whoosh&license=cc0` | Tanpa kredensial, tapi dibatasi (~20 request/menit, 200/hari untuk anonim). File audio di-host di sumber aslinya. Ada filter `license` & `license_type`, setiap record punya field lisensi & atribusi. [A3, A4] (info dari pihak ketiga; cek dokumentasi resmi) |
| **Sintesis Web Audio** | lokal, tanpa jaringan | Fallback: whoosh = noise + bandpass sweep, impact = sine pitch-drop + noise, click = burst pendek, riser = noise + filter naik. |

**CORS:** dukungan CORS Freesound/Openverse tidak terkonfirmasi. Halaman yang dibuka dari `file://` tidak bisa
memanggil API ini. **Panggil dari server lokal (proxy)**, bukan langsung dari browser. [A5]

**Lisensi:** simpan URL lisensi + nama kreator untuk setiap SFX yang dipakai (CC-BY wajib atribusi).

## Sumber
- [SFX1] [selar.com — CX Content SFX Pack](https://selar.com/h29183m8l2) · [eliashlbn sfxpack](https://eliashlbn.gumroad.com/l/sfxpack)
- [SFX2] [selar.com — 1000+ Premium SFX for Motion Designers](https://selar.com/20q5zm6u01) · [aejuice — Motion Design Sound Effects](https://aejuice.com/es-es/product/motion-design-sound-effects/)
- [SFX3] [uppbeat.io — UI whoosh impact](https://uppbeat.io/sfx/ui-whoosh-impact/187196/89824)
- [SFX4] [elevenlabs.io — sound effects](https://elevenlabs.io/sv/sound-effects/slow-motion) · [artlist — glitch motion riser impact](https://artlist.io/sfx/track/glitch-motion---riser-impact-distorted-gritty-eerie/85599)
- [SFX5] [artlist — Cinematic Routines: Riser to Impact](https://artlist.io/sfx/track/cinematic-routines---riser-to-impact-synth-glitches-/114088) · [sonniss.com — riser](https://sonniss.com/sound-effects-tag/riser/)
- [A1] [Freesound — APIv2 Overview](https://freesound.org/docs/api/overview.html)
- [A2] [jentic.com — Freesound API](https://jentic.com/apis/freesound.org/freesound.md)
- [A3] [jentic.com — Openverse API](https://jentic.com/apis/openverse.org/openverse.md)
- [A4] [GitHub — Losera/soundfetch](https://github.com/Losera/soundfetch) · [apify — Openverse Audio Scraper](https://apify.com/dadhalfdev/openverse-audio-scraper.md)
- [A5] [GitHub — freesound.js issue #10 (CORS)](https://github.com/g-roma/freesound.js/issues/10) · [public-api.org — Freesound](https://public-api.org/ja/api/896/freesound)
