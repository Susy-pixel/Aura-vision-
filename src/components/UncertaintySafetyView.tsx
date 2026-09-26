import React from 'react';
import { ShieldCheck, AlertTriangle, HelpCircle, CheckCircle2, XCircle, ArrowRight, EyeOff } from 'lucide-react';

interface UncertaintySafetyViewProps {
  onTestUncertainty: () => void;
}

export const UncertaintySafetyView: React.FC<UncertaintySafetyViewProps> = ({ onTestUncertainty }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
          <span>SAFETY ARCHITECTURE & EPSTEMIC HUMILITY</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
          Why AURA VISION never forces guesses
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Standard classifiers blindly return a label with a false confidence score even when handed pure noise or heavy blur.
          AURA VISION implements an uncompromising Uncertainty Safety Engine.
        </p>
      </div>

      {/* 4 Tiers of Confidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Tier 1 */}
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-emerald-400 font-semibold block uppercase">
              Tier 01
            </span>
            <h4 className="text-sm font-bold text-white">HIGH CONFIDENCE</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Observable physical evidence is abundant, unoccluded, and matches species/class diagnostic criteria unambiguously.
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
            Example: Bengal tiger with sharp visible vertical striping.
          </div>
        </div>

        {/* Tier 2 */}
        <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-amber-400 font-semibold block uppercase">
              Tier 02
            </span>
            <h4 className="text-sm font-bold text-white">MEDIUM CONFIDENCE</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Key characteristics are identifiable, but minor obstruction, distance, or lighting limits full diagnostic certainty.
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
            Example: Distant vehicle under twilight lighting.
          </div>
        </div>

        {/* Tier 3 */}
        <div className="p-5 rounded-2xl glass-panel border border-rose-500/30 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-rose-400 font-semibold block uppercase">
              Tier 03
            </span>
            <h4 className="text-sm font-bold text-white">LOW CONFIDENCE</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Significant ambiguity detected. System provides general family hypothesis while explicitly warning the user of uncertainty.
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
            Example: "Feline animal" due to heavy motion blur.
          </div>
        </div>

        {/* Tier 4 */}
        <div className="p-5 rounded-2xl glass-panel border border-purple-500/30 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-purple-300" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-purple-300 font-semibold block uppercase">
              Tier 04
            </span>
            <h4 className="text-sm font-bold text-white">INCONCLUSIVE</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Insufficient visual pixels. System deliberately aborts classification with actionable explanation instead of guessing.
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
            Example: Extreme darkness or severe corrupted blur.
          </div>
        </div>
      </div>

      {/* Comparison: Naive Classifier vs AURA VISION */}
      <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-base font-bold font-display text-white">
            Architecture Comparison: Naive vs Calibrated Intelligence
          </h3>
          <span className="text-xs font-mono text-amber-400">Production Reliability Standard</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 text-xs">
          {/* Naive System */}
          <div className="p-6 space-y-4 bg-rose-950/10">
            <div className="flex items-center gap-2 text-rose-400 font-semibold uppercase font-mono">
              <XCircle className="w-4 h-4" />
              <span>Generic AI Demo / Naive Classifier</span>
            </div>
            <ul className="space-y-2.5 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span>
                <span>Forces a single category even when pixels are pure darkness or motion blur</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span>
                <span>Fabricates pseudo-percentages (e.g. "98.4% Confidence") with zero calibration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span>
                <span>Calls a Bengal tiger merely a "Cat" and a newborn baby merely a "Person"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span>
                <span>Hides ambiguity and hallucinated single-label outputs</span>
              </li>
            </ul>
          </div>

          {/* AURA VISION */}
          <div className="p-6 space-y-4 bg-emerald-950/10">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>AURA VISION Intelligence Engine</span>
            </div>
            <ul className="space-y-2.5 text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Pre-flight image quality check for blur, underexposure, and clipping</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Uncertainty Safety: refuses forced classification if evidence is insufficient</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Sub-taxonomic precision: distinguishes "Human infant", "Bengal tiger", etc.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Evidence rationale: observable visual markers extracted for user review</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Direct Interactive Test CTA */}
      <div className="p-6 rounded-2xl glass-panel-glow border border-rose-500/30 text-center space-y-3">
        <h3 className="text-lg font-bold font-display text-white">
          Put the Uncertainty Engine to the test
        </h3>
        <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
          Open the Visual Scanner, activate the Stress Simulator, dial up blur or low illumination,
          and watch AURA VISION trigger safe diagnostic guardrails in real time.
        </p>
        <button
          onClick={onTestUncertainty}
          className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-rose-500/25 transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Open Scanner & Test Ambiguity</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
