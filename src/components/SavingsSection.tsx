import React, { useState, useMemo } from 'react';
import {
  Zap,
  Flame,
  Wifi,
  Building2,
  Droplet,
  PiggyBank,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Lightbulb,
  ArrowRight,
  Calculator
} from 'lucide-react';
import { TipoServicio, BillStructuredData } from '../types/bill';
import { SAVINGS_GUIDES, RASE_SUBSIDY_INFO, SavingsActionItem } from '../data/savingsTips';

interface SavingsSectionProps {
  currentBill?: BillStructuredData;
  defaultService?: TipoServicio;
  onOpenPortalsModal?: () => void;
}

export const SavingsSection: React.FC<SavingsSectionProps> = ({
  currentBill,
  defaultService,
  onOpenPortalsModal,
}) => {
  // Determine starting service
  const initialService = (currentBill?.tipo_servicio as TipoServicio) || defaultService || 'Luz';
  const [activeService, setActiveService] = useState<string>(
    SAVINGS_GUIDES[initialService] ? initialService : 'Luz'
  );

  // Track checked action IDs
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>(() => {
    // By default, check highlighted tips
    const initial: Record<string, boolean> = {};
    const guide = SAVINGS_GUIDES[initialService] || SAVINGS_GUIDES['Luz'];
    guide.actions.forEach((a) => {
      if (a.highlight) initial[a.id] = true;
    });
    return initial;
  });

  const [copied, setCopied] = useState(false);

  const guide = SAVINGS_GUIDES[activeService] || SAVINGS_GUIDES['Luz'];

  // Toggle item in checklist
  const toggleAction = (id: string) => {
    setCheckedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Calculate live savings
  const { totalMonthlySavings, totalAnnualSavings, checkedCount } = useMemo(() => {
    let monthly = 0;
    let count = 0;
    guide.actions.forEach((a) => {
      if (checkedIds[a.id]) {
        monthly += a.estimatedMonthlySavings;
        count += 1;
      }
    });
    return {
      totalMonthlySavings: monthly,
      totalAnnualSavings: monthly * 12,
      checkedCount: count,
    };
  }, [checkedIds, guide]);

  // Savings percentage relative to current bill if available
  const savingsPctOfBill = useMemo(() => {
    if (!currentBill || !currentBill.monto_total || currentBill.monto_total <= 0) return null;
    const pct = Math.min(100, Math.round((totalMonthlySavings / currentBill.monto_total) * 100));
    return pct;
  }, [currentBill, totalMonthlySavings]);

  const handleCopyPlan = () => {
    const selectedActions = guide.actions.filter((a) => checkedIds[a.id]);
    let text = `💡 MI PLAN DE AHORRO EN ${guide.title.toUpperCase()} (FacturaClara AI)\n\n`;
    text += `💰 Ahorro mensual proyectado: $${totalMonthlySavings.toLocaleString('es-AR')} ARS\n`;
    text += `📅 Ahorro anual estimado: $${totalAnnualSavings.toLocaleString('es-AR')} ARS\n\n`;
    text += `Acciones a implementar:\n`;
    selectedActions.forEach((a, i) => {
      text += `${i + 1}. [x] ${a.title} (Ahorro: ~$${a.estimatedMonthlySavings.toLocaleString('es-AR')}/mes)\n   ${a.description}\n\n`;
    });
    text += `\nGenerado con FacturaClara AI - https://facturaclara.ai`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Luz': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Gas': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'Internet': return <Wifi className="w-4 h-4 text-purple-400" />;
      case 'Expensas': return <Building2 className="w-4 h-4 text-emerald-400" />;
      case 'Agua': return <Droplet className="w-4 h-4 text-cyan-400" />;
      default: return <Lightbulb className="w-4 h-4 text-yellow-400" />;
    }
  };

  const servicesList = ['Luz', 'Gas', 'Internet', 'Expensas', 'Agua'];

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <PiggyBank className="w-3.5 h-3.5 text-cyan-400" />
              <span>Optimizador Financiero del Hogar</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight break-words">
              Consejos de Ahorro y Reducción de Gastos
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Estrategias prácticas validadas para el mercado argentino: evita saltar de escalón tarifario, elimina consumos fantasma y haz valer tus derechos ante las prestadoras.
            </p>
          </div>

          {/* Calculator summary box */}
          <div className="w-full lg:w-auto shrink-0 bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-w-[260px]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5 font-medium text-cyan-300">
                <Calculator className="w-3.5 h-3.5" />
                Ahorro Potencial Seleccionado
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {checkedCount} {checkedCount === 1 ? 'tip activo' : 'tips activos'}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight my-1">
              ${totalMonthlySavings.toLocaleString('es-AR')}{' '}
              <span className="text-xs font-semibold text-slate-400">/ mes</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Proyección anual:</span>
              <strong className="text-emerald-300 font-bold">
                ${totalAnnualSavings.toLocaleString('es-AR')} / año
              </strong>
            </div>
            {savingsPctOfBill !== null && (
              <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-cyan-300 font-semibold">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Equivale a bajar un ~{savingsPctOfBill}% de tu factura actual</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 w-full max-w-full touch-pan-x">
        {servicesList.map((srv) => (
          <button
            key={srv}
            onClick={() => setActiveService(srv)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 whitespace-nowrap min-h-[42px] ${
              activeService === srv
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {getServiceIcon(srv)}
            <span>{srv}</span>
            {currentBill?.tipo_servicio === srv && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Servicio de tu factura" />
            )}
          </button>
        ))}
      </div>

      {/* Service Banner Tip */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
            Dato clave para {guide.title}:
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {guide.bannerTip}
          </p>
        </div>
      </div>

      {/* Interactive Action Items Grid */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Checklist Interactivo de Ahorro ({guide.actions.length} acciones)</span>
          </h3>
          <button
            onClick={handleCopyPlan}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700 min-h-[36px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? '¡Plan Copiado!' : 'Copiar Mi Plan de Ahorro'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {guide.actions.map((action) => {
            const isChecked = Boolean(checkedIds[action.id]);

            return (
              <div
                key={action.id}
                onClick={() => toggleAction(action.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                  isChecked
                    ? 'bg-slate-900/95 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Checkbox button */}
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors border ${
                    isChecked
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-600 bg-slate-900 hover:border-cyan-400'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className={`text-xs sm:text-sm font-bold transition-colors ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                      {action.title}
                    </h4>
                    <span className="text-xs font-extrabold text-emerald-400 shrink-0 font-mono">
                      +${action.estimatedMonthlySavings.toLocaleString('es-AR')}/mes
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                    {action.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {action.category}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      action.difficulty === 'Fácil'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : action.difficulty === 'Media'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                    }`}>
                      Dificultad: {action.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subsidies Guide (RASE) Section */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                Subsidios Estatales RASE: ¿Cómo saber si calificas?
              </h4>
              <p className="text-xs text-slate-400">
                Segmentación tarifaria de luz y gas natural del Gobierno Nacional
              </p>
            </div>
          </div>

          <a
            href={RASE_SUBSIDY_INFO.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shrink-0"
          >
            <span>Inscribirme en RASE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {RASE_SUBSIDY_INFO.levels.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{item.level}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                  {item.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
