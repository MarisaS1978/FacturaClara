import { BillStructuredData } from '../types/bill';
import { findProviderDirectoryEntry } from '../data/providerPortals';

export function generateClaimLetter(bill: BillStructuredData): string {
  const providerInfo = findProviderDirectoryEntry(bill.proveedor || '', bill.tipo_servicio);
  const suspiciousCharges = bill.cargos_extra_o_anomalias?.filter((c) => c.es_sospechoso) || [];
  
  const itemsText = suspiciousCharges.length > 0
    ? suspiciousCharges.map((c) => `  - ${c.concepto}: ${bill.moneda} ${c.monto.toLocaleString('es-AR')}${c.explicacion ? ` (${c.explicacion})` : ''}`).join('\n')
    : `  - Incremento o concepto no convenido en período ${bill.periodo_facturado || 'actual'}`;

  const channelLines: string[] = [];
  if (providerInfo) {
    if (providerInfo.claimWebUrl) channelLines.push(`• Portal Web Oficial de Reclamos: ${providerInfo.claimWebUrl}`);
    if (providerInfo.claimWhatsapp) channelLines.push(`• Canal WhatsApp Oficial: ${providerInfo.claimWhatsapp}`);
    if (providerInfo.claimPhone) channelLines.push(`• Línea Telefónica de Atención: ${providerInfo.claimPhone}`);
    if (providerInfo.regulatoryAgencyName) channelLines.push(`• Ente Regulador competente: ${providerInfo.regulatoryAgencyName} (${providerInfo.regulatoryAgencyUrl})`);
  }

  return `=====================================================
📋 FORMULARIO DE RECLAMO / IMPUGNACIÓN DE FACTURA
=====================================================
Dirigido a: ${bill.proveedor || 'Empresa Prestadora'} (${bill.tipo_servicio})
Número de Cuenta / Cliente: ${bill.numero_cuenta || bill.numero_cliente_o_cuenta || '[Completar N° de Cliente]'}
Factura N°: ${bill.numero_factura || 'Liquidación período ' + (bill.periodo_facturado || 'actual')}
Fecha de Vencimiento: ${bill.fecha_vencimiento}
Monto Total Liquidado: ${bill.moneda} ${bill.monto_total.toLocaleString('es-AR')}

-----------------------------------------------------
DETALLE DE CONCEPTOS OBSERVADOS E IMPUGNADOS:
-----------------------------------------------------
${itemsText}

${bill.alerta_aumento ? `Asimismo, se constata un aumento desproporcionado respecto al consumo habitual o tarifa convenida en el período (${bill.periodo_facturado || 'actual'}).\n` : ''}
PETITORIO:
1. La revisión inmediata de la liquidación emitida y suspensión transitoria de los cargos impugnados.
2. La anulación y emisión de la correspondiente Nota de Crédito por los conceptos improcedentes.
3. La emisión de un comprobante de pago ajustado a derecho previo a la fecha límite (${bill.fecha_vencimiento}) a fin de no generar intereses punitorios ni corte del suministro.
4. Se me informe el NÚMERO DE GESTIÓN / RECLAMO para su debido seguimiento legal.

De no mediar respuesta favorable en los plazos reglamentarios (Ley 24.240 de Defensa del Consumidor), se procederá a elevar la correspondiente denuncia ante el Ente Regulador competente y la Dirección Nacional de Defensa del Consumidor / COPREC.

Atentamente,
Titular: [Nombre y Apellido]
DNI: [Número de DNI]
Teléfono de contacto: [Teléfono]
Email: [Correo electrónico]

-----------------------------------------------------
📍 DÓNDE PRESENTAR ESTE RECLAMO:
-----------------------------------------------------
${channelLines.length > 0 ? channelLines.join('\n') : '• Presentar ante los canales oficiales de atención al cliente de la empresa.'}
• En caso de silencio o rechazo: Denuncia ante Defensa del Consumidor (argentina.gob.ar/defensadelconsumidor) o COPREC (consumidor.gob.ar).`;
}
