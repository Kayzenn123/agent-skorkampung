# SKORKAMPUNG — Buletin Skor Antar-RT

Hari 22/30 — 2026-10-31. Koran zine fotokopi 2 tinta (pink sorak + oranye lampu lapangan) di atas kertas malam: situs ini satu edisi koran raksasa yang dibaca dengan menggeser horizontal, tanpa navbar. Persona: **Bang Jack**, redaktur buletin RT.

**Live:** https://kayzenn123.github.io/agent-skorkampung/

## Fitur
- **Klasemen live** 8 tim (RT 01–08) — dihitung dari hasil, kolom bisa diklik untuk sort
- **Catat hasil laga** — "karcis hasil": pilih tim + skor + pencetak gol → klasemen, jadwal, dan top skor update otomatis (localStorage `skorkampung.v1`, tahan refresh)
- **Jadwal tanding** 12 laga + **countdown live** ke laga berikutnya + filter semua/mendatang/selesai
- **Top skor** agregat otomatis dari pencetak gol
- **Warta kampung** 5 berita gaya Bang Jack + strip "momen lapangan" drag inertia
- **Deep-link**: `?tim=rt04` (sorot tim) · `?tab=jadwal` (lompat halaman)
- **Ekspor**: unduh JSON / CSV, salin ringkasan WA, salin link edisi
- **Easter egg**: ketik `gol` di mana saja
- Aksesibilitas: skip link, navigasi keyboard (←/→), tombol prev/next, toggle gerak, toggle teks berjalan, jeda marquee, aria-live, reduced-motion → layout vertikal statis, MODE RINGAN otomatis

## Tech
Tanpa dependency JS (vanilla). Gerak: pan horizontal pinned + zoom per panel (scroll-driven), 2 marquee diagonal + skew velocity, split huruf flip 3D, drag inertia manual, curtain wipe. 16 ikon pixel-art digambar tangan (grid 16×16), grain fotokopi via feTurbulence, divider sobekan kertas SVG, pola halftone CSS.

Font (self-host woff2, OFL): Emilys Candy (display), IBM Plex Mono (body), Ballet (aksen).

## Skor
- Lighthouse mobile **95/99/100/100**, desktop **100/99/100/100** (LCP 1.6s, CLS 0, TBT 180ms)
- qa.js exit 0 (chromium, 4 viewport, 0 overflow, 0 console issue, 0 tap target kecil)
- fps CPU throttle 4x: **60.4**

## Cara jalanin
Buka `index.html` langsung, atau: `python3 -m http.server` di folder ini.

## Kredit
Seluruh nama tim, pemain, skor, dan jadwal adalah **data contoh** fiktif untuk demo. Ikon pixel-art buatan sendiri. Font via Fontsource (OFL).
