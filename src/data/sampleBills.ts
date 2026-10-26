import { SampleInvoice } from '../types/bill';

// Generate realistic SVG invoice data URIs so they can be viewed, zoomed, or passed directly to Gemini Vision
function createSvgDataUri(svgContent: string): string {
  const encoded = encodeURIComponent(svgContent.trim());
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

const edenorSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100" style="background:#ffffff; font-family:sans-serif;">
  <!-- Header Bar -->
  <rect x="0" y="0" width="800" height="110" fill="#003882"/>
  <text x="40" y="65" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="1">edenor</text>
  <text x="160" y="65" font-size="14" fill="#60a5fa">| Energía Eléctrica S.A.</text>
  <text x="760" y="45" font-size="13" text-anchor="end" fill="#93c5fd">FACTURA B - SUMINISTRO ELÉCTRICO</text>
  <text x="760" y="70" font-size="18" font-weight="bold" text-anchor="end" fill="#ffffff">N° 0041-09823412</text>

  <!-- Client & Account Block -->
  <rect x="40" y="130" width="460" height="150" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="60" y="160" font-size="13" font-weight="bold" fill="#64748b">TITULAR DEL SUMINISTRO</text>
  <text x="60" y="185" font-size="18" font-weight="bold" fill="#0f172a">CARLOS EDUARDO GÓMEZ</text>
  <text x="60" y="210" font-size="14" fill="#334155">Av. Libertador 4820, Piso 4 B - CABA</text>
  <text x="60" y="235" font-size="13" fill="#64748b">Tarifa: T1R2 Residencial | Categoría Nivel N2</text>
  <text x="60" y="258" font-size="14" font-weight="bold" fill="#003882">N° CUENTA: 2948103981-4</text>

  <!-- Due Date & Total Box -->
  <rect x="520" y="130" width="240" height="150" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <text x="640" y="160" font-size="13" font-weight="bold" text-anchor="middle" fill="#1e40af">TOTAL A PAGAR</text>
  <text x="640" y="200" font-size="30" font-weight="900" text-anchor="middle" fill="#1e3a8a">$ 48.250,00</text>
  <text x="640" y="235" font-size="13" text-anchor="middle" fill="#dc2626" font-weight="bold">VENCE: 2026-11-12</text>
  <text x="640" y="260" font-size="11" text-anchor="middle" fill="#475569">Período: Octubre 2026 (Bim. 5)</text>

  <!-- Consumption Detail Block -->
  <rect x="40" y="300" width="720" height="160" rx="8" fill="#f1f5f9"/>
  <text x="60" y="330" font-size="15" font-weight="bold" fill="#0f172a">DETALLE DE MEDICIÓN Y CONSUMO</text>
  
  <text x="60" y="365" font-size="13" fill="#475569">Lectura Anterior (15/08): 12.430 kWh</text>
  <text x="320" y="365" font-size="13" fill="#475569">Lectura Actual (15/10): 12.910 kWh</text>
  <text x="560" y="365" font-size="15" font-weight="bold" fill="#003882">Consumo: 480 kWh</text>

  <!-- History Bar Chart Simulation -->
  <text x="60" y="405" font-size="12" font-weight="bold" fill="#64748b">Historial últimos bimestres (kWh):</text>
  <rect x="250" y="415" width="40" height="30" fill="#94a3b8" rx="2"/>
  <text x="270" y="410" font-size="10" text-anchor="middle" fill="#475569">310</text>
  <rect x="310" y="400" width="40" height="45" fill="#94a3b8" rx="2"/>
  <text x="330" y="395" font-size="10" text-anchor="middle" fill="#475569">340</text>
  <rect x="370" y="390" width="40" height="55" fill="#94a3b8" rx="2"/>
  <text x="390" y="385" font-size="10" text-anchor="middle" fill="#475569">355</text>
  <rect x="430" y="365" width="40" height="80" fill="#ef4444" rx="2"/>
  <text x="450" y="360" font-size="11" font-weight="bold" text-anchor="middle" fill="#dc2626">480 (+35%)</text>
  <text x="485" y="430" font-size="11" fill="#dc2626" font-weight="bold">⚠️ Incremento notable</text>

  <!-- Concept Table -->
  <rect x="40" y="480" width="720" height="360" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
  <rect x="40" y="480" width="720" height="40" fill="#e2e8f0" rx="8 8 0 0"/>
  <text x="60" y="505" font-size="13" font-weight="bold" fill="#334155">CONCEPTO / DESCRIPCIÓN</text>
  <text x="480" y="505" font-size="13" font-weight="bold" fill="#334155">CANTIDAD / BASE</text>
  <text x="730" y="505" font-size="13" font-weight="bold" text-anchor="end" fill="#334155">SUBTOTAL ($)</text>

  <!-- Rows -->
  <text x="60" y="545" font-size="13" fill="#1e293b">Cargo Fijo Bimensual Residencial</text>
  <text x="480" y="545" font-size="13" fill="#475569">Cargo Base</text>
  <text x="730" y="545" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">4.820,00</text>

  <text x="60" y="580" font-size="13" fill="#1e293b">Cargo Variable por Energía Activa</text>
  <text x="480" y="580" font-size="13" fill="#475569">480 kWh x $54,20</text>
  <text x="730" y="580" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">26.016,00</text>

  <text x="60" y="615" font-size="13" fill="#1e293b">Subsidio Estado Nacional (Nivel 2 Ingresos Medios)</text>
  <text x="480" y="615" font-size="13" fill="#16a34a">Bonificación</text>
  <text x="730" y="615" font-size="13" font-weight="bold" text-anchor="end" fill="#16a34a">- 5.200,00</text>

  <line x1="60" y1="635" x2="740" y2="635" stroke="#f1f5f9"/>

  <rect x="55" y="645" width="690" height="35" rx="4" fill="#fef2f2"/>
  <text x="60" y="668" font-size="13" font-weight="bold" fill="#b91c1c">⚠️ CARGO POR RECONEXIÓN DE SUMINISTRO (RECLAMO PREVIO)</text>
  <text x="480" y="668" font-size="13" fill="#b91c1c">1 trámite especial</text>
  <text x="730" y="668" font-size="13" font-weight="bold" text-anchor="end" fill="#b91c1c">4.500,00</text>

  <text x="60" y="715" font-size="13" fill="#1e293b">Impuesto Provincial Ley 11.769 (15,5%)</text>
  <text x="480" y="715" font-size="13" fill="#475569">Alicuota provincial</text>
  <text x="730" y="715" font-size="13" text-anchor="end" fill="#0f172a">4.670,40</text>

  <text x="60" y="750" font-size="13" fill="#1e293b">IVA Responsable Inscripto / Final (21%)</text>
  <text x="480" y="750" font-size="13" fill="#475569">21,00 %</text>
  <text x="730" y="750" font-size="13" text-anchor="end" fill="#0f172a">7.880,50</text>

  <text x="60" y="785" font-size="13" fill="#1e293b">Tasa Municipal de Alumbrado Público</text>
  <text x="480" y="785" font-size="13" fill="#475569">Tasa comunal</text>
  <text x="730" y="785" font-size="13" text-anchor="end" fill="#0f172a">5.563,10</text>

  <line x1="40" y1="810" x2="760" y2="810" stroke="#cbd5e1"/>
  <text x="480" y="830" font-size="16" font-weight="bold" fill="#0f172a">TOTAL LIQUIDACIÓN:</text>
  <text x="730" y="830" font-size="20" font-weight="900" text-anchor="end" fill="#003882">$ 48.250,00</text>

  <!-- Barcode & Payment bottom -->
  <rect x="40" y="870" width="720" height="180" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="60" y="905" font-size="14" font-weight="bold" fill="#0f172a">CÓDIGO DE PAGO ELECTRÓNICO / LINK / BANELCO</text>
  <text x="60" y="930" font-size="22" font-weight="bold" letter-spacing="4" fill="#0284c7">2948 1039 8104 22</text>
  
  <!-- Barcode pattern -->
  <line x1="60" y1="960" x2="60" y2="1020" stroke="#000" stroke-width="4"/>
  <line x1="70" y1="960" x2="70" y2="1020" stroke="#000" stroke-width="2"/>
  <line x1="80" y1="960" x2="80" y2="1020" stroke="#000" stroke-width="6"/>
  <line x1="95" y1="960" x2="95" y2="1020" stroke="#000" stroke-width="3"/>
  <line x1="110" y1="960" x2="110" y2="1020" stroke="#000" stroke-width="5"/>
  <line x1="125" y1="960" x2="125" y2="1020" stroke="#000" stroke-width="2"/>
  <line x1="140" y1="960" x2="140" y2="1020" stroke="#000" stroke-width="6"/>
  <line x1="160" y1="960" x2="160" y2="1020" stroke="#000" stroke-width="4"/>
  <line x1="180" y1="960" x2="180" y2="1020" stroke="#000" stroke-width="3"/>
  <line x1="200" y1="960" x2="200" y2="1020" stroke="#000" stroke-width="5"/>
  <line x1="220" y1="960" x2="220" y2="1020" stroke="#000" stroke-width="7"/>
  <line x1="240" y1="960" x2="240" y2="1020" stroke="#000" stroke-width="2"/>
  <line x1="260" y1="960" x2="260" y2="1020" stroke="#000" stroke-width="4"/>
  <text x="60" y="1035" font-size="11" fill="#64748b">004109823412000048250002026111229481039814</text>
  <text x="640" y="1020" font-size="12" text-anchor="middle" fill="#64748b">Válido para bancos y Pago Fácil</text>
</svg>
`;

const metrogasSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100" style="background:#ffffff; font-family:sans-serif;">
  <!-- Header Bar -->
  <rect x="0" y="0" width="800" height="110" fill="#ea580c"/>
  <text x="40" y="65" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="1">MetroGAS</text>
  <text x="210" y="65" font-size="14" fill="#fed7aa">| Distribución de Gas por Red</text>
  <text x="760" y="45" font-size="13" text-anchor="end" fill="#ffedd5">LIQUIDACIÓN DE SERVICIOS PÚBLICOS</text>
  <text x="760" y="70" font-size="18" font-weight="bold" text-anchor="end" fill="#ffffff">N° 2026-0819284</text>

  <!-- Account info -->
  <rect x="40" y="130" width="460" height="150" rx="8" fill="#fff7ed" stroke="#fdba74"/>
  <text x="60" y="160" font-size="13" font-weight="bold" fill="#9a3412">CLIENTE Y SUMINISTRO</text>
  <text x="60" y="185" font-size="18" font-weight="bold" fill="#0f172a">MARÍA LAURA FERNÁNDEZ</text>
  <text x="60" y="210" font-size="14" fill="#334155">Güemes 3420 - Palermo, CABA</text>
  <text x="60" y="235" font-size="13" fill="#64748b">Categoría R2-1 | Medidor: GN-991204</text>
  <text x="60" y="258" font-size="14" font-weight="bold" fill="#c2410c">CUENTA: 1104829103</text>

  <!-- Due date -->
  <rect x="520" y="130" width="240" height="150" rx="8" fill="#fff7ed" stroke="#ea580c" stroke-width="2"/>
  <text x="640" y="160" font-size="13" font-weight="bold" text-anchor="middle" fill="#c2410c">TOTAL A ABONAR</text>
  <text x="640" y="200" font-size="30" font-weight="900" text-anchor="middle" fill="#9a3412">$ 29.800,00</text>
  <text x="640" y="235" font-size="13" text-anchor="middle" fill="#dc2626" font-weight="bold">VENCE: 2026-11-05</text>
  <text x="640" y="260" font-size="11" text-anchor="middle" fill="#475569">Período Facturado: 09/2026</text>

  <!-- Consumption Detail -->
  <rect x="40" y="300" width="720" height="150" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="60" y="330" font-size="15" font-weight="bold" fill="#0f172a">REGISTRO DE CONSUMO DE GAS NATURAL</text>
  <text x="60" y="360" font-size="14" fill="#334155">Volumen Medido: <tspan font-weight="bold" fill="#c2410c">95 m³</tspan> (Factor Corrección: 1,02)</text>
  <text x="60" y="385" font-size="13" fill="#64748b">Mes anterior: 42 m³ | Mismo período año previo: 88 m³</text>
  <text x="60" y="415" font-size="13" font-weight="bold" fill="#b45309">📈 Variación de consumo: +126% vs mes anterior (pico estacional calefacción)</text>

  <!-- Concepts -->
  <rect x="40" y="470" width="720" height="370" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
  <rect x="40" y="470" width="720" height="40" fill="#ffedd5" rx="8 8 0 0"/>
  <text x="60" y="495" font-size="13" font-weight="bold" fill="#9a3412">DETALLE DE CONCEPTOS LIQUIDADOS</text>
  <text x="730" y="495" font-size="13" font-weight="bold" text-anchor="end" fill="#9a3412">IMPORTE ($)</text>

  <text x="60" y="535" font-size="13" fill="#1e293b">Cargo Fijo Mensual Categoría R2-1</text>
  <text x="730" y="535" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">3.450,00</text>

  <text x="60" y="570" font-size="13" fill="#1e293b">Cargo por m³ consumido (95 m³ x $185,40)</text>
  <text x="730" y="570" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">17.613,00</text>

  <text x="60" y="605" font-size="13" fill="#1e293b">Transporte y Distribución (TGN / Enargas)</text>
  <text x="730" y="605" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">2.140,00</text>

  <text x="60" y="640" font-size="13" fill="#1e293b">Fondo Fiduciario Gas Austral (Ley 25.565)</text>
  <text x="730" y="640" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">680,00</text>

  <text x="60" y="675" font-size="13" fill="#1e293b">Impuesto al Valor Agregado (IVA 21%)</text>
  <text x="730" y="675" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">5.015,40</text>

  <text x="60" y="710" font-size="13" fill="#1e293b">Tasa de Ocupación Vía Pública y Municipal</text>
  <text x="730" y="710" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">901,60</text>

  <line x1="40" y1="740" x2="760" y2="740" stroke="#cbd5e1"/>
  <text x="480" y="770" font-size="16" font-weight="bold" fill="#0f172a">TOTAL DE LA CUOTA:</text>
  <text x="730" y="770" font-size="20" font-weight="900" text-anchor="end" fill="#c2410c">$ 29.800,00</text>

  <!-- Payment -->
  <rect x="40" y="860" width="720" height="190" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="60" y="895" font-size="14" font-weight="bold" fill="#0f172a">CÓDIGO PAGO MIS CUENTAS / LINK</text>
  <text x="60" y="925" font-size="22" font-weight="bold" fill="#c2410c">0239 1104 8291 00</text>
  <text x="60" y="960" font-size="12" fill="#64748b">Nota al usuario: El subsidio de tarifa social fue removido por actualización RASE.</text>
</svg>
`;

const fibertelSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100" style="background:#ffffff; font-family:sans-serif;">
  <!-- Header Bar -->
  <rect x="0" y="0" width="800" height="110" fill="#7c3aed"/>
  <text x="40" y="65" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="1">Telecom Personal</text>
  <text x="360" y="65" font-size="14" fill="#ddd6fe">| Fibra 300MB + TV</text>
  <text x="760" y="45" font-size="13" text-anchor="end" fill="#ede9fe">FACTURA SERVICIOS DE CONECTIVIDAD</text>
  <text x="760" y="70" font-size="18" font-weight="bold" text-anchor="end" fill="#ffffff">FACT-B 0009-4819203</text>

  <!-- Account info -->
  <rect x="40" y="130" width="460" height="150" rx="8" fill="#f5f3ff" stroke="#c4b5fd"/>
  <text x="60" y="160" font-size="13" font-weight="bold" fill="#6d28d9">DATOS DE LA LÍNEA Y CLIENTE</text>
  <text x="60" y="185" font-size="18" font-weight="bold" fill="#0f172a">MATÍAS SANDRONI</text>
  <text x="60" y="210" font-size="14" fill="#334155">Plan: Fibra Óptica 300 Mbps Simétrico + Flow</text>
  <text x="60" y="235" font-size="13" fill="#64748b">Dirección de instalación: Olivos, Vicente López</text>
  <text x="60" y="258" font-size="14" font-weight="bold" fill="#6d28d9">N° DE CLIENTE: 67102931/1</text>

  <!-- Due date -->
  <rect x="520" y="130" width="240" height="150" rx="8" fill="#f5f3ff" stroke="#7c3aed" stroke-width="2"/>
  <text x="640" y="160" font-size="13" font-weight="bold" text-anchor="middle" fill="#6d28d9">TOTAL A PAGAR</text>
  <text x="640" y="200" font-size="30" font-weight="900" text-anchor="middle" fill="#4c1d95">$ 32.400,00</text>
  <text x="640" y="235" font-size="13" text-anchor="middle" fill="#dc2626" font-weight="bold">VENCE: 2026-11-10</text>
  <text x="640" y="260" font-size="11" text-anchor="middle" fill="#475569">Mes facturado: Noviembre 2026</text>

  <!-- Warning banner inside bill -->
  <rect x="40" y="300" width="720" height="70" rx="8" fill="#fef2f2" stroke="#fca5a5"/>
  <text x="60" y="330" font-size="14" font-weight="bold" fill="#b91c1c">⚠️ ATENCIÓN: Fin de promoción especial (Descuento 50% vencido el 31/10)</text>
  <text x="60" y="352" font-size="12" fill="#7f1d1d">Factura anterior abonada: $16.200,00 | Aumento registrado: +100% en el abono principal</text>

  <!-- Table -->
  <rect x="40" y="390" width="720" height="420" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
  <rect x="40" y="390" width="720" height="40" fill="#ede9fe" rx="8 8 0 0"/>
  <text x="60" y="415" font-size="13" font-weight="bold" fill="#5b21b6">DETALLE DE PLAN Y SERVICIOS ADICIONALES</text>
  <text x="730" y="415" font-size="13" font-weight="bold" text-anchor="end" fill="#5b21b6">PRECIO ($)</text>

  <text x="60" y="455" font-size="13" fill="#1e293b">Abono Fibra 300 Megas Residencial (Precio Lista)</text>
  <text x="730" y="455" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">22.800,00</text>

  <rect x="55" y="475" width="690" height="35" rx="4" fill="#fff1f2"/>
  <text x="60" y="498" font-size="13" font-weight="bold" fill="#e11d48">🚨 ALQUILER DECODIFICADOR FLOW HD ADICIONAL</text>
  <text x="730" y="498" font-size="13" font-weight="bold" text-anchor="end" fill="#e11d48">3.900,00</text>

  <text x="60" y="545" font-size="13" fill="#1e293b">Servicio Flow App Full Multipantalla</text>
  <text x="730" y="545" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">1.200,00</text>

  <text x="60" y="580" font-size="13" fill="#1e293b">Percepción IIBB CABA (3,00%)</text>
  <text x="730" y="580" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">837,00</text>

  <text x="60" y="615" font-size="13" fill="#1e293b">IVA 21% Telecomunicaciones</text>
  <text x="730" y="615" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">3.663,00</text>

  <line x1="40" y1="650" x2="760" y2="650" stroke="#cbd5e1"/>
  <text x="480" y="680" font-size="16" font-weight="bold" fill="#0f172a">TOTAL GENERAL:</text>
  <text x="730" y="680" font-size="22" font-weight="900" text-anchor="end" fill="#6d28d9">$ 32.400,00</text>

  <!-- Bottom -->
  <rect x="40" y="830" width="720" height="200" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="60" y="865" font-size="14" font-weight="bold" fill="#0f172a">PAGO FÁCIL / RAPIPAGO / DÉBITO DIRECTO</text>
  <text x="60" y="895" font-size="20" font-weight="bold" fill="#6d28d9">67102931102026111032400</text>
  <text x="60" y="930" font-size="12" fill="#475569">Para solicitar promociones vigentes comunícate al 0800-444-0800.</text>
</svg>
`;

const expensasSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100" style="background:#ffffff; font-family:sans-serif;">
  <!-- Header Bar -->
  <rect x="0" y="0" width="800" height="110" fill="#0f766e"/>
  <text x="40" y="65" font-size="30" font-weight="900" fill="#ffffff" letter-spacing="1">ADMINISTRACIÓN ALVEAR</text>
  <text x="430" y="65" font-size="14" fill="#99f6e4">| Consorcios de Propietarios</text>
  <text x="760" y="45" font-size="13" text-anchor="end" fill="#ccfbf1">LIQUIDACIÓN DE EXPENSAS</text>
  <text x="760" y="70" font-size="18" font-weight="bold" text-anchor="end" fill="#ffffff">PERÍODO: OCTUBRE 2026</text>

  <!-- Account info -->
  <rect x="40" y="130" width="460" height="150" rx="8" fill="#f0fdfa" stroke="#5eead4"/>
  <text x="60" y="160" font-size="13" font-weight="bold" fill="#0f766e">CONSORCIO Y UNIDAD FUNCIONAL</text>
  <text x="60" y="185" font-size="18" font-weight="bold" fill="#0f172a">CONSORCIO CALLE JUNCAL 2140</text>
  <text x="60" y="210" font-size="14" fill="#334155">Unidad: Piso 7 "B" (Propietario: Lucía Beltrán)</text>
  <text x="60" y="235" font-size="13" fill="#64748b">Porcentual fiscal: 3,45 %</text>
  <text x="60" y="258" font-size="14" font-weight="bold" fill="#0f766e">CÓDIGO DE EXPENSA: UF-07B</text>

  <!-- Due date -->
  <rect x="520" y="130" width="240" height="150" rx="8" fill="#f0fdfa" stroke="#0f766e" stroke-width="2"/>
  <text x="640" y="160" font-size="13" font-weight="bold" text-anchor="middle" fill="#0f766e">MONTO A ABONAR</text>
  <text x="640" y="200" font-size="30" font-weight="900" text-anchor="middle" fill="#115e59">$ 98.500,00</text>
  <text x="640" y="235" font-size="13" text-anchor="middle" fill="#dc2626" font-weight="bold">1° VENC: 2026-11-15</text>
  <text x="640" y="260" font-size="11" text-anchor="middle" fill="#475569">2° Venc (+10%): $108.350,00</text>

  <!-- Breakdown Table -->
  <rect x="40" y="300" width="720" height="480" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
  <rect x="40" y="300" width="720" height="40" fill="#ccfbf1" rx="8 8 0 0"/>
  <text x="60" y="325" font-size="13" font-weight="bold" fill="#134e4a">RUBRO DE GASTOS DEL EDIFICIO</text>
  <text x="500" y="325" font-size="13" font-weight="bold" fill="#134e4a">TOTAL CONSORCIO</text>
  <text x="730" y="325" font-size="13" font-weight="bold" text-anchor="end" fill="#134e4a">TU CUOTA (3,45%)</text>

  <text x="60" y="365" font-size="13" fill="#1e293b">1. Sueldos encargado SUTERH y cargas sociales</text>
  <text x="500" y="365" font-size="13" fill="#475569">$ 1.450.000,00</text>
  <text x="730" y="365" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">50.025,00</text>

  <text x="60" y="405" font-size="13" fill="#1e293b">2. Servicios comunes (Edenor fuerza motriz + AySA)</text>
  <text x="500" y="405" font-size="13" fill="#475569">$ 380.000,00</text>
  <text x="730" y="405" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">13.110,00</text>

  <text x="60" y="445" font-size="13" fill="#1e293b">3. Mantenimiento de ascensores y matafuegos</text>
  <text x="500" y="445" font-size="13" fill="#475569">$ 190.000,00</text>
  <text x="730" y="445" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">6.555,00</text>

  <text x="60" y="485" font-size="13" fill="#1e293b">4. Honorarios de Administración e imp. bancarios</text>
  <text x="500" y="485" font-size="13" fill="#475569">$ 140.000,00</text>
  <text x="730" y="485" font-size="13" font-weight="bold" text-anchor="end" fill="#0f172a">4.830,00</text>

  <rect x="55" y="505" width="690" height="40" rx="4" fill="#fef2f2"/>
  <text x="60" y="530" font-size="13" font-weight="bold" fill="#b91c1c">🚨 EXPENSA EXTRAORDINARIA: Reparación urgente de Sala de Bombas (Cuota 2/3)</text>
  <text x="730" y="530" font-size="13" font-weight="bold" text-anchor="end" fill="#b91c1c">21.500,00</text>

  <rect x="55" y="555" width="690" height="35" rx="4" fill="#fff7ed"/>
  <text x="60" y="578" font-size="13" font-weight="bold" fill="#c2410c">⚠️ FONDO DE RESERVA OPERATIVO</text>
  <text x="730" y="578" font-size="13" font-weight="bold" text-anchor="end" fill="#c2410c">2.480,00</text>

  <line x1="40" y1="620" x2="760" y2="620" stroke="#cbd5e1"/>
  <text x="480" y="650" font-size="16" font-weight="bold" fill="#0f172a">TOTAL A PAGAR:</text>
  <text x="730" y="650" font-size="22" font-weight="900" text-anchor="end" fill="#0f766e">$ 98.500,00</text>

  <!-- Bank details -->
  <rect x="40" y="800" width="720" height="230" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="60" y="835" font-size="14" font-weight="bold" fill="#0f172a">TRANSFERENCIA BANCARIA BAPRO</text>
  <text x="60" y="865" font-size="14" fill="#334155">CBU: 0140000201402910394812 | Alias: CONSORCIO.JUNCAL.2140</text>
  <text x="60" y="895" font-size="13" fill="#64748b">Nota: Enviar comprobante con número de UF a pagos@admin-alvear.com.ar</text>
</svg>
`;

export const SAMPLE_BILLS: SampleInvoice[] = [
  {
    id: 'edenor-oct',
    name: 'Edenor - Electricidad',
    company: 'Edenor S.A.',
    service: 'Luz',
    tag: 'Aumento +35% & Cargo sospechoso',
    amount: '$ 48.250',
    description: 'Factura bimestral de luz con fuerte incremento de kWh y un cargo de reconexión indebido.',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    imageDataUri: createSvgDataUri(edenorSvg),
    precomputedData: {
      proveedor: 'Edenor S.A.',
      tipo_servicio: 'Luz',
      numero_cuenta: '2948103981-4',
      numero_factura: '0041-09823412',
      periodo_facturado: 'Octubre 2026 (Bimestre 5)',
      fecha_vencimiento: '2026-11-12',
      monto_total: 48250.0,
      moneda: 'ARS',
      consumo_medido: '480 kWh (+35% vs anterior)',
      explicacion_en_criollo: `📌 **Resumen Rápido:**
- **Monto total a pagar:** $48.250,00 ARS
- **Fecha de vencimiento:** 12 de Noviembre de 2026 (Faltan 17 días)
- **Empresa proveedora:** Edenor S.A. (Cuenta N° 2948103981-4)

📊 **Análisis de Consumo y Tarifas:**
- En este período consumiste **480 kWh**, lo que representa un salto del **+35.2%** respecto a tu promedio anterior (355 kWh).
- ⚠️ **Alerta:** Al superar los 400 kWh entraste en un escalón tarifario más caro por unidad de energía (T1R2), por lo que cada kWh extra te cuesta sensiblemente más.

🔍 **¿Qué te están cobrando? (En criollo):**
1. **Cargo Fijo ($4.820):** Es lo que pagas sólo por tener el cable conectado a tu casa y la disponibilidad del servicio, consumas o no consumas un solo watt.
2. **Energía Activa ($26.016):** Los 480 kWh que gastaron tus electrodomésticos y luces.
3. **Subsidio Estatal (-$5.200):** Bonificación del Estado por estar encuadrado en el Nivel N2 (ingresos medios). Te ahorró un 16% de la factura pura.
4. 🚨 **CARGO SOSPECHOSO DETECTADO ($4.500):** Te facturaron "Cargo por reconexión de suministro". Si nunca te cortaron la luz ni vino una cuadrilla por mora, **este cargo es improcedente y reclamable de inmediato**.
5. **Impuestos y tasas comunales ($18.114 en total):** IVA, ley provincial y tasa municipal que representan casi el 38% del total.

💡 **Consejo/Alerta:**
- **Reclamo urgente:** Solicita la devolución o nota de crédito de los $4.500 antes de abonar.
- **Paga antes del 12/11:** Para evitar recargos por mora del 6% mensual sobre saldo impago.

📥 **Dónde descargar tus facturas oficiales:**
- **Portal Web Oficial:** [Edenor Digital](https://www.edenordigital.com) (Ingresas con tu N° de Cuenta 2948103981-4 y DNI).
- **App Móvil Oficial:** "Edenor Digital" disponible para Android en Google Play y iOS en App Store.

⚖️ **Dónde y cómo presentar el reclamo:**
- **Web de Reclamos Edenor:** [Portal de Reclamos Comerciales Edenor](https://www.edenor.com/tramites-y-consultas/reclamos-comerciales)
- **WhatsApp Oficial Edenor:** [+54 9 11 3900-0000](https://wa.me/5491139000000) (Escribe "Reclamo por facturación" y ten a mano el N° de Cuenta).
- **Línea Telefónica Gratuita:** 0800-666-1000 (Lunes a Viernes de 8 a 17 hs).
- **Ente Regulador Competente (ENRE):** Si Edenor no te da respuesta en 10 días hábiles o rechaza el reclamo, inicia tu queja en el [Portal de Reclamos del ENRE](https://www.argentina.gob.ar/enre/gestion-de-reclamos) con el número de reclamo previo.`,
      dias_restantes_vencimiento: 17,
      portal_descarga: {
        nombre_portal: 'Edenor Digital (Oficina Virtual)',
        url: 'https://www.edenordigital.com',
        requisitos_acceso: 'N° de Cuenta (2948103981-4) y DNI del titular',
      },
      canales_reclamo: {
        web_portal: 'https://www.edenor.com/tramites-y-consultas/reclamos-comerciales',
        whatsapp: '+54 9 11 3900-0000',
        telefono: '0800-666-1000',
        ente_regulador_nombre: 'ENRE (Ente Nacional Regulador de la Electricidad)',
        ente_regulador_web: 'https://www.argentina.gob.ar/enre/gestion-de-reclamos',
      },
    },
  },
  {
    id: 'metrogas-sep',
    name: 'MetroGAS - Gas Natural',
    company: 'MetroGAS S.A.',
    service: 'Gas',
    tag: 'Salto invernal +126% m3',
    amount: '$ 29.800',
    description: 'Factura de gas con pico estacional por estufas y quita de subsidio RASE.',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    imageDataUri: createSvgDataUri(metrogasSvg),
    precomputedData: {
      proveedor: 'MetroGAS S.A.',
      tipo_servicio: 'Gas',
      numero_cuenta: '1104829103',
      numero_factura: '2026-0819284',
      periodo_facturado: 'Septiembre 2026',
      fecha_vencimiento: '2026-11-05',
      monto_total: 29800.0,
      moneda: 'ARS',
      consumo_medido: '95 m3 (+126% vs anterior)',
      explicacion_en_criollo: `📌 **Resumen Rápido:**
- **Monto total a pagar:** $29.800,00 ARS
- **Fecha de vencimiento:** 05 de Noviembre de 2026 (Faltan 10 días)
- **Empresa proveedora:** MetroGAS S.A. (Cuenta N° 1104829103)

📊 **Análisis de Consumo y Tarifas:**
- Tu consumo saltó de **42 m³ a 95 m³** (**+126%**).
- Este salto es característico del período invernal debido al uso intensivo de calefactores, tiro balanceado y agua caliente sanitaria.

🔍 **¿Qué te están cobrando? (En criollo):**
1. **Cargo Fijo ($3.450):** El costo de mantenimiento de las tuberías y medidor hasta la puerta de tu domicilio.
2. **Consumo de gas ($17.613):** Los 95 metros cúbicos que pasaron por tu medidor a razón de $185,40 por m³.
3. **Transporte y Distribución ($2.140):** El viaje que hace el gas desde las cuencas neuquinas hasta tu cocina.
4. ⚠️ **Quita de subsidio:** No figura el descuento de subsidio RASE de facturas anteriores, lo que encareció el costo por m3 en un 40%.

💡 **Consejo/Alerta:**
- Revisa el registro RASE en la web oficial (argentina.gob.ar/subsidios) para volver a empadronarte si tus ingresos califican para el Nivel N2 o N3.
- En verano el consumo debería descender por debajo de los 30 m³.

📥 **Dónde descargar tus facturas oficiales:**
- **Portal Web Oficial:** [MetroGAS Mi Cuenta](https://www.metrogas.com.ar/seccion/usuarios/mi-cuenta) (Ingresa con N° de Cuenta 1104829103).
- **App Móvil Oficial:** "MetroGAS Móvil" para consultar saldos y descargar PDF.

⚖️ **Dónde y cómo presentar el reclamo:**
- **Web de Reclamos MetroGAS:** [Canales de Reclamo MetroGAS](https://www.metrogas.com.ar/seccion/usuarios/contacto-y-reclamos)
- **WhatsApp Oficial MetroGAS:** [+54 9 11 3180-2222](https://wa.me/5491131802222)
- **Línea Telefónica Comercial:** 0800-333-6427 (Lunes a Viernes de 8 a 17 hs).
- **Ente Regulador Competente (ENARGAS):** En caso de falta de respuesta en 15 días hábiles, formaliza tu reclamo ante el [ENARGAS](https://www.enargas.gob.ar/secciones/contacto-y-reclamos/reclamos-usuarios.php).`,
      dias_restantes_vencimiento: 10,
      portal_descarga: {
        nombre_portal: 'MetroGAS - Mi Cuenta (Descarga Factura)',
        url: 'https://www.metrogas.com.ar/seccion/usuarios/mi-cuenta',
        requisitos_acceso: 'Número de Cuenta (1104829103) impreso en factura',
      },
      canales_reclamo: {
        web_portal: 'https://www.metrogas.com.ar/seccion/usuarios/contacto-y-reclamos',
        whatsapp: '+54 9 11 3180-2222',
        telefono: '0800-333-6427',
        ente_regulador_nombre: 'ENARGAS (Ente Nacional Regulador del Gas)',
        ente_regulador_web: 'https://www.enargas.gob.ar/secciones/contacto-y-reclamos/reclamos-usuarios.php',
      },
    },
  },
  {
    id: 'fibertel-nov',
    name: 'Telecom Personal - Fibra 300MB',
    company: 'Telecom Argentina S.A.',
    service: 'Internet',
    tag: 'Fin de promo (+100%) + Deco no pedido',
    amount: '$ 32.400',
    description: 'Factura de internet que duplicó su valor por vencimiento de promo y coló un decodificador extra.',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    imageDataUri: createSvgDataUri(fibertelSvg),
    precomputedData: {
      proveedor: 'Telecom Personal',
      tipo_servicio: 'Internet',
      numero_cuenta: '67102931/1',
      numero_factura: 'FACT-B 0009-4819203',
      periodo_facturado: 'Noviembre 2026',
      fecha_vencimiento: '2026-11-10',
      monto_total: 32400.0,
      moneda: 'ARS',
      consumo_medido: '300 Mbps Ilimitado',
      explicacion_en_criollo: `📌 **Resumen Rápido:**
- **Monto total a pagar:** $32.400,00 ARS
- **Fecha de vencimiento:** 10 de Noviembre de 2026 (Faltan 15 días)
- **Empresa proveedora:** Telecom Personal (Cliente 67102931/1)

📊 **Análisis de Consumo y Tarifas:**
- La velocidad es 300 Mbps simétrica ilimitada. El mes pasado pagaste **$16.200**.
- **Aumento detectado:** **+100%** de incremento directo de un mes a otro.

🔍 **¿Qué te están cobrando? (En criollo):**
1. **Fin de promoción:** Se venció el 50% de bonificación que tenías durante 12 meses. Ahora estás pagando el precio de lista pleno ($22.800).
2. 🚨 **CARGO EXTRA EXTRAÑO ($3.900):** Te sumaron "Alquiler Decodificador Flow HD Adicional". Si sólo tienes una televisión o usas la App en Smart TV, te están cobrando el alquiler de una caja de hardware que no te entregaron.

💡 **Consejo/Alerta:**
- **Llamar al área de Retenciones (0800-444-0800 o vía WhatsApp oficial):** Solicita la baja del decodificador adicional fantasma (-$3.900) y pide la renovación del 40-50% de descuento bajo apercibimiento de portabilidad.

📥 **Dónde descargar tus facturas oficiales:**
- **Portal Web Oficial:** [Mi Personal Flow](https://www.personal.com.ar/mi-personal/login)
- **App Móvil Oficial:** "Mi Personal Flow" (Android & iOS).

⚖️ **Dónde y cómo presentar el reclamo:**
- **WhatsApp Oficial Telecom Personal:** [+54 9 11 7195-0001](https://wa.me/5491171950001)
- **Teléfono de Atención:** 0800-444-0800 o marcando *111 desde celular Personal.
- **Ente Regulador Competente:** Reclamo en [ENACOM Telecomunicaciones](https://www.argentina.gob.ar/enacom/tramites/reclamos-telefonia-e-internet) y mediación en [COPREC / Defensa del Consumidor](https://www.consumidor.gob.ar).`,
      dias_restantes_vencimiento: 15,
      portal_descarga: {
        nombre_portal: 'Mi Personal Flow (Web Clientes)',
        url: 'https://www.personal.com.ar/mi-personal/login',
        requisitos_acceso: 'DNI del titular o Email/Línea vinculada',
      },
      canales_reclamo: {
        web_portal: 'https://www.personal.com.ar/ayuda/contacto',
        whatsapp: '+54 9 11 7195-0001',
        telefono: '0800-444-0800',
        ente_regulador_nombre: 'ENACOM y Defensa del Consumidor (COPREC)',
        ente_regulador_web: 'https://www.argentina.gob.ar/enacom/tramites/reclamos-telefonia-e-internet',
      },
    },
  },
  {
    id: 'expensas-oct',
    name: 'Expensas Consorcio Juncal',
    company: 'Administración Alvear',
    service: 'Expensas',
    tag: 'Cuota extraordinaria $21.500',
    amount: '$ 98.500',
    description: 'Expensas mensuales con cuota de obra de bombas y fondo de reserva.',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    imageDataUri: createSvgDataUri(expensasSvg),
    precomputedData: {
      proveedor: 'Administración Alvear (Consorcio Juncal 2140)',
      tipo_servicio: 'Expensas',
      numero_cuenta: 'UF-07B',
      numero_factura: 'LIQ-OCT-2026',
      periodo_facturado: 'Octubre 2026',
      fecha_vencimiento: '2026-11-15',
      monto_total: 98500.0,
      moneda: 'ARS',
      consumo_medido: 'Porcentual 3,45%',
      explicacion_en_criollo: `📌 **Resumen Rápido:**
- **Monto total a pagar:** $98.500,00 ARS (1° vencimiento)
- **Fecha de vencimiento:** 15 de Noviembre de 2026 (Faltan 20 días)
- **Consorcio:** Juncal 2140 - UF 7 "B" (Porcentual: 3.45%)

📊 **Análisis de Consumo y Tarifas:**
- La liquidación aumentó un **+28.5%** frente a los $76.600 del mes pasado.

🔍 **¿Qué te están cobrando? (En criollo):**
1. **Expensas Ordinarias ($74.520):** Sueldo y aportes del encargado, seguro de incendio del edificio, Edenor de los pasillos/bombas y honorarios de administración.
2. 🚨 **Expensa Extraordinaria ($21.500 - Cuota 2 de 3):** Arreglo mayor de la sala de bombas de agua.
   - **¡DATO CLAVE SI ALQUILAS!:** Por la legislación civil de locaciones, las expensas extraordinarias (obras de infraestructura duradera) las debe pagar el dueño/propietario, NO el inquilino. Puedes deducirla del alquiler presentando esta liquidación.

💡 **Consejo/Alerta:**
- Si eres inquilino, avísale al dueño antes del día 10 para descontar los $21.500 del canon locativo.
- Transfiere antes del 15/11 para no sufrir la multa por 2° vencimiento ($9.850 extra).

📥 **Dónde descargar tus facturas oficiales:**
- **Plataforma de Expensas:** [ConsorcioAbierto](https://consorcioabierto.com) o correo enviado por la administración con la liquidación prorrateada.

⚖️ **Dónde y cómo presentar el reclamo:**
- **Ante la Administración:** Email formal a pagos@admin-alvear.com.ar o nota en libro de administración.
- **Ente Fiscalizador / Denuncias:** [Registro Público de Administradores de Consorcios (RPA)](https://buenosaires.gob.ar/defensaconsumidor) y [Defensa del Consumidor](https://www.argentina.gob.ar/produccion/defensadelconsumidor).`,
      dias_restantes_vencimiento: 20,
      portal_descarga: {
        nombre_portal: 'ConsorcioAbierto / Portal de Administración Alvear',
        url: 'https://consorcioabierto.com',
        requisitos_acceso: 'Código de Unidad Funcional UF-07B',
      },
      canales_reclamo: {
        web_portal: 'https://buenosaires.gob.ar/defensaconsumidor/tramites/denuncia-de-inquilinos-o-propietarios-de-consorcios',
        whatsapp: '+54 9 11 5050-0147',
        telefono: '147 (CABA)',
        ente_regulador_nombre: 'RPA (Registro Público de Administradores) & Defensa del Consumidor',
        ente_regulador_web: 'https://www.argentina.gob.ar/produccion/defensadelconsumidor',
      },
    },
  },
];
