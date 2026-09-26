import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Zap,
  ArrowRight,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { ClientQualityMetrics, applySimulationFilters } from '../utils/imageUtils';
import { DEMO_PRESETS } from '../data/demoPresets';

interface HeroScannerProps {
  onScanRequest: (imageBase64: string, mimeType: string, forced?: boolean) => void;
  isLoading: boolean;
  onSelectPreset: (presetId: string) => void;
  clientMetrics: ClientQualityMetrics | null;
  uploadedPreview: string | null;
  setUploadedPreview: (url: string | null) => void;
  fileName: string | null;
  setFileName: (name: string | null) => void;
}

export const HeroScanner: React.FC<HeroScannerProps> = ({
  onScanRequest,
  isLoading,
  onSelectPreset,
  clientMetrics,
  uploadedPreview,
  setUploadedPreview,
  fileName,
  setFileName,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showStressLab, setShowStressLab] = useState(false);
  const [simBlur, setSimBlur] = useState(0); // 0 to 20px
  const [simBrightness, setSimBrightness] = useState(100); // 20 to 180%
  const [simCrop, setSimCrop] = useState(0); // 0 to 80%
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hiddenImgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image format (JPEG, PNG, WEBP, or GIF).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedPreview(reader.result);
        setFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleScanClick = async () => {
    if (!uploadedPreview) return;

    // If stress lab filters are active, render filtered image to canvas before scanning
    if ((simBlur > 0 || simBrightness !== 100 || simCrop > 0) && hiddenImgRef.current) {
      const filtered = await applySimulationFilters(hiddenImgRef.current, {
        blur: simBlur,
        brightness: simBrightness,
        crop: simCrop,
      });
      onScanRequest(filtered, 'image/jpeg');
    } else {
      onScanRequest(uploadedPreview, 'image/jpeg');
    }
  };

  const resetFilters = () => {
    setSimBlur(0);
    setSimBrightness(100);
    setSimCrop(0);
  };

  const hasDegradation = simBlur > 5 || simBrightness < 50 || simCrop > 40;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Hidden image element for canvas manipulation */}
      {uploadedPreview && (
        <img
          ref={hiddenImgRef}
          src={uploadedPreview}
          alt="Hidden source"
          className="hidden"
          crossOrigin="anonymous"
        />
      )}

      {/* Hero Header with Sunset Horizon Motif */}
      <div className="text-center space-y-3 pt-6 pb-2 relative">
        {/* Soft radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-gradient-to-r from-rose-500/15 via-amber-500/10 to-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>GENERAL-PURPOSE MULTIMODAL INTELLIGENCE</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-3xl mx-auto leading-[1.1]">
          See beyond{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-purple-400">
            the image.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Upload any photograph or scene. AURA VISION reasons through physical evidence,
          attributes, and multi-entity context — with strict uncertainty safety that refuses to invent classifications.
        </p>
      </div>

      {/* Main Upload & Inspection Panel */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl relative overflow-hidden">
        {/* Ambient sunset horizon line on top edge */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-rose-500 to-amber-400" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Center Upload Area (7 cols if preview, else 12 cols) */}
          <div className={`${uploadedPreview ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            {!uploadedPreview ? (
              /* Empty Dropzone State */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
                  isDragOver
                    ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                    : 'border-rose-500/30 hover:border-rose-400 bg-slate-900/30 hover:bg-slate-900/50'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 via-amber-500/15 to-purple-500/20 border border-rose-500/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-8 h-8 text-amber-300" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white">
                    Drop your image here, or{' '}
                    <span className="text-amber-400 underline underline-offset-4">browse files</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Supports JPEG, PNG, WebP, GIF · Evaluates humans, animals, objects, scenes, or abstract items
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Uncertainty Safety Active</span>
                  </span>
                  <span>·</span>
                  <span>Multi-Stage Reasoning</span>
                  <span>·</span>
                  <span>High-Fidelity Pixel Decoding</span>
                </div>
              </div>
            ) : (
              /* Loaded Preview State */
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/70 border border-rose-500/30 shadow-xl group">
                  <img
                    src={uploadedPreview}
                    alt="Uploaded preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain transition-all duration-200"
                    style={{
                      filter: `blur(${simBlur}px) brightness(${simBrightness}%)`,
                      transform: simCrop > 0 ? `scale(${1 + simCrop / 100})` : 'none',
                    }}
                  />

                  {/* Gradient bottom bar */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090812]/90 via-transparent to-transparent opacity-70 pointer-events-none" />

                  {/* Metadata Header Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-300">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span className="max-w-[160px] truncate">{fileName || 'Uploaded Image'}</span>
                    </div>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-xs font-medium text-slate-200 hover:text-white transition-colors"
                    >
                      Change Image
                    </button>
                  </div>

                  {/* Pre-flight Quality Diagnostic Badge */}
                  {clientMetrics && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-mono text-slate-200 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15">
                      <span className="text-slate-400">Pre-Flight:</span>
                      <span
                        className={
                          clientMetrics.estimatedQuality === 'Poor' ||
                          clientMetrics.estimatedQuality === 'Insufficient'
                            ? 'text-rose-400 font-semibold'
                            : 'text-amber-400 font-semibold'
                        }
                      >
                        {clientMetrics.estimatedQuality}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400">
                        {clientMetrics.width}×{clientMetrics.height}
                      </span>
                    </div>
                  )}

                  {/* Active Simulation Badge */}
                  {hasDegradation && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs font-mono text-rose-300 bg-rose-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-rose-500/40">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Degradation Active</span>
                    </div>
                  )}
                </div>

                {/* Pre-flight warning note if detected */}
                {clientMetrics?.warningMessage && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{clientMetrics.warningMessage}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Execution CTA & Uncertainty Stress Lab (When image loaded) */}
          {uploadedPreview && (
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="text-xs font-mono text-rose-400 uppercase tracking-wider font-semibold">
                  Multi-Stage Intelligence Pipeline
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  Ready to scan image
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Upon initiation, AURA VISION performs geometric pixel decomposition, multi-entity
                  detection, and strict uncertainty safety validation.
                </p>
              </div>

              {/* Primary Signature Scan Button */}
              <button
                disabled={isLoading}
                onClick={handleScanClick}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 active:scale-[0.99] text-white font-bold font-display text-base tracking-wide shadow-xl shadow-rose-500/25 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                <Zap className="w-5 h-5 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
                <span>SCAN IMAGE</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Stress-Test Simulator Drawer (Proves Uncertainty Safety) */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-200">
                      Uncertainty Stress Simulator
                    </span>
                  </div>
                  <button
                    onClick={() => setShowStressLab(!showStressLab)}
                    className="text-[11px] font-mono text-rose-400 hover:underline"
                  >
                    {showStressLab ? 'Hide Lab' : 'Test Ambiguity'}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">
                  Intentionally degrade this image to test if AURA VISION correctly identifies low
                  quality and triggers safety without forcing false guesses.
                </p>

                {showStressLab && (
                  <div className="pt-2 space-y-3 border-t border-white/5 animate-in fade-in duration-200">
                    {/* Blur Slider */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                        <span>Motion / Lens Blur</span>
                        <span>{simBlur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="16"
                        step="1"
                        value={simBlur}
                        onChange={(e) => setSimBlur(parseInt(e.target.value, 10))}
                        className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Brightness / Darkness Slider */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                        <span>Illumination / Underexposure</span>
                        <span>{simBrightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="150"
                        step="5"
                        value={simBrightness}
                        onChange={(e) => setSimBrightness(parseInt(e.target.value, 10))}
                        className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Heavy Crop Slider */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                        <span>Extreme Obstruction / Crop</span>
                        <span>{simCrop}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        step="5"
                        value={simCrop}
                        onChange={(e) => setSimCrop(parseInt(e.target.value, 10))}
                        className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Reset Lab Button */}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={resetFilters}
                        className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reset Filters</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preset Demo Quick Selector */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Explore General-Purpose Demo Samples
          </div>
          <span className="text-xs text-slate-500">Click to instantly load</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className="group p-3 rounded-2xl glass-panel hover:glass-panel-glow border border-white/5 hover:border-rose-500/30 text-left transition-all flex flex-col gap-2.5 cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-white/5 relative">
                <img
                  src={preset.imageSrc}
                  alt={preset.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 backdrop-blur-md text-slate-200">
                  {preset.category}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {preset.difficultyNote || preset.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
