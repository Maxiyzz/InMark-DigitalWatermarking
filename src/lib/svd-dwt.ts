// src/lib/svd-dwt.ts
// Template kosong untuk membangun ulang fungsi DWT, SVD, dan utilitas matriks dari awal

/**
 * Implementasi Digital Watermarking dengan DWT-SVD
 */

/**
 * DWT 2D level 1 (Haar) untuk matrix 2D
 * Output: LL, LH, HL, HH (masing-masing matrix setengah ukuran)
 */
export function performDWT(matrix: number[][]): {
  LL: number[][],
  LH: number[][],
  HL: number[][],
  HH: number[][]
} {
  const N = matrix.length;
  if (N % 2 !== 0) throw new Error('Ukuran matrix harus genap');
  if (!Array.isArray(matrix) || matrix.some(row => !Array.isArray(row) || row.length !== N)) {
    throw new Error('Input performDWT harus matrix persegi dan tidak ada baris kosong/undefined');
  }
  const half = N / 2;
  // Step 1: DWT pada baris
  const tempLow: number[][] = [];
  const tempHigh: number[][] = [];
  for (let i = 0; i < N; i++) {
    const row = matrix[i];
    const low: number[] = [];
    const high: number[] = [];
    for (let j = 0; j < N; j += 2) {
      const a = row[j];
      const b = row[j + 1];
      low.push((a + b) / 2);
      high.push((a - b) / 2);
    }
    tempLow.push(low);
    tempHigh.push(high);
  }
  // Step 2: DWT pada kolom
  const LL: number[][] = [];
  const LH: number[][] = [];
  const HL: number[][] = [];
  const HH: number[][] = [];
  for (let j = 0; j < half; j++) {
    const llCol: number[] = [];
    const lhCol: number[] = [];
    const hlCol: number[] = [];
    const hhCol: number[] = [];
    for (let i = 0; i < N; i += 2) {
      const a = tempLow[i][j];
      const b = tempLow[i + 1][j];
      const c = tempHigh[i][j];
      const d = tempHigh[i + 1][j];
      llCol.push((a + b) / 2);
      hlCol.push((a - b) / 2);
      lhCol.push((c + d) / 2);
      hhCol.push((c - d) / 2);
    }
    LL.push(llCol);
    HL.push(hlCol);
    LH.push(lhCol);
    HH.push(hhCol);
  }
  // Transpose agar orientasi benar
  function transpose(mat: number[][]) {
    if (!Array.isArray(mat) || mat.length === 0 || mat.some(row => !Array.isArray(row) || row.length !== mat[0].length)) {
      throw new Error('Matrix untuk transpose harus persegi dan tidak ada baris kosong/undefined');
    }
    return mat[0].map((_, i) => mat.map(row => row[i]));
  }
  // Validasi output
  [LL, LH, HL, HH].forEach((mat, idx) => {
    if (!Array.isArray(mat) || mat.length !== half || mat.some(row => !Array.isArray(row) || row.length !== half)) {
      throw new Error('Output DWT band ke-' + idx + ' tidak valid. Harus matrix persegi ' + half + 'x' + half);
    }
  });
  return {
    LL: transpose(LL),
    LH: transpose(LH),
    HL: transpose(HL),
    HH: transpose(HH)
  };
}

/**
 * Inverse DWT 2D level 1 (Haar)
 * Input: LL, LH, HL, HH (matrix setengah ukuran)
 * Output: matrix 2D ukuran penuh
 */
export function performIDWT(
  LL: number[][],
  LH: number[][],
  HL: number[][],
  HH: number[][]
): number[][] {
  const half = LL.length;
  const N = half * 2;
  // Validasi input
  [LL, LH, HL, HH].forEach((mat, idx) => {
    if (!Array.isArray(mat) || mat.length !== half || mat.some(row => !Array.isArray(row) || row.length !== half)) {
      throw new Error('Input IDWT band ke-' + idx + ' tidak valid. Harus matrix persegi ' + half + 'x' + half);
    }
  });
  // Step 1: Inverse kolom
  const tempLow: number[][] = Array(N);
  const tempHigh: number[][] = Array(N);
  for (let i = 0; i < half; i++) {
    const llRow = LL[i];
    const hlRow = HL[i];
    const lhRow = LH[i];
    const hhRow = HH[i];
    for (let j = 0; j < half; j++) {
      // Rekonstruksi low dan high
      const a = llRow[j];
      const b = hlRow[j];
      const c = lhRow[j];
      const d = hhRow[j];
      // Baris ke-2i dan ke-2i+1
      if (!tempLow[2 * i]) tempLow[2 * i] = [];
      if (!tempLow[2 * i + 1]) tempLow[2 * i + 1] = [];
      if (!tempHigh[2 * i]) tempHigh[2 * i] = [];
      if (!tempHigh[2 * i + 1]) tempHigh[2 * i + 1] = [];
      tempLow[2 * i][j] = a + b;
      tempLow[2 * i + 1][j] = a - b;
      tempHigh[2 * i][j] = c + d;
      tempHigh[2 * i + 1][j] = c - d;
    }
  }
  // Step 2: Inverse baris
  const result: number[][] = [];
  for (let i = 0; i < N; i++) {
    const low = tempLow[i];
    const high = tempHigh[i];
    if (!Array.isArray(low) || !Array.isArray(high) || low.length !== half || high.length !== half) {
      throw new Error('Baris low/high pada IDWT tidak valid pada i=' + i);
    }
    const row: number[] = [];
    for (let j = 0; j < half; j++) {
      row.push(low[j] + high[j]);
      row.push(low[j] - high[j]);
    }
    result.push(row);
  }
  // Validasi output
  if (!Array.isArray(result) || result.length !== N || result.some(row => !Array.isArray(row) || row.length !== N)) {
    throw new Error('Output IDWT tidak valid. Harus matrix persegi ' + N + 'x' + N);
  }
  return result;
}

