import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  FileCode,
  MessageSquare,
  FileText,
  Copy,
  Check,
  Download,
  ExternalLink,
  ChevronRight,
  Eye,
  ShieldAlert,
  Send,
  Zap,
  Flame,
  Wifi,
  Building2,
  Info,
  Clock,
  Phone,
  Globe,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { BillStructuredData, AnalysisRecord } from '../types/bill';
import { MarkdownViewer } from './MarkdownViewer';
import { ChatBill } from './ChatBill';
import { generateIcsCalendarEvent, getGoogleCalendarUrl } from '../utils/calendar';
import { generateClaimLetter } from '../utils/claimLetter';
import { findProviderDirectoryEntry } from '../data/providerPortals';
import { OfficialPortalsModal } from './OfficialPortalsModal';

interface AnalysisDashboardProps {
  record: AnalysisRecord;
  onNewAnalysis: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  record,
  onNewAnalysis,
}) => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'claim' | 'portals' | 'calendar' | 'chat'>('markdown');
  const [claimCopied, setClaimCopied] = useState(false);
  const [showDocPreview, setShowDocPreview] = useState(false);
  const [isPortalsModalOpen, setIsPortalsModalOpen] = useState(false);

  const bill = record.billData;
  const suspiciousCharges = bill.cargos_extra_o_anomalias?.filter((c) => c.es_sospechoso) || [];
  const hasAnomalies = bill.alerta_aumento || suspiciousCharges.length > 0;

  // Find official channels from directory or fallback to bill data
  const directoryInfo = findProviderDirectoryEntry(bill.proveedor, bill.tipo_servicio);
  const downloadUrl = bill.portal_descarga?.url || directoryInfo?.downloadUrl;
  const downloadName = bill.portal_descarga?.nombre_portal || directoryInfo?.downloadPortalName || 'Portal Oficial';
  
  const claimWebUrl = bill.canales_reclamo?.web_portal || directoryInfo?.claimWebUrl;
  const claimPhone = bill.canales_reclamo?.telefono || directoryInfo?.claimPhone;
  const claimWhatsapp = bill.canales_reclamo?.whatsapp || directoryInfo?.claimWhatsapp;
  const regulatoryName = bill.canales_reclamo?.ente_regulador_nombre || directoryInfo?.regulatoryAgencyName || 'Defensa del Consumidor';
  const regulatoryUrl = bill.canales_reclamo?.ente_regulador_web || directoryInfo?.regulatoryAgencyUrl || 'https://www.argentina.gob.ar/defensadelconsumidor';

  // Format currency
  const formattedAmount = `${bill.moneda} ${bill.monto_total.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // Days until due date
  const calculateDaysRemaining = () => {
    if (!bill.fecha_vencimiento) return null;
    const due = new Date(bill.fecha_vencimiento + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  const handleDownloadIcs = () => {
    const icsContent = generateIcsCalendarEvent(bill);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    const safeProviderName = (bill.proveedor || 'factura').toLowerCase().replace(/\s+/g, '-');
    link.setAttribute('download', `vencimiento-${safeProviderName}.ics`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCopyClaim = () => {
    const letter = generateClaimLetter(bill);
    navigator.clipboard.writeText(letter);
    setClaimCopied(true);
    setTimeout(() => setClaimCopied(false), 2000);
  };

  const getServiceBadge = () => {
    switch (bill.tipo_servicio) {
      case 'Luz':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold"><Zap className="w-3 h-3" /> Luz Eléctrica</span>;
      case 'Gas':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/30 text-xs font-semibold"><Flame className="w-3 h-3" /> Gas Natural</span>;
      case 'Internet':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold"><Wifi className="w-3 h-3" /> Internet / Conectividad</span>;
      case 'Expensas':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"><Building2 className="w-3 h-3" /> Expensas / Consorcio</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold"><FileText className="w-3 h-3" /> {bill.tipo_servicio}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 w-full max-w-full min-w-0">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3.5 sm:p-4 rounded-2xl border border-slate-800 w-full max-w-full min-w-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-base sm:text-xl font-extrabold text-white truncate max-w-[200px] sm:max-w-none">
              {bill.proveedor || 'Servicio'}
            </h2>
            {getServiceBadge()}
          </div>
          {bill.periodo_facturado && (
            <span className="text-xs text-slate-400 hidden sm:inline">
              • Período: {bill.periodo_facturado}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto min-w-0">
          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-1 sm:col-span-auto flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors min-h-[40px] text-center"
              title="Descargar factura original del portal de la empresa"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Portal Descarga</span>
              <ExternalLink className="w-3 h-3 opacity-60 shrink-0 hidden xs:inline" />
            </a>
          )}

          {record.filePreviewUrl && (
            <button
              onClick={() => setShowDocPreview(!showDocPreview)}
              className="col-span-1 sm:col-span-auto flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors min-h-[40px] text-center"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{showDocPreview ? 'Ocultar' : 'Ver Comprobante'}</span>
            </button>
          )}

          <button
            onClick={onNewAnalysis}
            className={`${downloadUrl && record.filePreviewUrl ? 'col-span-2' : 'col-span-1'} sm:col-span-auto flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 min-h-[40px] text-center`}
          >
            <span className="truncate">Subir otra factura</span>
          </button>
        </div>
      </div>

      {/* Optional Document Preview Drawer */}
      {showDocPreview && record.filePreviewUrl && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-2xl relative">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
              Vista del documento original / comprobante
            </span>
            <button
              onClick={() => setShowDocPreview(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800"
            >
              Cerrar
            </button>
          </div>
          <div className="flex justify-center max-h-[500px] overflow-auto rounded-lg bg-black/60 p-2">
            <img
              src={record.filePreviewUrl}
              alt="Comprobante analizado"
              className="max-h-[460px] object-contain rounded shadow"
            />
          </div>
        </div>
      )}

      {/* Hero Anomaly Alert Banner */}
      {hasAnomalies ? (
        <div className="bg-gradient-to-r from-rose-950/70 via-red-950/50 to-slate-900 border border-rose-500/40 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500 text-slate-950 text-[10px] sm:text-[11px] font-black uppercase">
                    Alerta de Auditoría
                  </span>
                  {bill.alerta_aumento && (
                    <span className="text-xs font-semibold text-rose-300">
                      Aumento inusual detectado
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-white break-words">
                  {bill.resumen_ejecutivo || (bill.explicacion_en_criollo ? bill.explicacion_en_criollo.split('\n')[0].replace(/^[#*📌\s]+/, '') : `Liquidación de ${bill.proveedor || 'Servicio'}`)}
                </h3>
                {suspiciousCharges.length > 0 && (
                  <p className="text-xs sm:text-sm text-rose-200 break-words">
                    Cargos sospechosos detectados: {suspiciousCharges.map(c => `"${c.concepto}" (${bill.moneda} ${c.monto.toLocaleString('es-AR')})`).join(', ')}.
                  </p>
                )}
              </div>
            </div>

            <div className="w-full sm:w-auto shrink-0">
              <button
                onClick={() => setActiveTab('claim')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Dónde y Cómo Reclamar</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-4 sm:p-5 shadow-lg flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
              Auditoría Limpia
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white break-words">
              {bill.resumen_ejecutivo || (bill.explicacion_en_criollo ? bill.explicacion_en_criollo.split('\n')[0].replace(/^[#*📌\s]+/, '') : `Liquidación de ${bill.proveedor || 'Servicio'}`)}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              No se hallaron cargos ocultos ni anomalías en los conceptos facturados.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Amount */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] sm:text-xs font-semibold truncate">Total a Pagar</span>
            <DollarSign className="w-4 h-4 text-cyan-400 shrink-0" />
          </div>
          <div className="text-base sm:text-xl lg:text-2xl font-black text-white tracking-tight break-words min-w-0">
            {formattedAmount}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1 truncate">
            N° Fact: {bill.numero_factura || 'Sin número'}
          </div>
        </div>

        {/* Due Date & Countdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] sm:text-xs font-semibold truncate">Vencimiento</span>
            <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
          </div>
          <div className="text-base sm:text-xl lg:text-2xl font-black text-white tracking-tight break-words min-w-0">
            {bill.fecha_vencimiento || 'N/A'}
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold mt-1 truncate">
            {bill.dias_restantes_vencimiento !== undefined && bill.dias_restantes_vencimiento !== null ? (
              bill.dias_restantes_vencimiento > 0 ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 shrink-0" /> Faltan {bill.dias_restantes_vencimiento} d
                </span>
              ) : bill.dias_restantes_vencimiento === 0 ? (
                <span className="text-rose-400 font-bold">¡Vence hoy!</span>
              ) : (
                <span className="text-rose-400">Venció hace {Math.abs(bill.dias_restantes_vencimiento)} d</span>
              )
            ) : daysRemaining !== null ? (
              daysRemaining > 0 ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 shrink-0" /> Faltan {daysRemaining} d
                </span>
              ) : (
                <span className="text-rose-400">Venció hace {Math.abs(daysRemaining)} d</span>
              )
            ) : (
              <span className="text-slate-500">Fecha no informada</span>
            )}
          </div>
        </div>

        {/* Consumption */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] sm:text-xs font-semibold truncate">Consumo Medido</span>
            <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0" />
          </div>
          <div className="text-base sm:text-xl lg:text-2xl font-black text-white tracking-tight break-words min-w-0">
            {bill.consumo_medido || (bill.consumo ? `${bill.consumo.cantidad} ${bill.consumo.unidad || ''}` : 'No medido')}
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold mt-1 text-slate-400 truncate">
            {bill.consumo?.variacion_respecto_mes_anterior_pct ? (
              bill.consumo.variacion_respecto_mes_anterior_pct > 0 ? (
                <span className="text-rose-400">
                  +{bill.consumo.variacion_respecto_mes_anterior_pct}% vs mes ant.
                </span>
              ) : (
                <span className="text-emerald-400">
                  {bill.consumo.variacion_respecto_mes_anterior_pct}% vs mes ant.
                </span>
              )
            ) : (
              <span>Auditoría de medidor</span>
            )}
          </div>
        </div>

        {/* Account / Client ID */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] sm:text-xs font-semibold truncate">N° Cuenta / Cliente</span>
            <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="text-sm sm:text-lg font-bold text-white tracking-tight break-all truncate">
            {bill.numero_cuenta || bill.numero_cliente_o_cuenta || 'No informado'}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1 truncate">
            Para reclamos y trámites
          </div>
        </div>
      </div>

      {/* Tabs Navigation Slider */}
      <div className="relative w-full max-w-full">
        {/* Subtle right gradient indicator on mobile to cue horizontal scrolling */}
        <div className="sm:hidden pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-[#0b0f19] to-transparent z-10" />

        <div className="border-b border-slate-800 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-2 px-0.5 w-full max-w-full touch-pan-x overscroll-x-contain">
          <button
            onClick={() => setActiveTab('markdown')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 whitespace-nowrap min-h-[42px] ${
              activeTab === 'markdown'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Explicación en Criollo</span>
          </button>

          <button
            onClick={() => setActiveTab('claim')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 whitespace-nowrap min-h-[42px] ${
              activeTab === 'claim'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Dónde y Cómo Reclamar</span>
            {suspiciousCharges.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('portals')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 whitespace-nowrap min-h-[42px] ${
              activeTab === 'portals'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Descargar Facturas Oficiales</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 whitespace-nowrap min-h-[42px] ${
              activeTab === 'calendar'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Recordatorio & Calendario</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 whitespace-nowrap min-h-[42px] ${
              activeTab === 'chat'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Pregúntale a FacturaClara</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="w-full max-w-full min-w-0">
        {/* Tab 1: Explicación en Criollo */}
        {activeTab === 'markdown' && (
          <div className="space-y-6 w-full max-w-full min-w-0">
            <MarkdownViewer content={bill.explicacion_en_criollo || record.markdownText || ''} />

            {/* Quick access cards to download portal & claim */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {downloadUrl && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-cyan-400 uppercase">Portal Oficial de Descarga</span>
                    <h5 className="font-bold text-sm text-white">{downloadName}</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Baja duplicados o historial de comprobantes</p>
                  </div>
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors shrink-0"
                    title="Ir a descargar"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {claimWebUrl && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-rose-400 uppercase">Canal de Reclamo Oficial</span>
                    <h5 className="font-bold text-sm text-white">{bill.proveedor}</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Presenta tu queja formal con número de gestión</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('claim')}
                    className="p-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold transition-colors shrink-0"
                    title="Ver canales de reclamo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Extra charges table if present */}
            {bill.cargos_extra_o_anomalias && bill.cargos_extra_o_anomalias.length > 0 && (
              <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  <span>Desglose de Cargos Extra o Conceptos Singulares</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                      <tr>
                        <th className="p-3 rounded-l-xl">Concepto</th>
                        <th className="p-3">Monto</th>
                        <th className="p-3">Estado Auditoría</th>
                        <th className="p-3 rounded-r-xl">Explicación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {bill.cargos_extra_o_anomalias.map((cargo, idx) => (
                        <tr key={idx} className={cargo.es_sospechoso ? 'bg-rose-950/20' : ''}>
                          <td className="p-3 font-medium text-white">{cargo.concepto}</td>
                          <td className="p-3 font-mono font-bold">
                            {bill.moneda} {cargo.monto.toLocaleString('es-AR')}
                          </td>
                          <td className="p-3">
                            {cargo.es_sospechoso ? (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                                🚨 Sospechoso / Reclamable
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px]">
                                Habitual / Reglamentario
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-400">{cargo.explicacion || 'Concepto incluido en la factura.'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Dónde y Cómo Reclamar */}
        {activeTab === 'claim' && (
          <div className="space-y-6">
            {/* Interactive Channels Card */}
            <div className="bg-slate-900/90 rounded-2xl border border-rose-500/30 p-6 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    <span>Canales Oficiales: ¿Dónde Presentar tu Reclamo?</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Utiliza estos canales oficiales para {bill.proveedor} y exige tu N° de trámite.
                  </p>
                </div>
                <button
                  onClick={() => setIsPortalsModalOpen(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline"
                >
                  Ver directorio de otras empresas
                </button>
              </div>

              {/* Channel Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {claimWebUrl && (
                  <a
                    href={claimWebUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block">Canal Web Oficial</span>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300">Portal de Reclamos</span>
                    </div>
                    <Globe className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  </a>
                )}

                {claimWhatsapp && (
                  <a
                    href={`https://wa.me/${claimWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola, necesito iniciar un reclamo comercial por mi factura de ${bill.proveedor} cuenta N° ${bill.numero_cliente_o_cuenta || ''}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block">WhatsApp Oficial</span>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300">{claimWhatsapp}</span>
                    </div>
                    <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </a>
                )}

                {claimPhone && (
                  <a
                    href={`tel:${claimPhone.split('/')[0].replace(/[^0-9]/g, '')}`}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-400 block">Línea Telefónica</span>
                      <span className="text-xs font-bold text-white group-hover:text-blue-300">{claimPhone}</span>
                    </div>
                    <Phone className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  </a>
                )}

                {regulatoryUrl && (
                  <a
                    href={regulatoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-400 block">Ente Regulador</span>
                      <span className="text-xs font-bold text-white group-hover:text-purple-300 truncate max-w-[140px] block">{regulatoryName}</span>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  </a>
                )}
              </div>

              {/* Step by step tips */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs space-y-2">
                <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider">
                  📌 Pasos clave para que tu reclamo prospere:
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Copia el formulario de abajo y envíalo por WhatsApp oficial o a través del portal de reclamos.</li>
                  <li><strong>Exige siempre el Número de Reclamo / Trámite.</strong> Sin este número, el reclamo no existe legalmente.</li>
                  <li>La empresa tiene un plazo legal de <strong>10 a 15 días hábiles</strong> para responder formalmente.</li>
                  <li>Si no responden o rechazan el pedido, ingresa a <a href={regulatoryUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold">{regulatoryName}</a> o a <a href="https://www.consumidor.gob.ar" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold">COPREC / Defensa del Consumidor</a> e inicia la mediación gratuita adjuntando el N° de gestión.</li>
                </ol>
              </div>
            </div>

            {/* Dispute Letter Template */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-400 shrink-0" />
                    <span>Texto Formal de Reclamo (Listo para Copiar)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pégalo en el chat de WhatsApp, correo o formulario web del prestador.
                  </p>
                </div>

                <button
                  onClick={handleCopyClaim}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 active:scale-95 text-slate-950 text-xs font-bold transition-all shadow min-h-[42px]"
                >
                  {claimCopied ? <Check className="w-4 h-4 shrink-0" /> : <Copy className="w-4 h-4 shrink-0" />}
                  <span>{claimCopied ? '¡Texto Copiado!' : 'Copiar Texto de Reclamo'}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={generateClaimLetter(bill)}
                rows={14}
                className="w-full p-3.5 sm:p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs leading-relaxed text-slate-200 resize-none focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Descargar Facturas Oficiales */}
        {activeTab === 'portals' && (
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Páginas Oficiales para Descargar Facturas
                  </h4>
                  <p className="text-xs text-slate-400">
                    Baja comprobantes oficiales, duplicados y consulta consumos históricos
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPortalsModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 text-xs font-bold transition-colors min-h-[40px] text-center"
              >
                Abrir Directorio Completo
              </button>
            </div>

            {/* Current Provider Highlight */}
            {downloadUrl && (
              <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase">
                    Comprobante Actual: {bill.proveedor}
                  </span>
                  <h5 className="text-base sm:text-lg font-bold text-white mt-1 break-words">{downloadName}</h5>
                  <p className="text-xs text-slate-400 mt-0.5 break-words">
                    Requisitos para acceder: {bill.portal_descarga?.requisitos_acceso || directoryInfo?.requirements || 'N° de Cliente y DNI'}
                  </p>
                  {directoryInfo?.appMovil && (
                    <p className="text-xs text-slate-400 mt-1">
                      📱 App móvil oficial: <strong className="text-slate-300">{directoryInfo.appMovil}</strong>
                    </p>
                  )}
                </div>

                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all shrink-0 min-h-[42px]"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Ir al Portal Oficial</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            )}

            {/* Quick Directory Grid of Major Providers */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Otras Empresas de Servicios Públicos y Privados:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <a
                  href="https://www.edenordigital.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-colors group block"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-cyan-300">
                    <span>Edenor Digital</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="text-[11px] text-slate-400">Luz • CABA y GBA Norte</span>
                </a>

                <a
                  href="https://oficinavirtual.edesur.com.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-colors group block"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-cyan-300">
                    <span>Edesur Oficina Virtual</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="text-[11px] text-slate-400">Luz • CABA y GBA Sur</span>
                </a>

                <a
                  href="https://www.metrogas.com.ar/seccion/usuarios/mi-cuenta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-orange-500/40 rounded-xl transition-colors group block"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-orange-300">
                    <span>MetroGAS Mi Cuenta</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="text-[11px] text-slate-400">Gas Natural • CABA y Sur</span>
                </a>

                <a
                  href="https://oficinavirtual.aysa.com.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-blue-500/40 rounded-xl transition-colors group block"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-blue-300">
                    <span>AySA Oficina Virtual</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="text-[11px] text-slate-400">Agua y Saneamiento • AMBA</span>
                </a>

                <a
                  href="https://www.personal.com.ar/mi-personal/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-purple-500/40 rounded-xl transition-colors group block"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-purple-300">
                    <span>Mi Personal Flow</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="text-[11px] text-slate-400">Internet, TV y Móvil</span>
                </a>

                <a
                  href="https://consorcioabierto.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-xl transition-colors group block"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-emerald-300">
                    <span>ConsorcioAbierto / Expensas</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="text-[11px] text-slate-400">Expensas de Edificios</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Recordatorio & Calendario */}
        {activeTab === 'calendar' && (
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Programa tu Recordatorio de Pago
                </h4>
                <p className="text-xs text-slate-400">
                  Evita recargos por mora o cortes de servicio con una alerta anticipada de 48 horas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Google Calendar */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                    <span>Google Calendar</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300 text-[10px]">Directo</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Abre Google Calendar con el evento ya creado con el monto, número de cuenta y fecha de vencimiento.
                  </p>
                </div>
                <a
                  href={getGoogleCalendarUrl(bill)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Agregar a Google Calendar</span>
                </a>
              </div>

              {/* Apple / Outlook / iCal */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                    <span>Archivo iCalendar (.ics)</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-900/50 text-cyan-300 text-[10px]">Universal</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Descarga el archivo .ics compatible con Apple Calendar (iPhone/Mac), Outlook y cualquier gestor de calendario.
                  </p>
                </div>
                <button
                  onClick={handleDownloadIcs}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Descargar Archivo .ics</span>
                </button>
              </div>
            </div>

            {/* Tip Card */}
            <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-200">
                <strong>Consejo de FacturaClara:</strong> La mayoría de los servicios cortan o aplican intereses punitorios de hasta 6% mensual apenas transcurre el segundo vencimiento. Si tienes débito automático, revisa que tu cuenta bancaria tenga fondos disponibles 24 horas antes del {bill.fecha_vencimiento}.
              </p>
            </div>
          </div>
        )}

        {/* Tab 6: Pregúntale a FacturaClara (Chat) */}
        {activeTab === 'chat' && (
          <ChatBill billData={bill} />
        )}
      </div>

      {/* Official Portals Directory Modal */}
      <OfficialPortalsModal
        isOpen={isPortalsModalOpen}
        onClose={() => setIsPortalsModalOpen(false)}
        defaultService={bill.tipo_servicio}
      />
    </div>
  );
};
