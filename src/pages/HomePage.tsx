import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAnimation } from '../contexts/AnimationContext';
import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react';

const HomePage: React.FC = () => {
  const { animationsEnabled, animationSpeed } = useAnimation();

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5 * (1 / animationSpeed), 
        ease: "easeOut" 
      }
    }
  };

  const features = [
    {
      title: "Discrete Wavelet Transform (DWT)",
      description: "Transformasi wavelet untuk dekomposisi gambar menjadi sub-band frekuensi yang berbeda."
    },
    {
      title: "Singular Value Decomposition (SVD)",
      description: "Dekomposisi matriks untuk mendapatkan nilai singular yang stabil terhadap berbagai manipulasi gambar."
    },
    {
      title: "Metrik Kualitas",
      description: "Evaluasi kualitas watermark dengan PSNR, MMSI, dan NC untuk memastikan keseimbangan antara ketahanan dan invisibilitas."
    }
  ];

  const team = [
    { name: 'Riyanti Salsabila', npm: '237006156', role: 'Peneliti Metrik Kualitas' },
    { name: "Muhammad Syamsul Ma'arif", npm: '237006160', role: 'Pengembang Aplikasi' },
    { name: 'Fadil Darmawan', npm: '237006164', role: 'Peneliti algoritma berfokus pada algoritma dwt dan optimalisasi gambar' },
  ];

  const publications = [
    {
      title: 'IMPLEMENTASI METODE WATERMARKING SINGULAR VALUE DECOMPOSITION DAN DISCRETE WAVELET TRANSFORM PADA CITRA DIGITAL',
      doi: 'http://dx.doi.org/10.30811/tektro.v8i2.6326',
    },
    {
      title: 'Implementasi Teknik Watermarking Menggunakan Metode Discrete Wavelet Transform (DWT) dan Singular Value Decomposition (SVD) pada Citra Digital',
      doi: 'https://doi.org/10.32815/JITIKA.V14I2.262',
    },
    {
      title: 'Designing of a Hybrid DWT-SVD Watermarking Technique of Color Images with Digital Signature',
      doi: 'https://doi.org/10.1109/CCET56606.2022.10080560',
    },
  ];

  const content = (
    <div className="space-y-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
          InMark - Aplikasi Watermarking Digital
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Optimasi preservasi visual gambar digital dengan teknik Discrete Wavelet Transform (DWT) dan Singular Value Decomposition (SVD).
        </p>
        <Link
          to="/watermark"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Mulai Watermarking
          <ArrowRight className="ml-2" size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-lg border bg-card"
          >
            <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Mengapa Menggunakan InMark?</h2>
        <p className="text-muted-foreground mb-4">
          InMark menggunakan kombinasi DWT-SVD untuk memberikan watermark yang:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Tahan terhadap berbagai manipulasi gambar</li>
          <li>Tidak terlihat oleh mata manusia (invisible)</li>
          <li>Dapat diekstrak kembali dengan kualitas tinggi</li>
          <li>Memiliki keseimbangan antara ketahanan dan kualitas visual</li>
        </ul>
      </div>

      <div className="max-w-3xl mt-16">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} className="text-primary" /> Tim Pengembang</h2>
        <ul className="mb-6 space-y-1 text-muted-foreground">
          {team.map((m, i) => (
            <li key={i}>
              <span className="font-semibold text-foreground">{m.name}</span> ({m.npm}) - {m.role}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="py-8">
      {animationsEnabled ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          {content}
        </motion.div>
      ) : (
        content
      )}
    </div>
  );
};

export default HomePage;