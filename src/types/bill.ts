export type TipoServicio = 'Luz' | 'Gas' | 'Agua' | 'Internet' | 'Expensas' | 'Telefonía' | 'Otro';

export interface CanalesReclamo {
  web_portal?: string;
  whatsapp?: string;
  telefono?: string;
  ente_regulador_nombre?: string;
  ente_regulador_web?: string;
  instrucciones_paso_a_paso?: string[];
}

export interface PortalOficialDescarga {
  nombre_portal: string;
  url: string;
  app_movil?: string;
  requisitos_acceso?: string;
}

export interface CargoAnomalia {
  concepto: string;
  monto: number;
  es_sospechoso: boolean;
  explicacion?: string;
}

export interface ConsumoDetallado {
  cantidad: number;
  unidad: string | null;
  variacion_respecto_mes_anterior_pct?: number;
}

export interface BillStructuredData {
  proveedor: string | null;
  tipo_servicio: TipoServicio;
  numero_cuenta: string | null;
  numero_factura: string | null;
  periodo_facturado: string | null;
  fecha_vencimiento: string; // YYYY-MM-DD
  monto_total: number;
  moneda: string; // 'ARS'
  consumo_medido: string | null; // ej: "480 kWh" o "95 m3"
  explicacion_en_criollo: string; // Texto detallado en Markdown
  dias_restantes_vencimiento: number;
  
  // Enriquecimientos y compatibilidad analítica
  consumo?: ConsumoDetallado;
  cargos_extra_o_anomalias?: CargoAnomalia[];
  alerta_aumento?: boolean;
  resumen_ejecutivo?: string;
  portal_descarga?: PortalOficialDescarga;
  canales_reclamo?: CanalesReclamo;
  numero_cliente_o_cuenta?: string | null; // alias para compatibilidad
}

export interface AnalysisRecord {
  id: string;
  createdAt: string; // ISO string
  fileName?: string;
  filePreviewUrl?: string;
  billData: BillStructuredData;
  markdownText?: string;
  userNote?: string;
}

export interface ProviderDirectoryEntry {
  id: string;
  name: string;
  service: TipoServicio;
  logoText: string;
  downloadPortalName: string;
  downloadUrl: string;
  appMovil?: string;
  requirements: string;
  claimWebUrl: string;
  claimPhone: string;
  claimWhatsapp?: string;
  regulatoryAgencyName: string;
  regulatoryAgencyUrl: string;
  complaintTips: string[];
}

export interface SampleInvoice {
  id: string;
  name: string;
  company: string;
  service: TipoServicio;
  tag: string;
  amount: string;
  description: string;
  badgeColor: string;
  imageDataUri: string;
  precomputedData: BillStructuredData;
}
