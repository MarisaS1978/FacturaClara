import React from 'react';
import { ArrowDownToLine, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'compact' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header',
}) => {
  const {
    canInstall,
    isInstalled,
    isIOS,
    isAndroid,
    hasNativePrompt,
    showModal,
    setShowModal,
    triggerInstall,
  } = usePWAInstall();

  const handleClick = () => {
    if (hasNativePrompt) {
      triggerInstall();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`group relative flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all duration-200 min-h-[36px] cursor-pointer ${
          isInstalled
            ? 'bg-slate-900/60 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30'
            : 'bg-gradient-to-r from-cyan-600/25 via-blue-600/20 to-indigo-600/25 hover:from-cyan-600/40 hover:via-blue-600/30 hover:to-indigo-600/35 text-cyan-200 hover:text-white border border-cyan-500/40 hover:border-cyan-400 shadow-sm shadow-cyan-500/10 active:scale-95'
        } ${className}`}
        title={
          isInstalled
            ? 'FacturaClara ya está instalada como acceso directo'
            : 'Instalar acceso directo en tu celular o PC'
        }
        aria-label="Instalar acceso directo de FacturaClara"
      >
        {isInstalled ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden min-[520px]:inline text-emerald-300">Instalada</span>
          </>
        ) : (
          <>
            <div className="relative shrink-0 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-cyan-300 group-hover:text-cyan-200 transition-colors" />
              <ArrowDownToLine className="w-2.5 h-2.5 text-white absolute -bottom-1 -right-1 bg-cyan-600 rounded-full p-[1px]" />
            </div>
            <span className="hidden min-[480px]:inline sm:hidden font-medium">Instalar</span>
            <span className="hidden sm:inline font-medium">Instalar Acceso Directo</span>
          </>
        )}
      </button>

      <PWAInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onNativeInstall={triggerInstall}
        hasNativePrompt={hasNativePrompt}
        isIOS={isIOS}
        isAndroid={isAndroid}
        isInstalled={isInstalled}
      />
    </>
  );
};
