# Rencana Implementasi: Birthday Adventure — Awll Level Up 🎂🎮

Rencana aksi ini dibuat berdasarkan **Product Requirements Document (PRD)** yang berfokus pada pembangunan web interaktif ulang tahun yang personal, menyenangkan, *memorable*, dan dirancang khusus untuk **Awll** (mahasiswi Teknik Sipil, pekerja keras, anak kos). 

Situs ini akan dikembangkan sebagai aplikasi web modern menggunakan **Next.js 15 (App Router)**, **TypeScript**, **TailwindCSS**, **Zustand**, dan **Motion** (Framer Motion) untuk menjamin animasi pixel art yang sangat halus, *playful*, dan bersahabat di perangkat *mobile first*.

---

## 🎨 Panduan Desain & Estetika (Design System)

### 1. Palet Warna (Tailwind Custom Config)
* **Background Utama:**
  * Landing / Ending: `Dark Blue Night Sky` (`#0B132B` to `#1C2541`) & `Construction Site Dusk` (`#2c3e50` ke `#e74c3c`).
  * RPG UI / retro OS window: Beige/Cream Retro (`#F4EAD4` / `#EAD9B8`) dengan border hitam tebal khas pixel art (`border-4 border-black`).
* **Aksen & State:**
  * **Navy:** `#1D3557` (Primary UI)
  * **Purple:** `#7209B7` (Mystic / Level Up)
  * **Sky Blue:** `#4EA8DE` (Warm Accent)
  * **Gold:** `#FFD700` (Level & Stars)
  * **Pink:** `#F72585` (Cozy / Love)
  * **Green:** `#4AD66D` (Success / HP)

### 2. Tipografi (Typography)
* **Heading (Pixel-Art):** `'Press Start 2P'` (Google Font)
* **Body & Text:** `'Nunito'` (Google Font - memberikan kesan bulat, *cute*, dan bersahabat)
* **Fallback:** `Inter`, `sans-serif`

---

## 🛠️ Arsitektur Teknologi & Struktur Proyek

Aplikasi akan menggunakan struktur Next.js 15 modern dengan App Router.

### Struktur Direktori:
```text
apologize-for-awll/
├── public/
│   ├── assets/
│   │   ├── bg-landing.png     # City dusk & crane (AI Generated)
│   │   ├── profile-awll.png   # Avatar Awll + helm proyek
│   │   ├── mascot-dino.png    # Dino helper
│   │   ├── mascot-cat.png     # Cat helper
│   │   └── bg-ending.png      # Starry night celebration
│   └── audio/
│       ├── click.wav          # Klik tombol retro
│       ├── levelup.wav        # Efek suara level up
│       ├── unlock.wav         # Efek suara unlock achievement
│       └── success.wav        # Efek sukses mini game
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout, Google Fonts, Audio Context Provider
│   │   ├── page.tsx           # Entrypoint / Single Page State Router
│   │   └── globals.css        # CSS Reset, Tailwind, & Custom retro utility
│   ├── components/            # Komponen modular per Section
│   │   ├── LandingPage.tsx    # Section 1
│   │   ├── CharacterCard.tsx  # Section 2
│   │   ├── Achievements.tsx   # Section 3
│   │   ├── MiniGame.tsx       # Section 4
│   │   ├── SystemMessage.tsx  # Section 5
│   │   ├── EndingPage.tsx     # Section 6
│   │   ├── AudioController.tsx# Tombol Mute & Background Sound
│   │   └── ui/                # Reusable retro/pixel components
│   │       ├── RetroWindow.tsx
│   │       ├── PixelButton.tsx
│   │       └── ProgressBar.tsx
│   ├── store/
│   │   └── useGameStore.ts    # Zustand Store untuk State Game, XP, Buff, Audio
│   └── hooks/
│       └── useAudio.ts        # Custom hook untuk kontrol audio & sound effects
├── tailwind.config.ts         # Penambahan konfigurasi warna & font retro
├── package.json
└── tsconfig.json
```

---

## 💾 Zustand State Store (`useGameStore.ts`)
Melacak petualangan Awll secara terpusat:
```typescript
interface GameState {
  currentSection: number;
  xpPoints: number;
  unlockedAchievements: string[];
  activeBuffs: string[];
  placedBlessings: string[];
  isMuted: boolean;
  gameCompleted: boolean;
  nextSection: () => void;
  prevSection: () => void;
  addXP: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  activateBuff: (buff: string) => void;
  placeBlessing: (id: string) => void;
  toggleMute: () => void;
  resetGame: () => void;
}
```

---

## 📋 Rencana Tahapan Implementasi (Milestones)

