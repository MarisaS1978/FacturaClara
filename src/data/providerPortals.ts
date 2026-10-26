import { ProviderDirectoryEntry, TipoServicio } from '../types/bill';

export const PROVIDER_DIRECTORY: ProviderDirectoryEntry[] = [
  // LUZ / ELECTRICIDAD
  {
    id: 'edenor',
    name: 'Edenor',
    service: 'Luz',
    logoText: 'edenor',
    downloadPortalName: 'Edenor Digital (Oficina Virtual)',
    downloadUrl: 'https://www.edenordigital.com',
    appMovil: 'Edenor Digital (Android & iOS)',
    requirements: 'Número de Cuenta (10 dígitos) y DNI del titular',
    claimWebUrl: 'https://www.edenor.com/tramites-y-consultas/reclamos-comerciales',
    claimPhone: '0800-666-1000 (Comercial) / 0800-666-4004 (Técnico 24hs)',
    claimWhatsapp: '+54 9 11 3900-0000',
    regulatoryAgencyName: 'ENRE (Ente Nacional Regulador de la Electricidad)',
    regulatoryAgencyUrl: 'https://www.argentina.gob.ar/enre/gestion-de-reclamos',
    complaintTips: [
      'Pide siempre el N° de Reclamo Comercial (10 caracteres).',
      'Edenor tiene 10 días hábiles para emitir dictamen formal.',
      'Si no responden o rechazan el reclamo, eleva tu caso al ENRE adjuntando el N° de reclamo previo.',
    ],
  },
  {
    id: 'edesur',
    name: 'Edesur',
    service: 'Luz',
    logoText: 'edesur',
    downloadPortalName: 'Oficina Virtual Edesur',
    downloadUrl: 'https://oficinavirtual.edesur.com.ar',
    appMovil: 'Edesur en tu celular (Google Play & App Store)',
    requirements: 'Número de Cliente (8 dígitos) y últimos 3 dígitos del medidor',
    claimWebUrl: 'https://www.edesur.com.ar/servicios-al-cliente/reclamos-comerciales/',
    claimPhone: '0810-222-0200 (Comercial) / 0800-333-3787 (Emergencias)',
    claimWhatsapp: '+54 9 11 6187-6999',
    regulatoryAgencyName: 'ENRE (Ente Nacional Regulador de la Electricidad)',
    regulatoryAgencyUrl: 'https://www.argentina.gob.ar/enre/gestion-de-reclamos',
    complaintTips: [
      'Verifica la lectura de tu medidor antes de reclamar por consumo estimado.',
      'Anota el número de gestión y fecha límite de respuesta.',
      'Escala al ENRE si cobran conceptos no autorizados en la tarifa T1R.',
    ],
  },
  {
    id: 'edelap',
    name: 'Edelap (La Plata y región)',
    service: 'Luz',
    logoText: 'edelap',
    downloadPortalName: 'Oficina Virtual Edelap',
    downloadUrl: 'https://oficinavirtual.edelap.com.ar',
    appMovil: 'Edelap Móvil',
    requirements: 'Número de NIS y DNI',
    claimWebUrl: 'https://www.edelap.com.ar/canales-de-atencion/',
    claimPhone: '0810-222-3335 (Atención Comercial)',
    claimWhatsapp: '+54 9 221 616-0111',
    regulatoryAgencyName: 'OCEBA (Buenos Aires)',
    regulatoryAgencyUrl: 'https://oceba.gba.gov.ar',
    complaintTips: [
      'Exige número de trámite comercial.',
      'Presenta foto nítida de los números del medidor.',
    ],
  },

  // GAS NATURAL
  {
    id: 'metrogas',
    name: 'MetroGAS',
    service: 'Gas',
    logoText: 'MetroGAS',
    downloadPortalName: 'MetroGAS - Mi Cuenta (Descarga Factura)',
    downloadUrl: 'https://www.metrogas.com.ar/seccion/usuarios/mi-cuenta',
    appMovil: 'MetroGAS Móvil',
    requirements: 'Número de Cuenta / Cliente (10 dígitos) impreso en la factura',
    claimWebUrl: 'https://www.metrogas.com.ar/seccion/usuarios/contacto-y-reclamos',
    claimPhone: '0800-333-6427 (MetroTEL Clientes) / 0800-999-1050 (Emergencias 24hs)',
    claimWhatsapp: '+54 9 11 3180-2222',
    regulatoryAgencyName: 'ENARGAS (Ente Nacional Regulador del Gas)',
    regulatoryAgencyUrl: 'https://www.enargas.gob.ar/secciones/contacto-y-reclamos/reclamos-usuarios.php',
    complaintTips: [
      'Si el consumo fue estimado (letra E en factura) y no real (letra R), MetroGAS debe corregirlo.',
      'Guarda el N° de Reclamo emitido por el asistente virtual o telefonista.',
      'Plazo de resolución: 15 días hábiles antes de remitir a ENARGAS.',
    ],
  },
  {
    id: 'naturgy',
    name: 'Naturgy BAN',
    service: 'Gas',
    logoText: 'naturgy',
    downloadPortalName: 'Portal Clientes Naturgy (Oficina Online)',
    downloadUrl: 'https://clientes.naturgy.com.ar',
    appMovil: 'Naturgy Clientes Argentina',
    requirements: 'Número de Cliente y código de pago electrónico',
    claimWebUrl: 'https://www.naturgy.com.ar/hogares/contacto/canales-de-atencion/',
    claimPhone: '0810-333-46226 (Lunes a Viernes de 8 a 17 hs)',
    claimWhatsapp: '+54 9 11 4323-8900',
    regulatoryAgencyName: 'ENARGAS (Ente Nacional Regulador del Gas)',
    regulatoryAgencyUrl: 'https://www.enargas.gob.ar/secciones/contacto-y-reclamos/reclamos-usuarios.php',
    complaintTips: [
      'Verifica la categoría tarifaria (R1, R2, R3) según m³ consumidos en los últimos 6 bimestres.',
      'Si te quitaron el subsidio, reclama reincorporación en el RASE.',
    ],
  },
  {
    id: 'camuzzi',
    name: 'Camuzzi Gas (Pampeana / Sur)',
    service: 'Gas',
    logoText: 'camuzzi',
    downloadPortalName: 'Oficina Virtual Camuzzi Gas',
    downloadUrl: 'https://oficinavirtual.camuzzigas.com.ar',
    appMovil: 'Camuzzi Gas en Google Play',
    requirements: 'Número de Cuenta y correo electrónico',
    claimWebUrl: 'https://www.camuzzigas.com/contacto/',
    claimPhone: '0810-555-3698 / 0800-999-0800',
    regulatoryAgencyName: 'ENARGAS',
    regulatoryAgencyUrl: 'https://www.enargas.gob.ar',
    complaintTips: ['Presenta factura previa para contrastar el consumo promedio ponderado.'],
  },

  // AGUA CORRIENTE
  {
    id: 'aysa',
    name: 'AySA (Agua y Saneamientos Argentinos)',
    service: 'Agua',
    logoText: 'AySA',
    downloadPortalName: 'Oficina Virtual AySA - Tu Factura Digital',
    downloadUrl: 'https://oficinavirtual.aysa.com.ar',
    appMovil: 'AySA Clientes (App Oficial)',
    requirements: 'Número de Cuenta de Servicios (10 dígitos)',
    claimWebUrl: 'https://www.aysa.com.ar/usuarios/canales-de-atencion/reclamos',
    claimPhone: '0800-321-AGUA (2482) / 11-6333-2482',
    claimWhatsapp: '+54 9 11 5984-5794',
    regulatoryAgencyName: 'ERAS (Ente Regulador de Agua y Saneamiento)',
    regulatoryAgencyUrl: 'https://www.eras.gov.ar/reclamos.php',
    complaintTips: [
      'En inmuebles no medidos, el cobro se basa en superficie y coeficientes zonales.',
      'Si hay fuga en vereda o baja presión, exige número de reclamo técnico.',
      'ERAS atiende de forma gratuita en caso de falta de respuesta de AySA.',
    ],
  },

  // INTERNET / CONECTIVIDAD / CABLE
  {
    id: 'personal',
    name: 'Telecom Personal / Flow / Fibertel',
    service: 'Internet',
    logoText: 'Personal Flow',
    downloadPortalName: 'Mi Personal Flow (Web Clientes)',
    downloadUrl: 'https://www.personal.com.ar/mi-personal/login',
    appMovil: 'App Mi Personal Flow (Android / iOS)',
    requirements: 'DNI del titular o Email/Línea vinculada',
    claimWebUrl: 'https://www.personal.com.ar/ayuda/contacto',
    claimPhone: '0800-444-0800 (Atención Clientes) / *111 desde celular Personal',
    claimWhatsapp: '+54 9 11 7195-0001',
    regulatoryAgencyName: 'ENACOM & Defensa del Consumidor (COPREC)',
    regulatoryAgencyUrl: 'https://www.argentina.gob.ar/enacom/tramites/reclamos-telefonia-e-internet',
    complaintTips: [
      'Al finalizar una promoción, solicita renovación al sector "Bajas / Retenciones".',
      'Si figura alquiler de decodificador no entregado, exige número de baja de hardware.',
      'Si no resuelven en 48 hs, inicia trámite en ENACOM o COPREC (consumidor.gob.ar).',
    ],
  },
  {
    id: 'movistar',
    name: 'Movistar Argentina',
    service: 'Internet',
    logoText: 'Movistar',
    downloadPortalName: 'Mi Movistar Web - Facturación',
    downloadUrl: 'https://app.movistar.com.ar',
    appMovil: 'App Mi Movistar',
    requirements: 'DNI del titular o número de línea telefónica',
    claimWebUrl: 'https://ayuda.movistar.com.ar/canales-de-atencion/',
    claimPhone: '0800-321-0611 / *611 desde celular Movistar',
    claimWhatsapp: '+54 9 11 2261-6666',
    regulatoryAgencyName: 'ENACOM & Defensa del Consumidor',
    regulatoryAgencyUrl: 'https://www.argentina.gob.ar/enacom',
    complaintTips: [
      'Verifica si el cobro incluye suscripciones a contenidos SMS no solicitados.',
      'Pide bloqueo de compras online de terceros.',
    ],
  },
  {
    id: 'claro',
    name: 'Claro Argentina',
    service: 'Internet',
    logoText: 'Claro',
    downloadPortalName: 'Mi Claro Web - Facturas',
    downloadUrl: 'https://miclaro.claro.com.ar',
    appMovil: 'App Mi Claro',
    requirements: 'Número de línea Claro o Email y contraseña',
    claimWebUrl: 'https://www.claro.com.ar/personas/ayuda/canales-de-atencion',
    claimPhone: '0800-123-0611 / *611',
    claimWhatsapp: '+54 9 11 6806-0000',
    regulatoryAgencyName: 'ENACOM',
    regulatoryAgencyUrl: 'https://www.argentina.gob.ar/enacom',
    complaintTips: ['Exige la grabación o constancia de alta si te aplican un cargo nuevo.'],
  },
  {
    id: 'telecentro',
    name: 'Telecentro',
    service: 'Internet',
    logoText: 'Telecentro',
    downloadPortalName: 'Sucursal Virtual Telecentro',
    downloadUrl: 'https://sucursalvirtual.telecentro.com.ar',
    appMovil: 'App Telecentro',
    requirements: 'Número de Cliente y DNI',
    claimWebUrl: 'https://telecentro.com.ar/ayuda/contacto',
    claimPhone: '6380-0000 / 0800-322-9500',
    claimWhatsapp: '+54 9 11 6380-9500',
    regulatoryAgencyName: 'ENACOM & Defensa del Consumidor',
    regulatoryAgencyUrl: 'https://www.argentina.gob.ar/enacom',
    complaintTips: [
      'Pide la anulación de servicios adicionales como packs o antivirus si no los usas.',
      'Conserva constancia de reclamo por días sin servicio para exigir crédito en factura.',
    ],
  },

  // EXPENSAS / CONSORCIOS
  {
    id: 'expensas-gral',
    name: 'Expensas de Consorcios / Administraciones',
    service: 'Expensas',
    logoText: 'Expensas',
    downloadPortalName: 'Plataformas de Expensas (MisExpensas / ConsorcioAbierto / Octoplus)',
    downloadUrl: 'https://consorcioabierto.com',
    appMovil: 'ConsorcioAbierto / MisExpensas App',
    requirements: 'Código de Unidad Funcional (UF) provisto por la administración',
    claimWebUrl: 'https://buenosaires.gob.ar/defensaconsumidor/tramites/denuncia-de-inquilinos-o-propietarios-de-consorcios',
    claimPhone: '147 (CABA) o Secretaría de Comercio local',
    claimWhatsapp: '+54 9 11 5050-0147 (Boti CABA)',
    regulatoryAgencyName: 'Registro Público de Administradores (RPA) & Defensa del Consumidor',
    regulatoryAgencyUrl: 'https://www.argentina.gob.ar/produccion/defensadelconsumidor',
    complaintTips: [
      'Si eres inquilino: los gastos extraordinarios (obras edilicias duraderas, fondo de reserva) corresponden al propietario.',
      'Exige copia de los comprobantes y facturas que respaldan cada gasto de la liquidación.',
      'Verifica que el administrador esté inscripto con matrícula vigente en el RPA.',
    ],
  },
];

