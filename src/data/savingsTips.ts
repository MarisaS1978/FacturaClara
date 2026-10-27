import { TipoServicio } from '../types/bill';

export interface SavingsActionItem {
  id: string;
  service: TipoServicio;
  title: string;
  description: string;
  estimatedMonthlySavings: number; // In ARS
  difficulty: 'Fácil' | 'Media' | 'Trámite';
  category: 'Comportamiento' | 'Técnico' | 'Tarifario' | 'Contractual';
  highlight?: boolean;
}

export interface ServiceSavingsGuide {
  service: TipoServicio;
  title: string;
  tagline: string;
  bannerTip: string;
  averageMonthlyPotential: number; // In ARS
  actions: SavingsActionItem[];
}

export const SAVINGS_GUIDES: Record<string, ServiceSavingsGuide> = {
  Luz: {
    service: 'Luz',
    title: 'Electricidad y Energía del Hogar',
    tagline: 'Estrategias para no saltar de escalón tarifario y frenar el consumo fantasma',
    bannerTip: 'En Argentina, mantenerte debajo de 400 kWh bimestrales (o 350 kWh mensuales en verano) evita entrar a categorías tarifarias con costo por kWh hasta 50% superior.',
    averageMonthlyPotential: 24500,
    actions: [
      {
        id: 'luz-aire-24',
        service: 'Luz',
        title: 'Aire acondicionado siempre en 24°C y modo ECO',
        description: 'Cada grado por debajo de 24°C incrementa entre un 8% y un 10% el consumo eléctrico del equipo. Limpiar los filtros de aire cada 30 días ahorra un 5% adicional.',
        estimatedMonthlySavings: 9200,
        difficulty: 'Fácil',
        category: 'Comportamiento',
        highlight: true,
      },
      {
        id: 'luz-vampiro',
        service: 'Luz',
        title: 'Eliminar consumo vampiro (Stand-by)',
        description: 'Televisores, decodificadores, microondas y cargadores enchufados sin uso consumen entre un 7% y 12% de la electricidad total del hogar. Usa zapatillas con tecla de corte.',
        estimatedMonthlySavings: 4500,
        difficulty: 'Fácil',
        category: 'Comportamiento',
      },
      {
        id: 'luz-escalon-tarifario',
        service: 'Luz',
        title: 'Mantener el consumo debajo de 400 kWh bimestrales',
        description: 'Las distribuidoras (Edenor, Edesur, EPEC, etc.) aplican un salto de precio brusco al pasar de categoría T1R1 a T1R2. Monitorear el medidor a mitad de bimestre permite moderar el uso a tiempo.',
        estimatedMonthlySavings: 11000,
        difficulty: 'Media',
        category: 'Tarifario',
        highlight: true,
      },
      {
        id: 'luz-rase-subsidio',
        service: 'Luz',
        title: 'Empadronamiento o actualización en RASE (Nivel 2 / Nivel 3)',
        description: 'Si en tu factura no figura bonificación por subsidio nacional y tus ingresos netos no superan 3.5 canastas básicas, puedes inscribirte en el RASE para bonificar hasta el 40% del costo de energía.',
        estimatedMonthlySavings: 14500,
        difficulty: 'Trámite',
        category: 'Tarifario',
      },
      {
        id: 'luz-lavarropas-agua-fria',
        service: 'Luz',
        title: 'Lavarropa en ciclos cortos y agua fría',
        description: 'El 85% de la energía de un lavarropas se usa para calentar el agua. Usar ciclos a 30°C o fría con carga completa reduce drásticamente el consumo por lavado.',
        estimatedMonthlySavings: 3800,
        difficulty: 'Fácil',
        category: 'Comportamiento',
      },
      {
        id: 'luz-iluminacion-led',
        service: 'Luz',
        title: 'Reemplazo total a lámparas LED de 9W-12W',
        description: 'Las bombillas LED consumen hasta 85% menos que las halógenas y duran 10 veces más. Se amortizan en menos de 2 facturas bimestrales.',
        estimatedMonthlySavings: 2800,
        difficulty: 'Fácil',
        category: 'Técnico',
      },
    ],
  },
  Gas: {
    service: 'Gas',
    title: 'Gas Natural por Red',
    tagline: 'Claves para amortiguar el pico invernal y regular artefactos de llama continua',
    bannerTip: '¡El piloto del calefón o estufa encendido las 24 horas consume hasta 0.5 m³ diarios! En un mes son 15 m³ consumidos sin calentar una sola gota de agua.',
    averageMonthlyPotential: 18500,
    actions: [
      {
        id: 'gas-apagar-piloto',
        service: 'Gas',
        title: 'Apagar el piloto del calefón / estufa cuando no se use',
        description: 'La llama piloto encendida de forma pasiva representa hasta el 25% del consumo mensual de gas en hogares estándar. Apagarlo de noche o en verano genera un ahorro directo e inmediato.',
        estimatedMonthlySavings: 6800,
        difficulty: 'Fácil',
        category: 'Comportamiento',
        highlight: true,
      },
      {
        id: 'gas-burletes-aislacion',
        service: 'Gas',
        title: 'Colocar burletes en puertas y ventanas',
        description: 'Las filtraciones de chifletes obligan a subir el termostato 3°C o 4°C de más. Aislar aberturas con burletes de espuma o goma reduce la pérdida térmica un 20%.',
        estimatedMonthlySavings: 5500,
        difficulty: 'Media',
        category: 'Técnico',
        highlight: true,
      },
      {
        id: 'gas-termotanque-temperatura',
        service: 'Gas',
        title: 'Calibrar termotanque a 45°C - 50°C',
        description: 'Hervir agua a 70°C en el termotanque para luego tener que enfriarla mezclándola con la canilla de agua fría es un desperdicio del 20% del gas. Gradúa la perilla a temperatura de confort.',
        estimatedMonthlySavings: 4800,
        difficulty: 'Fácil',
        category: 'Técnico',
      },
      {
        id: 'gas-tapar-ollas',
        service: 'Gas',
        title: 'Tapar ollas y centrar llama en las hornallas',
        description: 'Cocinar con la olla tapada acorta el tiempo de cocción en un 30%. Evita que la llama sobrepase la base de la olla porque ese calor se disipa al aire.',
        estimatedMonthlySavings: 2200,
        difficulty: 'Fácil',
        category: 'Comportamiento',
      },
      {
        id: 'gas-verificacion-subsidios',
        service: 'Gas',
        title: 'Verificar subsidio RASE Gas en factura',
        description: 'En gas, la diferencia entre usuario N1 (sin subsidio) y N2/N3 es de más del 50% en el valor del metro cúbico. Chequea que tu categoría no haya sido revocada indebidamente.',
        estimatedMonthlySavings: 12000,
        difficulty: 'Trámite',
        category: 'Tarifario',
      },
    ],
  },
  Internet: {
    service: 'Internet',
    title: 'Internet, Cable & Telefonía',
    tagline: 'Negociación estratégica, renovación de bonificaciones y poda de servicios fantasma',
    bannerTip: 'Las empresas de telecomunicaciones (Telecom Personal, Telecentro, Movistar, Claro) aplican aumentos mensuales agresivos una vez que vence la bonificación anual. Una llamada de 10 minutos ahorra hasta $20.000 mensuales.',
    averageMonthlyPotential: 26000,
    actions: [
      {
        id: 'net-llamar-retenciones',
        service: 'Internet',
        title: 'Llamar a retenciones / Solicitar renovación del 50%',
        description: 'Comunícate por teléfono o WhatsApp oficial y solicita la renovación del descuento promocional (40% al 55%) bajo la opción "baja de servicio". Todas las prestadoras tienen campañas activas de retención de clientes.',
        estimatedMonthlySavings: 17500,
        difficulty: 'Media',
        category: 'Contractual',
        highlight: true,
      },
      {
        id: 'net-baja-decos-extra',
        service: 'Internet',
        title: 'Devolver decodificadores adicionales sin uso',
        description: 'Cada decodificador Flow o HD extra cuesta entre $3.500 y $4.500 al mes. Si tienes Smart TVs, instala directamente la aplicación oficial y da de baja los equipos físicos.',
        estimatedMonthlySavings: 4200,
        difficulty: 'Media',
        category: 'Contractual',
      },
      {
        id: 'net-baja-packs-premium',
        service: 'Internet',
        title: 'Revisar suscripciones a canales o packs no vistos',
        description: 'Packs de fútbol, canales premium o servicios de streaming facturados en la misma boleta que no se utilizan. Dar de baja desde la web de autogestión de la empresa.',
        estimatedMonthlySavings: 6500,
        difficulty: 'Fácil',
        category: 'Contractual',
      },
      {
        id: 'net-ajuste-velocidad',
        service: 'Internet',
        title: 'Ajustar velocidad al uso familiar real',
        description: 'Un plan de 300 Mbps simétricos es más que suficiente para 4 personas con streaming 4K y videollamadas en simultáneo. Pagar por 600 o 1000 Mbps suele ser innecesario.',
        estimatedMonthlySavings: 5000,
        difficulty: 'Fácil',
        category: 'Tarifario',
      },
    ],
  },
  Expensas: {
    service: 'Expensas',
    title: 'Expensas de Consorcios y Edificios',
    tagline: 'Defensa de tus derechos de inquilino o propietario y auditoría de rubros',
    bannerTip: 'Si alquilas, la ley establece con claridad que las expensas extraordinarias (fondos de reserva, pintura de fachadas, obras de cañerías mayores) corresponden al propietario y debes descontarlas del alquiler.',
    averageMonthlyPotential: 32000,
    actions: [
      {
        id: 'exp-descontar-extraordinarias',
        service: 'Expensas',
        title: 'Deducir expensas extraordinarias del pago del alquiler',
        description: 'Las mejoras definitivas del edificio aumentan el valor patrimonial del inmueble. El inquilino sólo abona las expensas ordinarias de mantenimiento habitual.',
        estimatedMonthlySavings: 22000,
        difficulty: 'Media',
        category: 'Contractual',
        highlight: true,
      },
      {
        id: 'exp-evitar-segundo-vencimiento',
        service: 'Expensas',
        title: 'Abonar antes del primer vencimiento',
        description: 'Los consorcios suelen aplicar multas punitorias de entre 5% y 10% mensual a partir del segundo vencimiento. Pagar en término evita este costo financiero.',
        estimatedMonthlySavings: 8500,
        difficulty: 'Fácil',
        category: 'Comportamiento',
        highlight: true,
      },
      {
        id: 'exp-asamblea-auditoria',
        service: 'Expensas',
        title: 'Participar de la asamblea y pedir 3 presupuestos',
        description: 'Exigir a la administración al menos 3 presupuestos comparativos para obras y revisar el rubro de horas extras y cargas sociales del encargado.',
        estimatedMonthlySavings: 6000,
        difficulty: 'Media',
        category: 'Técnico',
      },
    ],
  },
  Agua: {
    service: 'Agua',
    title: 'Agua de Red y Saneamiento',
    tagline: 'Prevención de fugas invisibles y control de consumo medido',
    bannerTip: 'Una pérdida silenciosa en la mochila del inodoro puede fugar más de 100 litros diarios de agua potable (3.000 litros al mes), inflando la factura si tienes medidor.',
    averageMonthlyPotential: 7500,
    actions: [
      {
        id: 'agua-mochila-inodoro',
        service: 'Agua',
        title: 'Reparar válvulas de mochila de inodoro y sapito',
        description: 'Coloca unas gotas de colorante en el depósito del inodoro sin tirar la cadena: si el agua de la taza se colorea en 15 minutos, tienes una pérdida constante que debes reparar.',
        estimatedMonthlySavings: 4200,
        difficulty: 'Fácil',
        category: 'Técnico',
        highlight: true,
      },
      {
        id: 'agua-aireadores',
        service: 'Agua',
        title: 'Instalar aireadores en canillas de cocina y baño',
        description: 'Los picos aireadores mezclan aire con el chorro de agua, reduciendo el caudal hasta en un 40% con la misma sensación de presión.',
        estimatedMonthlySavings: 2300,
        difficulty: 'Fácil',
        category: 'Técnico',
      },
      {
        id: 'agua-ducha-5min',
        service: 'Agua',
        title: 'Duchas conscientes de 5 a 7 minutos',
        description: 'Ahorra agua y además gas o electricidad necesaria para calentar esa cantidad de litros.',
        estimatedMonthlySavings: 3100,
        difficulty: 'Fácil',
        category: 'Comportamiento',
      },
    ],
  },
};

export const RASE_SUBSIDY_INFO = {
  portalUrl: 'https://www.argentina.gob.ar/subsidios',
  levels: [
    {
      level: 'Nivel 1 (Ingresos Altos)',
      badge: 'Tarifa Plena',
      description: 'Hogares con ingresos netos superiores a 3.5 canastas básicas totales. No reciben bonificación sobre el costo de generación de energía.',
    },
    {
      level: 'Nivel 2 (Ingresos Bajos)',
      badge: 'Subsidio Mayor',
      description: 'Hogares con ingresos menores a 1 canasta básica total o beneficiarios de tarifa social. Máxima bonificación en luz y gas.',
    },
    {
      level: 'Nivel 3 (Ingresos Medios)',
      badge: 'Subsidio con Tope',
      description: 'Hogares con ingresos entre 1 y 3.5 canastas básicas. Mantienen subsidio hasta un tope mensual de consumo (ej. 350-400 kWh); el excedente se factura a tarifa plena.',
    },
  ],
};
