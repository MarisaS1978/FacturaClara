import { BillStructuredData } from '../types/bill';

/**
 * Creates an .ics file content for an analyzed bill reminder (set 2 days before due date)
 */
export function generateIcsCalendarEvent(bill: BillStructuredData): string {
  const dueDateStr = bill.fecha_vencimiento.replace(/-/g, '');
  const nowStr = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  // Calculate reminder date (2 days before)
  const dueDate = new Date(bill.fecha_vencimiento + 'T12:00:00');
  const reminderDate = new Date(dueDate);
  reminderDate.setDate(reminderDate.getDate() - 2);
  const reminderDateStr = reminderDate.toISOString().replace(/-/g, '').slice(0, 8);

  const summary = `Vencimiento Factura ${bill.proveedor || 'Servicio'} (${bill.moneda} ${bill.monto_total.toLocaleString('es-AR')})`;
  const description = `Recordatorio de FacturaClara AI:\\n` +
    `Proveedor: ${bill.proveedor || 'Servicio'}\\n` +
    `Servicio: ${bill.tipo_servicio}\\n` +
    `Monto: ${bill.moneda} ${bill.monto_total}\\n` +
    `N° Cliente/Cuenta: ${bill.numero_cuenta || bill.numero_cliente_o_cuenta || 'N/A'}\\n` +
    `Vence el: ${bill.fecha_vencimiento}\\n\\n` +
    `Detalle: ${(bill.explicacion_en_criollo || '').slice(0, 150)}...`;

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FacturaClara AI//Recordatorio de Facturas//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:facturaclara-${Date.now()}@facturaclara.ai`,
    `DTSTAMP:${nowStr}`,
    `DTSTART;VALUE=DATE:${dueDateStr}`,
    `DTEND;VALUE=DATE:${dueDateStr}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P2D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Recordatorio: ${summary} vence en 2 días`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return icsLines.join('\r\n');
}

/**
 * Generates a Google Calendar Web Intent URL
 */
export function getGoogleCalendarUrl(bill: BillStructuredData): string {
  const dueDate = bill.fecha_vencimiento.replace(/-/g, '');
  const title = encodeURIComponent(`Pagar Factura ${bill.proveedor || 'Servicio'} - ${bill.moneda} ${bill.monto_total.toLocaleString('es-AR')}`);
  const details = encodeURIComponent(
    `Recordatorio generado por FacturaClara AI:\n` +
    `Empresa: ${bill.proveedor || 'Servicio'} (${bill.tipo_servicio})\n` +
    `Monto a pagar: ${bill.moneda} ${bill.monto_total}\n` +
    `N° Cuenta: ${bill.numero_cuenta || bill.numero_cliente_o_cuenta || 'N/A'}\n` +
    `Vencimiento: ${bill.fecha_vencimiento}\n` +
    `Detalle: ${(bill.explicacion_en_criollo || '').slice(0, 150)}...`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dueDate}/${dueDate}&details=${details}&add=msandroni@gmail.com`;
}