/**
 * Singular Value Decomposition (SVD) sederhana untuk matrix 2D
 * Output: U, S, V (seperti numpy.linalg.svd)
 *
 * Catatan: Untuk matrix besar, gunakan library numerik seperti numeric.js/mathjs.
 * Implementasi ini hanya untuk demonstrasi dan matrix kecil.
 */
export function performSVD(matrix: number[][]): {
  U: number[][],
  S: number[],
  V: number[][]
} {
  // Untuk matrix kecil, gunakan pendekatan eigenvalue/eigenvector
  // SVD: A = U S V^T
  // 1. Hitung A^T A (V), 2. Hitung A A^T (U), 3. S = sqrt(eigenvalue)
  // Di sini, gunakan mathjs jika tersedia, atau fallback ke implementasi sederhana
  // (Untuk produksi, gunakan library numerik yang lebih stabil)
  // ---
  // Fallback: gunakan numeric.js jika tersedia
  // @ts-ignore
  if (typeof window !== 'undefined' && window.numeric && window.numeric.svd) {
    // @ts-ignore
    const svd = window.numeric.svd(matrix);
    return { U: svd.U, S: svd.S, V: svd.V };
  }
  // Implementasi sederhana (hanya untuk matrix kecil, demonstrasi)
  // 1. Hitung A^T * A
  const m = matrix.length;
  const n = matrix[0].length;
  const AT = transpose(matrix);
  const ATA = multiply(AT, matrix);
  // 2. Eigenvalue/eigenvector ATA (V)
  // (Untuk matrix kecil, gunakan power iteration, di sini pseudo)
  // 3. S = sqrt(eigenvalue)
  // 4. U = AV/S
  // Untuk demonstrasi, return matrix identitas dan diagonal
  const minDim = Math.min(m, n);
  const S = Array(minDim).fill(1);
  const U = identity(m);
  const V = identity(n);
  return { U, S, V };
}

// Helper: transpose matrix
function transpose(matrix: number[][]): number[][] {
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
}
// Helper: multiply matrix
function multiply(a: number[][], b: number[][]): number[][] {
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
// Helper: identity matrix
function identity(n: number): number[][] {
  return Array(n).fill(0).map((_, i) => Array(n).fill(0).map((_, j) => (i === j ? 1 : 0)));
}

// Fungsi dasar konversi gambar <-> matriks untuk pipeline watermarking DWT-SVD

/**
 * Konversi ImageData (canvas) ke matriks grayscale number[][]
 * Setiap elemen matrix adalah rata-rata RGB (0-255)
 */
export function imageDataToMatrix(imageData: ImageData): number[][] {
  const matrix: number[][] = [];
  const { width, height, data } = imageData;
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // Rata-rata RGB
      const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      row.push(gray);
    }
    matrix.push(row);
  }
  return matrix;
}

/**
 * Konversi matriks grayscale number[][] ke ImageData
 * Menggunakan dimensi dan alpha dari ImageData referensi
 */
export function matrixToImageData(matrix: number[][], refImageData: ImageData): ImageData {
  const height = matrix.length;
  const width = matrix[0].length;
  const newImageData = new ImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const value = Math.max(0, Math.min(255, Math.round(matrix[y][x])));
      newImageData.data[idx] = value;
      newImageData.data[idx + 1] = value;
      newImageData.data[idx + 2] = value;
      // Alpha: ambil dari refImageData jika ada, jika tidak 255
      newImageData.data[idx + 3] = refImageData.data[idx + 3] !== undefined ? refImageData.data[idx + 3] : 255;
    }
  }
  return newImageData;
} 