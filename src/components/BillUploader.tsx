import React, { useState, useRef } from 'react';
import { Upload, Camera, FileText, Sparkles, AlertCircle, ArrowRight, Zap, Flame, Wifi, Building2, PiggyBank, Lightbulb } from 'lucide-react';
import { SAMPLE_BILLS } from '../data/sampleBills';
import { SampleInvoice } from '../types/bill';

interface BillUploaderProps {
  onFileSelected: (base64: string, mimeType: string, fileName?: string, userContext?: string) => void;
  onSampleSelected: (sample: SampleInvoice, liveScan?: boolean) => void;
  onOpenCamera: () => void;
  onOpenPortalsModal: () => void;
  onOpenSavingsModal?: () => void;
  isLoading: boolean;
}

export const BillUploader: React.FC<BillUploaderProps> = ({
  onFileSelected,
  onSampleSelected,
  onOpenCamera,
  onOpenPortalsModal,
  onOpenSavingsModal,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [userContext, setUserContext] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);
    if (!file) return;

    // Validate size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('El archivo supera los 20MB permitidos.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onFileSelected(result, file.type || 'image/jpeg', file.name, userContext);
    };
    reader.onerror = () => {
      setErrorMessage('Error al leer el archivo. Intenta con otro formato.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Luz': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Gas': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'Internet': return <Wifi className="w-4 h-4 text-purple-400" />;
      case 'Expensas': return <Building2 className="w-4 h-4 text-emerald-400" />;
      default: return <FileText className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Intro Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Extracción Multimodal con Gemini 3.8 Flash</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Entiende tu factura sin <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">letra chica</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Sube una foto o PDF de tu factura de luz, gas, agua, internet o expensas. FacturaClara AI audita aumentos, detecta cargos indebidos y te explica todo en criollo.
        </p>
      </div>

      {/* Upload Box */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-3xl border-2 border-dashed transition-all p-6 sm:p-10 text-center ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
            : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'
        } backdrop-blur-sm shadow-xl`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <p className="text-base sm:text-lg font-bold text-white">
              Arrastra tu factura aquí o selecciónala de tu equipo
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              Soporta imágenes (JPG, PNG, WEBP) o documentos PDF
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-2 w-full max-w-md mx-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex-1 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Seleccionar Archivo</span>
            </button>

            <button
              type="button"
              onClick={onOpenCamera}
              disabled={isLoading}
              className="flex-1 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Camera className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Escanear con Cámara</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center justify-center gap-2 max-w-full">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="break-words">{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Helpful Quick Access Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Banner 1: Portales Oficiales de Descarga */}
        <div 
          onClick={onOpenPortalsModal}
          className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900 border border-cyan-500/30 hover:border-cyan-400/60 rounded-2xl p-4 flex items-center justify-between gap-3 cursor-pointer transition-all hover:shadow-lg hover:shadow-cyan-500/10 group min-w-0"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                ¿No tienes tu factura digital?
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                Descarga de Edenor, Edesur, MetroGAS, AySA, Telecom y más
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>

        {/* Banner 2: Consejos de Ahorro del Hogar */}
        <div 
          onClick={onOpenSavingsModal}
          className="bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30 hover:border-emerald-400/60 rounded-2xl p-4 flex items-center justify-between gap-3 cursor-pointer transition-all hover:shadow-lg hover:shadow-emerald-500/10 group min-w-0"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                Guía de Consejos de Ahorro
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                Calculadora interactiva y tips para bajar tus consumos
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>
      </div>

      {/* Optional Context Field */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-2">
          <span>Información o facturas anteriores del usuario (Opcional):</span>
          <span className="text-[11px] font-normal text-slate-500">Mejora la precisión al comparar aumentos</span>
        </label>
        <input
          type="text"
          value={userContext}
          onChange={(e) => setUserContext(e.target.value)}
          placeholder="Ej: El mes pasado pagué $16.000 y se me venció la promoción, o estuvimos 15 días de vacaciones..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
        />
      </div>

      {/* Instant Testing Samples Carousel */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              O prueba al instante con estos casos reales del hogar
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">Haz clic para auditar con 1 solo toque</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SAMPLE_BILLS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSampleSelected(sample, false)}
              className="group bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    {getServiceIcon(sample.service)}
                    <span>{sample.service}</span>
                  </div>
                  <span className="text-xs font-black text-white">{sample.amount}</span>
                </div>

                <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {sample.company}
                </h4>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {sample.description}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sample.badgeColor}`}>
                  {sample.tag}
                </span>
                <span className="text-[11px] text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Auditar <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
