import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, MessageSquare } from 'lucide-react';
import { BillStructuredData } from '../types/bill';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface ChatBillProps {
  billData: BillStructuredData;
}

export const ChatBill: React.FC<ChatBillProps> = ({ billData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `¡Hola! Soy FacturaClara AI. Acabo de auditar tu factura de **${billData.proveedor}** por **${billData.moneda} ${billData.monto_total.toLocaleString('es-AR')}**.\n\n¿Tienes alguna duda sobre los cargos, cómo reclamar o cómo pedir subsidios? ¡Pregúntame lo que quieras!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedQuestions = [
    '¿Cómo redacto el reclamo para la empresa?',
    '¿Qué significa el cargo fijo y es legal?',
    '¿Cómo solicito el subsidio de luz/gas?',
    '¿Cuánto me cobran de recargo si pago fuera de término?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billContext: billData,
          question: textToSend,
          history: messages.slice(-4),
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'No se pudo obtener respuesta.');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Disculpa, ocurrió un inconveniente: ${err.message || 'Error de conexión'}. ¿Podrías intentar nuevamente?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col h-[520px] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Pregúntale a FacturaClara AI</h4>
            <p className="text-[11px] text-slate-400">Asesor financiero para {billData.proveedor}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/30 rounded-full text-[10px] text-emerald-300 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Activo</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {msg.text}
                <div className={`text-[10px] mt-1 text-right ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-none p-3 text-xs text-slate-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>FacturaClara AI está pensando...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700/80 transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu consulta sobre esta factura..."
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-200 placeholder-slate-500 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
