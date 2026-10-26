import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser for JSON with large base64 invoice images/documents
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_PROMPT = `Eres "FacturaClara AI", un asistente experto en análisis financiero del hogar y extracción de datos multimodales. Tu objetivo es procesar imágenes o PDFs de facturas de servicios públicos y privados (luz, gas, agua, internet, expensas/mantenimiento, telefonía, etc.), extraer su información clave y proporcionar un resumen ultra claro y cotidiano para el usuario en formato JSON estricto.

### INSTRUCCIONES DE PROCESAMIENTO:

1. ANÁLISIS VISUAL Y LECTURA:
   - Examina la factura adjunta (imagen o documento).
   - Identifica la empresa proveedora, tipo de servicio (Luz | Gas | Agua | Internet | Expensas | Otro), titular, número de cliente/cuenta, período facturado, fecha de vencimiento (formato YYYY-MM-DD) y monto total a pagar.
   - Identifica el consumo del período actual (ej. kWh, m3, GB) y su unidad.

2. DETECCIÓN DE ANOMALÍAS Y AUMENTOS:
   - Compara el consumo actual con el historial visible en la factura.
   - Detecta si hay un incremento inusual en el consumo o un aumento significativo en la tarifa.

3. EXPLICACIÓN PARA EL USUARIO ("EN CRIOLLO"):
   - Redacta un resumen amigable y en lenguaje cotidiano dentro del campo "explicacion_en_criollo" del JSON en formato Markdown estructurado:
     - 📌 **Resumen Rápido:** Monto total, vencimiento y empresa.
     - 📊 **Análisis de Consumo y Tarifas:** Comparativa y alertas de subida/bajada.
     - 🔍 **¿Qué te están cobrando? (En criollo):** Explicación clara de conceptos y cargos sospechosos (marcar con 🚨 si hay alguno).
     - 💡 **Consejo/Alerta:** Recomendación de ahorro o acción antes del vencimiento.
     - 📥 **Dónde descargar tus facturas oficiales:** Enlace al portal web oficial o App de la empresa.
     - ⚖️ **Dónde y cómo reclamar:** Canales oficiales (Portal de reclamos, WhatsApp, 0800) y Ente Regulador competente (ENRE, ENARGAS, ENACOM, ERAS o Defensa del Consumidor/COPREC).

---

### ESTRUCTURA DE SALIDA (SCHEMA JSON):

Tu respuesta debe ajustarse estrictamente a este formato JSON, sin texto fuera de él:

{
  "proveedor": "Nombre de la empresa o null",
  "tipo_servicio": "Luz | Gas | Agua | Internet | Expensas | Otro",
  "numero_cuenta": "string o null",
  "numero_factura": "string o null",
  "periodo_facturado": "string o null",
  "fecha_vencimiento": "YYYY-MM-DD",
  "monto_total": 0.00,
  "moneda": "ARS",
  "consumo_medido": "string (ej: 300 GB o 150 kWh) o null",
  "explicacion_en_criollo": "Texto detallado en Markdown explicándole al usuario de forma sencilla los montos, consumos y detalles de su factura.",
  "dias_restantes_vencimiento": 0
}

### Reglas estrictas:
- No incluyas bloques de texto fuera del JSON. Todo el contenido (tanto los datos de las tarjetas como la explicación en texto) debe viajar dentro de las propiedades del objeto JSON.
- REGLA FUNDAMENTAL: NUNCA escribas "PARTE 1:", "Parte 1:", "PARTE 1" o encabezados similares en "explicacion_en_criollo". Comienza directamente con los encabezados temáticos con emojis (📌 **Resumen Rápido:** ...).
- Si un campo no es visible, asígnale null.
- La fecha actual de referencia es: 2026-10-26. Calcula dias_restantes_vencimiento en base a esa fecha.`;

