---
generator: motion-generator/v1
slug: contoh-launch-kopi-senja
title: "Launch Kopi Senja"
style: glitch
duration_s: 15
aspect: "16:9"
fps: 60
bpm: 120
language: Indonesia
output: html-canvas
---

# Motion Brief: Launch Kopi Senja

> Brief ini dibuat oleh dashboard Motion Generator. Kerjakan dengan skill `motion-generator`.
> Semua keputusan di bawah adalah keputusan user. Jangan diganti tanpa bertanya.

## 1. Brief

Promo kopi susu gula aren baru, nuansa sore hangat.

## 2. Spesifikasi teknis

| Item | Nilai |
|---|---|
| Durasi | 15 detik |
| Rasio | 16:9 (1920×1080) |
| FPS | 60 |
| Tempo | 120 BPM (1 beat = 0.50 s, 1 bar = 2.00 s) |
| Bahasa teks | Indonesia |
| Format kode | Single-file HTML + Canvas 2D (`window.seek(t)` murni fungsi waktu) |

## 3. Style: Glitch / Cyber

RGB split, scanline, VHS, pixel-sort, datamosh.

- **Palet:** `#000000` `#00F0FF` `#FF2A6D` `#FFFFFF` (urutan: latar, utama, sekunder, aksen…)
- **Tipografi:** Monospace / condensed grotesk
- **Intensitas gerak:** 3/5 (seimbang)
- **Aturan gerak:** jitter seed; freeze-frame; tearing horizontal; 1 efek + 1 gerak kamera per scene
- **Hindari:** glitch terus-menerus tanpa jeda; lebih dari 1 efek glitch utama per scene
- **Engine yang disarankan:** canvas2d
- **Referensi:** `sources/02-katalog-style.md` bagian "Glitch / Cyber", dan `sources/03-prinsip-gerak.md`

## 4. Shot list (sketsa)

| # | Scene | Beat | Waktu (s) | Teks di layar | Visual | Transisi keluar |
|---|---|---|---|---|---|---|
| 1 | Hook | 0–5 | 0.00–2.50 | Launch Kopi Senja | hook: teks besar masuk dengan punch, latar bergerak | wipe |
| 2 | Masalah / ide | 5–10 | 2.50–5.00 | _(AI tulis copy dari brief)_ | kenapa ini penting? elemen pendukung muncul satu per satu (AI tulis copy dari brief) | slide |
| 3 | Poin utama 1 | 10–17 | 5.00–8.50 | _(AI tulis copy dari brief)_ | manfaat/fitur pertama: ilustrasi atau UI dianimasikan (AI tulis copy dari brief) | zoom |
| 4 | Poin utama 2 | 17–24 | 8.50–12.00 | _(AI tulis copy dari brief)_ | manfaat/fitur kedua: morph dari scene sebelumnya (AI tulis copy dari brief) | cut |
| 5 | Reveal + CTA | 24–30 | 12.00–15.00 | Launch Kopi Senja | logo/nama reveal, aksen warna, hold 1 bar | — (akhir) |

## 5. Timeline HITS

Setiap aksen visual **dan** suara dijadwalkan dari daftar ini (satu sumber kebenaran).

| Waktu (s) | Beat | Momen | Kategori SFX | Query pencarian |
|---|---|---|---|---|
| 0.25 | 0.5 | teks muncul: "Launch Kopi Senja" | ui click | `ui click glitch digital` |
| 2.50 | 5 | transisi 1→2 (wipe) | whoosh | `whoosh glitch digital` |
| 5.00 | 10 | transisi 2→3 (slide) | swoosh | `swoosh glitch digital` |
| 8.50 | 17 | transisi 3→4 (zoom) | whoosh | `whoosh glitch digital` |
| 10.00 | 20 | riser menuju scene terakhir | riser | `riser glitch digital` |
| 12.00 | 24 | impact / reveal akhir | impact | `impact glitch digital` |
| 12.25 | 24.5 | teks muncul: "Launch Kopi Senja" | ui click | `ui click glitch digital` |

```js
// salin ke kode film
const HITS = [
  [0.25, "teks muncul: \"Launch Kopi Senja\"", "ui click"],
  [2.50, "transisi 1→2 (wipe)", "whoosh"],
  [5.00, "transisi 2→3 (slide)", "swoosh"],
  [8.50, "transisi 3→4 (zoom)", "whoosh"],
  [10.00, "riser menuju scene terakhir", "riser"],
  [12.00, "impact / reveal akhir", "impact"],
  [12.25, "teks muncul: \"Launch Kopi Senja\"", "ui click"],
];
```

## 6. Rencana suara

- **Musik:** Sintesis (buat musik sendiri dengan kode / Web Audio)
- **Mode SFX:** Cari online dulu; kalau tidak ketemu/lisensi tidak cocok → sintesis
- **Sumber online:** openverse
- **Lisensi yang diizinkan:** cc0, by. Catat judul, kreator, URL, dan lisensi tiap file di `films/contoh-launch-kopi-senja/audio/CREDITS.md`.
- **Kategori SFX yang dipakai:** whoosh, swoosh, hit, impact, riser, ui click, glitch, shimmer
- **Karakter SFX style ini:** glitch burst, bitcrush, static, stutter, sub drop
- **Mix:** musik di bawah SFX; target loudness sekitar −14 LUFS; SFX tidak boleh clipping.

## 7. Deliverables

Semua di `films/contoh-launch-kopi-senja/`:

- [ ] Kode film (Single-file HTML + Canvas 2D (`window.seek(t)` murni fungsi waktu))
- [ ] `audio/` berisi SFX yang dipakai + `CREDITS.md`
- [ ] `storyboard.png`: contact sheet 1 frame per scene (sketsa untuk direview)
- [ ] `out/contoh-launch-kopi-senja.mp4` (16:9, 60 fps, dengan audio)

## 8. Checklist kualitas

- [ ] Setiap frame = fungsi murni dari waktu (`seek(t)` bisa lompat ke frame mana pun).
- [ ] Semua cut & aksen jatuh di waktu pada Timeline HITS (toleransi ±1 frame).
- [ ] Palet hanya dari §3; aturan "Hindari" dipatuhi.
- [ ] Teks terbaca di layar HP (cek di setengah ukuran).
- [ ] Tidak ada SFX tanpa lisensi yang jelas.
- [ ] Storyboard dikirim ke user sebelum render final (kalau diminta).
