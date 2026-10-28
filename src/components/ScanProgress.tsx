import React, { useEffect, useState } from 'react';
import { Sparkles, Scan, CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';

interface ScanProgressProps {
  previewUrl?: string;
}

const STEPS = [
  'Escaneando documento con visión multimodal...',
  'Identificando proveedor, titular y fecha límite de pago...',
  'Auditando histórico de consumo (kWh/m³/GB) y saltos de tarifa...',
  'Detectando cargos ocultos, multas o conceptos atípicos...',
  'Traduciendo términos técnicos y formateando JSON estructurado...',
];

export const ScanProgress: React.FC<ScanProgressProps> = ({ previewUrl }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/80 border border-cyan-500/30 rounded-full text-xs font-semibold text-cyan-300 mb-3 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FacturaClara AI analizando en tiempo real</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Procesando Comprobante
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Extrayendo datos de alta precisión y auditando cargos
        </p>
      </div>

      {/* Document Scanner Preview */}
      {previewUrl && (
        <div className="relative max-w-xs mx-auto mb-8 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner max-h-56">
          <img
            src={previewUrl}
            alt="Factura en análisis"
            className="w-full h-full object-cover filter brightness-90"
          />
          {/* Laser scanning bar */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanline pointer-events-none" />
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/75 rounded text-[10px] font-mono text-cyan-300 flex items-center gap-1 border border-cyan-500/30">
            <Scan className="w-3 h-3 animate-spin" />
            <span>OCR AI</span>
          </div>
        </div>
      )}

      {/* Step Progress Checklist */}
      <div className="space-y-3 max-w-md mx-auto">
        {STEPS.map((stepText, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 text-xs sm:text-sm ${
                isCurrent
                  ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-200'
                  : isDone
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                )}
              </div>
              <span className={isCurrent ? 'font-semibold text-white' : ''}>
                {stepText}
              </span>
            </div>
          );
        })}
      </div>

      {currentStepIndex >= 3 && (
        <p className="text-center text-[11px] text-slate-400 mt-5 animate-pulse">
          ⚡ Si hay alta demanda en los servidores, conectando automáticamente con canales de alta disponibilidad...
        </p>
      )}
    </div>
  );
};
