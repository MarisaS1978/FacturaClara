import React from 'react';
import { Sparkles, ShieldCheck, History, FileText, Zap, HelpCircle } from 'lucide-react';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenPortals: () => void;
  onOpenSavings: () => void;
  onNewAnalysis: () => void;
  hasActiveBill: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onOpenPortals,
  onOpenSavings,
  onNewAnalysis,
  hasActiveBill,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 w-full max-w-full">
        {/* Brand */}
        <div 
          onClick={onNewAnalysis}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group transition-transform active:scale-95 min-w-0 shrink"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20 shrink-0">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-base sm:text-lg text-white tracking-tight truncate">
                Factura<span className="text-cyan-400">Clara</span>
              </span>
              <span className="hidden min-[380px]:inline-block px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 rounded shrink-0">
                AI Vision
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden md:block truncate">
              Auditoría financiera y traducción en criollo
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={onOpenSavings}
            className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/50 rounded-xl text-xs font-semibold transition-colors min-h-[36px]"
            title="Ver consejos de ahorro del hogar"
          >
            <span className="shrink-0 text-sm">💡</span>
            <span className="hidden sm:inline">Consejos de Ahorro</span>
            <span className="hidden min-[480px]:inline sm:hidden">Ahorro</span>
          </button>

          <button
            onClick={onOpenPortals}
            className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-xs font-semibold transition-colors min-h-[36px]"
            title="Ver páginas oficiales para descargar facturas y hacer reclamos"
          >
            <span className="shrink-0 text-sm">📥</span>
            <span className="hidden sm:inline">Portales & Reclamos</span>
            <span className="hidden min-[480px]:inline sm:hidden">Portales</span>
          </button>

          {hasActiveBill && (
            <button
              onClick={onNewAnalysis}
              className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-medium transition-colors min-h-[36px]"
              title="Analizar otra factura"
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Nueva Factura</span>
              <span className="hidden min-[480px]:inline sm:hidden">Nueva</span>
            </button>
          )}

          <button
            onClick={onOpenHistory}
            className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors min-h-[36px]"
            title="Ver historial de comprobantes"
          >
            <History className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="hidden min-[480px]:inline">Historial</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center justify-center shrink-0">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
