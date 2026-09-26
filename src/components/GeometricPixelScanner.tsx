import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Cpu, Search, Sparkles } from 'lucide-react';

interface GeometricPixelScannerProps {
  imageSrc: string;
  onAnimationComplete: () => void;
  isBackendReady: boolean;
}

interface ScanStep {
  title: string;
  detail: string;
  threshold: number; // progress 0 - 100
}

const SCAN_STEPS: ScanStep[] = [
  { title: 'Initializing visual scan…', detail: 'Calibrating sensory matrices & color space', threshold: 12 },
  { title: 'Examining image quality & artifacts…', detail: 'Evaluating blur, exposure, contrast & resolution', threshold: 28 },
  { title: 'Mapping visual features & geometry…', detail: 'Synthesizing aligned structural block grid', threshold: 48 },
  { title: 'Identifying visible entities…', detail: 'Extracting subject contours, textures & patterns', threshold: 68 },
  { title: 'Checking ambiguity & uncertainty bounds…', detail: 'Validating evidence against safety threshold', threshold: 88 },
  { title: 'Generating visual report…', detail: 'Consolidating diagnostic intelligence', threshold: 100 },
];

export const GeometricPixelScanner: React.FC<GeometricPixelScannerProps> = ({
  imageSrc,
  onAnimationComplete,
  isBackendReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [laserY, setLaserY] = useState(0);

  // Grid dimensions for geometrically aligned uniform square blocks
  const COLS = 28;
  const ROWS = 20;

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 2800; // 2.8 seconds total smooth scan sequence

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    // Buffer canvas for color extraction
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

    let sampledColors: string[][] = [];

    img.onload = () => {
      offscreen.width = COLS;
      offscreen.height = ROWS;
      if (offCtx) {
        offCtx.drawImage(img, 0, 0, COLS, ROWS);
        const imgData = offCtx.getImageData(0, 0, COLS, ROWS).data;

        sampledColors = [];
        for (let r = 0; r < ROWS; r++) {
          const rowColors: string[] = [];
          for (let c = 0; c < COLS; c++) {
            const idx = (r * COLS + c) * 4;
            const red = imgData[idx];
            const green = imgData[idx + 1];
            const blue = imgData[idx + 2];
            rowColors.push(`rgb(${red}, ${green}, ${blue})`);
          }
          sampledColors.push(rowColors);
        }
      }
    };

    const render = (now: number) => {
      const elapsed = now - startTime;
      let rawProgress = Math.min(100, (elapsed / duration) * 100);

      // If backend is still computing, ease the tail end so it doesn't abruptly finish early
      if (!isBackendReady && rawProgress > 92) {
        rawProgress = 92;
      }

      setProgress(rawProgress);

      // Update current step index
      for (let i = 0; i < SCAN_STEPS.length; i++) {
        if (rawProgress <= SCAN_STEPS[i].threshold) {
          setCurrentStepIndex(i);
          break;
        }
      }

      // Draw canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;

          ctx.clearRect(0, 0, width, height);

          // Phase transition math:
          // 0 - 20%: Image visible, grid appears
          // 20 - 75%: Image dissolves into uniform geometric pixel blocks
          // 75 - 100%: Pixel blocks decode and image reconstructs
          let pixelGridOpacity = 0;
          if (rawProgress < 20) {
            pixelGridOpacity = rawProgress / 20;
          } else if (rawProgress <= 75) {
            pixelGridOpacity = 1;
          } else {
            pixelGridOpacity = Math.max(0, 1 - (rawProgress - 75) / 25);
          }

          const imageOpacity = 1 - pixelGridOpacity * 0.85;

          // 1. Draw base image
          if (img.complete && img.naturalWidth > 0) {
            ctx.save();
            ctx.globalAlpha = imageOpacity;
            ctx.drawImage(img, 0, 0, width, height);
            ctx.restore();
          }

          // 2. Draw perfectly aligned square pixel blocks
          if (sampledColors.length === ROWS && pixelGridOpacity > 0.05) {
            const blockW = width / COLS;
            const blockH = height / ROWS;
            const gap = 1.5; // Perfectly uniform 1.5px spacing

            const currentScanRow = (rawProgress / 100) * ROWS;

            for (let r = 0; r < ROWS; r++) {
              const rowDistToScan = Math.abs(r - currentScanRow);
              const isNearScanline = rowDistToScan < 2.5;

              for (let c = 0; c < COLS; c++) {
                const bx = c * blockW;
                const by = r * blockH;
                const bw = blockW - gap;
                const bh = blockH - gap;

                ctx.save();
                ctx.globalAlpha = pixelGridOpacity * 0.92;

                // Base pixel color from sampled source image
                ctx.fillStyle = sampledColors[r][c];
                ctx.fillRect(bx, by, bw, bh);

                // Geometric sunset highlight near the active scanline
                if (isNearScanline) {
                  ctx.fillStyle = 'rgba(251, 146, 60, 0.45)'; // sunset orange glow
                  ctx.fillRect(bx, by, bw, bh);

                  // Hairline geometric border on active blocks
                  ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)'; // amber-gold
                  ctx.lineWidth = 1;
                  ctx.strokeRect(bx, by, bw, bh);
                } else {
                  // Subtle dark hairline grid delimiter
                  ctx.strokeStyle = 'rgba(7, 6, 14, 0.4)';
                  ctx.lineWidth = 1;
                  ctx.strokeRect(bx, by, bw, bh);
                }

                ctx.restore();
              }
            }
          }

          // 3. Draw horizontal laser scanline with sunset gradient
          const scanY = (rawProgress / 100) * height;
          setLaserY(scanY);

          ctx.save();
          // Glow band
          const glowGrad = ctx.createLinearGradient(0, scanY - 14, 0, scanY + 14);
          glowGrad.addColorStop(0, 'rgba(244, 63, 94, 0)');
          glowGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.35)');
          glowGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
          ctx.fillStyle = glowGrad;
          ctx.fillRect(0, scanY - 14, width, 28);

          // Crisp laser line
          const lineGrad = ctx.createLinearGradient(0, 0, width, 0);
          lineGrad.addColorStop(0, 'rgba(244, 63, 94, 0.8)'); // rose
          lineGrad.addColorStop(0.3, 'rgba(249, 115, 22, 1)'); // orange
          lineGrad.addColorStop(0.7, 'rgba(251, 191, 36, 1)'); // gold
          lineGrad.addColorStop(1, 'rgba(192, 38, 211, 0.8)'); // magenta
          ctx.strokeStyle = lineGrad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, scanY);
          ctx.lineTo(width, scanY);
          ctx.stroke();
          ctx.restore();

          // 4. Subtle corner HUD brackets for scientific laboratory feel
          const bracketSize = 16;
          ctx.strokeStyle = 'rgba(251, 146, 60, 0.8)';
          ctx.lineWidth = 2;

          // Top-Left
          ctx.beginPath();
          ctx.moveTo(10, 10 + bracketSize);
          ctx.lineTo(10, 10);
          ctx.lineTo(10 + bracketSize, 10);
          ctx.stroke();

          // Top-Right
          ctx.beginPath();
          ctx.moveTo(width - 10 - bracketSize, 10);
          ctx.lineTo(width - 10, 10);
          ctx.lineTo(width - 10, 10 + bracketSize);
          ctx.stroke();

          // Bottom-Left
          ctx.beginPath();
          ctx.moveTo(10, height - 10 - bracketSize);
          ctx.lineTo(10, height - 10);
          ctx.lineTo(10 + bracketSize, height - 10);
          ctx.stroke();

          // Bottom-Right
          ctx.beginPath();
          ctx.moveTo(width - 10 - bracketSize, height - 10);
          ctx.lineTo(width - 10, height - 10);
          ctx.lineTo(width - 10, height - 10 - bracketSize);
          ctx.stroke();
        }
      }

      if (rawProgress >= 100 && isBackendReady) {
        onAnimationComplete();
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [imageSrc, isBackendReady, onAnimationComplete]);

  // Keep canvas resolution synced to container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width;
        canvasRef.current.height = rect.height;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeStep = SCAN_STEPS[currentStepIndex] || SCAN_STEPS[0];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Central scanning viewport */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] max-h-[520px] rounded-2xl overflow-hidden glass-panel-glow shadow-2xl border border-rose-500/30"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Ambient sunset gradient overlays */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#07060e]/80 via-transparent to-[#07060e]/40" />

        {/* HUD coordinate telemetry (quiet, tasteful) */}
        <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-mono text-amber-300/80 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/20">
          <Cpu className="w-3.5 h-3.5 text-rose-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>GRID: 28×20 ALIGNED</span>
          <span className="text-slate-500">/</span>
          <span>Y: {Math.round(laserY)}px</span>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-mono text-rose-300/80 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-rose-500/20">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>UNCERTAINTY SAFETY: ACTIVE</span>
        </div>

        {/* Active Scan Stage Floating Pill-free Card */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0e0a1f]/85 backdrop-blur-xl border border-rose-500/25">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Search className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>{activeStep.title}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">{activeStep.detail}</p>
            </div>
          </div>

          <div className="w-full sm:w-48 flex flex-col items-end gap-1.5">
            <div className="flex items-center justify-between w-full text-xs font-mono text-slate-300">
              <span className="text-slate-400">SCAN STATUS</span>
              <span className="text-amber-400 font-semibold">{Math.round(progress)}%</span>
            </div>
            {/* Sunset progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-violet-600 via-rose-500 to-amber-400 transition-all duration-100 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sequence Roadmap Checklist */}
      <div className="w-full grid grid-cols-2 md:grid-cols-6 gap-2 mt-4 text-center">
        {SCAN_STEPS.map((step, idx) => {
          const isDone = progress > step.threshold;
          const isCurrent = currentStepIndex === idx;

          return (
            <div
              key={step.title}
              className={`p-2.5 rounded-lg border text-left transition-all duration-200 ${
                isCurrent
                  ? 'bg-rose-500/10 border-rose-500/40 text-slate-100'
                  : isDone
                  ? 'bg-slate-900/40 border-emerald-500/20 text-slate-400'
                  : 'bg-slate-900/20 border-white/5 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isCurrent
                      ? 'bg-amber-400 animate-ping'
                      : isDone
                      ? 'bg-emerald-400'
                      : 'bg-slate-700'
                  }`}
                />
                <span>0{idx + 1}</span>
              </div>
              <p className="text-xs font-medium truncate mt-1">{step.title.replace('…', '')}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
