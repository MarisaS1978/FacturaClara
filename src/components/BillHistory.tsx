import React from 'react';
import { History, Trash2, ArrowRight, Zap, Flame, Wifi, Building2, FileText, DollarSign, Calendar, X } from 'lucide-react';
import { AnalysisRecord } from '../types/bill';

interface BillHistoryProps {
  records: AnalysisRecord[];
  onSelectRecord: (record: AnalysisRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const BillHistory: React.FC<BillHistoryProps> = ({
  records,
  onSelectRecord,
  onDeleteRecord,
  onClearAll,
  onClose,
}) => {
  // Calculate total expenditure
  const totalAmount = records.reduce((acc, curr) => acc + (curr.billData?.monto_total || 0), 0);

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Historial de Facturas del Hogar</h3>
              <p className="text-xs text-slate-400">{records.length} comprobantes guardados localmente</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {records.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-3 py-1 rounded-lg text-rose-400 hover:bg-rose-950/40 text-xs font-semibold transition-colors"
              >
                Limpiar todo
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Total Summary Ribbon */}
        {records.length > 0 && (
          <div className="px-5 py-3 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">Gasto total en servicios registrados:</span>
            <span className="text-sm font-extrabold text-cyan-300">
              $ {totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {/* Records List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {records.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <History className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">Aún no has analizado facturas.</p>
              <p className="text-xs text-slate-500 mt-1">Sube una factura o prueba con los ejemplos.</p>
            </div>
          ) : (
            records.map((rec) => {
              const bill = rec.billData;
              const hasAnomaly = bill.alerta_aumento || (bill.cargos_extra_o_anomalias && bill.cargos_extra_o_anomalias.some(c => c.es_sospechoso));

              return (
                <div
                  key={rec.id}
                  className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/30 rounded-2xl p-3.5 sm:p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer"
                  onClick={() => {
                    onSelectRecord(rec);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      {getServiceIcon(bill.tipo_servicio)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                          {bill.proveedor}
                        </h4>
                        {hasAnomaly && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold shrink-0">
                            ⚠️ Alerta
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>Vence: {bill.fecha_vencimiento}</span>
                        {bill.periodo_facturado && <span className="hidden sm:inline">• {bill.periodo_facturado}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t border-slate-800/60 sm:border-t-0">
                    <div className="text-left sm:text-right">
                      <div className="font-extrabold text-sm text-white">
                        {bill.moneda} {bill.monto_total.toLocaleString('es-AR')}
                      </div>
                      <div className="text-[10px] text-cyan-400 flex items-center sm:justify-end gap-1 font-semibold">
                        Ver informe <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecord(rec.id);
                      }}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                      title="Eliminar de historial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