### Phase 1: Inisialisasi Proyek & Konfigurasi Dasar 🛠️
* [x] **Inisialisasi Next.js 15:** Menggunakan `npx create-next-app@latest` dengan TypeScript, TailwindCSS, App Router, dan ESLint.
* [x] **Instalasi Dependensi:**
  ```bash
  npm install zustand framer-motion lucide-react react-confetti react-type-animation use-sound @tsparticles/react @tsparticles/slim
  ```
* [x] **Konfigurasi Font & Warna:** Daftarkan `'Press Start 2P'` dan `'Nunito'` di `globals.css` / Tailwind Config. Tambahkan utility class untuk efek pixel border (3D rigid border style).
* [x] **Layout Setup:** Buat `layout.tsx` yang membungkus aplikasi dengan Audio Controller global dan layout responsif *mobile first*.

### Phase 2: Pembuatan Visual Aset & Audio Integrasi 🎨🎵
* [x] **Aset Background & Maskot (AI-Generated Pixel Art):**
  * `bg-landing.png`: Kota malam pixel art, ada derek proyek (crane), helm proyek, cangkir kopi, dan kucing berkedip.
  * `profile-awll.png`: Avatar pixel lucu Awll memakai helm proyek putih.
  * `mascot-dino.png`: Dino hijau pixel dengan helm kuning.
  * `mascot-cat.png`: Kucing oranye pixel dengan helm abu-abu & rompi keselamatan.
  * `bg-ending.png`: Langit malam dengan bintang-bintang bersinar.
* [x] **Sound Effects Setup:** Menyiapkan aset `.wav` dengan ukuran kecil di folder `public/audio/`.
* [x] **Audio Controller:** Buat komponen `AudioController` melayang (floating) di pojok atas untuk mute/unmute suara (karena kebijakan autoplay browser).

### Phase 3: Section 1 — Landing Page 🏗️
* [x] **Struktur:** Background kota malam senja pixel-art.
* [x] **Konten:**
  * Header `"SELAMAT!"` berdenyut (pulse animation).
  * Subtitle `"Kamu berhasil naik level 🎉"`.
  * Kartu Level: `"Awll has reached LEVEL 20"` (berdesain RPG UI box gelap dengan bayangan tegas).
  * Teks tambahan dengan ikon hati biru.
* [x] **Tombol Interaksi:** `START ADVENTURE` menggunakan *Motion* (`whileHover={{ scale: 1.05 }}` & `whileTap={{ scale: 0.95 }}`). Mengeluarkan suara `click.wav` dan transisi ke Section 2 dengan suara `levelup.wav`.
* [x] **Efek:** Partikel mengambang (*floating stars* / *sparkles*) menggunakan CSS animations/framer-motion.

### Phase 4: Section 2 — Character Profile 🪟
* [x] **Struktur:** Retro OS Window `RetroWindow` dengan title bar: `PROFILE: AWLL`.
* [x] **Konten Kiri:** Foto profil `profile-awll.png` dengan animasi idle mengambang lambat (bobbing effect).
* [x] **Konten Kanan:** 
  * Teks data diri (Nama, Class, Jurusan).
  * **Interactive Stats (Progress Bars):** HP (999/999), Stress (70/100), Tidur (2/100), Kopi (8/100).
* [x] **Animasi:** Saat layar aktif, bilah status (HP, Stress, dll.) terisi perlahan dari nol dengan animasi *Motion* (`animate={{ width: "X%" }}`).
* [x] **Status Lucu:** Kotak pesan di bawah dengan maskot kucing proyek.
* [x] **Navigasi:** Tombol `LANJUTIN YUK! ▶` dengan transisi mulus.

### Phase 5: Section 3 — Achievement Unlocked 🏆
* [x] **Struktur:** Grid responsif berisi 6 kartu pencapaian anak sipil & kosan.
* [x] **Kartu Pencapaian:**
  1. *Survived Tugas Struktur*
  2. *Survived Perhitungan Manual*
  3. *Survived Revisi Gambar*
  4. *Survived Praktikum Beton*
  5. *Survived Kerja Kelompok*
  6. *Survived Begadang*
* [x] **Animasi & Interaktivitas:**
  * Kartu muncul secara bertahap menggunakan stagger-children animation dari Framer Motion.
  * Ketika masuk halaman, setiap pencapaian memicu suara `unlock.wav` secara beruntun.
  * Efek klik kartu: Pemicu partikel XP (+500 XP) melayang ke atas.
* [x] **Footer:** Balon dialog dari Dinosaurus Helm Kuning yang ramah.

### Phase 6: Section 4 — Mini Game (Build the Blessing) 🧩
* [x] **Struktur:** Area drop dengan ilustrasi perancah konstruksi (scaffolding).
* [x] **Kartu Berkat:** 4 kartu bertema *Kesehatan*, *Keberuntungan*, *Ilmu Bermanfaat*, dan *Rezeki Lancar*.
* [x] **Mekanika (Drag & Drop / Click to Build):**
  * Menggunakan Framer Motion (`drag`, `dragConstraints`) atau sistem klik ramah ponsel.
  * Ketika komponen ditarik/diklik ke area proyek, crane akan bergerak turun meletakkan balok struktur.
  * Setiap balok yang terpasang mengeluarkan suara `success.wav` dan memicu getaran layar (*screen shake* ringan).
* [x] **Hasil Akhir:** Struktur selesai dibangun, maskot kucing oranye memberi pesan bijak, dan tombol lanjut bersinar keemasan muncul.

### Phase 7: Section 5 — System Message (RPG Dialogue Box) 💬
* [x] **Struktur:** RPG Dialogue Box klasik transparan gelap di atas background cozy kosan senja.
* [x] **Logika Typewriter:**
  * Menggunakan `react-type-animation` untuk memunculkan pesan satu per satu secara berurutan dengan kecepatan ketik alami.
  * Baris terakhir: `// Always proud of you, Awll!` berwarna hijau neon khas *syntax code highlight*.
* [x] **Easter Eggs Trigger (Random Birthday Buff):**
  * Setelah teks selesai diketik, popup kejutan bertuliskan *"BUFF ACTIVATED!"* akan muncul secara acak (contoh: *Concrete Strength +999*, *Deadline Resistance +50%*, *Unlimited Kopi For Today*).
* [x] **Navigasi:** Tombol `LANJUT YAA ➔` aktif setelah proses mengetik selesai.

### Phase 8: Section 6 — Ending Page & Celebration 🎉
* [x] **Struktur:** Langit malam penuh bintang gembira.
* [x] **Efek Selebrasi:**
  * Mengintegrasikan `react-confetti` dan efek partikel kembang api (`@tsparticles/react`) yang menyala meriah.
* [x] **Konten:** 
  * Teks pixel `"MISSION COMPLETE"` berkelip warna-warni.
  * Papan kayu gantung: *"LIFE IS A PROJECT, BUILD IT WELL AND ENJOY THE PROCESS."*
  * Ucapan hangat ulang tahun ke-20.
* [x] **Dua Tombol Interaktif:**
  * `KIRIM PELUKAN VIRTUAL 🤗`: Pemicu semburan partikel hati (`floating hearts`) memenuhi layar dan efek suara level up.
  * `MAIN LAGI NANTI YA!`: Mereset *Zustand store* dan mengembalikan pengguna ke Section 1 dengan transisi pudar (*fade-out*).

### Phase 9: State Management & Transisi Layar (JS Core) ⚙️
* [x] **Fungsi Transisi Layar:** Menggunakan Zustand store secara modular untuk navigasi antar screen.
* [x] **Sound Control:** Mencegah isu Autoplay dengan setup klik interaktif di awal game.

### Phase 10: Responsivitas & Penyempurnaan Akhir 📱
* [x] Menggunakan media query CSS untuk memastikan tampilan proporsional dan sangat estetis di berbagai perangkat (Mobile/Smartphone potret maupun Desktop).
* [x] Menguji kinerja rendering animasi dan interaktivitas drag-and-drop agar berjalan mulus tanpa lag.
* [x] Melakukan pemolesan mikro-interaksi (hover state, getaran tombol, transisi progress bar).

---

## 🎯 Rencana Pengujian & Verifikasi (Verification Plan)

### 1. Fungsionalitas Aplikasi
* [x] **State Transitions:** Memastikan perpindahan antar-layar mulus, tidak ada elemen meleset atau bocor di layar berikutnya.
* [x] **Zustand & Local Storage:** Memastikan XP, Buff yang diaktifkan, dan progres mini game tersinkronisasi dengan benar di store.
* [x] **Drag & Drop pada Mobile:** Verifikasi bahwa komponen berkat di Section 4 mudah dimainkan di layar sentuh ponsel (resolusi 320px ke atas) tanpa *bug scrolling*.

### 2. Audio & Keamanan Browser
* [x] **Autoplay Block Bypass:** Memastikan audio tidak memaksa memutar di awal jika dinonaktifkan oleh browser. Navigasi suara dikendalikan secara elegan oleh klik `START ADVENTURE` dan status Mute global terdeteksi.

### 3. Responsivitas & Performa
* [x] Menguji aplikasi pada rasio layar populer mobile (*iPhone SE*, *iPhone 12/13/14 Pro*, *Samsung Galaxy*) di Google Chrome DevTools.
* [x] Menjamin pemuatan Next.js cepat dengan mengoptimalkan aset gambar pixel art menggunakan loader optimal.
