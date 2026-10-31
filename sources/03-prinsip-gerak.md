# 03 — Prinsip Gerak (Easing, Spring, Timing)

> Dipakai engine generator untuk membuat gerak terasa "profesional". Sebagian besar sumber adalah
> dokumentasi tool / halaman skill, bukan riset akademis. Angka anggap sebagai panduan.

## 12 Prinsip Animasi Disney
Dikodifikasi animator Disney, masih jadi fondasi motion design modern dan berlaku langsung untuk UI
animation dan motion graphics. [P1] Anticipation dan overshoot disebut elemen dasar animasi kartun. [P2]

Yang paling relevan untuk generator:
| Prinsip | Implementasi di kode |
|---|---|
| Anticipation | mundur sedikit (−5–10%) sebelum gerak utama |
| Slow in / slow out | easing, bukan linear |
| Follow-through & overlapping | elemen anak ber-delay 2–4 frame dari induk |
| Squash & stretch | scaleX/scaleY berlawanan saat impact |
| Staging | satu fokus per beat; elemen lain diredupkan |
| Timing | durasi per gerak disesuaikan dengan BPM |
| Exaggeration | overshoot spring di kata/objek kunci |

## Easing
- Linear (kecepatan konstan) terasa mekanis dan tidak natural. [P3]
- **Masuk → ease-out**, **keluar → ease-in**, **gerak di layar → ease-in-out**, **bounce/overshoot → spring/elastic**. [P4]
- Gerak UI: kira-kira **200–500 ms**. [P3]
- "Kalau ragu, kurangi animasinya." [P3]

## Spring vs Easing
- Spring menghasilkan overshoot-lalu-mengendap yang tidak bisa ditiru kurva easing biasa, sehingga transisi terasa lebih hidup. [P5]
- Preset spring Figma: satu preset energi tinggi dengan overshoot & osilasi yang jelas, satu lagi kurva lebih stabil dengan overshoot minimal; mode custom pakai nilai *Bounce*. [P6]
- Lottie punya plugin Spring Curve. [P7]

**Spring closed-form (pure function of t), cocok untuk `seek(t)`:**
```js
// damped harmonic oscillator, start 0 → target 1
function spring(t, { stiffness = 170, damping = 26, mass = 1 } = {}) {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta < 1) { // underdamped → overshoot
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + (zeta * w0 / wd) * Math.sin(wd * t));
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t); // critically damped (overdamped dibulatkan ke sini)
}
```

## Timing terhadap musik (beat grid)
**[umum]** Pola dari pipeline Opus 5.5 (lihat 01): semua dijadwalkan dalam satuan beat, bukan detik.
- `beat = 60 / BPM` detik. 120 BPM → 0,5 detik/beat.
- Cut besar di downbeat (beat 1 tiap bar), aksen kecil di off-beat.
- Riser mulai 1–2 bar sebelum drop; impact tepat di drop.

## Sumber
- [P1] [userinterface-wiki — 12 principles of animation](https://mintlify.com/raphaelsalaja/userinterface-wiki/animation/12-principles-of-animation) · [graduateschool.edu — Animation Principles](https://www.graduateschool.edu/learn/premiere-pro/animation-principles-motion)
- [P2] [JCGT paper (jcgt.org)](https://jcgt.org/published/0011/03/02/paper.pdf)
- [P3] [madegooddesigns.com — Motion Design Principles Explained](https://madegooddesigns.com/motion-design-principles/)
- [P4] [skills.sh — easing curves timing design](https://www.skills.sh/avnehsbhatia/ultraui/easing-curves-timing-design) · [claudemarket.ai — animation principles](https://www.claudemarket.ai/skills/iart-ai/motion-design-skills/animation-principles)
- [P5] [Framer community — Day 3/365 of Framer Animations](https://www.framer.com/community/posts/7LtZDcjP6sPozANsUjkuxA/)
- [P6] [Figma Help — spring presets](https://help.figma.com/hc/en-us/articles/41414048690839)
- [P7] [LottieFiles — Spring Curve](https://docs.lottiefiles.com/en/creator/14_plugins/spring-curve)
- Tambahan: [playbooks.com — follow-through & overlapping](https://playbooks.com/skills/dylantarre/animation-principles/follow-through-overlapping) · [uni-ak.ac.at — Motion Design 01](https://computerstudio.uni-ak.ac.at/tutorials/motion-design-01/)
