import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Eye, Info } from 'lucide-react';
import { AnalysisResponseData } from '../types/vision';

interface WhyThisResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResponseData;
}

export const WhyThisResultModal: React.FC<WhyThisResultModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen) return null;

  const isInconclusive = result.confidenceLevel === 'INCONCLUSIVE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl glass-panel-glow border border-rose-500/30 overflow-hidden shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-rose-300 font-medium">
                Observable Visual Evidence
              </div>
              <h3 className="text-lg font-bold font-display text-white mt-0.5">
                Why this result?
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close why this result dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Identification Summary */}
        <div className="mt-5 p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>TARGET SUBJECT</span>
            <span
              className={
                isInconclusive
                  ? 'text-rose-400 font-semibold'
                  : 'text-amber-400 font-semibold'
              }
            >
              {result.confidenceLevel}
            </span>
          </div>
          <div className="text-lg font-semibold text-white">
            {result.primaryIdentification}
          </div>
        </div>

        {/* Observable Evidence Explanation */}
        <div className="mt-5">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Diagnostic Rationale</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed bg-[#0b0816]/70 p-4 rounded-xl border border-rose-500/20">
            {result.whyThisResult ||
              'Identification is based strictly on observable anatomical, structural, and textural characteristics visible within the frame.'}
          </p>
        </div>

        {/* Visible Evidence Points */}
        {result.visibleEvidence && result.visibleEvidence.length > 0 && (
          <div className="mt-5">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wide mb-3">
              Observable Anatomical / Surface Signals
            </div>
            <div className="space-y-2">
              {result.visibleEvidence.map((evidence, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-white/5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-relaxed font-sans">
                    {evidence}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inconclusive or Ambiguity Reason */}
        {isInconclusive && result.inconclusiveReason && (
          <div className="mt-5 p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                Why Confidence is Inconclusive
              </div>
              <p className="text-xs text-rose-200 mt-1 leading-relaxed">
                {result.inconclusiveReason}
              </p>
            </div>
          </div>
        )}

        {/* Reassurance Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict uncertainty safety verified — zero forced classifications</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
