import React, { useState } from 'react';
import { X, Smartphone, Share, PlusSquare, Monitor, CheckCircle2, ArrowDownToLine, Zap } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall?: () => void;
  hasNativePrompt: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isInstalled: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onNativeInstall,
  hasNativePrompt,
  isIOS,
  isAndroid,
  isInstalled,
}) => {
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'desktop'>(
    isIOS ? 'ios' : isAndroid ? 'android' : 'desktop'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Instalar Acceso Directo
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-cyan-950 border border-cyan-800 text-cyan-300 rounded-full">
                  PWA
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Accedé a FacturaClara como una app nativa en tu pantalla
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Main Action if native prompt is ready */}
          {hasNativePrompt && !isInstalled && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/50 via-blue-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <ArrowDownToLine className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Instalación con 1 Clic</h4>
                  <p className="text-xs text-slate-300">
                    Tu navegador permite instalar el acceso directo ahora mismo.
                  </p>
                </div>
              </div>
              <button
                onClick={onNativeInstall}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition-transform active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <ArrowDownToLine className="w-4 h-4 text-slate-950" />
                Instalar Ahora
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-emerald-300">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-emerald-200">¡FacturaClara ya está instalada!</p>
                <p className="text-emerald-400/80">
                  Ya estás utilizando la aplicación desde el acceso directo de tu pantalla.
                </p>
              </div>
            </div>
          )}

          {/* Benefits pills */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span className="block text-cyan-400 font-bold mb-0.5">⚡ 1 Toque</span>
              <span className="text-[11px] text-slate-400 leading-tight">Acceso instantáneo</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span className="block text-cyan-400 font-bold mb-0.5">📱 Pantalla completa</span>
              <span className="text-[11px] text-slate-400 leading-tight">Sin barra de URL</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span className="block text-cyan-400 font-bold mb-0.5">🔒 100% Seguro</span>
              <span className="text-[11px] text-slate-400 leading-tight">Sin ocupar memoria</span>
            </div>
          </div>

          {/* Device Tabs */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">
              Guía paso a paso según tu dispositivo:
            </div>
            <div className="flex border-b border-slate-800 gap-2 mb-3">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex items-center gap-1.5 pb-2 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'android'
                    ? 'border-cyan-400 text-cyan-300 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Android / Chrome
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex items-center gap-1.5 pb-2 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'ios'
                    ? 'border-cyan-400 text-cyan-300 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Share className="w-3.5 h-3.5" />
                iPhone / iPad (Safari)
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex items-center gap-1.5 pb-2 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'desktop'
                    ? 'border-cyan-400 text-cyan-300 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                PC / Mac
              </button>
            </div>

            {/* Android Tab Content */}
            {activeTab === 'android' && (
              <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-900/60 border border-cyan-700 text-cyan-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <p>
                    Tocá el menú de tres puntos <span className="font-bold text-white">⋮</span> en la esquina superior derecha de Google Chrome.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-900/60 border border-cyan-700 text-cyan-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <p>
                    Seleccioná <span className="font-semibold text-cyan-300">"Agregar a la pantalla principal"</span> o <span className="font-semibold text-cyan-300">"Instalar aplicación"</span>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-900/60 border border-cyan-700 text-cyan-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <p>
                    Confirmá en <span className="font-bold text-white">"Instalar"</span>. ¡Listo! El icono de FacturaClara aparecerá junto a tus otras aplicaciones.
                  </p>
                </div>
              </div>
            )}

            {/* iOS Safari Tab Content */}
            {activeTab === 'ios' && (
              <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-900/60 border border-cyan-700 text-cyan-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <p className="flex items-center gap-1.5 flex-wrap">
                    En Safari, presioná el botón de <span className="font-semibold text-cyan-300 inline-flex items-center gap-1"><Share className="w-3.5 h-3.5" /> Compartir</span> en la barra inferior.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-900/60 border border-cyan-700 text-cyan-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <p className="flex items-center gap-1.5 flex-wrap">
                    Deslizá las opciones hacia abajo y tocá <span className="font-semibold text-cyan-300 inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5" /> Agregar a pantalla de inicio</span>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-900/60 border border-cyan-700 text-cyan-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <p>
                    Pulsá <span className="font-bold text-white">"Agregar"</span> en la esquina superior derecha.
                  </p>
                </div>
              </div>
            )}

            {/* Desktop Tab Content */}
            {activeTab === 'desktop' && (
              <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-900/60 border border-cyan-700 text-cyan-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <p>
                    Mirá la barra de direcciones de tu navegador (Chrome, Edge o Brave).
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-900/60 border border-cyan-700 text-cyan-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <p>
                    Hacé clic en el icono de instalación <span className="font-semibold text-cyan-300">⊕</span> o <span className="font-semibold text-cyan-300">💻</span> ubicado al final de la barra de URLs.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-900/60 border border-cyan-700 text-cyan-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <p>
                    Hacé clic en <span className="font-bold text-white">"Instalar"</span> para tener la app en tu escritorio o barra de tareas.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            FacturaClara AI • Sin descargas pesadas
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
