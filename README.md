# 🧾 FacturaClara AI | Lector y Simplificador Inteligente de Facturas

<p align="center">
  <a href="#español">🇦🇷 Español</a> |
  <a href="#english">🇬🇧 English</a>
</p>

---

<a id="español"></a>

# 🇦🇷 Español

## 📋 Descripción del proyecto

**FacturaClara AI** es una aplicación web que utiliza Inteligencia Artificial para leer, analizar y explicar facturas de servicios de manera sencilla y comprensible.

Permite cargar una factura en formato PDF o imagen, extraer información relevante y generar un resumen en lenguaje cotidiano, para que cualquier persona pueda entender qué está pagando, cuánto debe abonar, cuándo vence y qué conceptos aparecen en su factura.

El proyecto combina procesamiento multimodal con IA, extracción estructurada de datos y asistencia conversacional para facilitar la comprensión de los gastos del hogar.

🌐 **Aplicación online:** [Probar FacturaClara AI](https://facturaclara.ai.studio/)

## ✨ Funcionalidades principales

### 📄 Lectura inteligente de facturas
- Carga de facturas en formato PDF e imagen.
- Captura de documentos mediante cámara.
- Reconocimiento de información mediante Inteligencia Artificial multimodal.
- Identificación del proveedor y tipo de servicio.
- Extracción de importes, vencimientos, períodos facturados y consumos.
- Identificación de números de cuenta y factura cuando están disponibles.

### 🤖 Explicación en lenguaje cotidiano
La aplicación transforma la información técnica de las facturas en explicaciones fáciles de entender.

- Resumen del importe total y fecha de vencimiento.
- Explicación de cargos fijos, consumo e impuestos.
- Análisis de consumos e historial cuando la factura contiene esa información.
- Identificación de posibles cargos inusuales.
- Consejos y alertas para el usuario.

### 🔍 Asistente conversacional con IA
- Permite realizar preguntas sobre una factura analizada.
- Ofrece explicaciones adicionales sobre importes y consumos.
- Proporciona orientación sobre posibles reclamos.
- Sugiere canales oficiales de atención y organismos reguladores.

### 📚 Historial de análisis
- Consulta de facturas analizadas anteriormente.
- Acceso a resultados guardados.
- Selección y eliminación de registros.
- Almacenamiento del historial en el navegador mediante LocalStorage.

### 🏢 Directorio de servicios y portales oficiales
Incluye orientación para consultar servicios y proveedores, como:

- Edesur y Edenor.
- Metrogas y Naturgy.
- AySA.
- Personal, Telecom y Telecentro.
- Expensas y otros servicios.

### 💡 Consejos de ahorro
Incluye un espacio de recomendaciones para ayudar a comprender los consumos y buscar oportunidades de ahorro en los gastos del hogar.

### 🔐 Privacidad y controles de seguridad
- Opción de enmascaramiento de información personal sensible.
- Controles para eliminar el historial almacenado.
- Procesamiento de documentos mediante el servidor y la API de Gemini.
- Cabeceras de seguridad y controles de entrada en el servidor.

**Importante:** las funcionalidades y controles de seguridad implementados en el código no equivalen por sí mismos a una certificación independiente SOC 2 o ISO 27001.

---

## 🛠️ Tecnologías y herramientas

| Categoría | Tecnologías |
|---|---|
| Lenguaje de programación | TypeScript |
| Biblioteca de interfaz | React 19 |
| Entorno de desarrollo | Vite |
| Estilos | Tailwind CSS 4 |
| Inteligencia Artificial | Google Gemini API |
| SDK de IA | Google GenAI SDK |
| Servidor | Node.js, Express |
| Iconografía | Lucide React |
| Animaciones | Motion, Canvas Confetti |
| Almacenamiento local | LocalStorage |
| Herramientas adicionales | dotenv, npm |
| Desarrollo asistido por IA | Google AI Studio |

---

## 🧠 Procesamiento con Inteligencia Artificial

El sistema utiliza modelos multimodales de Google Gemini para interpretar documentos y extraer información estructurada.

El flujo de análisis comprende:

1. **Carga:** el usuario selecciona una factura PDF o imagen, o utiliza la cámara.
2. **Procesamiento:** el documento se envía al servidor para su análisis.
3. **Extracción:** Gemini identifica los datos disponibles en la factura.
4. **Estructuración:** la información se organiza en un esquema JSON.
5. **Interpretación:** se genera una explicación en lenguaje cotidiano.
6. **Consulta:** el usuario puede realizar preguntas adicionales sobre el documento.

La extracción contempla campos como proveedor, tipo de servicio, importe, moneda, vencimiento, período facturado y consumo registrado.

El sistema también incorpora mecanismos de reintento y selección alternativa de modelos ante errores temporales o límites de disponibilidad.

---

## 📂 Estructura del proyecto

```text
FacturaClara/
│
├── public/                  # Recursos públicos
├── scripts/                 # Scripts auxiliares
├── src/
│   ├── components/
│   │   ├── AnalysisDashboard
│   │   ├── BillUploader
│   │   ├── BillHistory
│   │   ├── CameraModal
│   │   ├── OfficialPortalsModal
│   │   ├── SavingsModal
│   │   └── SecurityComplianceModal
│   ├── data/                # Datos y facturas de ejemplo
│   ├── types/               # Tipos y estructuras de datos
│   └── App.tsx              # Componente principal
│
├── .env.example
├── index.html
├── metadata.json
├── package.json
├── server.ts                # Servidor y endpoints de IA
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Instalación y ejecución local

**Requisitos previos:**
- Node.js
- npm
- Una API Key de Google Gemini.

**1. Clonar el repositorio**

```bash
git clone https://github.com/MarisaS1978/FacturaClara.git
```

**2. Ingresar a la carpeta**

```bash
cd FacturaClara
```

**3. Instalar dependencias**

```bash
npm install
```

**4. Configurar variables de entorno**

Crear un archivo `.env` a partir de `.env.example` y configurar la clave de API:

```env
GEMINI_API_KEY=tu_api_key
```

No compartir ni publicar la clave de API.

**5. Ejecutar la aplicación**

```bash
npm run dev
```

**6. Generar la versión de producción**

```bash
npm run build
```

---

## 🎯 Objetivo del proyecto

Desarrollar una herramienta digital que acerque la Inteligencia Artificial a la vida cotidiana, ayudando a las personas a comprender sus facturas, controlar los gastos del hogar y acceder a información útil para tomar decisiones más informadas.

FacturaClara AI forma parte de mi portfolio de proyectos de desarrollo de aplicaciones con Inteligencia Artificial, integrando procesamiento de documentos, extracción de datos, análisis y asistencia conversacional.

---

## 👩‍💻 Desarrollado por

**Marisa Silvina Sandroni**

- **GitHub:** [MarisaS1978](https://github.com/MarisaS1978)
- **LinkedIn:** [Marisa Silvina Sandroni](https://www.linkedin.com/in/marisa-silvina-sandroni/)
- **Behance:** [marisasand](https://www.behance.net/marisasand)

📂 **Repositorio:** [FacturaClara](https://github.com/MarisaS1978/FacturaClara)

🌐 **Aplicación online:** [Probar FacturaClara AI](https://facturaclara.ai.studio/)

⭐ ¡Gracias por visitar mi proyecto!

---

<a id="english"></a>

# 🇬🇧 English

## 📋 Project Overview

**FacturaClara AI** is a web application that uses Artificial Intelligence to read, analyze, and explain utility bills in a simple and understandable way.

Users can upload a bill as a PDF or image, extract relevant information, and receive an easy-to-understand summary explaining what they are paying for, how much they owe, when payment is due, and which charges appear on the bill.

The project combines multimodal AI processing, structured data extraction, and conversational assistance to make household expenses easier to understand.

🌐 **Live Application:** [Try FacturaClara AI](https://facturaclara.ai.studio/)

## ✨ Key Features

### 📄 Intelligent Bill Reading
- Upload bills in PDF or image format.
- Capture documents using the camera.
- Multimodal AI-powered document recognition.
- Provider and service type identification.
- Extraction of amounts, due dates, billing periods, and consumption data.
- Identification of account and invoice numbers when available.

### 🤖 Plain-Language Explanations
The application transforms technical billing information into clear and easy-to-understand explanations.

- Summary of total amount and payment due date.
- Explanation of fixed charges, consumption, and taxes.
- Consumption and billing history analysis when available on the document.
- Identification of potentially unusual charges.
- Practical tips and alerts for users.

### 🔍 AI Conversational Assistant
- Ask questions about an analyzed bill.
- Get additional explanations about charges and consumption.
- Receive guidance on possible complaints.
- Access official customer support channels and regulatory authorities.

### 📚 Analysis History
- Review previously analyzed bills.
- Access saved analysis results.
- Select and delete records.
- Browser-based history storage using LocalStorage.

### 🏢 Utility Providers and Official Portals
Includes guidance for checking utility providers and services, such as:

- Edesur and Edenor.
- Metrogas and Naturgy.
- AySA.
- Personal, Telecom, and Telecentro.
- Building maintenance fees and other services.

### 💡 Savings Tips
Provides recommendations to help users understand their consumption and identify potential savings in household expenses.

### 🔐 Privacy and Security Controls
- Option to mask sensitive personal information.
- Controls to clear locally stored history.
- Document processing through the server and Gemini API.
- Server-side security headers and input controls.

**Important:** security features and controls implemented in the code do not, by themselves, constitute independent SOC 2 or ISO 27001 certification.

---

## 🛠️ Technologies and Tools

| Category | Technologies |
|---|---|
| Programming Language | TypeScript |
| UI Library | React 19 |
| Development Environment | Vite |
| Styling | Tailwind CSS 4 |
| Artificial Intelligence | Google Gemini API |
| AI SDK | Google GenAI SDK |
| Server | Node.js, Express |
| Icons | Lucide React |
| Animations | Motion, Canvas Confetti |
| Local Storage | LocalStorage |
| Additional Tools | dotenv, npm |
| AI-assisted Development | Google AI Studio |

---

## 🧠 Artificial Intelligence Processing

The system uses Google's multimodal Gemini models to interpret documents and extract structured information.

The analysis workflow includes:

1. **Upload:** the user selects a PDF or image, or uses the camera.
2. **Processing:** the document is sent to the server for analysis.
3. **Extraction:** Gemini identifies the available information in the bill.
4. **Structuring:** the extracted information is organized into a JSON schema.
5. **Interpretation:** an easy-to-understand explanation is generated.
6. **Follow-up:** users can ask additional questions about the document.

The extraction process covers fields such as provider, service type, amount, currency, due date, billing period, and recorded consumption.

The system also includes retry mechanisms and alternative model selection to handle temporary errors and availability limits.

---

## 📂 Project Structure

```text
FacturaClara/
│
├── public/                  # Public assets
├── scripts/                 # Auxiliary scripts
├── src/
│   ├── components/
│   │   ├── AnalysisDashboard
│   │   ├── BillUploader
│   │   ├── BillHistory
│   │   ├── CameraModal
│   │   ├── OfficialPortalsModal
│   │   ├── SavingsModal
│   │   └── SecurityComplianceModal
│   ├── data/                # Sample data and invoices
│   ├── types/               # Data types and structures
│   └── App.tsx              # Main application component
│
├── .env.example
├── index.html
├── metadata.json
├── package.json
├── server.ts                # Server and AI endpoints
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Installation and Local Setup

**Prerequisites:**
- Node.js
- npm
- A Google Gemini API Key.

**1. Clone the repository**

```bash
git clone https://github.com/MarisaS1978/FacturaClara.git
```

**2. Navigate to the project folder**

```bash
cd FacturaClara
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env` file based on `.env.example` and configure your API key:

```env
GEMINI_API_KEY=your_api_key
```

Do not share or publish your API key.

**5. Start the application**

```bash
npm run dev
```

**6. Build for production**

```bash
npm run build
```

---

## 🎯 Project Goal

To develop a digital tool that brings Artificial Intelligence closer to everyday life, helping people understand their bills, manage household expenses, and access useful information to make more informed decisions.

FacturaClara AI is part of my portfolio of AI-powered application development projects, combining document processing, data extraction, analysis, and conversational assistance.

---

## 👩‍💻 Developed by

**Marisa Silvina Sandroni**

- **GitHub:** [MarisaS1978](https://github.com/MarisaS1978)
- **LinkedIn:** [Marisa Silvina Sandroni](https://www.linkedin.com/in/marisa-silvina-sandroni/)
- **Behance:** [marisasand](https://www.behance.net/marisasand)

📂 **Repository:** [FacturaClara](https://github.com/MarisaS1978/FacturaClara)

🌐 **Live Application:** [Try FacturaClara AI](https://facturaclara.ai.studio/)

⭐ Thank you for visiting my project!
