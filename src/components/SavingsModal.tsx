import React from 'react';
import { X, PiggyBank } from 'lucide-react';
import { SavingsSection } from './SavingsSection';
import { TipoServicio } from '../types/bill';

interface SavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: TipoServicio;
}

export const SavingsModal: React.FC<SavingsModalProps> = ({
  isOpen,
  onClose,
  defaultService,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-white text-base sm:text-lg truncate">
                Guía de Consejos de Ahorro del Hogar
              </h3>
              <p className="text-xs text-slate-400 truncate">
                Reduce tus facturas de luz, gas, internet, expensas y agua
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <SavingsSection defaultService={defaultService} />
        </div>
      </div>
    </div>
  );
};
