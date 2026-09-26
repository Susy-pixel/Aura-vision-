import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
  RotateCcw,
  Upload,
  Download,
  CheckCircle2,
  Sliders,
  Palette,
  Eye,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AnalysisResponseData } from '../types/vision';
import { ImageComparisonView } from './ImageComparisonView';

interface ResultDashboardProps {
  result: AnalysisResponseData;
  imageSrc: string;
  onAnalyzeAgain: () => void;
  onUploadNew: () => void;
  onOpenWhyThisResult: () => void;
  onSaveResult: () => void;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  result,
  imageSrc,
  onAnalyzeAgain,
  onUploadNew,
  onOpenWhyThisResult,
  onSaveResult,
}) => {
  const [isDetailedMode, setIsDetailedMode] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isInconclusive = result.confidenceLevel === 'INCONCLUSIVE';
  const isLowConfidence = result.confidenceLevel === 'LOW CONFIDENCE';

  // Confidence styling
  const getConfidenceBadge = () => {
    switch (result.confidenceLevel) {
      case 'HIGH CONFIDENCE':
        return {
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/30',
          bg: 'bg-emerald-950/30',
          icon: ShieldCheck,
          label: 'HIGH CONFIDENCE',
        };
      case 'MEDIUM CONFIDENCE':
        return {
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/30',
          bg: 'bg-amber-950/30',
          icon: ShieldCheck,
          label: 'MEDIUM CONFIDENCE',
        };
      case 'LOW CONFIDENCE':
        return {
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/30',
          bg: 'bg-rose-950/30',
          icon: AlertTriangle,
          label: 'LOW CONFIDENCE',
        };
      case 'INCONCLUSIVE':
      default:
        return {
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/50',
          bg: 'bg-rose-950/40',
          icon: HelpCircle,
          label: 'ANALYSIS INCONCLUSIVE',
        };
    }
  };

  const confidenceBadge = getConfidenceBadge();
  const ConfidenceIcon = confidenceBadge.icon;

  const handleSaveClick = () => {
    onSaveResult();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2400);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel-glow border border-rose-500/25">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-rose-400 uppercase">
            <span>AURA VISION</span>
            <span className="text-slate-600">/</span>
            <span>VISUAL ANALYSIS COMPLETE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
            {isInconclusive ? 'Identification Inconclusive' : result.primaryIdentification}
          </h2>
          {/* Metadata Discipline: unboxed text with typographic separators */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1.5">
            <span>Category: {result.category || 'General Entity'}</span>
            <span aria-hidden="true">·</span>
            <span>Quality: {result.imageQuality}</span>
            <span aria-hidden="true">·</span>
            <span className={confidenceBadge.textColor}>{result.confidenceLevel}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsDetailedMode(!isDetailedMode)}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              isDetailedMode
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isDetailedMode ? 'Concise Summary' : 'Detailed Intelligence'}</span>
          </button>

          <button
            onClick={handleSaveClick}
            className="px-4 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSaved ? 'Saved!' : 'Save Result'}</span>
          </button>
        </div>
      </div>

      {/* INCONCLUSIVE / UNCERTAINTY SAFETY ALERT BANNER (If applicable) */}
      {(isInconclusive || isLowConfidence) && (
        <div className="p-5 rounded-2xl bg-[#1c0d1e]/80 border border-rose-500/40 backdrop-blur-md shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-400">
                Uncertainty Safety Protocol Enforced
              </div>
              <h4 className="text-base font-bold text-white mt-0.5">
                {isInconclusive
                  ? 'No Confident Identification Forced'
                  : 'Low Diagnostic Confidence Warning'}
              </h4>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                {result.inconclusiveReason ||
                  result.qualityWarning ||
                  'The visual evidence present in the image is too degraded, ambiguous, or obstructed for a definitive conclusion. AURA VISION strictly refuses to fabricate or guess classifications.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Primary 2-Column Intelligence Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Viewport & Quick Metrics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-white/10 bg-black/60 shadow-xl group">
            <img
              src={imageSrc}
              alt="Analyzed target"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
            {/* Visual scanline highlight on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a1f]/80 via-transparent to-transparent opacity-60 pointer-events-none" />

            {/* Confidence Stamp */}
            <div
              className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold backdrop-blur-md border ${confidenceBadge.bg} ${confidenceBadge.borderColor} ${confidenceBadge.textColor}`}
            >
              <ConfidenceIcon className="w-3.5 h-3.5" />
              <span>{confidenceBadge.label}</span>
            </div>

            {/* Comparison toggle button on image */}
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/20 text-xs font-medium text-slate-200 hover:text-white hover:bg-black/90 transition-all flex items-center gap-1.5 shadow-lg"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>{showComparison ? 'Hide Comparison' : 'Compare / Inspect'}</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl glass-panel-subtle text-center">
              <span className="text-[11px] font-mono text-slate-400 block">CATEGORY</span>
              <span className="text-xs font-bold text-white mt-0.5 truncate block">
                {result.category}
              </span>
            </div>

            <div className="p-3 rounded-xl glass-panel-subtle text-center">
              <span className="text-[11px] font-mono text-slate-400 block">QUALITY</span>
              <span
                className={`text-xs font-bold mt-0.5 truncate block ${
                  result.imageQuality === 'Poor' || result.imageQuality === 'Insufficient'
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              >
                {result.imageQuality}
              </span>
            </div>

            <div className="p-3 rounded-xl glass-panel-subtle text-center">
              <span className="text-[11px] font-mono text-slate-400 block">ENTITIES</span>
              <span className="text-xs font-bold text-white mt-0.5 truncate block font-mono">
                {result.detectedObjects ? result.detectedObjects.length : 1}
              </span>
            </div>
          </div>

          {/* "Why this result?" Primary Trigger */}
          <button
            onClick={onOpenWhyThisResult}
            className="w-full p-3.5 rounded-xl bg-gradient-to-r from-rose-500/15 via-amber-500/15 to-purple-500/15 hover:from-rose-500/25 hover:via-amber-500/25 hover:to-purple-500/25 border border-rose-500/30 text-xs font-semibold text-slate-100 transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Observable Visual Evidence Breakdown</span>
            </div>
            <span className="text-rose-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-mono">
              Why this result? <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        {/* Right Column: Visual Reasoning & Evidence (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Executive Summary Card */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Visual Description & Scene Context
              </span>
              <span className="text-xs text-slate-500">Multimodal Synthesis</span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {result.description}
            </p>

            {result.sceneContext && (
              <div className="pt-2 border-t border-white/5 text-xs text-slate-400 leading-relaxed">
                <span className="text-slate-300 font-medium">Environmental Context: </span>
                {result.sceneContext}
              </div>
            )}
          </div>

          {/* Observable Evidence List */}
          {result.visibleEvidence && result.visibleEvidence.length > 0 && (
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-rose-300 font-semibold">
                Diagnostic Visual Markers
              </div>

              <div className="space-y-2">
                {result.visibleEvidence.map((evidence, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-200 leading-relaxed font-sans">
                      {evidence}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected Entities Section */}
          {result.detectedObjects && result.detectedObjects.length > 0 && (
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  Entities Detected in Scene
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {result.detectedObjects.length} identified
                </span>
              </div>

              <div className="space-y-2">
                {result.detectedObjects.map((obj, idx) => (
                  <div
                    key={obj.id || idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-rose-500/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-500">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          {obj.name}
                        </span>
                        {obj.description && (
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {obj.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-xs font-mono font-medium ${
                        obj.confidence === 'High'
                          ? 'text-emerald-400'
                          : obj.confidence === 'Medium'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {obj.confidence}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Possible Alternatives (When Ambiguity Genuinely Exists) */}
          {result.possibleAlternatives && result.possibleAlternatives.length > 0 && (
            <div className="p-5 rounded-2xl bg-purple-950/25 border border-purple-500/25 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Plausible Alternative Interpretations</span>
              </div>

              <div className="space-y-2">
                {result.possibleAlternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-black/40 border border-purple-500/20 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-amber-300">
                      <span>{alt.label}</span>
                      <span className="text-[11px] font-mono text-slate-400">Hypothesis</span>
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed">{alt.whyPossible}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Mode: Surface Attributes & Diagnostics */}
          {isDetailedMode && result.attributes && (
            <div className="p-5 rounded-2xl glass-panel-glow border border-rose-500/30 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="text-xs font-mono uppercase tracking-wider text-rose-300 font-bold">
                  Deep Visual Attributes & Surface Matrix
                </div>
                <span className="text-xs text-amber-400 font-mono">Detailed Mode Active</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-slate-500 font-mono block text-[11px]">
                    GEOMETRY & SILHOUETTE
                  </span>
                  <span className="text-slate-200 mt-1 block font-medium">
                    {result.attributes.shapeGeometry || 'Natural organic form'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-slate-500 font-mono block text-[11px]">SURFACE TEXTURE</span>
                  <span className="text-slate-200 mt-1 block font-medium">
                    {result.attributes.texture || 'Visible surface grain'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-slate-500 font-mono block text-[11px]">
                    APPROXIMATE SCALE
                  </span>
                  <span className="text-slate-200 mt-1 block font-medium">
                    {result.attributes.approximateSizeCategory || 'Human-scale'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-slate-500 font-mono block text-[11px]">MATERIALS</span>
                  <span className="text-slate-200 mt-1 block font-medium">
                    {result.attributes.materials || 'Organic matter'}
                  </span>
                </div>
              </div>

              {/* Observed Color Palette */}
              {result.attributes.colorPalette && result.attributes.colorPalette.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-400 block mb-2">
                    DOMINANT CHROMA PALETTE
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.attributes.colorPalette.map((color, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-xs font-mono text-slate-200"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quality Details */}
              {result.qualityDetails && (
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300">
                  <span className="font-mono text-slate-400 block text-[11px]">
                    OPTICAL QUALITY DIAGNOSTIC
                  </span>
                  <p className="mt-1 leading-relaxed">{result.qualityDetails}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expandable Image Comparison (Before vs After) */}
      {showComparison && (
        <div className="pt-2 animate-in fade-in duration-300">
          <ImageComparisonView imageSrc={imageSrc} result={result} />
        </div>
      )}

      {/* Action Footer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={onAnalyzeAgain}
            className="px-4 py-2.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/10 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Analyze Again</span>
          </button>

          <button
            onClick={onUploadNew}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Image</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Calibrated visual intelligence report</span>
        </div>
      </div>
    </div>
  );
};
