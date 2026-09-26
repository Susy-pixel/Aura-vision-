import { AnalysisRecord, AnalysisResponseData } from '../types/vision';

const HISTORY_KEY = 'aura_vision_history_v1';

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function urlToBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return fileToBase64(new File([blob], 'preset.jpg', { type: blob.type || 'image/jpeg' }));
}

export interface ClientQualityMetrics {
  width: number;
  height: number;
  brightness: number; // 0 - 255
  contrast: number; // standard deviation
  estimatedQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Insufficient';
  warningMessage: string | null;
}

export function analyzeClientImageMetrics(imgElement: HTMLImageElement): ClientQualityMetrics {
  const canvas = document.createElement('canvas');
  const w = (canvas.width = Math.min(imgElement.naturalWidth || imgElement.width || 400, 400));
  const h = (canvas.height = Math.min(imgElement.naturalHeight || imgElement.height || 300, 300));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    return {
      width: imgElement.naturalWidth,
      height: imgElement.naturalHeight,
      brightness: 128,
      contrast: 50,
      estimatedQuality: 'Good',
      warningMessage: null,
    };
  }

  ctx.drawImage(imgElement, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  let totalLuma = 0;
  const lumas: number[] = [];

  for (let i = 0; i < data.length; i += 4) {
    // Rec. 709 luminance
    const luma = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    totalLuma += luma;
    lumas.push(luma);
  }

  const avgBrightness = totalLuma / lumas.length;
  let variance = 0;
  for (let i = 0; i < lumas.length; i++) {
    const diff = lumas[i] - avgBrightness;
    variance += diff * diff;
  }
  const stdDev = Math.sqrt(variance / lumas.length);

  const realW = imgElement.naturalWidth || w;
  const realH = imgElement.naturalHeight || h;
  const isTooSmall = realW < 120 || realH < 120;
  const isExtremelyDark = avgBrightness < 25;
  const isOverexposed = avgBrightness > 235;
  const isLowContrast = stdDev < 18;

  let estimatedQuality: ClientQualityMetrics['estimatedQuality'] = 'Good';
  let warningMessage: string | null = null;

  if (isTooSmall) {
    estimatedQuality = 'Insufficient';
    warningMessage = 'Image resolution is extremely low (under 120px). Visual features may be unrecognizable.';
  } else if (isExtremelyDark) {
    estimatedQuality = 'Poor';
    warningMessage = 'Severe underexposure detected. Most structural details are drowned in dark shadows.';
  } else if (isOverexposed) {
    estimatedQuality = 'Poor';
    warningMessage = 'Severe overexposure detected. Highlights are heavily blown out.';
  } else if (isLowContrast) {
    estimatedQuality = 'Fair';
    warningMessage = 'Low dynamic contrast detected. Details may appear washed out or misty.';
  } else if (realW >= 800 && realH >= 600 && stdDev >= 35) {
    estimatedQuality = 'Excellent';
  }

  return {
    width: realW,
    height: realH,
    brightness: Math.round(avgBrightness),
    contrast: Math.round(stdDev),
    estimatedQuality,
    warningMessage,
  };
}

export function applySimulationFilters(
  sourceImg: HTMLImageElement,
  options: { blur: number; brightness: number; crop: number }
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const origW = sourceImg.naturalWidth || sourceImg.width;
    const origH = sourceImg.naturalHeight || sourceImg.height;

    // Apply crop
    const cropFraction = options.crop / 100;
    const sx = (origW * cropFraction) / 2;
    const sy = (origH * cropFraction) / 2;
    const sw = origW - origW * cropFraction;
    const sh = origH - origH * cropFraction;

    canvas.width = Math.max(Math.round(sw), 50);
    canvas.height = Math.max(Math.round(sh), 50);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(sourceImg.src);
      return;
    }

    const filterParts: string[] = [];
    if (options.blur > 0) {
      filterParts.push(`blur(${options.blur}px)`);
    }
    if (options.brightness !== 100) {
      filterParts.push(`brightness(${options.brightness}%)`);
    }

    if (filterParts.length > 0) {
      ctx.filter = filterParts.join(' ');
    }

    ctx.drawImage(sourceImg, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    resolve(canvas.toDataURL('image/jpeg', 0.9));
  });
}

export function saveAnalysisToHistory(record: Omit<AnalysisRecord, 'id' | 'timestamp'>): AnalysisRecord {
  const newRecord: AnalysisRecord = {
    ...record,
    id: 'scan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
  };

  try {
    const existing = loadAnalysisHistory();
    // Keep up to 20 recent records, with thumbnail
    const updated = [newRecord, ...existing.filter((r) => r.id !== newRecord.id)].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not persist to localStorage:', err);
  }

  return newRecord;
}

export function loadAnalysisHistory(): AnalysisRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function deleteHistoryItem(id: string): AnalysisRecord[] {
  try {
    const current = loadAnalysisHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearAnalysisHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (err) {
    console.warn('Could not clear history:', err);
  }
}