// API: Analyze Bill
app.post('/api/analyze-bill', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', userContext = '' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Falta la imagen o archivo de la factura.' });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');

    const userPrompt = userContext
      ? `Por favor analiza esta factura adjunta y extrae la información en el JSON estricto requerido.
Contexto adicional del usuario: "${userContext}"`
      : 'Por favor analiza en detalle esta factura adjunta y extrae la información en el JSON estricto requerido.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType.includes('pdf') ? 'application/pdf' : (mimeType || 'image/jpeg'),
              },
            },
            {
              text: userPrompt,
            },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            proveedor: { type: Type.STRING },
            tipo_servicio: { type: Type.STRING },
            numero_cuenta: { type: Type.STRING },
            numero_factura: { type: Type.STRING },
            periodo_facturado: { type: Type.STRING },
            fecha_vencimiento: { type: Type.STRING },
            monto_total: { type: Type.NUMBER },
            moneda: { type: Type.STRING },
            consumo_medido: { type: Type.STRING },
            explicacion_en_criollo: { type: Type.STRING },
            dias_restantes_vencimiento: { type: Type.INTEGER },
          },
          required: [
            'proveedor',
            'tipo_servicio',
            'fecha_vencimiento',
            'monto_total',
            'moneda',
            'explicacion_en_criollo',
          ],
        },
        temperature: 0.1,
      },
    });

    const rawText = (response.text || '').trim();
    let billData: any = null;

    try {
      billData = JSON.parse(rawText);
    } catch (parseErr) {
      console.warn('Direct parse failed, attempting extraction:', parseErr);
      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        billData = JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
      }
    }

    if (!billData) {
      throw new Error('No se pudo decodificar el formato JSON de FacturaClara.');
    }

    // Ensure dias_restantes_vencimiento is accurate
    if (billData.fecha_vencimiento) {
      const due = new Date(billData.fecha_vencimiento + 'T00:00:00');
      const today = new Date('2026-10-26T00:00:00');
      const diffTime = due.getTime() - today.getTime();
      billData.dias_restantes_vencimiento = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Strip any unexpected "PARTE 1:" or "Parte 1" prefix
    if (billData.explicacion_en_criollo) {
      billData.explicacion_en_criollo = billData.explicacion_en_criollo
        .replace(/^[#*\s]*parte\s*1\s*[:\-\.]?\s*[^\n]*\n?/gim, '')
        .replace(/\bPARTE\s*1\s*[:\-\.]?\s*/gi, '')
        .replace(/\bParte\s*1\s*[:\-\.]?\s*/gi, '')
        .trim();
    }

    // Set alias for compatibility
    billData.numero_cliente_o_cuenta = billData.numero_cuenta;

    return res.json({
      success: true,
      rawOutput: rawText,
      billData,
    });
  } catch (error: any) {
    console.error('Error analyzing bill with Gemini:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al comunicarse con FacturaClara AI.',
    });
  }
});

// API: Follow-up Chat on Analyzed Bill
app.post('/api/chat-bill', async (req: Request, res: Response) => {
  try {
    const { billContext, question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'La pregunta no puede estar vacía.' });
    }

    const promptText = `Contexto de la factura auditada:
- Proveedor: ${billContext?.proveedor || 'No especificado'}
- Tipo de servicio: ${billContext?.tipo_servicio || 'Servicio'}
- Monto total: ${billContext?.moneda || '$'} ${billContext?.monto_total || 0}
- Vencimiento: ${billContext?.fecha_vencimiento || 'N/A'} (en ${billContext?.dias_restantes_vencimiento || 0} días)
- Consumo medido: ${billContext?.consumo_medido || 'No disponible'}
- N° Cuenta: ${billContext?.numero_cuenta || 'N/A'}
- N° Factura: ${billContext?.numero_factura || 'N/A'}
- Resumen en criollo previo: ${billContext?.explicacion_en_criollo || ''}

Pregunta del usuario:
"${question}"

Responde como FacturaClara AI de forma concisa, cálida, en lenguaje cotidiano ("en criollo"), dando pasos prácticos y canales oficiales donde resolver su duda o reclamo.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: 'Eres FacturaClara AI, un asesor financiero del hogar empático y experto en facturas de servicios y defensa del consumidor.',
        temperature: 0.4,
      },
    });

    return res.json({
      success: true,
      reply: response.text || 'No se pudo generar una respuesta.',
    });
  } catch (error: any) {
    console.error('Error in chat-bill:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error en el chat de FacturaClara.',
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'FacturaClara AI Server',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    schema: 'Strict JSON Schema with explicacion_en_criollo',
    time: new Date().toISOString(),
  });
});

// Vite or Static file middleware
async function setupVite() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FacturaClara AI] Running at http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
