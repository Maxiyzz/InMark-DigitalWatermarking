import React from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../contexts/AnimationContext';
import { Github, Mail, GraduationCap, BookOpen, ChevronRight } from 'lucide-react';

const AboutUsPage: React.FC = () => {
  const { animationsEnabled, animationSpeed } = useAnimation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5 * (1 / animationSpeed),
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

  const teamMembers = [
    {
      name: "Riyanti Salsabila",
      NPM: "237006156", 
      role: "Peneliti Metrik Kualitas",
      bio: "Mengembangkan metodologi untuk evaluasi PSNR, SSIM, dan NC dalam watermarking digital.",
      photo: "/img/salsa.jpg",
      github: "",
      email: "237006156@student.unsil.ac.id"
    },
    {
      name: "Muhammad Syamsul Ma'arif",
      NPM : "237006160",
      role: "Pengembang Aplikasi",
      bio: "Bertanggung jawab untuk implementasi interface dan algoritma watermarking.",
      photo: "/img/syamsul.jpg",
      github: "https://github.com/Maxiyzz",
      email: "237006160@student.unsil.ac.id"
    },
    {
      name: "Fadil Darmawan",
      NPM : "237006164",
      role: "Peneliti Algoritma",
      bio: "Fokus pada pengembangan algoritma DWT dan optimasi kualitas gambar.",
      photo: "/img/Fadil.jpg",
      github: "https://github.com/TehRio-byte",
      email: "237006164@student.unsil.ac.id"
    },
  ];

  const publications = [
    {
      title: "IMPLEMENTASI METODE WATERMARKING SINGULAR VALUE DECOMPOSITION DAN DISCRETE WAVELET TRANSFORM PADA CITRA DIGITAL",
      journal: "Jurnal TEKTRO ",
      year: "2021",
      doi: "http://dx.doi.org/10.30811/tektro.v8i2.6326",
    },
    {
      title: "Implementasi Teknik Watermarking Menggunakan Metode Discrete Wavelet Transform (DWT) dan Singular Value Decomposition (SVD) pada Citra Digital",
      journal: "JITIKA",
      year: "2021",
      doi: "https://doi.org/10.32815/JITIKA.V14I2.262",
    },
    {
      title: "Designing of a Hybrid DWT-SVD Watermarking Technique of Color Images with Digital Signature",
      journal: "IEEE",
      year: "2022",
      doi: "https://doi.org/10.1109/CCET56606.2022.10080560",
    },
  ];

  return (
    <div className="space-y-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Tentang Kami
        </h1>
        <p className="text-lg text-muted-foreground">
          Tim peneliti di balik pengembangan InMark, aplikasi watermarking digital berbasis web
        </p>
      </div>

      {animationsEnabled ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-14">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Tim Kami
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[3/2] overflow-hidden bg-muted">
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                    <div className="text-xs text-muted-foreground mb-1">NPM: {member.NPM}</div>
                    <p className="text-primary font-medium mb-4">{member.role}</p>
                    <p className="text-muted-foreground">{member.bio}</p>
                    
                    <div className="mt-6 flex space-x-3">
                      {member.github && (
                        <a 
                          href={member.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors text-foreground"
                          aria-label={`${member.name} Github`}
                        >
                          <Github size={18} />
                        </a>
                      )}
                      <a 
                        href={`mailto:${member.email}`}
                        className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors text-foreground"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-14">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Tentang Proyek Ini
            </h2>
            
            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              <p className="text-muted-foreground mb-4">
                InMark adalah aplikasi watermarking digital berbasis web yang dikembangkan untuk penelitian dan implementasi teknik preservasi visual gambar digital menggunakan algoritma Discrete Wavelet Transform (DWT) dan Singular Value Decomposition (SVD).
              </p>
              
              <p className="text-muted-foreground mb-4">
                Proyek ini bertujuan untuk menyediakan platform yang memudahkan pengguna untuk melakukan watermarking pada gambar digital dengan menjaga kualitas visual gambar asli. Aplikasi ini dapat digunakan untuk berbagai keperluan, seperti perlindungan hak cipta, otentikasi konten, dan deteksi manipulasi gambar.
              </p>
              
              <p className="text-muted-foreground mb-4">
                Metodologi yang digunakan dalam aplikasi ini menggabungkan teknik DWT dan SVD untuk mendapatkan hasil watermarking yang optimal dengan perubahan visual minimal. Algoritma ini memberikan ketahanan yang baik terhadap pemrosesan gambar umum seperti kompresi dan filtering.
              </p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-border rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BookOpen className="text-primary" size={20} />
                    Fitur Utama
                  </h3>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">Implementasi algoritma DWT-SVD untuk watermarking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">Analisis metrik kualitas (PSNR, MMSI, NC)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">Ekstraksi dan verifikasi watermark</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">Antarmuka web yang intuitif dan responsif</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border border-border rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BookOpen className="text-primary" size={20} />
                    Teknologi
                  </h3>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">React untuk antarmuka pengguna</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">TypeScript untuk pengembangan yang lebih aman</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">HTML Canvas API untuk pemrosesan gambar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">Tailwind CSS untuk desain responsif</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Publikasi Terkait
            </h2>
            
            <div className="space-y-4">
              {publications.map((pub, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {pub.title}
                  </h3>
                  <div className="mt-2 text-muted-foreground flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>{pub.journal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} />
                      <span>{pub.year}</span>
                    </div>
                    <div>
                      <span className="text-primary">DOI: {pub.doi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <div>
          <div className="mb-14">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Tim Kami
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[3/2] overflow-hidden bg-muted">
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                    <div className="text-xs text-muted-foreground mb-1">NPM: {member.NPM}</div>
                    <p className="text-primary font-medium mb-4">{member.role}</p>
                    <p className="text-muted-foreground">{member.bio}</p>
                    
                    <div className="mt-6 flex space-x-3">
                      {member.github && (
                        <a 
                          href={member.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors text-foreground"
                          aria-label={`${member.name} Github`}
                        >
                          <Github size={18} />
                        </a>
                      )}
                      <a 
                        href={`mailto:${member.email}`}
                        className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors text-foreground"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-14">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Tentang Proyek Ini
            </h2>
            
            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              <p className="text-muted-foreground mb-4">
                InMark adalah aplikasi watermarking digital berbasis web yang dikembangkan untuk penelitian dan implementasi teknik preservasi visual gambar digital menggunakan algoritma Discrete Wavelet Transform (DWT) dan Singular Value Decomposition (SVD).
              </p>
              
              <p className="text-muted-foreground mb-4">
                Proyek ini bertujuan untuk menyediakan platform yang memudahkan pengguna untuk melakukan watermarking pada gambar digital dengan menjaga kualitas visual gambar asli. Aplikasi ini dapat digunakan untuk berbagai keperluan, seperti perlindungan hak cipta, otentikasi konten, dan deteksi manipulasi gambar.
              </p>
              
              <p className="text-muted-foreground mb-4">
                Metodologi yang digunakan dalam aplikasi ini menggabungkan teknik DWT dan SVD untuk mendapatkan hasil watermarking yang optimal dengan perubahan visual minimal. Algoritma ini memberikan ketahanan yang baik terhadap pemrosesan gambar umum seperti kompresi dan filtering.
              </p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-border rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BookOpen className="text-primary" size={20} />
                    Fitur Utama
                  </h3>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">Implementasi algoritma DWT-SVD untuk watermarking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">Analisis metrik kualitas (PSNR, MMSI, NC)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">Ekstraksi dan verifikasi watermark</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">Antarmuka web yang intuitif dan responsif</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border border-border rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BookOpen className="text-primary" size={20} />
                    Teknologi
                  </h3>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">React untuk antarmuka pengguna</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">TypeScript untuk pengembangan yang lebih aman</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">HTML Canvas API untuk pemrosesan gambar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="flex-shrink-0 mt-1 text-primary" size={16} />
                      <span className="text-muted-foreground">Tailwind CSS untuk desain responsif</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Publikasi Terkait
            </h2>
            
            <div className="space-y-4">
              {publications.map((pub, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {pub.title}
                  </h3>
                  <div className="mt-2 text-muted-foreground flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>{pub.journal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} />
                      <span>{pub.year}</span>
                    </div>
                    <div>
                      <span className="text-primary">DOI: {pub.doi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUsPage;