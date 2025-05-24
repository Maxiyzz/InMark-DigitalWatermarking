// src/lib/watermark.ts
// Template kosong untuk membangun ulang algoritma watermarking DWT-SVD dari awal

import {
  performDWT,
  performIDWT,
  performSVD,
  imageDataToMatrix,
  matrixToImageData
} from './svd-dwt';

// Helper: crop matrix ke power of 2 dan samakan ukuran
function cropToPowerOf2(matrixA: number[][], matrixB: number[][]) {
  const minSize = Math.min(matrixA.length, matrixA[0].length, matrixB.length, matrixB[0].length);
  // Cari power of 2 terbesar <= minSize
  let size = 1;
  while (size * 2 <= minSize) size *= 2;
  function crop(mat: number[][]) {
    return mat.slice(0, size).map(row => row.slice(0, size));
  }
  return [crop(matrixA), crop(matrixB), size] as [number[][], number[][], number];
}

// Helper: normalisasi matrix ke 0-255
function normalizeMatrix(mat: number[][]): number[][] {
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[0].length; j++) {
      if (mat[i][j] < min) min = mat[i][j];
      if (mat[i][j] > max) max = mat[i][j];
    }
  }
  if (min === max) return mat.map(row => row.map(() => 0));
  return mat.map(row => row.map(v => ((v - min) * 255) / (max - min)));
}

// Helper: resize matrix ke ukuran tertentu (bilinear sederhana)
function resizeMatrix(mat: number[][], newSize: number): number[][] {
  const oldSize = mat.length;
  const result: number[][] = [];
  for (let y = 0; y < newSize; y++) {
    const row: number[] = [];
    for (let x = 0; x < newSize; x++) {
      const srcY = y * (oldSize - 1) / (newSize - 1);
      const srcX = x * (oldSize - 1) / (newSize - 1);
      const y0 = Math.floor(srcY), y1 = Math.min(Math.ceil(srcY), oldSize - 1);
      const x0 = Math.floor(srcX), x1 = Math.min(Math.ceil(srcX), oldSize - 1);
      const wy = srcY - y0, wx = srcX - x0;
      // Bilinear interpolation
      const v =
        (1 - wy) * ((1 - wx) * mat[y0][x0] + wx * mat[y0][x1]) +
        wy * ((1 - wx) * mat[y1][x0] + wx * mat[y1][x1]);
      row.push(v);
    }
    result.push(row);
  }
  return result;
}

// Helper: DWT multi-level (Haar, hanya LL band)
function dwtMultiLevel(mat: number[][], level: number) {
  let LL = mat;
  let coeffs = [];
  for (let i = 0; i < level; i++) {
    if (LL.length < 2 || LL[0].length < 2) {
      console.error(`DWT level ${i}: matrix too small (${LL.length}x${LL[0].length})`);
      throw new Error(`Matrix terlalu kecil untuk DWT level ${level}. Ukuran minimal: ${Math.pow(2, level)}x${Math.pow(2, level)}`);
    }
    const { LL: nextLL, LH, HL, HH } = performDWT(LL);
    console.log(`DWT level ${i + 1}: LL size = ${nextLL.length}x${nextLL[0].length}`);
    coeffs.push({ LH, HL, HH });
    LL = nextLL;
  }
  return { LL, coeffs };
}
// Helper: IDWT multi-level (rekonstruksi dari LL dan coeffs)
function idwtMultiLevel(LL: number[][], coeffs: any[]) {
  let currentLL = LL;
  for (let i = coeffs.length - 1; i >= 0; i--) {
    const { LH, HL, HH } = coeffs[i];
    // Validasi dan log ukuran sebelum performIDWT
    if (!currentLL || !LH || !HL || !HH) {
      console.error(`IDWT level ${i + 1}: Ada band yang undefined/null`, { currentLL, LH, HL, HH });
      throw new Error(`IDWT gagal: Ada band yang undefined/null pada level ${i + 1}`);
    }
    const n = currentLL.length, m = currentLL[0].length;
    const check = (mat: number[][], name: string) => {
      if (!mat || mat.length !== n || mat[0].length !== n) {
        console.error(`IDWT level ${i + 1}: Ukuran ${name} tidak sesuai. Diharapkan ${n}x${n}, dapat ${mat?.length}x${mat?.[0]?.length}`);
        throw new Error(`IDWT gagal: Ukuran ${name} tidak sesuai pada level ${i + 1}`);
      }
      for (let row = 0; row < n; row++) {
        if (!Array.isArray(mat[row]) || mat[row].length !== n) {
          console.error(`IDWT level ${i + 1}: Baris ke-${row} pada ${name} tidak valid.`, mat[row]);
          throw new Error(`IDWT gagal: Baris ke-${row} pada ${name} tidak valid pada level ${i + 1}`);
        }
      }
    };
    check(currentLL, 'LL');
    check(LH, 'LH');
    check(HL, 'HL');
    check(HH, 'HH');
    // Log ukuran dan contoh baris pertama
    console.log(`IDWT level ${i + 1}: LL=${n}x${m}, LH=${LH.length}x${LH[0].length}, HL=${HL.length}x${HL[0].length}, HH=${HH.length}x${HH[0].length}`);
    console.log('Contoh baris pertama LL:', currentLL[0]);
    currentLL = performIDWT(currentLL, LH, HL, HH);
  }
  return currentLL;
}

/**
 * Embed watermark ke host image dengan DWT-SVD (multi-level, referensi Python)
 * @param hostImage ImageData gambar asli
 * @param watermarkImage ImageData watermark (teks/gambar)
 * @param alpha Kekuatan watermark
 * @param dwtLevel Level DWT (default 2)
 * @param embeddingFactor Faktor embedding (default 0.1)
 * @returns ImageData hasil watermarked
 */
export function embedWatermark(
  hostImage: ImageData,
  watermarkImage: ImageData,
  alpha: number,
  dwtLevel = 2,
  embeddingFactor = 0.1
): ImageData {
  // 1. Konversi ke matrix grayscale
  let hostMat = imageDataToMatrix(hostImage);
  let wmMat = imageDataToMatrix(watermarkImage);
  // 2. Crop ke power of 2 dan samakan ukuran
  [hostMat, wmMat] = cropToPowerOf2(hostMat, wmMat);
  const size = hostMat.length;
  if (size < Math.pow(2, dwtLevel)) {
    throw new Error(`Ukuran gambar terlalu kecil untuk DWT level ${dwtLevel}. Minimal: ${Math.pow(2, dwtLevel)}x${Math.pow(2, dwtLevel)}`);
  }
  // 3. DWT multi-level host
  const { LL, coeffs } = dwtMultiLevel(hostMat, dwtLevel);
  // 4. Resize watermark ke ukuran LL band
  const llSize = LL.length;
  const wmResized = resizeMatrix(wmMat, llSize);
  // 5. SVD pada LL host & watermark
  const { U: U_host, S: S_host, V: V_host } = performSVD(LL);
  // Watermark flatten dan normalisasi ke [0,1]
  const wmFlat = wmResized.flat().map(v => v / 255);
  // Interpolasi watermark ke panjang S
  const sLength = S_host.length;
  const wmSVLike = Array(sLength).fill(0).map((_, i) => {
    const idx = i * (wmFlat.length - 1) / (sLength - 1);
    const idx0 = Math.floor(idx), idx1 = Math.min(Math.ceil(idx), wmFlat.length - 1);
    const w = idx - idx0;
    return (1 - w) * wmFlat[idx0] + w * wmFlat[idx1];
  });
  // 6. Modifikasi singular value
  const maxS = Math.max(...S_host);
  const S_embed = S_host.map((s, i) => s + alpha * wmSVLike[i] * maxS * embeddingFactor);
  // 7. Rekonstruksi LL'
  const LL_embed = multiplyMatrices(multiplyMatrices(U_host, diag(S_embed)), transpose(V_host));
  // 8. IDWT multi-level
  let watermarkedMat = idwtMultiLevel(LL_embed, coeffs);
  // 9. Normalisasi hasil
  watermarkedMat = normalizeMatrix(watermarkedMat);
  // 10. Konversi ke ImageData
  return matrixToImageData(watermarkedMat, hostImage);
}

/**
 * Ekstrak watermark dari gambar watermarked (multi-level, referensi Python)
 * @param watermarkedImage ImageData hasil watermarked
 * @param originalImage ImageData gambar asli
 * @param alpha Kekuatan watermark (sama dengan embed)
 * @param dwtLevel Level DWT (default 2)
 * @param embeddingFactor Faktor embedding (default 0.1)
 * @returns ImageData hasil ekstraksi watermark
 */
export function extractWatermark(
  watermarkedImage: ImageData,
  originalImage: ImageData,
  alpha: number,
  dwtLevel = 2,
  embeddingFactor = 0.1
): ImageData {
  // 1. Konversi ke matrix grayscale
  let wmMat = imageDataToMatrix(watermarkedImage);
  let origMat = imageDataToMatrix(originalImage);
  // 2. Crop ke power of 2 dan samakan ukuran
  [wmMat, origMat] = cropToPowerOf2(wmMat, origMat);
  const size = wmMat.length;
  if (size < Math.pow(2, dwtLevel)) {
    throw new Error(`Ukuran gambar terlalu kecil untuk DWT level ${dwtLevel}. Minimal: ${Math.pow(2, dwtLevel)}x${Math.pow(2, dwtLevel)}`);
  }
  // 3. DWT multi-level kedua gambar
  const { LL: LL_wm } = dwtMultiLevel(wmMat, dwtLevel);
  const { LL: LL_orig } = dwtMultiLevel(origMat, dwtLevel);
  // 4. SVD pada LL watermarked & original
  const { S: S_wm } = performSVD(LL_wm);
  const { S: S_orig } = performSVD(LL_orig);
  // 5. Ekstrak watermark dari singular value
  const maxS = Math.max(...S_orig);
  const wmExtract = S_wm.map((s, i) => (s - S_orig[i]) / (alpha * maxS * embeddingFactor));
  // 6. Reshape ke matrix persegi
  const imgSide = Math.floor(Math.sqrt(wmExtract.length));
  let wmExtractMat: number[][] = [];
  for (let y = 0; y < imgSide; y++) {
    wmExtractMat.push(wmExtract.slice(y * imgSide, (y + 1) * imgSide));
  }
  // 7. Normalisasi hasil ekstraksi
  wmExtractMat = normalizeMatrix(wmExtractMat);
  // 8. Konversi ke ImageData
  return matrixToImageData(wmExtractMat, watermarkedImage);
}

// Helper: matrix multiplication
function multiplyMatrices(a: number[][], b: number[][]): number[][] {
  const result = Array(a.length).fill(0).map(() => Array(b[0].length).fill(0));
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b[0].length; j++) {
      for (let k = 0; k < b.length; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}
// Helper: diagonal matrix from array
function diag(arr: number[]): number[][] {
  return arr.map((v, i) => arr.map((_, j) => (i === j ? v : 0)));
}
// Helper: transpose
function transpose(mat: number[][]): number[][] {
  return mat[0].map((_, i) => mat.map(row => row[i]));
}

// PSNR: Peak Signal-to-Noise Ratio
export function psnr(a: ImageData, b: ImageData): number {
  if (a.width !== b.width || a.height !== b.height) throw new Error('Ukuran gambar tidak sama untuk PSNR');
  let mse = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    const diff = a.data[i] - b.data[i]; // Grayscale, cukup channel R
    mse += diff * diff;
  }
  mse /= (a.width * a.height);
  if (mse === 0) return Infinity;
  return 10 * Math.log10(255 * 255 / mse);
}
// SSIM: Structural Similarity Index (windowless, sederhana)
export function ssim(a: ImageData, b: ImageData): number {
  if (a.width !== b.width || a.height !== b.height) throw new Error('Ukuran gambar tidak sama untuk SSIM');
  let muA = 0, muB = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    muA += a.data[i];
    muB += b.data[i];
  }
  muA /= (a.width * a.height);
  muB /= (b.width * b.height);
  let sigmaA = 0, sigmaB = 0, sigmaAB = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    const da = a.data[i] - muA;
    const db = b.data[i] - muB;
    sigmaA += da * da;
    sigmaB += db * db;
    sigmaAB += da * db;
  }
  sigmaA /= (a.width * a.height);
  sigmaB /= (a.width * a.height);
  sigmaAB /= (a.width * a.height);
  const C1 = 6.5025, C2 = 58.5225;
  return ((2 * muA * muB + C1) * (2 * sigmaAB + C2)) /
         ((muA * muA + muB * muB + C1) * (sigmaA + sigmaB + C2));
}

// NC: Normalized Correlation antara dua ImageData grayscale
export function nc(a: ImageData, b: ImageData): number {
  if (a.width !== b.width || a.height !== b.height) throw new Error('Ukuran gambar tidak sama untuk NC');
  let num = 0, denA = 0, denB = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    const va = a.data[i];
    const vb = b.data[i];
    num += va * vb;
    denA += va * va;
    denB += vb * vb;
  }
  if (denA === 0 || denB === 0) return 0;
  return num / Math.sqrt(denA * denB);
}

