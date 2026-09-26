import React from 'react';
import { AlertTriangle, ArrowRight, RefreshCw, EyeOff } from 'lucide-react';
import { ImageQuality } from '../types/vision';

interface QualityWarningModalProps {
  isOpen: boolean;
  quality: ImageQuality;
  warningText: string;
  imagePreview: string;
  onAnalyzeAnyway: () => void;
  onTryAnother: () => void;
}

export const QualityWarningModal: React.FC<QualityWarningModalProps> = ({
  isOpen,
  quality,
  warningText,
  imagePreview,
  onAnalyzeAnyway,
  onTryAnother,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel-glow border border-amber-500/30 overflow-hidden shadow-2xl p-6 sm:p-8">
        {/* Glow backdrop element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-amber-400 font-semibold uppercase">
              <span>Image Quality Warning</span>
              <span className="text-slate-600">·</span>
              <span className="text-rose-400">Rating: {quality}</span>
            </div>

            <h3 className="text-xl font-bold font-display text-white mt-1">
              Low Visual Evidence Detected
            </h3>

            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {warningText ||
                'The uploaded image displays low clarity, severe motion blur, or poor illumination. AURA VISION strictly avoids forced or fabricated classifications.'}
            </p>
          </div>
        </div>

        {/* Thumbnail Preview with Quality Scrim */}
        <div className="mt-5 relative rounded-xl overflow-hidden border border-white/10 aspect-video max-h-48 bg-black/60 flex items-center justify-center">
          <img
            src={imagePreview}
            alt="Uploaded sample preview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a1f] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-mono text-slate-300 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded">
            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Pre-Flight Uncertainty Check Triggered</span>
          </div>
        </div>

        {/* Uncertainty Protocol Reassurance */}
        <div className="mt-4 p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200/90 leading-normal">
          <span className="font-semibold text-amber-300">Uncertainty Safety Protocol:</span> If you choose to analyze anyway, the system will evaluate all available visual pixels but will refuse to invent a confident label if evidence remains inconclusive.
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onTryAnother}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Another Image</span>
          </button>

          <button
            onClick={onAnalyzeAnyway}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 rounded-xl shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Analyze Anyway</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
