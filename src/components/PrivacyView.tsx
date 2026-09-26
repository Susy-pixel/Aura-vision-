import React from 'react';
import { Shield, Lock, Server, Cpu, HardDrive, CheckCircle2 } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>TRANSPARENT SYSTEM SPECIFICATION</span>
        </div>
        <h2 className="text-3xl font-extrabold font-display text-white">
          Data Lifecycle & Privacy Architecture
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Accurate, verifiable disclosure of how image data is ingested, processed, and retained across the AURA VISION pipeline.
        </p>
      </div>

      {/* Technical Architecture Flow */}
      <div className="rounded-2xl glass-panel border border-white/10 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold font-display text-white">
          End-to-End Processing Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-xs font-mono text-slate-400">STAGE 01</div>
            <h4 className="text-sm font-semibold text-white">Client-Side Ingestion</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              When you select or drop an image, your browser encodes it into an in-memory base64 representation. Optical metrics (brightness, resolution, contrast) are evaluated locally on an HTML5 canvas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Server className="w-4 h-4" />
            </div>
            <div className="text-xs font-mono text-slate-400">STAGE 02</div>
            <h4 className="text-sm font-semibold text-white">Ephemeral Backend Proxy</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              The payload is transmitted via encrypted HTTPS POST to the application server (`/api/analyze`). The backend holds the image purely in transient memory (RAM) and immediately invokes the Gemini multimodal API.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <HardDrive className="w-4 h-4" />
            </div>
            <div className="text-xs font-mono text-slate-400">STAGE 03</div>
            <h4 className="text-sm font-semibold text-white">Local History Storage</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Analysis reports and low-resolution thumbnails are saved solely in your local browser's <code className="text-amber-400 font-mono">window.localStorage</code>. They are never written to any external persistent database.
            </p>
          </div>
        </div>

        {/* Precise Guarantees vs Reality */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Clear Commitments & Boundaries
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-slate-200">
                <span className="font-semibold text-white">No Database Retention:</span> No PostgreSQL, MySQL, Mongo, or Firebase database instances are connected to store your uploaded photography.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-slate-200">
                <span className="font-semibold text-white">Full User Control:</span> You can clear your analysis records at any time using the "Clear History" button on the History tab.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-slate-200">
                <span className="font-semibold text-white">AI Inference Provider:</span> Multimodal reasoning is performed via Google's Gemini 3.8 Flash API under Google Cloud's enterprise data governance standards.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
