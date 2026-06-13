import React, { useState } from "react";
import { Phone, ShieldAlert, X, MessageSquare, Heart, AlertOctagon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface EmergencyBotaoProps {
  familiarPhone?: string;
  familiarName?: string;
  whatsappEmergency?: string;
}

export default function EmergencyBotao({
  familiarPhone = "+55 (11) 99999-9999",
  familiarName = "Familiar de Confiança",
  whatsappEmergency = "55188" // mock ou customizado
}: EmergencyBotaoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openPhoneCall = (num: string) => {
    window.location.href = `tel:${num.replace(/\D/g, "")}`;
  };

  const openWhatsApp = (num: string, text: string) => {
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${num.replace(/\D/g, "")}?text=${encodedText}`, "_blank");
  };

  return (
    <>
      {/* Botão Flutuante Redondo Vermelho */}
      <motion.button
        id="btn-sos"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: [0.95, 1.05, 0.95], opacity: 1 }}
        transition={{
          scale: {
            repeat: Infinity,
            duration: 2.5,
            ease: "easeInOut"
          },
          opacity: { duration: 0.5 }
        }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-22 right-4 md:right-8 z-40 bg-red-500 hover:bg-red-600 active:scale-95 text-white p-3.5 rounded-full shadow-lg shadow-red-500/20 flex items-center justify-center gap-1.5 cursor-pointer font-display font-semibold text-xs uppercase tracking-wider"
        title="Ajuda de Emergência - SOS"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <AlertOctagon className="w-4 h-4" />
        <span>SOS Crise</span>
      </motion.button>

      {/* Modal / Painel de Emergência */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Conteúdo do Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden z-10 border border-red-100 max-h-[90vh] flex flex-col"
            >
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-5 flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="p-2.5 bg-white/10 rounded-xl">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg leading-tight">Canal de Apoio Imediato</h2>
                    <p className="text-red-100 text-xs mt-0.5">Você não está sozinho(a). Estamos aqui por você.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {/* Alerta de Segurança e Limitação do App */}
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-xs text-red-700 leading-relaxed space-y-2">
                  <p className="font-semibold text-sm">Aviso Importante de Saúde:</p>
                  <p>
                    Se você está passando por uma crise emocional severa, automutilação ou possui pensamentos de autoagressão, por favor, busque ajuda especializada de imediato.
                  </p>
                  <p>
                    Este aplicativo é um assistente de apoio emocional inteligente, mas **não substitui** o tratamento presencial realizado por psicólogos, psiquiatras ou serviços médicos de urgência.
                  </p>
                </div>

                {/* CVV */}
                <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-gradient-to-br from-slate-50 to-white hover:border-brand-200 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
                        <Heart className="w-5 h-5 fill-brand-500/20 text-brand-600" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-sm text-slate-800">CVV</h3>
                        <p className="text-[11px] text-slate-500">Centro de Valorização da Vida</p>
                      </div>
                    </div>
                    <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded font-mono font-medium">Ligar 188</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-normal">
                    Atendimento gratuito, totalmente sigiloso e disponível por telefone, e-mail ou chat online 24 horas por dia.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => openPhoneCall("188")}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold cursor-pointer active:scale-98 transition-transform"
                    >
                      <Phone className="w-4 h-4" />
                      Ligar Grátis (188)
                    </button>
                    <a
                      href="https://cvv.org.br"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      Acessar Chat Web
                    </a>
                  </div>
                </div>

                {/* Contato Familiar Cadastrado */}
                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-safe-100 text-safe-600 rounded-lg">
                      <Heart className="w-5 h-5 fill-safe-500/20 text-safe-600" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-sm text-slate-800">Contato de Confiança</h3>
                      <p className="text-[11px] text-slate-500">Cadastrado para Emergências</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100 mt-1">
                    <span className="text-slate-500">Nome:</span>
                    <span className="font-medium text-slate-800">{familiarName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-1">
                    <span className="text-slate-500">Telefone:</span>
                    <span className="font-mono text-slate-800">{familiarPhone}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => openPhoneCall(familiarPhone)}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-safe-600 hover:bg-safe-700 text-white rounded-lg text-xs font-semibold cursor-pointer active:scale-98 transition-transform"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Ligar para Familiar
                    </button>
                    <button
                      onClick={() => openWhatsApp(familiarPhone, "Olá, preciso conversar. Estou usando o app Meu Psicólogo Pessoal e acionei o contato de segurança.")}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer active:scale-98 transition-transform"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Enviar WhatsApp
                    </button>
                  </div>
                </div>

                {/* Outros Serviços Públicos */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div onClick={() => openPhoneCall("192")} className="border border-slate-100 rounded-xl p-2.5 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="font-bold text-red-600 text-sm">SAMU (192)</div>
                    <div className="text-[10px] text-slate-500">Emergência Médica Brasileira</div>
                  </div>
                  <div onClick={() => openPhoneCall("193")} className="border border-slate-100 rounded-xl p-2.5 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="font-bold text-red-600 text-sm">Bombeiros (193)</div>
                    <div className="text-[10px] text-slate-500">Resgate e Apoio Emergencial</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
                Sua vida é importante. Procure ajuda profissional e suporte de quem você ama.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
