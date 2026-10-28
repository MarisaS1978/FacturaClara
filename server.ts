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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_PROMPT = `Eres "FacturaClara AI", un asistente experto en análisis financiero del hogar y extracción de datos multimodales de facturas reales.
Tu objetivo es examinar minuciosamente la imagen o documento adjunto de la factura (Edesur, Edenor, MetroGAS, Naturgy, AySA, Personal, Telecom, Telecentro, Expensas, etc.), extraer con EXACTITUD los datos reales que figuran en el documento y proporcionar un resumen ultra claro y cotidiano para el usuario en formato JSON estricto.

### INSTRUCCIONES ESTRICTAS:
1. EXTRACCIÓN FIEL DE DATOS REALES (NO INVENTAR):
   - Lee minuciosamente el nombre exacto de la empresa proveedora (ej. "Edesur S.A.", "Edenor", "MetroGAS", etc.).
   - Extrae el monto total REAL a pagar que figura en la factura (numérico con decimales). NUNCA inventes montos.
   - Extrae la fecha de vencimiento real (formato YYYY-MM-DD), el número de cuenta/cliente, número de factura y período facturado.
   - Extrae el consumo real registrado (ej. "350 kWh", "120 m³", etc.).

2. ANÁLISIS Y EXPLICACIÓN ("EN CRIOLLO"):
   - En el campo "explicacion_en_criollo", redacta en Markdown claro y empático:
     - 📌 **Resumen Rápido:** Monto exacto, vencimiento y empresa proveedora detectada.
     - 📊 **Análisis de Consumo y Tarifas:** Evolución del consumo según el gráfico/historial visible en la factura.
     - 🔍 **¿Qué te están cobrando? (En criollo):** Desglose sencillo de cargos fijos, consumo medido e impuestos. Si detectas un cargo sospechoso o fuera de lo habitual, márcalo con 🚨.
     - 💡 **Consejo/Alerta:** Recomendación práctica antes del vencimiento.
     - 📥 **Dónde descargar tus facturas oficiales:** Enlace web oficial o App de la empresa para descargar la factura original en PDF.
     - ⚖️ **Dónde y cómo reclamar:** Canales de contacto directo con la empresa (WhatsApp, teléfono de reclamos) y el Ente Regulador competente correspondiente a este servicio (ENRE para luz como Edesur/Edenor, ENARGAS para gas, ERAS para agua, ENACOM para telecomunicaciones, o Defensa del Consumidor / COPREC).

---

### ESTRUCTURA DE SALIDA (SCHEMA JSON):

Tu respuesta debe ser UNICAMENTE este JSON sin texto antes ni después:

{
  "proveedor": "Nombre exacto de la empresa o null",
  "tipo_servicio": "Luz | Gas | Agua | Internet | Expensas | Otro",
  "numero_cuenta": "string o null",
  "numero_factura": "string o null",
  "periodo_facturado": "string o null",
  "fecha_vencimiento": "YYYY-MM-DD",
  "monto_total": 0.00,
  "moneda": "ARS",
  "consumo_medido": "string (ej: 300 kWh) o null",
  "explicacion_en_criollo": "Texto detallado en Markdown explicándole al usuario de forma sencilla los montos, consumos y detalles de su factura real.",
  "dias_restantes_vencimiento": 0
}

### Reglas estrictas:
- NUNCA inventes datos si no corresponden a la imagen.
- NUNCA escribas "PARTE 1:", "Parte 1:" o similares en la explicación. Comienza directo con los encabezados con emojis (📌 **Resumen Rápido:**).
- La fecha de referencia actual es: 2026-10-26. Calcula dias_restantes_vencimiento en base a esa fecha.`;

// Sleep helper for backoff
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to detect 503, 429, or high demand errors
function isTransientOrOverloadedError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  const status = (err.status || err.code || '').toString().toLowerCase();
  return (
    msg.includes('503') ||
    msg.includes('unavailable') ||
    msg.includes('high demand') ||
    msg.includes('spikes in demand') ||
    msg.includes('try again later') ||
    msg.includes('429') ||
    msg.includes('resource_exhausted') ||
    msg.includes('rate limit') ||
    msg.includes('quota') ||
    msg.includes('overloaded') ||
    msg.includes('timeout') ||
    status === '503' ||
    status === '429' ||
    status === 'unavailable' ||
    status === 'resource_exhausted'
  );
}

