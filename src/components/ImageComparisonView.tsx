import React, { useState, useRef } from 'react';
import { Sliders, Grid3X3, Layers, Scan } from 'lucide-react';
import { AnalysisResponseData } from '../types/vision';

interface ImageComparisonViewProps {
  imageSrc: string;
  result: AnalysisResponseData;
}

export const ImageComparisonView: React.FC<ImageComparisonViewProps> = ({
  imageSrc,
  result,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [showGridOverlay, setShowGridOverlay] = useState(true);
  const [isSideBySide, setIsSideBySide] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || isSideBySide) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-white/10">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h4 className="text-sm font-semibold font-display text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Visual Inspection & Comparison</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare source photography with diagnostic visual intelligence layer
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Grid toggle */}
          <button
            onClick={() => setShowGridOverlay(!showGridOverlay)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              showGridOverlay
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Diagnostic Grid</span>
          </button>

          {/* Mode switch */}
          <button
            onClick={() => setIsSideBySide(!isSideBySide)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              isSideBySide
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isSideBySide ? 'Split Slider' : 'Side-by-Side'}</span>
          </button>
        </div>
      </div>

      {/* Comparison Viewport */}
      {isSideBySide ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Original */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>01. ORIGINAL SOURCE</span>
              <span className="text-slate-500">Unfiltered Input</span>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-white/10">
              <img
                src={imageSrc}
                alt="Original unedited input"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Analyzed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>02. DIAGNOSTIC LAYER</span>
              <span className="text-amber-400 font-semibold">{result.confidenceLevel}</span>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-rose-500/30">
              <img
                src={imageSrc}
                alt="Analyzed target visual layer"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              {showGridOverlay && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(244,63,94,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,63,94,0.3) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
              )}
              {/* HUD Target Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
                <div className="border border-amber-400/50 rounded-xl p-3 bg-black/40 backdrop-blur-sm max-w-xs text-center shadow-lg">
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                    Primary Entity Identified
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {result.primaryIdentification}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Split Slider */
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>DRAG SLIDER TO REVEAL</span>
            <span className="text-slate-400">
              LEFT: SOURCE · RIGHT: DIAGNOSTIC REASONING
            </span>
          </div>

          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            className="relative aspect-[4/3] max-h-[460px] w-full rounded-xl overflow-hidden bg-black/80 border border-rose-500/30 cursor-ew-resize select-none touch-none"
          >
            {/* Background: Analyzed Layer */}
            <div className="absolute inset-0">
              <img
                src={imageSrc}
                alt="Analyzed visual layer"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />

              {showGridOverlay && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(249,115,22,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(249,115,22,0.35) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
              )}

              {/* Analyzed Tag */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-[11px] font-mono text-rose-200">
                <Scan className="w-3.5 h-3.5 text-amber-400" />
                <span>DIAGNOSTIC VISION</span>
              </div>
            </div>

            {/* Foreground: Original Layer (Clipped by slider position) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <div
                className="relative w-full h-full"
                style={{ width: containerRef.current?.clientWidth || '100%' }}
              >
                <img
                  src={imageSrc}
                  alt="Original image"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Original Tag */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-mono text-slate-300">
                <span>ORIGINAL INPUT</span>
              </div>
            </div>

            {/* Slider Dividing Line */}
            <div
              className="absolute top-0 bottom-0 z-20 w-0.5 bg-gradient-to-b from-amber-400 via-rose-500 to-purple-600 shadow-xl"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 border-2 border-white flex items-center justify-center shadow-lg text-white">
                <Sliders className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
