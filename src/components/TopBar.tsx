import React from 'react';
import { History, Shield, Sparkles, Upload } from 'lucide-react';

interface TopBarProps {
  activeTab: 'analyzer' | 'presets' | 'uncertainty' | 'history' | 'privacy';
  setActiveTab: (tab: 'analyzer' | 'presets' | 'uncertainty' | 'history' | 'privacy') => void;
  historyCount: number;
  onUploadClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  historyCount,
  onUploadClick,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-500/15 bg-[#07060e]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark in display face */}
        <button
          onClick={() => setActiveTab('analyzer')}
          className="text-left font-display font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-purple-400 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          AURA VISION
        </button>

        {/* Zone 2: 4-5 clean text navigation links with subtle active states */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'analyzer'
                ? 'text-amber-300 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Visual Scanner
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'presets'
                ? 'text-amber-300 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Sample Gallery
          </button>

          <button
            onClick={() => setActiveTab('uncertainty')}
            className={`transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'uncertainty'
                ? 'text-amber-300 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span>Uncertainty Safety</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'text-amber-300 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="font-mono text-[11px] text-amber-300">({historyCount})</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'text-amber-300 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Architecture
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onUploadClick}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 rounded-xl shadow-md shadow-rose-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
        </div>
      </div>
    </header>
  );
};
