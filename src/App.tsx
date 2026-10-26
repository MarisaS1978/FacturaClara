import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { BillUploader } from './components/BillUploader';
import { ScanProgress } from './components/ScanProgress';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { BillHistory } from './components/BillHistory';
import { CameraModal } from './components/CameraModal';
import { OfficialPortalsModal } from './components/OfficialPortalsModal';
import { AnalysisRecord, SampleInvoice } from './types/bill';
import { SAMPLE_BILLS } from './data/sampleBills';
import { AlertCircle, RefreshCw, Zap } from 'lucide-react';

const STORAGE_KEY = 'facturaclara_history_v1';

export default function App() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<AnalysisRecord | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanPreviewUrl, setScanPreviewUrl] = useState<string | undefined>(undefined);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPortalsOpen, setIsPortalsOpen] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecords(parsed);
          // If no active record, default to the latest saved one or stay on intake
        }
      } else {
        // Pre-seed with Edenor sample for instant pleasant onboarding
        const initialRecord: AnalysisRecord = {
          id: 'edenor-sample-init',
          createdAt: new Date().toISOString(),
          fileName: 'edenor-octubre-2026.pdf',
          filePreviewUrl: SAMPLE_BILLS[0].imageDataUri,
          markdownText: SAMPLE_BILLS[0].precomputedData.explicacion_en_criollo,
          billData: SAMPLE_BILLS[0].precomputedData,
        };
        setRecords([initialRecord]);
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  }, []);

  // Save history to localStorage
  const saveRecords = (newRecords: AnalysisRecord[]) => {
    setRecords(newRecords);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  };

  // Process live bill analysis via server-side Gemini 3.8 Flash
  const handleAnalyzeBill = async (
    base64Data: string,
    mimeType: string,
    fileName?: string,
    userContext?: string
  ) => {
    setErrorBanner(null);
    setIsAnalyzing(true);
    setScanPreviewUrl(base64Data);

    try {
      const res = await fetch('/api/analyze-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: mimeType || 'image/jpeg',
          userContext: userContext || '',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se pudo analizar la factura. Verifica que la imagen sea legible.');
      }

      const newRecord: AnalysisRecord = {
        id: `rec-${Date.now()}`,
        createdAt: new Date().toISOString(),
        fileName: fileName || 'factura.jpg',
        filePreviewUrl: base64Data,
        markdownText: data.markdownText,
        billData: data.billData,
        userNote: userContext,
      };

      // Check if bill is clean (no anomalies) for celebration
      const hasSuspicious = data.billData?.cargos_extra_o_anomalias?.some((c: any) => c.es_sospechoso);
      if (!hasSuspicious && !data.billData?.alerta_aumento) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }

      const updated = [newRecord, ...records];
      saveRecords(updated);
      setCurrentRecord(newRecord);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorBanner(err.message || 'Error al procesar la factura con Gemini AI.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Sample Selection
  const handleSampleSelected = (sample: SampleInvoice, liveScan = false) => {
    setErrorBanner(null);

    if (liveScan) {
      // Run live extraction through Gemini with the sample's visual SVG invoice
      handleAnalyzeBill(sample.imageDataUri, 'image/svg+xml', `${sample.name}.svg`);
    } else {
      // Instant instant preview using high-fidelity precomputed data
      const sampleRecord: AnalysisRecord = {
        id: `sample-${sample.id}-${Date.now()}`,
        createdAt: new Date().toISOString(),
        fileName: `${sample.name}.pdf`,
        filePreviewUrl: sample.imageDataUri,
        markdownText: sample.precomputedData.explicacion_en_criollo,
        billData: sample.precomputedData,
      };

      const updated = [sampleRecord, ...records.filter((r) => r.id !== sampleRecord.id)];
      saveRecords(updated);
      setCurrentRecord(sampleRecord);
    }
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    saveRecords(updated);
    if (currentRecord?.id === id) {
      setCurrentRecord(updated[0] || null);
    }
  };

  const handleClearAll = () => {
    saveRecords([]);
    setCurrentRecord(null);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 w-full max-w-full overflow-x-hidden">
      {/* Global Header */}
      <Header
        historyCount={records.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenPortals={() => setIsPortalsOpen(true)}
        onNewAnalysis={() => setCurrentRecord(null)}
        hasActiveBill={Boolean(currentRecord)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 min-w-0">
        {/* Error Alert Banner */}
        {errorBanner && (
          <div className="mb-6 max-w-4xl mx-auto p-4 bg-rose-950/80 border border-rose-500/50 rounded-2xl flex items-center justify-between gap-3 text-rose-200 text-xs sm:text-sm shadow-xl">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorBanner}</span>
            </div>
            <button
              onClick={() => setErrorBanner(null)}
              className="text-xs font-bold text-rose-300 hover:text-white px-2 py-1 rounded bg-rose-900/40"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* View Switching */}
        {isAnalyzing ? (
          <div className="py-8">
            <ScanProgress previewUrl={scanPreviewUrl} />
          </div>
        ) : currentRecord ? (
          <AnalysisDashboard
            record={currentRecord}
            onNewAnalysis={() => setCurrentRecord(null)}
          />
        ) : (
          <BillUploader
            onFileSelected={(base64, mime, name, context) =>
              handleAnalyzeBill(base64, mime, name, context)
            }
            onSampleSelected={handleSampleSelected}
            onOpenCamera={() => setIsCameraOpen(true)}
            onOpenPortalsModal={() => setIsPortalsOpen(true)}
            isLoading={isAnalyzing}
          />
        )}
      </main>

      {/* Official Portals Directory Modal */}
      <OfficialPortalsModal
        isOpen={isPortalsOpen}
        onClose={() => setIsPortalsOpen(false)}
      />

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(base64) => {
          handleAnalyzeBill(base64, 'image/jpeg', 'captura-camara.jpg');
        }}
      />

      {/* History Ledger Modal */}
      {isHistoryOpen && (
        <BillHistory
          records={records}
          onSelectRecord={(rec) => setCurrentRecord(rec)}
          onDeleteRecord={handleDeleteRecord}
          onClearAll={handleClearAll}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950/40 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-slate-300">FacturaClara AI</span>
            <span>— Análisis multimodal de facturas del hogar</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Traducción en criollo, auditoría de anomalías y canales oficiales de reclamo
          </div>
        </div>
      </footer>
    </div>
  );
}
