import React, { useState, useEffect, useRef } from 'react';
import { TopBar } from './components/TopBar';
import { HeroScanner } from './components/HeroScanner';
import { GeometricPixelScanner } from './components/GeometricPixelScanner';
import { ResultDashboard } from './components/ResultDashboard';
import { QualityWarningModal } from './components/QualityWarningModal';
import { WhyThisResultModal } from './components/WhyThisResultModal';
import { DemoPresetGallery } from './components/DemoPresetGallery';
import { UncertaintySafetyView } from './components/UncertaintySafetyView';
import { HistoryView } from './components/HistoryView';
import { PrivacyView } from './components/PrivacyView';
import { DEMO_PRESETS } from './data/demoPresets';
import {
  AnalysisResponseData,
  AnalysisRecord,
} from './types/vision';
import {
  analyzeClientImageMetrics,
  ClientQualityMetrics,
  urlToBase64,
  loadAnalysisHistory,
  saveAnalysisToHistory,
  deleteHistoryItem,
  clearAnalysisHistory,
} from './utils/imageUtils';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'presets' | 'uncertainty' | 'history' | 'privacy'>('analyzer');
  
  // Image state
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [clientMetrics, setClientMetrics] = useState<ClientQualityMetrics | null>(null);

  // Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [scanResult, setScanResult] = useState<AnalysisResponseData | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Modals & Drawers
  const [qualityWarningModalOpen, setQualityWarningModalOpen] = useState(false);
  const [whyThisResultModalOpen, setWhyThisResultModalOpen] = useState(false);
  const [pendingScanPayload, setPendingScanPayload] = useState<{ imageBase64: string; mimeType: string } | null>(null);

  // History state
  const [historyRecords, setHistoryRecords] = useState<AnalysisRecord[]>([]);

  // Temporary storage for result while scanning animation runs
  const pendingResultRef = useRef<AnalysisResponseData | null>(null);

  // Load history on mount
  useEffect(() => {
    setHistoryRecords(loadAnalysisHistory());
  }, []);

  // Update client metrics whenever uploaded preview changes
  useEffect(() => {
    if (!uploadedPreview) {
      setClientMetrics(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = uploadedPreview;
    img.onload = () => {
      const metrics = analyzeClientImageMetrics(img);
      setClientMetrics(metrics);
    };
  }, [uploadedPreview]);

  // Execute scan request (with pre-flight check)
  const handleScanRequest = (imageBase64: string, mimeType: string = 'image/jpeg', forced: boolean = false) => {
    setBackendError(null);

    // If pre-flight heuristic flagged insufficient or poor quality and not forced, show warning modal
    if (!forced && clientMetrics && (clientMetrics.estimatedQuality === 'Poor' || clientMetrics.estimatedQuality === 'Insufficient')) {
      setPendingScanPayload({ imageBase64, mimeType });
      setQualityWarningModalOpen(true);
      return;
    }

    // Trigger signature scanning animation & backend call
    startScanPipeline(imageBase64, mimeType, forced);
  };

  const startScanPipeline = async (imageBase64: string, mimeType: string, forced: boolean) => {
    setIsScanning(true);
    setIsBackendReady(false);
    pendingResultRef.current = null;
    setScanResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          forcedAnalysis: forced,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to complete visual analysis. Please check image input.');
      }

      const data: AnalysisResponseData = json.data;
      pendingResultRef.current = data;

      // Check if image quality warning came from server AI reasoning
      if (!forced && (data.imageQuality === 'Poor' || data.imageQuality === 'Insufficient') && data.qualityWarning) {
        // Still allow scanning to conclude smoothly, but data has qualityWarning attached
      }

      setIsBackendReady(true);
    } catch (err: any) {
      console.error('Scan execution error:', err);
      setBackendError(err.message || 'Analysis could not be completed reliably.');
      setIsScanning(false);
    }
  };

  // Called when the 2.8s geometric pixel animation completes
  const handleScanningAnimationComplete = () => {
    setIsScanning(false);
    if (pendingResultRef.current && uploadedPreview) {
      setScanResult(pendingResultRef.current);

      // Persist to history
      const saved = saveAnalysisToHistory({
        imageThumb: uploadedPreview,
        imageFull: uploadedPreview,
        fileName: fileName || 'Analyzed Scene',
        fileSize: uploadedPreview.length,
        result: pendingResultRef.current,
      });

      setHistoryRecords((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)].slice(0, 20));
    }
  };

  // Select demo preset
  const handleSelectPreset = async (presetId: string) => {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    try {
      const base64 = await urlToBase64(preset.imageSrc);
      setUploadedPreview(base64);
      setFileName(preset.title);
      setScanResult(null);
      setBackendError(null);
      setActiveTab('analyzer');
    } catch (err) {
      console.error('Failed to load preset:', err);
    }
  };

  // Select preset and immediately scan
  const handleSelectAndScan = async (presetId: string) => {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    try {
      const base64 = await urlToBase64(preset.imageSrc);
      setUploadedPreview(base64);
      setFileName(preset.title);
      setScanResult(null);
      setBackendError(null);
      setActiveTab('analyzer');

      // Pre-flight check before scan
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = base64;
      img.onload = () => {
        const metrics = analyzeClientImageMetrics(img);
        setClientMetrics(metrics);
        startScanPipeline(base64, 'image/jpeg', false);
      };
    } catch (err) {
      console.error('Failed to run preset scan:', err);
    }
  };

  // Reopen record from history
  const handleReopenHistory = (record: AnalysisRecord) => {
    setUploadedPreview(record.imageFull);
    setFileName(record.fileName);
    setScanResult(record.result);
    setBackendError(null);
    setIsScanning(false);
    setActiveTab('analyzer');
  };

  // Delete history item
  const handleDeleteHistory = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistoryRecords(updated);
  };

  // Clear all history
  const handleClearHistory = () => {
    clearAnalysisHistory();
    setHistoryRecords([]);
  };

  // Save / export result
  const handleSaveResult = () => {
    if (!scanResult) return;
    const report = {
      product: 'AURA VISION',
      timestamp: new Date().toISOString(),
      analysis: scanResult,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-vision-report-${scanResult.primaryIdentification.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Analyze again
  const handleAnalyzeAgain = () => {
    if (uploadedPreview) {
      handleScanRequest(uploadedPreview, 'image/jpeg', true);
    }
  };

  // Upload new image
  const handleUploadNew = () => {
    setUploadedPreview(null);
    setFileName(null);
    setScanResult(null);
    setBackendError(null);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07060e] text-slate-100 selection:bg-rose-500 selection:text-white relative overflow-x-hidden">
      {/* Cinematic Sunset Glow Backdrop */}
      <div className="fixed inset-0 pointer-events-none sunset-glow-bg z-0" />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-rose-600/10 via-amber-500/10 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Top Bar following strict 3-zone contract */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={historyRecords.length}
        onUploadClick={() => {
          setActiveTab('analyzer');
          handleUploadNew();
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        {/* Global Error Banner */}
        {backendError && (
          <div className="w-full max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 backdrop-blur-md flex items-start justify-between gap-3 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Visual Intelligence Alert</h4>
                <p className="text-xs text-rose-200 mt-0.5 leading-relaxed">{backendError}</p>
              </div>
            </div>
            <button
              onClick={() => setBackendError(null)}
              className="px-3 py-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 rounded-lg"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Visual Analyzer (Scanner / Result / Signature Animation) */}
        {activeTab === 'analyzer' && (
          <div className="space-y-6">
            {isScanning && uploadedPreview ? (
              <GeometricPixelScanner
                imageSrc={uploadedPreview}
                isBackendReady={isBackendReady}
                onAnimationComplete={handleScanningAnimationComplete}
              />
            ) : scanResult && uploadedPreview ? (
              <ResultDashboard
                result={scanResult}
                imageSrc={uploadedPreview}
                onAnalyzeAgain={handleAnalyzeAgain}
                onUploadNew={handleUploadNew}
                onOpenWhyThisResult={() => setWhyThisResultModalOpen(true)}
                onSaveResult={handleSaveResult}
              />
            ) : (
              <HeroScanner
                onScanRequest={handleScanRequest}
                isLoading={isScanning}
                onSelectPreset={handleSelectPreset}
                clientMetrics={clientMetrics}
                uploadedPreview={uploadedPreview}
                setUploadedPreview={setUploadedPreview}
                fileName={fileName}
                setFileName={setFileName}
              />
            )}
          </div>
        )}

        {/* Tab 2: Sample Gallery */}
        {activeTab === 'presets' && (
          <DemoPresetGallery onSelectAndScan={handleSelectAndScan} />
        )}

        {/* Tab 3: Uncertainty Safety Architecture */}
        {activeTab === 'uncertainty' && (
          <UncertaintySafetyView
            onTestUncertainty={() => {
              setActiveTab('analyzer');
            }}
          />
        )}

        {/* Tab 4: Local History Log */}
        {activeTab === 'history' && (
          <HistoryView
            records={historyRecords}
            onReopen={handleReopenHistory}
            onDelete={handleDeleteHistory}
            onClearAll={handleClearHistory}
            onStartNew={() => {
              setActiveTab('analyzer');
              handleUploadNew();
            }}
          />
        )}

        {/* Tab 5: Architecture & Privacy */}
        {activeTab === 'privacy' && <PrivacyView />}
      </main>

      {/* Quality Warning Modal */}
      {uploadedPreview && clientMetrics && (
        <QualityWarningModal
          isOpen={qualityWarningModalOpen}
          quality={clientMetrics.estimatedQuality}
          warningText={clientMetrics.warningMessage || ''}
          imagePreview={uploadedPreview}
          onTryAnother={() => {
            setQualityWarningModalOpen(false);
            setUploadedPreview(null);
            setFileName(null);
          }}
          onAnalyzeAnyway={() => {
            setQualityWarningModalOpen(false);
            if (pendingScanPayload) {
              startScanPipeline(pendingScanPayload.imageBase64, pendingScanPayload.mimeType, true);
            }
          }}
        />
      )}

      {/* Why This Result Modal */}
      {scanResult && (
        <WhyThisResultModal
          isOpen={whyThisResultModalOpen}
          onClose={() => setWhyThisResultModalOpen(false)}
          result={scanResult}
        />
      )}

      {/* Clean, Non-Slop Footer */}
      <footer className="w-full border-t border-white/5 py-8 mt-12 bg-[#05040a] relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-300">AURA VISION</span>
            <span>·</span>
            <span>Multimodal Visual Intelligence System</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('uncertainty')}
              className="hover:text-slate-200 transition-colors"
            >
              Uncertainty Standard
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('privacy')}
              className="hover:text-slate-200 transition-colors"
            >
              Privacy & Data Flow
            </button>
            <span>·</span>
            <span>Evaluated with Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
