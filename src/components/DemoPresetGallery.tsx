import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { DEMO_PRESETS } from '../data/demoPresets';

interface DemoPresetGalleryProps {
  onSelectAndScan: (presetId: string) => void;
}

export const DemoPresetGallery: React.FC<DemoPresetGalleryProps> = ({ onSelectAndScan }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>GENERAL-PURPOSE VISUAL VERIFICATION</span>
        </div>
        <h2 className="text-3xl font-extrabold font-display text-white">
          Evaluation Benchmark Suite
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          AURA VISION is engineered for open-domain visual intelligence. It does not force images into a
          narrow taxonomy of generic tags. Test diverse subjects, environments, and uncertainty bounds.
        </p>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className="rounded-2xl glass-panel hover:glass-panel-glow border border-white/5 hover:border-rose-500/30 overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="aspect-[4/3] relative overflow-hidden bg-black/70">
                <img
                  src={preset.imageSrc}
                  alt={preset.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-black/80 backdrop-blur-md text-slate-200 border border-white/10">
                  {preset.category}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-emerald-500/30">
                  <span>Target Confidence</span>
                  <span className="font-semibold">{preset.expectedConfidence}</span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {preset.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {preset.description}
                </p>
                {preset.difficultyNote && (
                  <div className="pt-2 border-t border-white/5 text-[11px] text-amber-200/90 font-mono">
                    <span className="text-slate-400">Benchmark Test: </span>
                    {preset.difficultyNote}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => onSelectAndScan(preset.id)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-800 hover:bg-gradient-to-r hover:from-rose-500 hover:to-amber-500 rounded-xl border border-white/10 hover:border-transparent transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
              >
                <span>Run Intelligent Scan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Uncertainty Safety Protocol Notice */}
      <div className="p-5 rounded-2xl glass-panel border border-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Want to test severe ambiguity or inconclusive edge-cases?
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Use the built-in Uncertainty Stress Simulator on the visual scanner tab to inject motion blur or underexposure.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-amber-400 shrink-0">
          Refuses forced guesses · Calibrated safety
        </div>
      </div>
    </div>
  );
};
