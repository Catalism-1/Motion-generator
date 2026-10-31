---
name: motion-generator
description: Kerjakan Motion Brief (file markdown dari dashboard Motion Generator, biasanya di prompts/*.md, frontmatter `generator: motion-generator/v1`) menjadi video motion graphics berbasis kode, dengan SFX yang dicari agent, storyboard, dan MP4. Pakai ketika user bilang "buat video dari prompts/...", menempelkan brief yang diawali frontmatter itu, atau bertanya cara memakai dashboard Motion Generator.
---

# Motion Generator: cara memakai Motion Brief

Skill ini **tidak** mendesain apa pun sendiri. Semua keputusan kreatif sudah ditulis user lewat dashboard
(`dashboard/index.html`) ke dalam satu file markdown. Tugasmu: **baca brief → patuhi → kerjakan → laporkan.**

## 0. Kalau user belum punya brief
Arahkan user:
1. Buka `dashboard/index.html` di browser (cukup double-click, tidak perlu server).
2. Isi 5 langkah (Proyek, Style, Scene, Suara, Output), lalu klik **Download .md**.
3. Simpan ke `prompts/<slug>.md`, lalu bilang: `buat video dari prompts/<slug>.md`.

Jangan menebak brief dari chat kalau user sebenarnya ingin pakai dashboard.

## 1. Baca brief
- Frontmatter: `slug`, `style`, `duration_s`, `aspect`, `fps`, `bpm`, `output`.
- Bagian brief (nomor di brief): §3 Style (palet, tipe, aturan gerak, **Hindari**), §4 Shot list, §5 Timeline HITS (+ blok `const HITS`),
  §6 Rencana suara, §7 Deliverables, §8 Checklist.
- Baca juga referensi yang disebut brief: `sources/02-katalog-style.md` (bagian style itu) dan `sources/03-prinsip-gerak.md`.
- Ada peringatan ⚠️ total scene ≠ durasi? Skalakan panjang scene secara proporsional, cut tetap di beat.
- Teks bertanda _(AI tulis copy dari brief)_: tulis copy pendek (≤ 6 kata per layar) dari §1, dalam bahasa di frontmatter.
- **Jangan ganti** style, palet, durasi, rasio, atau urutan scene. Kalau ada yang mustahil, tanya dulu.

## 2. Struktur kerja
```
films/<slug>/
  index.html      kanvas + window.seek(t)       (output: html-canvas / threejs)
  film.js         semua scene; HITS dari §5
  audio/          sfx_*.mp3|wav, music.wav, CREDITS.md
  storyboard.png  1 frame per scene (kalau diminta)
out/<slug>.mp4
```
Untuk `output: remotion`, buat proyek Remotion di `films/<slug>/` dan ikuti struktur Remotion. Aturan lainnya tetap sama.

## 3. Aturan kode film
- **Frame = fungsi murni dari waktu.** `window.seek(t)` menggambar frame di detik `t` tanpa state dari frame sebelumnya.
  Tanpa `Math.random()` polos: pakai random ber-seed (`rnd(seed)`). Tanpa `requestAnimationFrame` sebagai sumber waktu saat render.
- Ekspos `window.DURATION`, `window.FPS`, `window.WIDTH`, `window.HEIGHT`, `window.HITS`, dan `window.ready` (Promise font/asset siap).
- Waktu dalam beat: `beat = 60 / bpm`. Ambil `HITS` apa adanya dari brief; aksen visual (flash, punch, shake) dipicu dari HITS yang sama.
- Gerak: spring closed-form + easing dari `sources/03-prinsip-gerak.md`. Patuhi "Aturan gerak" & "Hindari" di §3.
- Ada mode preview: tanpa `?render`, halaman memutar film sendiri dengan audio supaya user bisa langsung buka di browser.

## 4. SFX: agent mencari sendiri
Ikuti §6. Untuk tiap kategori unik di §5, pakai kolom "Query pencarian".

**Openverse** (tanpa key, ±20 req/menit, 200/hari):
```bash
curl -s "https://api.openverse.org/v1/audio/?q=whoosh%20glitch&license=cc0,by&page_size=5"
```
Ambil `results[].url`, `title`, `creator`, `license`, `license_url`, `foreign_landing_url`. Pilih durasi pendek
(UI click < 0,2 s; whoosh ≈ panjang transisi).

**Freesound** (hanya jika `FREESOUND_API_KEY` ada di env; jangan pernah minta key di chat):
```bash
curl -s "https://freesound.org/apiv2/search/text/?query=whoosh&fields=id,name,username,license,previews,duration&token=$FREESOUND_API_KEY"
```
Pakai `previews["preview-hq-mp3"]`.

Aturan:
- Hanya lisensi yang diizinkan di §6. Tulis setiap file ke `audio/CREDITS.md` (judul, kreator, URL, lisensi).
- Mode `synth`, atau pencarian gagal/diblokir jaringan: **sintesis** dengan Web Audio / DSP
  (whoosh = noise + bandpass sweep; impact = sine pitch-drop + noise burst; click = burst 5–20 ms;
  riser = noise + filter naik + pitch naik; glitch = potongan bitcrush/stutter; shimmer = sine tinggi + vibrato).
  Catat di CREDITS.md: "disintesis".
- Selalu panggil API dari terminal/server, bukan dari halaman `file://` (CORS tidak terjamin).

## 5. Storyboard dulu (kalau §7 memintanya)
Render 1 frame di tengah tiap scene → gabung jadi `storyboard.png` (grid, label nomor + nama scene + waktu).
Tunjukkan ke user dan **tunggu OK** sebelum render final. Revisi di sini jauh lebih murah.

## 6. Render
1. Playwright (sudah terpasang di environment ini; jangan install ulang) buka `index.html?render`, `await window.ready`,
   loop `i = 0..DURATION*FPS-1` → `seek(i/FPS)` → screenshot kanvas → pipe ke `ffmpeg -f image2pipe`.
2. Mix audio: tempatkan SFX di waktu HITS (`adelay`), musik di bawahnya, target ≈ −14 LUFS (`loudnorm`), tanpa clipping.
3. Mux → `out/<slug>.mp4` (H.264, yuv420p, fps sesuai brief).
4. Cek dengan `ffprobe`: durasi, fps, ada audio.
Kalau ffmpeg tidak ada, bilang ke user dan serahkan `index.html` + audio saja.

## 7. Laporan akhir
Jalankan checklist §8 satu per satu dan laporkan jujur (yang gagal disebut gagal). Sebutkan path file hasil,
SFX yang dipakai beserta lisensinya, dan apa yang perlu user cek.
