import React, { useRef, useState } from 'react';
import { embedWatermark, extractWatermark, psnr, ssim, nc } from '../lib/watermark';

const steps = [
  { key: 'upload', label: 'Upload Image', desc: 'Upload gambar asli yang akan diberi watermark' },
  { key: 'watermark', label: 'Watermark', desc: 'Masukkan teks watermark dan atur kekuatan' },
  { key: 'process', label: 'Proses', desc: 'Terapkan watermark ke gambar' },
  { key: 'verify', label: 'Verifikasi', desc: 'Verifikasi dan ekstrak watermark' },
];
const tabs = [
  { key: 'original', label: 'Original Image' },
  { key: 'watermarked', label: 'Watermarked Image' },
  { key: 'comparison', label: 'Comparison' },
  { key: 'extracted', label: 'Extracted Watermark' },
];

const DWT_LEVEL = 2;
const EMBEDDING_FACTOR = 0.1;

const WatermarkPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('original');
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [imageSize, setImageSize] = useState('');
  const [watermarkText, setWatermarkText] = useState('');
  const [alpha, setAlpha] = useState(2.0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifyImage, setVerifyImage] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const verifyInputRef = useRef<HTMLInputElement>(null);
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);
  const [extractedWatermark, setExtractedWatermark] = useState<string | null>(null);
  const [verifyImageData, setVerifyImageData] = useState<ImageData | null>(null);
  const [psnrValue, setPsnrValue] = useState<number | null>(null);
  const [ssimValue, setSsimValue] = useState<number | null>(null);
  const [verifyImageName, setVerifyImageName] = useState('');
  const [watermarkImageData, setWatermarkImageData] = useState<ImageData | null>(null);
  const [ncValue, setNcValue] = useState<number | null>(null);
  const [ncCompValue, setNcCompValue] = useState<number | null>(null);

  // Drag & drop upload handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setNotification({ type: 'error', message: 'File harus berupa gambar.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      setImageName(file.name);
      const img = new window.Image();
      img.onload = () => setImageSize(`${img.width}x${img.height}px`);
      img.src = ev.target?.result as string;
      setActiveStep(1);
      setNotification(null);
    };
    reader.readAsDataURL(file);
  };
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };
  // Drag & drop for verify
  const handleDropVerify = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleVerifyFile(e.dataTransfer.files[0]);
    }
  };
  const handleVerifyFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setNotification({ type: 'error', message: 'File harus berupa gambar.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setVerifyImage(ev.target?.result as string);
      setVerifyImageName(file.name);
      // Ambil ImageData dari file
      const img = new window.Image();
      img.src = ev.target?.result as string;
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, size, size);
        setVerifyImageData(ctx.getImageData(0, 0, size, size));
      };
      setNotification(null);
    };
    reader.readAsDataURL(file);
  };
  const handleUploadVerify = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) handleVerifyFile(e.target.files[0]);
  };

  // Dummy process
  const handleApply = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (image && watermarkText) {
        const img = new window.Image();
        img.src = image;
        img.onload = () => {
          const size = Math.min(img.width, img.height);
          const hostCanvas = document.createElement('canvas');
          hostCanvas.width = size;
          hostCanvas.height = size;
          const hctx = hostCanvas.getContext('2d')!;
          hctx.drawImage(img, 0, 0, size, size);
          const hostImageData = hctx.getImageData(0, 0, size, size);
          // Buat watermark canvas
          const wmCanvas = document.createElement('canvas');
          wmCanvas.width = size;
          wmCanvas.height = size;
          const wctx = wmCanvas.getContext('2d')!;
          wctx.fillStyle = '#fff';
          wctx.fillRect(0, 0, size, size);
          wctx.font = `bold ${Math.floor(size/6)}px sans-serif`;
          wctx.fillStyle = '#000';
          wctx.textAlign = 'center';
          wctx.textBaseline = 'middle';
          wctx.fillText(watermarkText, size/2, size/2);
          const watermarkImageData = wctx.getImageData(0, 0, size, size);
          setWatermarkImageData(watermarkImageData);
          // Proses embed (pakai parameter baru)
          try {
            const resultImageData = embedWatermark(
              hostImageData,
              watermarkImageData,
              alpha,
              DWT_LEVEL,
              EMBEDDING_FACTOR
            );
            // Konversi ke URL
            const outCanvas = document.createElement('canvas');
            outCanvas.width = resultImageData.width;
            outCanvas.height = resultImageData.height;
            outCanvas.getContext('2d')!.putImageData(resultImageData, 0, 0);
            const dataUrl = outCanvas.toDataURL('image/png');
            console.log('Watermarked DataURL:', dataUrl.slice(0, 100));
            if (!dataUrl || !dataUrl.startsWith('data:image')) {
              setNotification({ type: 'error', message: 'Gagal menghasilkan DataURL watermarked.' });
              console.error('Gagal menghasilkan DataURL watermarked');
              return;
            }
            setWatermarkedImage(dataUrl);
            setNotification({ type: 'success', message: 'Watermark berhasil diterapkan!' });
          } catch (err) {
            setNotification({ type: 'error', message: 'Gagal embed watermark: ' + (err instanceof Error ? err.message : err) });
            console.error('Embed error:', err);
          }
        };
      }
      setIsProcessing(false);
      setActiveStep(2);
      setActiveTab('watermarked');
    }, 1200);
  };
  const handleSave = () => {
    if (!watermarkedImage) {
      setNotification({ type: 'error', message: 'Tidak ada gambar watermarked untuk disimpan.' });
      return;
    }
    // Buat link download
    const link = document.createElement('a');
    link.href = watermarkedImage;
    link.download = 'watermarked.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification({ type: 'success', message: 'Gambar berhasil disimpan!' });
  };
  const handleVerify = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      if (verifyImageData && image) {
        const img = new window.Image();
        img.src = image;
        img.onload = async () => {
          const size = Math.min(img.width, img.height);
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, size, size);
          const origImageData = ctx.getImageData(0, 0, size, size);
          try {
            // --- AUTO RESIZE verifyImageData jika ukuran beda ---
            let verifyData = verifyImageData;
            if (
              verifyImageData.width !== origImageData.width ||
              verifyImageData.height !== origImageData.height
            ) {
              // Resize verifyImage ke ukuran origImageData
              const resizeCanvas = document.createElement('canvas');
              resizeCanvas.width = origImageData.width;
              resizeCanvas.height = origImageData.height;
              const rctx = resizeCanvas.getContext('2d')!;
              // Buat image dari verifyImage
              const tempImg = new window.Image();
              tempImg.src = verifyImage!;
              await new Promise((resolve) => {
                tempImg.onload = resolve;
              });
              rctx.drawImage(tempImg, 0, 0, resizeCanvas.width, resizeCanvas.height);
              verifyData = rctx.getImageData(0, 0, resizeCanvas.width, resizeCanvas.height);
            }
            // Hitung metrik
            const psnrVal = psnr(origImageData, verifyData);
            const ssimVal = ssim(origImageData, verifyData);
            const ncVal = nc(origImageData, verifyData);
            setPsnrValue(psnrVal);
            setSsimValue(ssimVal);
            setNcCompValue(ncVal);
            setActiveStep(3);
            setActiveTab('comparison');
            setNotification({ type: 'success', message: 'Verifikasi selesai!' });
          } catch (err) {
            setNotification({ type: 'error', message: 'Gagal hitung metrik: ' + (err instanceof Error ? err.message : err) });
          }
        };
      } else {
        setNotification({ type: 'error', message: 'Gambar verifikasi belum diupload.' });
      }
      setIsProcessing(false);
    }, 1200);
  };
  const handleExtract = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (image && watermarkedImage) {
        const img = new window.Image();
        img.src = image;
        img.onload = () => {
          const size = Math.min(img.width, img.height);
          const hostCanvas = document.createElement('canvas');
          hostCanvas.width = size;
          hostCanvas.height = size;
          const hctx = hostCanvas.getContext('2d')!;
          hctx.drawImage(img, 0, 0, size, size);
          const hostImageData = hctx.getImageData(0, 0, size, size);
          // Ambil watermarked
          const wmImg = new window.Image();
          wmImg.src = watermarkedImage;
          wmImg.onload = () => {
            const wmCanvas = document.createElement('canvas');
            wmCanvas.width = size;
            wmCanvas.height = size;
            const wctx = wmCanvas.getContext('2d')!;
            wctx.drawImage(wmImg, 0, 0, size, size);
            const wmImageData = wctx.getImageData(0, 0, size, size);
            // Proses extract (pakai parameter baru)
            try {
              const resultImageData = extractWatermark(
                wmImageData,
                hostImageData,
                alpha,
                DWT_LEVEL,
                EMBEDDING_FACTOR
              );
              // Konversi ke URL
              const outCanvas = document.createElement('canvas');
              outCanvas.width = resultImageData.width;
              outCanvas.height = resultImageData.height;
              outCanvas.getContext('2d')!.putImageData(resultImageData, 0, 0);
              const dataUrl = outCanvas.toDataURL('image/png');
              console.log('Extracted Watermark DataURL:', dataUrl.slice(0, 100));
              if (!dataUrl || !dataUrl.startsWith('data:image')) {
                setNotification({ type: 'error', message: 'Gagal menghasilkan DataURL hasil ekstraksi.' });
                console.error('Gagal menghasilkan DataURL hasil ekstraksi');
                return;
              }
              setExtractedWatermark(dataUrl);
              // Hitung NC jika watermarkImageData tersedia dan ukuran sama
              if (watermarkImageData &&
                  watermarkImageData.width === resultImageData.width &&
                  watermarkImageData.height === resultImageData.height) {
                const ncVal = nc(watermarkImageData, resultImageData);
                setNcValue(ncVal);
              } else {
                setNcValue(null);
              }
              setNotification({ type: 'success', message: 'Ekstraksi watermark selesai!' });
            } catch (err) {
              setNotification({ type: 'error', message: 'Gagal ekstrak watermark: ' + (err instanceof Error ? err.message : err) });
              console.error('Extract error:', err);
            }
          };
        };
      }
      setIsProcessing(false);
      setActiveTab('extracted');
    }, 1200);
  };
  const handleReset = () => {
    setImage(null);
    setImageName('');
    setImageSize('');
    setWatermarkText('');
    setAlpha(2.0);
    setIsProcessing(false);
    setVerifyImage(null);
    setActiveStep(0);
    setActiveTab('original');
    setNotification(null);
    setWatermarkedImage(null);
    setExtractedWatermark(null);
    setVerifyImageData(null);
    setPsnrValue(null);
    setSsimValue(null);
    setWatermarkImageData(null);
    setNcValue(null);
    setNcCompValue(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-[340px] bg-card text-foreground p-6 flex flex-col gap-6 border-r border-border">
        {/* Stepper */}
        <div className="flex items-center gap-2 mb-6">
          {steps.map((step, idx) => (
            <React.Fragment key={step.key}>
              <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg border-2 ${activeStep === idx ? 'bg-primary border-primary text-primary-foreground' : idx < activeStep ? 'bg-secondary border-secondary text-secondary-foreground' : 'bg-muted border-border text-muted-foreground'}`}>{idx + 1}</div>
              {idx < steps.length - 1 && <div className={`flex-1 h-1 ${idx < activeStep ? 'bg-primary' : 'bg-muted'}`}></div>}
            </React.Fragment>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">InMark Watermarking</h2>
        {/* Step 1: Upload */}
        <div>
          <div className="font-semibold text-lg mb-2">Step 1: Upload Original Image</div>
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer mb-2 ${image ? 'border-primary' : 'border-border hover:border-primary'}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            {image ? (
              <img src={image} alt="preview" className="mx-auto mb-2 max-h-32 rounded" />
            ) : (
              <div className="text-muted-foreground">Drag & drop file di sini atau klik untuk upload</div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>
          {imageName && <div className="text-xs text-muted-foreground">{imageName}<br />{imageSize}</div>}
        </div>
        {/* Step 2: Watermark Settings */}
        <div className={`${activeStep < 1 ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="font-semibold text-lg mb-2">Step 2: Watermark Settings</div>
          <label className="block text-sm mb-1">Watermark Text:</label>
          <input className="w-full px-2 py-1 rounded bg-background border border-border text-foreground mb-2" placeholder="Enter text" value={watermarkText} onChange={e => setWatermarkText(e.target.value)} />
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm">Watermark Strength (Alpha):</label>
            <span className="text-xs text-muted-foreground cursor-help" title="Alpha = kekuatan watermark, semakin besar semakin terlihat.">?</span>
          </div>
          <input type="range" min={0.1} max={5.0} step={0.1} className="w-full" value={alpha} onChange={e => setAlpha(Number(e.target.value))} />
          <div className="text-sm mt-1">{alpha.toFixed(1)}</div>
        </div>
        {/* Step 3: Process */}
        <div className={`${activeStep < 1 ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="font-semibold text-lg mb-2">Step 3: Process</div>
          <button className="bg-primary hover:bg-primary/90 px-4 py-2 rounded text-primary-foreground font-semibold mb-2 w-full disabled:opacity-50" disabled={isProcessing || !image || !watermarkText} onClick={handleApply}>{isProcessing ? <span className="animate-spin inline-block mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> : null}Apply Watermark</button>
          <button className="bg-secondary px-4 py-2 rounded text-secondary-foreground font-semibold mb-2 w-full disabled:opacity-50" disabled={!image || isProcessing} onClick={handleSave}>Save Watermarked Image</button>
        </div>
        {/* Step 4: Verification */}
        <div className={`${activeStep < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="font-semibold text-lg mb-2">Step 4: Verification</div>
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer mb-2 ${verifyImage ? 'border-primary' : 'border-border hover:border-primary'}`}
            onClick={() => verifyInputRef.current?.click()}
            onDrop={handleDropVerify}
            onDragOver={e => e.preventDefault()}
          >
            {verifyImage ? (
              <>
                <img src={verifyImage} alt="verify" className="mx-auto mb-2 max-h-24 rounded" />
                {verifyImageName && <div className="text-xs text-muted-foreground">{verifyImageName}</div>}
              </>
            ) : (
              <div className="text-muted-foreground">Drag & drop file verifikasi atau klik untuk upload</div>
            )}
            <input ref={verifyInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadVerify} />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold mb-2 w-full disabled:opacity-50" disabled={isProcessing || !verifyImage} onClick={handleVerify}>{isProcessing ? <span className="animate-spin inline-block mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> : null}Verify Authenticity</button>
          <button className="bg-muted px-4 py-2 rounded text-foreground font-semibold mb-2 w-full disabled:opacity-50" disabled={isProcessing || !verifyImage} onClick={handleExtract}>Extract Watermark</button>
        </div>
        <button className="mt-4 bg-accent hover:bg-accent/90 px-4 py-2 rounded text-accent-foreground font-semibold w-full" onClick={handleReset}>Reset</button>
        {/* Notification */}
        {notification && (
          <div className={`mt-4 px-4 py-2 rounded text-sm ${notification.type === 'success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}>{notification.message}</div>
        )}
      </div>
      {/* Main Area */}
      <div className="flex-1 bg-background p-8">
        <div className="flex gap-4 mb-4 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded ${activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center h-[500px] bg-card rounded">
          {activeTab === 'original' && image && (
            <img src={image} alt="Original" className="max-h-full max-w-full rounded" />
          )}
          {activeTab === 'watermarked' && watermarkedImage && (
            <img src={watermarkedImage} alt="Watermarked" className="max-h-full max-w-full rounded" />
          )}
          {activeTab === 'extracted' && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex gap-4">
                {watermarkImageData && (
                  <div className="flex flex-col items-center">
                    <span className="text-xs mb-1">Original Watermark</span>
                    <canvas
                      ref={node => {
                        if (node && watermarkImageData) {
                          node.width = watermarkImageData.width;
                          node.height = watermarkImageData.height;
                          node.getContext('2d')!.putImageData(watermarkImageData, 0, 0);
                        }
                      }}
                      className="max-h-32 max-w-32 rounded border"
                    />
                  </div>
                )}
                {extractedWatermark && (
                  <div className="flex flex-col items-center">
                    <span className="text-xs mb-1">Extracted Watermark</span>
                    <img src={extractedWatermark} alt="Extracted Watermark" className="max-h-32 max-w-32 rounded border" />
                  </div>
                )}
              </div>
              {ncValue !== null && (
                <div className="mt-2 p-2 bg-muted rounded text-foreground text-base">
                  NC (Normalized Correlation): {ncValue.toFixed(4)}
                </div>
              )}
            </div>
          )}
          {activeTab === 'comparison' && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex gap-4">
                {image && <img src={image} alt="Original" className="max-h-60 max-w-xs rounded" />}
                {verifyImage && <img src={verifyImage} alt="Verify" className="max-h-60 max-w-xs rounded" />}
              </div>
              {(psnrValue !== null || ssimValue !== null || ncCompValue !== null) && (
                <div className="mt-4 p-4 bg-muted rounded text-foreground text-lg">
                  <div>PSNR: {psnrValue !== null ? psnrValue.toFixed(2) : '-'} dB</div>
                  <div>SSIM: {ssimValue !== null ? ssimValue.toFixed(4) : '-'}</div>
                  <div>NC: {ncCompValue !== null ? ncCompValue.toFixed(4) : '-'}</div>
                </div>
              )}
            </div>
          )}
          {/* Fallback jika belum ada gambar */}
          {!((activeTab === 'original' && image) ||
            (activeTab === 'watermarked' && watermarkedImage) ||
            (activeTab === 'extracted' && (watermarkImageData || extractedWatermark)) ||
            (activeTab === 'comparison' && (image || verifyImage))
          ) && (
            <span className="text-muted-foreground text-xl">
              {tabs.find(t => t.key === activeTab)?.label} Preview
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatermarkPage; 