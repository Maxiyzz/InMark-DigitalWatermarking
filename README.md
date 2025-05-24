# InMark - Aplikasi Watermarking Digital

InMark adalah aplikasi web untuk watermarking citra digital berbasis algoritma **DWT-SVD**. Proyek ini dikembangkan untuk penelitian dan edukasi mengenai teknik watermarking yang kuat, dengan antarmuka modern dan metrik evaluasi kualitas yang lengkap.

---

## ✨ Fitur Utama
- **Watermarking DWT-SVD**: Penyisipan dan ekstraksi watermark pada gambar digital menggunakan kombinasi Discrete Wavelet Transform (DWT) dan Singular Value Decomposition (SVD).
- **Metrik Kualitas**: Evaluasi hasil watermarking dengan **PSNR**, **SSIM/MMSI**, dan **NC (Normalized Correlation)**.
- **Ekstraksi & Verifikasi**: Proses ekstraksi watermark dan verifikasi keaslian gambar dengan perbandingan metrik.
- **UI Modern**: Antarmuka web responsif, mudah digunakan, dan mendukung drag & drop.
- **Preview & Perbandingan**: Tampilkan gambar asli, watermarked, hasil ekstraksi, dan perbandingan metrik secara visual.

---

## 🚀 Teknologi
- **React + TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animasi)
- **numeric.js** (fallback SVD)
- **HTML Canvas API** (proses gambar)

---

## 📂 Struktur Folder
```
src/
  pages/         # Halaman utama (Home, Watermark, About, HowToUse)
  components/    # Komponen global (Header, Footer, Layout, SettingsPanel)
  lib/           # Algoritma watermarking & metrik (watermark.ts, svd-dwt.ts)
  utils/         # Utility/helper
  contexts/      # Context global (Theme, Animation)
  types/         # (Opsional) Tipe data global
```

---

## 🖥️ Cara Menjalankan
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```
3. **Akses di browser:**
   Buka [http://localhost:5173](http://localhost:5173)

---

## 📝 Cara Menggunakan
1. **Upload gambar asli** di halaman Watermark.
2. **Masukkan watermark** (teks/gambar), atur kekuatan watermark.
3. **Apply Watermark** untuk menghasilkan gambar watermarked.
4. **Simpan hasil** jika diinginkan.
5. **Verifikasi**: Upload gambar verifikasi (watermarked/hasil edit), bandingkan dengan gambar asli.
6. **Lihat metrik** (PSNR, SSIM/MMSI, NC) dan preview visual.
7. **Ekstrak watermark** untuk membuktikan keaslian.

---

## 👨‍💻 Tim Pengembang
- **Riyanti Salsabila** (237006156) - Peneliti Utama
- **Muhammad Syamsul Ma'arif** (237006160) - Pengembang Aplikasi
- **Fadil Darmawan** (237006164) - Peneliti Metrik Kualitas

---

## 📚 Publikasi Terkait
- [IMPLEMENTASI METODE WATERMARKING SINGULAR VALUE DECOMPOSITION DAN DISCRETE WAVELET TRANSFORM PADA CITRA DIGITAL](http://dx.doi.org/10.30811/tektro.v8i2.6326)
- [Implementasi Teknik Watermarking Menggunakan Metode Discrete Wavelet Transform (DWT) dan Singular Value Decomposition (SVD) pada Citra Digital](https://doi.org/10.32815/JITIKA.V14I2.262)
- [Designing of a Hybrid DWT-SVD Watermarking Technique of Color Images with Digital Signature](https://doi.org/10.1109/CCET56606.2022.10080560)

---

## 📫 Kontak
- Riyanti: 237006156@student.unsil.ac.id
- Syamsul: 237006160@student.unsil.ac.id ([Github](https://github.com/Maxiyzz))
- Fadil: 237006164@student.unsil.ac.id ([Github](https://github.com/TehRio-byte))

---

## ⚠️ Catatan
- Proyek ini untuk tujuan edukasi dan penelitian. Algoritma SVD pada matrix besar menggunakan fallback sederhana, untuk produksi disarankan library numerik yang lebih stabil.
- Semua metrik otomatis menyesuaikan ukuran gambar (auto-resize) agar perbandingan adil. 