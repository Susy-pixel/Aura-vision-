import React from 'react';
import { History, Trash2, RotateCcw, ExternalLink, Calendar, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AnalysisRecord } from '../types/vision';

interface HistoryViewProps {
  records: AnalysisRecord[];
  onReopen: (record: AnalysisRecord) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onStartNew: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  records,
  onReopen,
  onDelete,
  onClearAll,
  onStartNew,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-300 uppercase">
            <History className="w-3.5 h-3.5" />
            <span>SESSION INTELLIGENCE LOG</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
            Analysis History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Locally stored in your browser's secure cache. Zero persistent external storage.
          </p>
        </div>

        {records.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-4 py-2 text-xs font-medium text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 rounded-xl border border-rose-500/30 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Record list or empty state */}
      {records.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl glass-panel border border-white/5 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
            <History className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Previous Analyses Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Scanned images and verified intelligence breakdowns will automatically appear here for quick reopening.
            </p>
          </div>
          <button
            onClick={onStartNew}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-xs shadow-lg shadow-rose-500/20 hover:from-rose-600 hover:to-amber-600 transition-all inline-flex items-center gap-2"
          >
            <span>Scan Your First Image</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((rec) => {
            const isInconclusive = rec.result.confidenceLevel === 'INCONCLUSIVE';

            return (
              <div
                key={rec.id}
                className="rounded-2xl glass-panel hover:glass-panel-glow border border-white/5 hover:border-rose-500/30 overflow-hidden transition-all duration-200 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="aspect-[4/3] relative overflow-hidden bg-black/60">
                    <img
                      src={rec.imageThumb || rec.imageFull}
                      alt={rec.result.primaryIdentification}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 backdrop-blur-md text-slate-200 border border-white/10">
                      {rec.result.category}
                    </div>

                    <div
                      className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono backdrop-blur-md border ${
                        isInconclusive
                          ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {rec.result.confidenceLevel}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{new Date(rec.timestamp).toLocaleString()}</span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {rec.result.primaryIdentification}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {rec.result.description}
                    </p>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Quality: {rec.result.imageQuality}</span>
                      <span>{rec.result.detectedObjects?.length || 1} Entities</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => onReopen(rec)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reopen Report</span>
                  </button>

                  <button
                    onClick={() => onDelete(rec.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl border border-white/5 hover:border-rose-500/20 transition-colors"
                    aria-label="Delete analysis record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