// Fallback universal regulatory bodies
export const UNIVERSAL_REGULATORY_AGENCIES = [
  {
    name: 'Defensa del Consumidor (Ventanilla Única Federal)',
    url: 'https://www.argentina.gob.ar/defensadelconsumidor/formulario',
    description: 'Para denunciar cargos indebidos, falta de respuesta o aumento abusivo en cualquier servicio.',
  },
  {
    name: 'COPREC (Conciliación Previa en las Relaciones de Consumo)',
    url: 'https://www.consumidor.gob.ar',
    description: 'Audiencias de mediación legal gratuitas para usuarios y empresas de servicios.',
  },
  {
    name: 'ENRE (Electricidad)',
    url: 'https://www.argentina.gob.ar/enre',
    description: 'Ente Regulador de Edenor y Edesur.',
  },
  {
    name: 'ENARGAS (Gas Natural)',
    url: 'https://www.enargas.gob.ar',
    description: 'Ente Regulador de MetroGAS, Naturgy, Camuzzi y Ecogas.',
  },
  {
    name: 'ENACOM (Internet, Telefonía y TV)',
    url: 'https://www.argentina.gob.ar/enacom',
    description: 'Ente de Comunicaciones para Personal, Movistar, Claro y Telecentro.',
  },
];

export function findProviderDirectoryEntry(
  companyName: string | null | undefined,
  serviceType: TipoServicio
): ProviderDirectoryEntry | undefined {
  if (!companyName) {
    return PROVIDER_DIRECTORY.find((p) => p.service === serviceType);
  }
  const lowerName = companyName.toLowerCase();

  // First check specific name matches
  if (lowerName.includes('edenor')) return PROVIDER_DIRECTORY.find((p) => p.id === 'edenor');
  if (lowerName.includes('edesur')) return PROVIDER_DIRECTORY.find((p) => p.id === 'edesur');
  if (lowerName.includes('edelap')) return PROVIDER_DIRECTORY.find((p) => p.id === 'edelap');
  if (lowerName.includes('metrogas')) return PROVIDER_DIRECTORY.find((p) => p.id === 'metrogas');
  if (lowerName.includes('naturgy')) return PROVIDER_DIRECTORY.find((p) => p.id === 'naturgy');
  if (lowerName.includes('camuzzi')) return PROVIDER_DIRECTORY.find((p) => p.id === 'camuzzi');
  if (lowerName.includes('aysa')) return PROVIDER_DIRECTORY.find((p) => p.id === 'aysa');
  if (lowerName.includes('personal') || lowerName.includes('telecom') || lowerName.includes('flow') || lowerName.includes('fibertel')) {
    return PROVIDER_DIRECTORY.find((p) => p.id === 'personal');
  }
  if (lowerName.includes('movistar') || lowerName.includes('telefónica')) {
    return PROVIDER_DIRECTORY.find((p) => p.id === 'movistar');
  }
  if (lowerName.includes('claro')) return PROVIDER_DIRECTORY.find((p) => p.id === 'claro');
  if (lowerName.includes('telecentro')) return PROVIDER_DIRECTORY.find((p) => p.id === 'telecentro');
  if (lowerName.includes('expensa') || lowerName.includes('consorcio') || lowerName.includes('administra') || serviceType === 'Expensas') {
    return PROVIDER_DIRECTORY.find((p) => p.id === 'expensas-gral');
  }

  // Fallback to match by service
  return PROVIDER_DIRECTORY.find((p) => p.service === serviceType);
}
