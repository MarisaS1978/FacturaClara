import React, { useState } from 'react';
import { Download, ExternalLink, Phone, MessageSquare, ShieldCheck, Search, X, Zap, Flame, Wifi, Building2, FileText, ChevronRight } from 'lucide-react';
import { PROVIDER_DIRECTORY, UNIVERSAL_REGULATORY_AGENCIES } from '../data/providerPortals';
import { TipoServicio } from '../types/bill';

interface OfficialPortalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: TipoServicio;
}

export const OfficialPortalsModal: React.FC<OfficialPortalsModalProps> = ({
  isOpen,
  onClose,
  defaultService,
}) => {
  const [selectedService, setSelectedService] = useState<string>(defaultService || 'Todos');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const services = ['Todos', 'Luz', 'Gas', 'Agua', 'Internet', 'Expensas'];

  const filteredProviders = PROVIDER_DIRECTORY.filter((provider) => {
    const matchesService = selectedService === 'Todos' || provider.service === selectedService;
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.downloadPortalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.regulatoryAgencyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesService && matchesSearch;
  });

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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                Portales Oficiales: Descarga de Facturas y Canales de Reclamo
              </h3>
              <p className="text-xs text-slate-400">
                Enlaces directos a oficinas virtuales, WhatsApp oficiales y entes reguladores
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center gap-3">
          {/* Service tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            {services.map((srv) => (
              <button
                key={srv}
                onClick={() => setSelectedService(srv)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedService === srv
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {srv}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por empresa (Edenor, Metrogas, AySA, Personal, etc.)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Provider Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all"
              >
                <div>
                  {/* Top info */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200">
                      {getServiceIcon(provider.service)}
                      <span>{provider.service}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-cyan-400">
                      Oficial y Verificado
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-1">
                    {provider.name}
                  </h4>

                  <div className="text-xs text-slate-400 space-y-1.5 mb-3">
                    <p className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <span className="text-cyan-400">📥 Dónde descargar:</span> {provider.downloadPortalName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Requisitos: {provider.requirements}
                    </p>
                    {provider.appMovil && (
                      <p className="text-[11px] text-slate-400">
                        📱 App móvil: {provider.appMovil}
                      </p>
                    )}
                  </div>

                  {/* Reclamos block */}
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                    <div className="font-bold text-rose-300 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <span>⚖️ Dónde hacer reclamos:</span>
                    </div>
                    {provider.claimPhone && (
                      <p className="text-slate-300 flex items-center gap-1.5 text-[11px]">
                        <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Tel: {provider.claimPhone}</span>
                      </p>
                    )}
                    {provider.claimWhatsapp && (
                      <p className="text-slate-300 flex items-center gap-1.5 text-[11px]">
                        <MessageSquare className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>WhatsApp: {provider.claimWhatsapp}</span>
                      </p>
                    )}
                    <p className="text-slate-400 text-[11px] pt-1">
                      Ente regulador: <strong className="text-slate-300">{provider.regulatoryAgencyName}</strong>
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
                  <a
                    href={provider.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 min-h-[40px] px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center"
                  >
                    <Download className="w-3.5 h-3.5 shrink-0" />
                    <span>Descargar Factura</span>
                    <ExternalLink className="w-3 h-3 opacity-70 shrink-0" />
                  </a>

                  <a
                    href={provider.claimWebUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-rose-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700 text-center"
                  >
                    <span>Portal de Reclamos</span>
                    <ExternalLink className="w-3 h-3 opacity-70 shrink-0" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Universal Consumer Protection & Regulatory Bodies */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>¿La empresa no te responde o rechaza el reclamo? Entes de Escalación:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {UNIVERSAL_REGULATORY_AGENCIES.map((agency, idx) => (
                <a
                  key={idx}
                  href={agency.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-colors group block"
                >
                  <div className="font-bold text-xs text-white group-hover:text-cyan-300 flex items-center justify-between">
                    <span>{agency.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {agency.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
