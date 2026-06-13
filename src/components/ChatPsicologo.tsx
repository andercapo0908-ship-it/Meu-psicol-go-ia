import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, MicOff, Volume2, VolumeX, Eye, AlertOctagon, HeartHandshake, Smile, RefreshCw, MessageSquare } from "lucide-react";
import { ChatMessage, UserProfile } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ChatPsicologoProps {
  userProfile: UserProfile;
}

export default function ChatPsicologo({ userProfile }: ChatPsicologoProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("chat_messages");
    return saved ? JSON.parse(saved) : [
      {
        id: "welcome_init",
        role: "assistant",
        text: `Olá, ${userProfile.name || "amigo(a)"}. Seja muito bem-vindo(a) a este espaço seguro de escuta ativa e acolhimento emocional.\n\nSou o seu assistente inteligente Meu Psicólogo Pessoal. Estou aqui sob as bases da Terapia Cognitivo-Comportamental (TCC) e Atenção Plena (Mindfulness) para escutar você sem julgamentos, de forma empática e compassiva.\n\nComo você está se sentindo hoje? Se preferir, conte-me o que está te afligindo ou escolha um assunto (ansiedade, estresse, autoestima...). Se houver cansaço, você pode usar o ícone do microfone para falar por voz.`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingMsgId, setIsSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // Salvar logs de mensagens no storage local
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  // Inicializar Reconhecimento de Voz (Speech to Text)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'pt-BR';
      rec.interimResults = false;

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInputText(prev => prev + " " + transcript);
        }
      };
      rec.onerror = (err: any) => {
        console.warn("Erro no reconhecimento de fala do navegador:", err);
        setIsListening(false);
      };
      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Ligar/Desligar Microfone
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("O reconhecimento de voz/fala não é suportado integralmente neste navegador. Sugerimos utilizar o navegador Chrome ou Safari para suporte a áudio-texto.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      window.speechSynthesis?.cancel(); // Parar fala atual ao falar
      setIsSpeakingMsgId(null);
      recognitionRef.current.start();
    }
  };

  // Leitura de texto por Voz (Text to Speech)
  const speakMessageText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Seu navegador não possui suporte para síntese de texto-áudio.");
      return;
    }

    if (isSpeakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel(); // Parar as leituras prévias
    
    // Limpar markdown das frases para leitura fluída
    const cleanText = text.replace(/[*#_\\-]/g, "").replace(/\n/g, " ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "pt-BR";
    
    // Buscar voz pt-BR do sistema se disponível
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith("pt")) || voices[0];
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onend = () => {
      setIsSpeakingMsgId(null);
    };
    utterance.onerror = () => {
      setIsSpeakingMsgId(null);
    };

    setIsSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Enviar Mensagem do Usuário
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsgText = inputText.trim();
    setInputText("");
    
    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Enviar para o backend Express que se comunica com o Gemini API
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, text: m.text })),
          userPreferences: {
            name: userProfile.name,
            age: userProfile.age,
            goals: userProfile.emotionalGoals
          }
        })
      });

      const data = await response.json();
      setIsTyping(false);

      if (response.ok && data.text) {
        const assistantMessage: ChatMessage = {
          id: `asst_${Date.now()}`,
          role: "assistant",
          text: data.text,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Se for crise ou se quiser ativar auto fonoaudiologia, pode falar de imediato
        if (data.isCrisis) {
          speakMessageText(assistantMessage.id, "Por favor, busque apoio humano profissional imediato. Faça uma ligação gratuita para o CVV discando de seu celular o número cento e oitenta e oito.");
        }
      } else {
        throw new Error(data.error || "Erro ao gerar resposta");
      }

    } catch (error) {
      console.error("Erro na escuta do chat:", error);
      setIsTyping(false);
      
      // Fallback local caso o servidor ou a API esteja inativa
      const fallbackMsgs = [
        "Sinto muito que você esteja passando por isso. Às vezes, colocar para fora o que sentimos já ajuda a diminuir a pressão. Gostaria de me detalhar um pouco mais sobre esse sentimento?",
        "Entendo como isso pode parecer difícil agora. Me fale: o que de imediato poderíamos fazer para tornar o seu ambiente mais confortável e seguro agora? Talvez respirar fundo?",
        "Estou escutando você com atenção plena. Lembre-se de ser gentil consigo mesmo(a). Situações difíceis são temporárias, e você é mais forte do que imagina. O que acha de reestruturarmos esse pensamento negativo?"
      ];
      const randomFallback = fallbackMsgs[Math.floor(Math.random() * fallbackMsgs.length)];

      setMessages(prev => [...prev, {
        id: `asst_err_${Date.now()}`,
        role: "assistant",
        text: `[Modo Acolhimento Local]: ${randomFallback}\n\n*(Nota: O chatbot está operando em contingência offline. Certifique-se de preencher a chave GEMINI_API_KEY se preferir respostas dinâmicas do assistente inteligente).*`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  // Limpar histórico
  const clearChatHistory = () => {
    if (confirm("Deseja apagar permanentemente todo o histórico de conversas com o seu psicólogo pessoal?")) {
      window.speechSynthesis?.cancel();
      const reset = [
        {
          id: "welcome_init",
          role: "assistant",
          text: `Conversa reiniciada. Como está se sentindo agora, ${userProfile.name || "amigo(a)"}? Estou pronto(a) para escutar e trabalhar junto com você através de TCC e Inteligência Emocional.`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(reset as any);
      localStorage.setItem("chat_messages", JSON.stringify(reset));
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-[600px]">
      {/* Topo do Chat */}
      <div className="bg-gradient-to-r from-brand-50 to-safe-50 border-b border-slate-100 p-4 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-brand-500 font-display font-medium text-white flex items-center justify-center border-2 border-white shadow-xs">
              🧠
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-slate-800">Seu Psicólogo Inteligente</h3>
            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              Ativo via TCC & Mindfulness • Online/Offline
            </span>
          </div>
        </div>

        <button
          onClick={clearChatHistory}
          className="text-slate-400 hover:text-red-500 bg-white/70 hover:bg-red-50 border border-slate-200/60 p-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          title="Limpar Conversas"
        >
          Limpar Diálogo
        </button>
      </div>

      {/* Caixa do Fluxo de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[85%] md:max-w-[75%] ${
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs shadow-xs ${
                isUser ? "bg-white border-slate-200 text-slate-600" : "bg-brand-500 border-brand-500 text-white"
              }`}>
                {isUser ? "👤" : "🧠"}
              </div>

              <div className="space-y-1">
                <div className={`p-4 rounded-2xl relative shadow-2xs text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? "bg-brand-500 text-white rounded-tr-xs font-medium"
                    : "bg-white border border-slate-150 text-slate-700 rounded-tl-xs"
                }`}>
                  {msg.text}
                  
                  {/* Botão integrado de Áudio-Escuta Texto a partir de mensagem de Psicólogo */}
                  {!isUser && (
                    <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => speakMessageText(msg.id, msg.text)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] transition-colors cursor-pointer border ${
                          isSpeakingMsgId === msg.id 
                            ? "bg-amber-50 border-amber-200 text-amber-700 font-bold" 
                            : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-100"
                        }`}
                        title="Ouvir áudio-leitor"
                      >
                        {isSpeakingMsgId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 animate-bounce" />
                            <span>Parar Leitura</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Ouvir Psicólogo</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                
                <span className={`text-[9px] font-mono font-medium block px-1 text-slate-400 ${isUser ? "text-right" : "text-left"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Indicador de Digitação (Typing Indicator) */}
        {isTyping && (
          <div className="flex items-center gap-2 mr-auto max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border text-xs">
              🧠
            </div>
            <div className="bg-white border border-slate-100 p-3 px-4 rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-1 h-10 shrink-0">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Envio de Texto e Voz */}
      <form onSubmit={handleSendMessage} className="bg-slate-50 p-3 shrink-0 border-t border-slate-100 flex items-center gap-2">
        {/* Microfone de Áudio para Texto (Speech-to-text) */}
        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isListening
              ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20"
              : "bg-white hover:bg-slate-100 text-slate-500 hover:text-brand-500 border border-slate-200"
          }`}
          title={isListening ? "Gravando voz... Toque para finalizar" : "Falar por Voz (Áudio para Texto)"}
        >
          {isListening ? (
            <MicOff className="w-4 h-4 text-white" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>

        {/* Campo de Texto */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? "Ouvindo sua voz... Fale claramente" : "Descreva seu sentimento ou pensamentos..."}
          disabled={isListening}
          className="flex-1 bg-white border border-slate-200/80 rounded-full py-2.5 px-4 text-xs md:text-sm focus:outline-none focus:border-brand-400 transition-colors bg-clip-padding"
        />

        {/* Enviar */}
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-brand-500 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-brand-600 active:scale-95 text-white p-3 rounded-full overflow-hidden shrink-0 cursor-pointer shadow-xs transition-colors flex items-center justify-center"
        >
          <Send className="w-4 h-4 fill-white" />
        </button>
      </form>
    </div>
  );
}
