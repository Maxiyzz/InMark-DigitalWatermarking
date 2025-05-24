import React from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../contexts/AnimationContext';
import { Upload, FileX, ImageIcon, Eye, FileCheck, RotateCcw, ChevronRight } from 'lucide-react';

const HowToUsePage: React.FC = () => {
  const { animationsEnabled, animationSpeed } = useAnimation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.4 * (1 / animationSpeed),
        staggerChildren: 0.1 * (1 / animationSpeed)
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 * (1 / animationSpeed) }
    }
  };

  const steps = [
    {
      title: "Upload Gambar Asli",
      description: "Upload gambar digital yang ingin diberi watermark. Gambar ini akan menjadi host. Format yang didukung: JPG, PNG, dsb.",
      icon: <Upload size={24} />,
    },
    {
      title: "Input Watermark (Teks atau Gambar)",
      description: "Masukkan teks watermark (akan diubah otomatis menjadi gambar) atau upload gambar watermark. Watermark akan dicrop otomatis agar sesuai dengan host.",
      icon: <ImageIcon size={24} />,
    },
    {
      title: "Atur Kekuatan Watermark (Alpha)",
      description: "Sesuaikan parameter alpha (α) untuk menentukan kekuatan watermark. Nilai lebih tinggi = watermark lebih terlihat, tapi kualitas gambar bisa menurun.",
      icon: <Eye size={24} />,
    },
    {
      title: "Apply Watermark",
      description: "Klik tombol 'Apply Watermark' untuk memulai proses penyisipan watermark menggunakan algoritma DWT-SVD. Proses cropping ke power of 2 dilakukan otomatis.",
      icon: <FileCheck size={24} />,
    },
    {
      title: "Simpan Gambar Watermarked",
      description: "Setelah proses selesai, simpan gambar hasil watermark ke perangkat Anda.",
      icon: <FileCheck size={24} />,
    },
    {
      title: "Verifikasi & Ekstraksi Watermark",
      description: "Upload gambar hasil watermark untuk verifikasi. Klik 'Extract Watermark' untuk melihat hasil ekstraksi dan bandingkan dengan watermark asli.",
      icon: <Eye size={24} />,
    },
    {
      title: "Analisis Metrik Kualitas",
      description: "Perhatikan nilai PSNR, SSIM, dan NC untuk mengevaluasi kualitas gambar dan keberhasilan watermark.",
      icon: <Eye size={24} />,
    },
    {
      title: "Reset Proses (Opsional)",
      description: "Klik tombol reset untuk memulai ulang proses dari awal.",
      icon: <RotateCcw size={24} />,
    },
  ];

  const troubleshooting = [
    {
      problem: "Gagal Upload Gambar/Watermark",
      solution: "Pastikan file yang diupload adalah gambar (JPG, PNG, dsb). Jika upload teks, pastikan diisi dengan benar. Ukuran file terlalu besar bisa menyebabkan error/performa lambat."
    },
    {
      problem: "Watermark Tidak Terlihat",
      solution: "Tingkatkan nilai alpha (α) agar watermark lebih terlihat. Namun, alpha terlalu tinggi bisa menurunkan kualitas gambar."
    },
    {
      problem: "Watermark Terlalu Dominan",
      solution: "Turunkan nilai alpha (α) agar watermark lebih samar dan kualitas gambar tetap baik."
    },
    {
      problem: "Kualitas Gambar Watermarked Buruk",
      solution: "Periksa nilai PSNR dan SSIM. PSNR > 30 dB dan SSIM > 0.95 menandakan kualitas baik. Jika rendah, turunkan alpha atau gunakan gambar host dengan resolusi lebih tinggi."
    },
    {
      problem: "Ekstraksi Watermark Buruk",
      solution: "Periksa nilai NC. NC mendekati 1 menandakan ekstraksi baik. Jika rendah, coba gunakan watermark yang lebih kontras atau tingkatkan alpha."
    },
    {
      problem: "Ukuran Gambar Tidak Sesuai",
      solution: "Aplikasi akan otomatis crop gambar ke ukuran power of 2 terbesar yang sesuai. Jika hasil crop terlalu kecil, gunakan gambar dengan resolusi lebih besar."
    },
  ];

  return (
    <div className="space-y-10">
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Cara Penggunaan
        </h1>
        <p className="text-lg text-muted-foreground">
          Panduan langkah demi langkah untuk menggunakan aplikasi watermarking InMark
        </p>
      </div>

      {animationsEnabled ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Langkah-langkah Penggunaan
            </h2>
            
            <ol className="space-y-8">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <span className="text-primary font-bold">{index + 1}.</span> 
                      {step.title}
                    </h3>
                    <p className="mt-1 text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Pemecahan Masalah
            </h2>
            
            <div className="grid gap-4">
              {troubleshooting.map((item, index) => (
                <div key={index} className="p-4 rounded-lg border border-border bg-card">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <FileX className="text-accent" size={20} /> {item.problem}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    <span className="font-medium text-foreground">Solusi:</span> {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Memahami Metrik Kualitas
            </h2>
            
            <div className="grid gap-6 md:grid-cols-4">
              <div className="p-5 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-2">PSNR</h3>
                <p className="text-muted-foreground">
                  <strong>Peak Signal-to-Noise Ratio</strong> - Mengukur kualitas gambar watermarked dibandingkan gambar asli. Nilai lebih tinggi = kualitas lebih baik.
                </p>
                <p className="mt-2 text-sm text-primary">
                  Nilai ideal: &gt; 30 dB
                </p>
              </div>
              <div className="p-5 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-2">SSIM</h3>
                <p className="text-muted-foreground">
                  <strong>Structural Similarity Index</strong> - Mengukur kemiripan struktur antara gambar asli dan watermarked. Nilai 1 = identik, &gt;0.95 sangat baik.
                </p>
                <p className="mt-2 text-sm text-primary">
                  Nilai ideal: &gt; 0.95
                </p>
              </div>
              <div className="p-5 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-2">NC</h3>
                <p className="text-muted-foreground">
                  <strong>Normalized Correlation</strong> - Mengukur kesamaan antara watermark asli dan hasil ekstraksi. Nilai mendekati 1 = ekstraksi sangat baik.
                </p>
                <p className="mt-2 text-sm text-primary">
                  Nilai ideal: &gt; 0.75
                </p>
              </div>
              <div className="p-5 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-2">Cropping Otomatis</h3>
                <p className="text-muted-foreground">
                  Gambar host dan watermark akan otomatis dicrop ke ukuran power of 2 terbesar yang sesuai sebelum proses watermarking.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Langkah Selanjutnya
            </h2>
            
            <p className="text-muted-foreground mb-4">
              Setelah berhasil menggunakan aplikasi, Anda dapat:
            </p>
            
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                <span>Bereksperimen dengan nilai alpha (α) yang berbeda untuk menyeimbangkan kekuatan watermark dan kualitas gambar</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                <span>Mencoba jenis gambar dan watermark yang berbeda untuk memahami bagaimana algoritma bekerja pada media yang berbeda</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                <span>Menganalisis metrik kualitas untuk memahami trade-off antara keamanan watermark dan kualitas visual</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      ) : (
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Langkah-langkah Penggunaan
            </h2>
            
            <ol className="space-y-8">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <span className="text-primary font-bold">{index + 1}.</span> 
                      {step.title}
                    </h3>
                    <p className="mt-1 text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Pemecahan Masalah
            </h2>
            
            <div className="grid gap-4">
              {troubleshooting.map((item, index) => (
                <div key={index} className="p-4 rounded-lg border border-border bg-card">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <FileX className="text-accent" size={20} /> {item.problem}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    <span className="font-medium text-foreground">Solusi:</span> {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Memahami Metrik Kualitas
            </h2>
            
            <div className="grid gap-6 md:grid-cols-4">
              <div className="p-5 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-2">PSNR</h3>
                <p className="text-muted-foreground">
                  <strong>Peak Signal-to-Noise Ratio</strong> - Mengukur kualitas gambar watermarked dibandingkan gambar asli. Nilai lebih tinggi = kualitas lebih baik.
                </p>
                <p className="mt-2 text-sm text-primary">
                  Nilai ideal: &gt; 30 dB
                </p>
              </div>
              <div className="p-5 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-2">SSIM</h3>
                <p className="text-muted-foreground">
                  <strong>Structural Similarity Index</strong> - Mengukur kemiripan struktur antara gambar asli dan watermarked. Nilai 1 = identik, &gt;0.95 sangat baik.
                </p>
                <p className="mt-2 text-sm text-primary">
                  Nilai ideal: &gt; 0.95
                </p>
              </div>
              <div className="p-5 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-2">NC</h3>
                <p className="text-muted-foreground">
                  <strong>Normalized Correlation</strong> - Mengukur kesamaan antara watermark asli dan hasil ekstraksi. Nilai mendekati 1 = ekstraksi sangat baik.
                </p>
                <p className="mt-2 text-sm text-primary">
                  Nilai ideal: &gt; 0.75
                </p>
              </div>
              <div className="p-5 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-2">Cropping Otomatis</h3>
                <p className="text-muted-foreground">
                  Gambar host dan watermark akan otomatis dicrop ke ukuran power of 2 terbesar yang sesuai sebelum proses watermarking.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Langkah Selanjutnya
            </h2>
            
            <p className="text-muted-foreground mb-4">
              Setelah berhasil menggunakan aplikasi, Anda dapat:
            </p>
            
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                <span>Bereksperimen dengan nilai alpha (α) yang berbeda untuk menyeimbangkan kekuatan watermark dan kualitas gambar</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                <span>Mencoba jenis gambar dan watermark yang berbeda untuk memahami bagaimana algoritma bekerja pada media yang berbeda</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                <span>Menganalisis metrik kualitas untuk memahami trade-off antara keamanan watermark dan kualitas visual</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default HowToUsePage;