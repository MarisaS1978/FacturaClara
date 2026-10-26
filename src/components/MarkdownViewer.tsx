import React from 'react';
import { Copy, Check, Info, AlertTriangle, Lightbulb, TrendingUp, HelpCircle } from 'lucide-react';

interface MarkdownViewerProps {
  content: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const [copied, setCopied] = React.useState(false);

  // Sanitize content to completely remove any 'PARTE 1:' or 'Parte 1' remnants
  const sanitizedContent = React.useMemo(() => {
    if (!content) return '';
    return content
      // Remove any heading or line starting with PARTE 1 or Parte 1
      .replace(/^[#*\s]*parte\s*1\s*[:\-\.]?\s*[^\n]*\n?/gim, '')
      // Remove inline "PARTE 1:" or "Parte 1:"
      .replace(/\bPARTE\s*1\s*[:\-\.]?\s*/gi, '')
      .replace(/\bParte\s*1\s*[:\-\.]?\s*/gi, '')
      .trim();
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sanitizedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Process text into styled blocks
  const lines = sanitizedContent.split('\n');

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3.5 sm:p-6 shadow-xl relative text-slate-200 w-full max-w-full min-w-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 mb-4 sm:mb-5 border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm shrink-0">
            💬
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-white truncate">
              Explicación para el Usuario (En Criollo)
            </h3>
            <p className="text-[11px] text-slate-400 truncate">Traducción directa sin terminología técnica</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-xl text-xs font-semibold transition-colors min-h-[40px] shrink-0"
          title="Copiar texto de explicación"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm leading-relaxed break-words w-full max-w-full min-w-0 overflow-hidden">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Extra safety check: if line starts with PARTE 1, completely omit it
          if (/^#*\s*\*?\*?parte\s*1\b/i.test(trimmed)) {
            return null;
          }

          // Headers
          if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
            const headingText = trimmed.replace(/^#+\s*/, '').replace(/^parte\s*1\s*[:\-\.]?\s*/i, '');
            return (
              <h4 key={idx} className="text-sm sm:text-base font-bold text-cyan-300 mt-3 pt-2 border-t border-slate-800/60 flex items-center gap-2 break-words">
                {headingText}
              </h4>
            );
          }

          // Section Markers
          const isResumen = trimmed.includes('📌') || trimmed.toLowerCase().includes('resumen rápido');
          const isConsumo = trimmed.includes('📊') || trimmed.toLowerCase().includes('análisis de consumo');
          const isQueCobran = trimmed.includes('🔍') || trimmed.toLowerCase().includes('qué te están cobrando');
          const isConsejo = trimmed.includes('💡') || trimmed.toLowerCase().includes('consejo') || trimmed.toLowerCase().includes('alerta');
          const isDescarga = trimmed.includes('📥') || trimmed.toLowerCase().includes('dónde descargar');
          const isReclamo = trimmed.includes('⚖️') || trimmed.toLowerCase().includes('dónde y cómo');
          const isWarning = trimmed.includes('🚨') || trimmed.includes('⚠️') || trimmed.toLowerCase().includes('cargo sospechoso');

          let cardStyle = '';
          if (isResumen) cardStyle = 'bg-blue-950/30 border-l-4 border-l-blue-500 p-3.5 rounded-r-xl border-y border-r border-slate-800/80';
          else if (isConsumo) cardStyle = 'bg-indigo-950/30 border-l-4 border-l-indigo-500 p-3.5 rounded-r-xl border-y border-r border-slate-800/80';
          else if (isQueCobran) cardStyle = 'bg-slate-800/40 border-l-4 border-l-cyan-500 p-3.5 rounded-r-xl border-y border-r border-slate-800/80';
          else if (isConsejo) cardStyle = 'bg-amber-950/30 border-l-4 border-l-amber-500 p-3.5 rounded-r-xl border-y border-r border-slate-800/80';
          else if (isDescarga) cardStyle = 'bg-cyan-950/30 border-l-4 border-l-cyan-400 p-3.5 rounded-r-xl border-y border-r border-slate-800/80 text-cyan-200';
          else if (isReclamo) cardStyle = 'bg-purple-950/30 border-l-4 border-l-purple-500 p-3.5 rounded-r-xl border-y border-r border-slate-800/80 text-purple-200';
          else if (isWarning) cardStyle = 'bg-rose-950/40 border border-rose-500/40 p-3.5 rounded-xl text-rose-200';

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const bulletText = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2.5 ml-1 my-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <div className="flex-1 text-slate-300" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(bulletText) }} />
              </div>
            );
          }

          // Numbered items
          const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numberedMatch) {
            return (
              <div key={idx} className="flex items-start gap-2.5 ml-1 my-2">
                <span className="w-5 h-5 rounded bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {numberedMatch[1]}
                </span>
                <div className="flex-1 text-slate-300" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(numberedMatch[2]) }} />
              </div>
            );
          }

          if (cardStyle) {
            return (
              <div key={idx} className={`${cardStyle} my-2 font-medium`}>
                <div dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
              </div>
            );
          }

          return (
            <p key={idx} className="text-slate-300 my-1">
              <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
            </p>
          );
        })}
      </div>
    </div>
  );
};

// Helper for bold, italic, and anchor links
function formatInlineMarkdown(text: string): string {
  let formatted = text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline font-semibold transition-colors inline-flex items-center gap-0.5">$1 ↗</a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 text-xs font-mono">$1</code>');
  return formatted;
}