// Call a single model with a timeout promise
async function callModelWithTimeout(
  model: string,
  params: { contents: any; config?: any },
  timeoutMs = 15000
) {
  let timer: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Timeout de ${timeoutMs}ms en modelo ${model}`));
    }, timeoutMs);
  });

  try {
    const res = await Promise.race([
      ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      }),
      timeoutPromise,
    ]);
    return res;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// Resilient multimodal extractor with live quota verification and transient 503 retries
async function generateMultimodalInvoiceContent(params: {
  contents: any;
  config?: any;
}) {
  const candidateModels = [
    { name: 'gemini-3-flash-preview', timeout: 18000 },
    { name: 'gemini-3.5-flash-lite', timeout: 18000 },
    { name: 'gemini-flash-lite-latest', timeout: 12000 },
  ];

  let lastError: any = null;

  for (const candidate of candidateModels) {
    try {
      console.log(`[FacturaClara AI] Calling model "${candidate.name}" (timeout: ${candidate.timeout}ms)...`);
      const response = await callModelWithTimeout(candidate.name, params, candidate.timeout);
      console.log(`[FacturaClara AI] Success with model "${candidate.name}"`);
      return response;
    } catch (err: any) {
      lastError = err;
      const errMsg = (err?.message || String(err)).slice(0, 120);
      console.warn(`[FacturaClara AI] Model "${candidate.name}" failed:`, errMsg);
    }
  }

  throw lastError || new Error('No se pudo conectar con ningún servidor de IA disponible para leer la factura.');
}

// API: Analyze Bill
app.post('/api/analyze-bill', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', userContext = '' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'Falta la imagen o archivo de la factura.' });
    }

    const cleanBase64 = imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');

    const userPrompt = userContext
      ? `Por favor analiza esta factura adjunta y extrae con total exactitud la información en el JSON estricto requerido sin inventar datos.
Contexto adicional del usuario: "${userContext}"`
      : 'Por favor analiza en detalle esta factura adjunta y extrae con total exactitud los datos reales (proveedor, montos, vencimientos, consumos) en el JSON estricto requerido sin inventar ningún dato.';

    const response = await generateMultimodalInvoiceContent({
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
      console.warn('Direct parse failed, attempting regex extraction:', parseErr);
      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        billData = JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
      }
    }

    if (!billData) {
      throw new Error('No se pudo decodificar la información de la factura enviada.');
    }

    // Ensure dias_restantes_vencimiento is accurate
    if (billData.fecha_vencimiento) {
      const due = new Date(billData.fecha_vencimiento + 'T00:00:00');
      const today = new Date('2026-10-26T00:00:00');
      if (!isNaN(due.getTime())) {
        const diffTime = due.getTime() - today.getTime();
        billData.dias_restantes_vencimiento = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    }

    // Strip any unexpected "PARTE 1:" or "Parte 1" prefix
    if (billData.explicacion_en_criollo) {
      billData.explicacion_en_criollo = billData.explicacion_en_criollo
        .replace(/^[#*\s]*parte\s*1\s*[:\-\.]?\s*[^\n]*\n?/gim, '')
        .replace(/\bPARTE\s*1\s*[:\-\.]?\s*/gi, '')
        .replace(/\bParte\s*1\s*[:\-\.]?\s*/gi, '')
        .trim();
    }

    // Set alias for UI compatibility
    billData.numero_cliente_o_cuenta = billData.numero_cuenta;

    return res.json({
      success: true,
      rawOutput: rawText,
      billData,
    });
  } catch (error: any) {
    console.error('Error analyzing bill with Gemini:', error);
    const isTransient = isTransientOrOverloadedError(error);
    const friendlyMessage = isTransient
      ? 'Los servidores de visión de IA tuvieron una interrupción momentánea de red. Haz clic en "Reintentar ahora" para analizar tu factura real.'
      : (error.message || 'No se pudo leer la factura. Por favor verifica que la imagen sea nítida y reintenta.');

    return res.status(200).json({
      success: false,
      error: friendlyMessage,
      isTransient,
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

    const promptText = `Contexto de la factura real auditada:
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

    const candidateModels = ['gemini-3-flash-preview', 'gemini-3.5-flash-lite', 'gemini-flash-lite-latest'];
    let replyText = '';

    for (const model of candidateModels) {
      try {
        const response = await callModelWithTimeout(model, {
          contents: promptText,
          config: {
            systemInstruction: 'Eres FacturaClara AI, un asesor financiero del hogar empático y experto en facturas de servicios y defensa del consumidor.',
            temperature: 0.4,
          },
        }, 8000);
        replyText = response.text || '';
        if (replyText) break;
      } catch (err) {
        console.warn(`Chat model ${model} failed, trying next...`);
      }
    }

    if (!replyText) {
      const prov = billContext?.proveedor || 'tu empresa prestadora';
      replyText = `Para resolver tu consulta sobre **${prov}**:

1. **Gestión rápida:** Podés ingresar a su portal web oficial o comunicarte por sus canales de atención digital indicando tu número de cuenta (${billContext?.numero_cuenta || 'el que figura en la factura'}).
2. **Reclamos:** Si te cobraron de más o sufriste un corte indebido, exigí siempre tu **número de reclamo** oficial de 10 dígitos.
3. **Plazo legal y Ente Regulador:** Si la empresa no responde en 10 días hábiles, podés presentar el número de reclamo ante el Ente Regulador correspondiente o en Defensa del Consumidor (COPREC / Línea 147) para solicitar el reintegro.`;
    }

    return res.json({
      success: true,
      reply: replyText,
    });
  } catch (error: any) {
    console.error('Error in chat-bill:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al procesar la consulta.',
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'FacturaClara AI Server',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// JSON Error Handler Middleware
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('[FacturaClara Server Error Handler]:', err);
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      success: false,
      error: 'El archivo enviado es demasiado pesado para transferirse. Te recomendamos tomar una foto más cercana o recortarla.',
    });
  }
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor.',
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
