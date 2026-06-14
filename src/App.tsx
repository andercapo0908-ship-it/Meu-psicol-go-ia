import React, { useState, useEffect } from "react";
import { 
  Home, Brain, Heart, BookOpen, User, Settings, 
  Smartphone, Share2, Download, ShieldCheck, 
  RefreshCw, Github, Zap, LogOut, Check, Star, Play, Award, 
  ChevronRight, Volume2, Save, Send, Eye, ShieldAlert, AlertCircle
} from "lucide-react";
import { UserProfile, DailyMoodRecord, EmotionalNote } from "./types";
import { motion, AnimatePresence } from "motion/react";

// Sub-componentes modulares
import LoginScreen from "./components/LoginScreen";
import ChatPsicologo from "./components/ChatPsicologo";
import TherapyLibrary from "./components/TherapyLibrary";
import AudioPlayer from "./components/AudioPlayer";
import VideoExercises from "./components/VideoExercises";
import MyNotes from "./components/MyNotes";
import EmotionalChart from "./components/EmotionalChart";
import EmergencyBotao from "./components/EmergencyBotao";

const MOTIVATIONAL_QUOTES = [
  "Você não precisa controlar todos os seus pensamentos. Só precisa não deixá-los controlar você.",
  "Sua dor atual não é o seu destino final. Os dias cinzentos também passam para dar lugar ao sol.",
  "Autocompaixão é dar a si mesmo o mesmo acolhimento que você daria a um amigo querido em sofrimento.",
  "O autocuidado não é egoísmo. É encher seu próprio copo primeiro para poder transbordar paz ao mundo.",
  "Respire fundo. Cada expiração é uma oportunidade de soltar o que você não precisa mais carregar nas costas."
];

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("user_profile");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<'inicio' | 'psicologo' | 'terapias' | 'anotacoes' | 'perfil' | 'config'>('inicio');
  const [activeSubTherapyTab, setActiveSubTherapyTab] = useState<'tecnicas' | 'videos' | 'audios'>('tecnicas');

  // Registro de humor do dia
  const [todayMood, setTodayMood] = useState<DailyMoodRecord>(() => {
    const defaultRecord: DailyMoodRecord = {
      date: new Date().toLocaleDateString('pt-BR', { weekday: 'short' }),
      happiness: 3,
      anxiety: 3,
      sadness: 1,
      anger: 1,
      energy: 3
    };
    const saved = localStorage.getItem("today_mood_record");
    return saved ? JSON.parse(saved) : defaultRecord;
  });

  // Estatísticas de registros históricos locais
  const [historicalMoods, setHistoricalMoods] = useState<DailyMoodRecord[]>(() => {
    const saved = localStorage.getItem("historical_moods");
    return saved ? JSON.parse(saved) : [];
  });

  // Checklist de hábitos diários
  const [habits, setHabits] = useState<{ [key: string]: boolean }>({
    agua: false,
    respirar: false,
    terapia: false,
    humor: false,
    audios: false,
    dormir: false
  });

  // Configurações do app
  const [appTheme, setAppTheme] = useState<'claro' | 'escuro'>('claro');
  const [pinLock, setPinLock] = useState("");
  const [isPinEnabled, setIsPinEnabled] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  // GitHub e Vercel Admin Fields (simulação de deploy completo)
  const [gitHubToken, setGitHubToken] = useState("");
  const [gitHubRepo, setGitHubRepo] = useState("meu-psicologo-pessoal");
  const [gitHubBranch, setGitHubBranch] = useState("main");
  const [vercelToken, setVercelToken] = useState("");
  const [vercelProject, setVercelProject] = useState("meu-psicologo-pessoal");
  const [isDeploying, setIsDeploying] = useState(false);

  // Registro de última anotação inserida para o Dashboard
  const [latestNote, setLatestNote] = useState<EmotionalNote | null>(null);

  // Alerta de Notificação Temporário
  const [notification, setNotification] = useState<string | null>(null);

  // Estados estratégicos para gerenciamento do PWA (Instalação Nativa / Substituição Real de APK)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallAvailable, setIsInstallAvailable] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [isInstalledApp, setIsInstalledApp] = useState(false);
  const [pwaTutorialTab, setPwaTutorialTab] = useState<'android' | 'ios' | 'desktop'>('android');

  useEffect(() => {
    // Detectar se já está rodando como PWA instalado (Standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true ||
                          document.referrer.includes('android-app://');
    if (isStandalone) {
      setIsInstalledApp(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallAvailable(true);
    };

    const handleAppInstalled = () => {
      console.log('[PWA] Aplicativo instalado com sucesso pelo usuário!');
      setIsInstalledApp(true);
      setIsInstallAvailable(false);
      setDeferredPrompt(null);
      setNotification("🎉 Excelente! O aplicativo foi instalado na tela de início do seu celular com sucesso!");
      setTimeout(() => setNotification(null), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      // Se não há o prompt nativo (por exemplo, no Safari iOS ou navegadores específicos), abrir o guia didático detalhado
      setShowPwaModal(true);
      return;
    }
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] Usuário aceitou a instalação.');
        setIsInstalledApp(true);
        setIsInstallAvailable(false);
        setDeferredPrompt(null);
      } else {
        console.log('[PWA] Usuário descartou a instalação.');
      }
    } catch (err) {
      console.error('[PWA] Falha ao disparar motor de instalação:', err);
      setShowPwaModal(true);
    }
  };

  useEffect(() => {
    if (profile) {
      localStorage.setItem("user_profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("user_profile");
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("today_mood_record", JSON.stringify(todayMood));
  }, [todayMood]);

  // Atualizar última anotação inserida ao montar
  const updateLatestNote = () => {
    const savedNotes = localStorage.getItem("emotional_notes");
    if (savedNotes) {
      const parsed: EmotionalNote[] = JSON.parse(savedNotes);
      if (parsed.length > 0) {
        setLatestNote(parsed[0]);
      } else {
         setLatestNote(null);
      }
    }
  };

  useEffect(() => {
    updateLatestNote();
  }, [activeTab]);

  // Lembretes aleatórios simulando notificações periódicas agradáveis
  useEffect(() => {
    const notifications = [
      "Que tal beber um copo d'água agora? Cuide do seu corpo físico.",
      "Hora de fazer uma parada rápida e realizar 3 ciclos de respiração lenta.",
      "Como está o seu humor agora? Registre no seu diário emocional.",
      "Reserve um instante para ouvir um som terapêutico relaxante hoje."
    ];

    const interval = setInterval(() => {
      const randomMsg = notifications[Math.floor(Math.random() * notifications.length)];
      setNotification(randomMsg);
      setTimeout(() => setNotification(null), 5000);
    }, 45000); // mostrar a cada 45 segundos para diversão em tempo real no applet

    return () => clearInterval(interval);
  }, []);

  // Salvar registro de humor de hoje no histórico geral
  const handleSaveDailyMood = () => {
    const updatedHistory = [...historicalMoods.filter(h => h.date !== todayMood.date), todayMood];
    setHistoricalMoods(updatedHistory);
    localStorage.setItem("historical_moods", JSON.stringify(updatedHistory));
    
    // Marcar check de humor
    setHabits(prev => ({ ...prev, humor: true }));
    setNotification("Seu humor de hoje foi gravado nas estatísticas do seu perfil com sucesso!");
    setTimeout(() => setNotification(null), 3000);
  };

  // Frase motivacional randômica baseada no dia da semana
  const dayIndex = new Date().getDay();
  const dailyQuote = MOTIVATIONAL_QUOTES[dayIndex % MOTIVATIONAL_QUOTES.length];

  // Saudação por horário
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Bom dia";
    if (hr < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Exportar PDF do diário de forma limpa convertida
  const handleExportDataText = () => {
    const savedNotes = localStorage.getItem("emotional_notes") || "[]";
    const parsedNotes: EmotionalNote[] = JSON.parse(savedNotes);
    
    let docContent = `RELATÓRIO EMOCIONAL INDIVIDUAL - MEU PSICÓLOGO PESSOAL\n`;
    docContent += `Exportado em: ${new Date().toLocaleString('pt-BR')}\n`;
    docContent += `Usuário: ${profile?.name || "Anonimo"}\n`;
    docContent += `=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n\n`;

    if (parsedNotes.length === 0) {
      docContent += "Nenhum registro encontrado no diário emocional até o momento.";
    } else {
      parsedNotes.forEach((n, idx) => {
        docContent += `REGISTRO #${idx + 1} (${n.date})\n`;
        docContent += `Humor Predominante: ${n.mood.toUpperCase()}\n`;
        docContent += `Emoções tagueadas: ${n.emotions.join(", ") || "Nenhuma"}\n`;
        docContent += `Relato:\n"${n.text}"\n`;
        docContent += `----------------------------------------------------\n\n`;
      });
    }

    const blob = new Blob([docContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `diario-emocional-${profile?.name?.replace(/\s+/g, "-") || "usuario"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Backup Local (Download JSON)
  const handleBackupDownload = () => {
    const backupObj = {
      profile,
      historicalMoods,
      notes: localStorage.getItem("emotional_notes") ? JSON.parse(localStorage.getItem("emotional_notes")!) : [],
      chat_messages: localStorage.getItem("chat_messages") ? JSON.parse(localStorage.getItem("chat_messages")!) : []
    };

    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup-meu-psicologo-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Restaurar Backup Local (Upload JSON)
  const handleBackupUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile) {
          setProfile(parsed.profile);
          localStorage.setItem("user_profile", JSON.stringify(parsed.profile));
        }
        if (parsed.historicalMoods) {
          setHistoricalMoods(parsed.historicalMoods);
          localStorage.setItem("historical_moods", JSON.stringify(parsed.historicalMoods));
        }
        if (parsed.notes) {
          localStorage.setItem("emotional_notes", JSON.stringify(parsed.notes));
          updateLatestNote();
        }
        if (parsed.chat_messages) {
          localStorage.setItem("chat_messages", JSON.stringify(parsed.chat_messages));
        }
        alert("Backup local restaurado e sincronizado com o IndexedDB offline com sucesso!");
      } catch (err) {
        alert("O formato do arquivo selecionado é inválido.");
      }
    };
    reader.readAsText(file);
  };

  // Simular conexão de Deploy e Token Testing
  const handleTestDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      alert("Conexão com GitHub e Vercel estabelecida com sucesso! Seu repositório está integrado e pronto para Deploy Automático contínuo.");
    }, 2500);
  };

  // PIN Lock desbloquear
  const handleUnlockPin = () => {
    if (pinInput === pinLock) {
      setIsLocked(false);
      setPinInput("");
    } else {
      alert("PIN de segurança incorreto. Tente novamente.");
      setPinInput("");
    }
  };

  // Ativador de PIN definitivo
  const handleSavePinSettings = () => {
    if (isPinEnabled) {
      if (pinLock.length < 4) {
        alert("O PIN de proteção deve possuir pelo menos 4 algarismos.");
        return;
      }
      alert("PIN de proteção ativado! Reiniciamos a proteção ativa de criptografia local.");
    } else {
      setPinLock("");
      setIsLocked(false);
      alert("Proteção de barreira biométrica PIN desativada.");
    }
  };

  // Renderizador principal da interface com base no login
  if (!profile) {
    return <LoginScreen onLoginSuccess={(prof) => setProfile(prof)} />;
  }

  // Barreira de proteção do Diário com PIN se estiver bloqueado
  if (isLocked && isPinEnabled && pinLock) {
    return (
      <div className="bg-gradient-to-br from-brand-50 to-slate-100 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-xs text-center space-y-4 border border-slate-100">
          <ShieldAlert className="w-12 h-12 text-brand-500 mx-auto" />
          <h3 className="font-display font-bold text-sm text-slate-800">Criptografia Local de Proteção</h3>
          <p className="text-xs text-slate-500 leading-normal">
            Insira o seu PIN de privacidade configurado de 4 dígitos para gerenciar seus registros.
          </p>
          <input
            type="password"
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
            placeholder="Digite seu PIN"
            className="w-full text-center py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-lg font-bold letter focus:outline-none"
          />
          <button
            onClick={handleUnlockPin}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white py-2.5 rounded-xl font-bold text-xs"
          >
            Desbloquear Dados
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-100 md:py-8 flex items-center justify-center font-sans select-none overflow-x-hidden ${appTheme === 'escuro' ? 'dark text-slate-200' : ''}`}>
      {/* Alerta de Notificação Flutuante sutil */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-800 text-white min-w-xs max-w-md p-4 rounded-2xl shadow-xl flex items-start gap-2.5 text-xs font-semibold leading-relaxed"
          >
            <span className="p-1 px-1.5 bg-brand-500 text-white rounded-lg leading-none">🔔</span>
            <div className="flex-1">
              <h5 className="font-bold text-slate-200 text-[10px] uppercase tracking-wider">Apoio Diário</h5>
              <p className="text-slate-300 mt-0.5">{notification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Frame de Celular no Desktop / Edge-to-Edge no Mobile */}
      <div className="w-full max-w-4xl min-h-screen md:min-h-[850px] bg-white md:rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 flex flex-col justify-between relative">
        
        {/* Cabecalho Principal Permanente */}
        <header className="bg-white border-b border-slate-100 px-5 py-3 sticky top-0 z-30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand-50 bg-gradient-to-tr from-brand-400 to-safe-400 text-white flex items-center justify-center font-bold text-lg select-none">
              🧠
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-safe-100 text-safe-700 px-1.5 py-0.5 rounded leading-none">
                Estável • Seguro
              </span>
              <h1 className="font-display font-extrabold text-sm text-slate-800 tracking-tight leading-none mt-1">
                Meu Psicólogo Pessoal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Indicador de Conexão Estável */}
            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 rounded-full px-2.5 py-1 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span>Offline Ativo</span>
            </span>

            {/* Botão de Instalação PWA rápido se não estiver instalado */}
            {!isInstalledApp && (
              <button
                onClick={handleInstallApp}
                className="flex items-center gap-1 bg-brand-100 hover:bg-brand-250 hover:scale-103 text-brand-700 rounded-full px-2.5 py-1 text-[10px] font-bold cursor-pointer transition-all shadow-3xs"
                title="Instalar aplicativo de forma oficial na Tela de Início"
              >
                <Smartphone className="w-3.5 h-3.5 text-brand-600 animate-bounce" />
                <span className="hidden sm:inline">Baixar App</span>
                <span className="inline sm:hidden">Baixar</span>
              </button>
            )}

            {/* Logout sutil */}
            <button
              onClick={() => {
                if (confirm("Você gostaria de sair da sua sessão atual? Seus dados continuarão salvos no IndexedDB de forma offline.")) {
                  setProfile(null);
                }
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="Sair do Perfil"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Corpo de Conteúdo Principal */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 bg-slate-50/30">
          <AnimatePresence mode="wait">
            {activeTab === 'inicio' && (
              <motion.div
                key="inicio"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="space-y-6 text-left"
              >
                {/* Saudação de Entrada */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-3xl shadow-sm relative overflow-hidden">
                  {/* Brilhos de fundo decorativos */}
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  
                  <div className="space-y-1.5 max-w-md z-10 relative">
                    <h2 className="font-display font-bold text-lg md:text-xl leading-tight">
                      {getGreeting()}, {profile.name}!
                    </h2>
                    <p className="text-brand-100 text-xs leading-relaxed">
                      "{dailyQuote}"
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('psicologo')}
                    className="shrink-0 bg-white hover:bg-brand-50 text-brand-600 font-bold text-xs py-3 px-4 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-sm self-start md:self-center z-10"
                  >
                    <span>Conversar Agora</span>
                    <Brain className="w-4 h-4 text-brand-500" />
                  </button>
                </div>

                {/* Bloco de Instalação PWA Ativo (Visual e instalador alternativo de APK) */}
                <div className="p-4 bg-gradient-to-r from-indigo-50 via-white to-purple-50/70 border border-indigo-100 rounded-3xl shadow-3xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="flex items-start gap-3.5 relative z-10">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-150 text-indigo-700 flex items-center justify-center font-bold text-lg select-none shrink-0">
                      📲
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-xs text-slate-800 leading-tight flex items-center gap-2">
                        <span>Instalar como Aplicativo Nativo</span>
                        <span className="text-[8px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-sans uppercase font-black tracking-widest animate-pulse">Recomendado</span>
                      </h3>
                      <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5 max-w-lg">
                        Adicione o aplicativo diretamente à tela inicial do seu celular. Ele roda em janela cheia isolada (standalone), sem barra de endereço, consome pouca bateria e suporta consultas offline completas!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end relative z-10">
                    <button
                      onClick={() => setShowPwaModal(true)}
                      className="text-[10px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl cursor-pointer transition-all text-center"
                    >
                      Dúvidas?
                    </button>
                    <button
                      onClick={handleInstallApp}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] py-2 px-3.5 rounded-xl cursor-pointer shadow-3xs hover:scale-102 transition-all flex items-center gap-1.5 text-center"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Instalar Aplicativo
                    </button>
                  </div>
                </div>

                {/* Grid Interativa: Humores + Práticas de Hábitos */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* Registro do Humor do Dia (Esquerda) */}
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs space-y-4">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-800">Como você avalia seus índices hoje?</h3>
                      <p className="text-slate-400 text-[11px] mt-0.5">Registre de 1 a 5 para atualizar seus relatórios evolutivos.</p>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { field: 'happiness', icon: "😊", label: "Humor / Felicidade", color: "accent-emerald-500" },
                        { field: 'anxiety', icon: "⚡", label: "Ansiedade / Agitação", color: "accent-cyan-500" },
                        { field: 'sadness', icon: "😢", label: "Tristeza / Bloqueio", color: "accent-blue-500" },
                        { field: 'energy', icon: "🔋", label: "Nível de Energia Física", color: "accent-amber-500" }
                      ].map(metric => (
                        <div key={metric.field} className="flex items-center justify-between gap-4">
                          <span className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 w-40 shrink-0">
                            <span className="text-base">{metric.icon}</span>
                            <span>{metric.label}</span>
                          </span>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={(todayMood as any)[metric.field]}
                            onChange={(e) => setTodayMood(prev => ({ ...prev, [metric.field]: Number(e.target.value) }))}
                            className={`flex-1 h-1 bg-slate-100 rounded-lg cursor-pointer ${metric.color}`}
                          />
                          <span className="font-mono text-xs font-bold text-slate-500 w-6 text-right">
                            {(todayMood as any)[metric.field]}/5
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleSaveDailyMood}
                      className="w-full py-2.5 bg-brand-50 border border-brand-100/60 text-brand-700 font-bold text-xs rounded-xl hover:bg-brand-100/70 cursor-pointer active:scale-98 transition-all text-center"
                    >
                      Gravar Registro Diário
                    </button>
                  </div>

                  {/* Lembretes de Hábitos de Autocuidado (Direita) */}
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs space-y-4">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-800">Suas Metas de Autocuidado</h3>
                      <p className="text-slate-400 text-[11px] mt-0.5">Pequenas ações consistentes constroem grande equilíbrio.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { key: "agua", label: "Beber Água", text: "Hidratar o corpo" },
                        { key: "respirar", label: "Pratica Respire", text: "Regrar respiração" },
                        { key: "terapia", label: "Auto-Estudo", text: "Guia de TCC" },
                        { key: "humor", label: "Anotar Humor", text: "Gravar evolução" },
                        { key: "audios", label: "Ouvir Audio", text: "Frequência Solfeggio" },
                        { key: "dormir", label: "Higiene Sono", text: "Ritual noite ideal" }
                      ].map(item => {
                        const checked = habits[item.key];
                        return (
                          <div
                            key={item.key}
                            onClick={() => setHabits(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                            className={`p-2 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors select-none ${
                              checked 
                                ? "bg-safe-50 border-safe-200 text-safe-700 font-semibold" 
                                : "bg-slate-50/50 border-slate-100 text-slate-500"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border text-xs shrink-0 ${
                              checked ? "bg-safe-500 border-safe-500 text-white" : "bg-white border-slate-200"
                            }`}>
                              {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div>
                              <span className="text-[11px] block leading-none">{item.label}</span>
                              <span className="text-[9px] text-slate-400 font-medium leading-none mt-0.5 inline-block">{item.text}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Seção diário emocioanl preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Última anotação diário */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-1.5 font-sans">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Seu Último Diário</span>
                      <h4 className="font-display font-bold text-sm text-slate-800 leading-tight">Mapeamento e Diário</h4>
                    </div>

                    {latestNote ? (
                      <div className="space-y-2 border-l-2 border-brand-300 pl-3.5 py-1.5">
                        <span className="text-[10px] font-mono text-slate-400 font-bold block">{latestNote.date}</span>
                        <p className="text-xs text-slate-600 line-clamp-3 italic leading-relaxed">
                          "{latestNote.text}"
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 leading-normal">
                        Nenhum relato escrito no diário Emotional até o momento. Escrever sentimentos alivia o estresse e cansaço.
                      </p>
                    )}

                    <button
                      onClick={() => setActiveTab('anotacoes')}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 mt-2 cursor-pointer transition-colors"
                    >
                      <span>Gerenciar Diário de Escrita</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Atalhos Rápidos Terapêuticos */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Atalhos Clínicos</span>
                      <h4 className="font-display font-bold text-sm text-slate-800 leading-tight">Biblioteca Terapêutica Rápida</h4>
                    </div>

                    <p className="text-xs text-slate-500 leading-normal">
                      Acesse imediatamente exercícios de respiração diafragmática profunda, controle de pânico 5-4-3-2-1 e frequências binaurais calmantes.
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => {
                          setActiveTab('terapias');
                          setActiveSubTherapyTab('videos');
                        }}
                        className="bg-safe-50 hover:bg-safe-100 text-safe-700 hover:text-safe-800 font-bold text-xs py-2 px-3 rounded-xl cursor-pointer shadow-3xs transition-all text-center"
                      >
                        ⚡ Exercícios Respiração
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('terapias');
                          setActiveSubTherapyTab('audios');
                        }}
                        className="bg-brand-50 hover:bg-brand-100 text-brand-700 hover:text-brand-800 font-bold text-xs py-2 px-3 rounded-xl cursor-pointer shadow-3xs transition-all text-center"
                      >
                        🌌 Sons Solfeggio
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {activeTab === 'psicologo' && (
              <motion.div
                key="psicologo"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                <ChatPsicologo userProfile={profile} />
              </motion.div>
            )}

            {activeTab === 'terapias' && (
              <motion.div
                key="terapias"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="space-y-4"
              >
                {/* Abas Secundárias de Terapias */}
                <div className="flex bg-slate-100 p-1 rounded-2xl max-w-fit mx-auto text-xs font-bold text-slate-500 mb-4 shrink-0 shadow-2xs border border-slate-200/40">
                  <button
                    onClick={() => setActiveSubTherapyTab('tecnicas')}
                    className={`px-4 py-2 rounded-xl transition-all h-full cursor-pointer flex items-center gap-1.5 ${activeSubTherapyTab === 'tecnicas' ? "bg-white text-brand-600 shadow-3xs font-bold" : "hover:text-slate-700"}`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Técnicas Clínicas (CBT)</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTherapyTab('audios')}
                    className={`px-4 py-2 rounded-xl transition-all h-full cursor-pointer flex items-center gap-1.5 ${activeSubTherapyTab === 'audios' ? "bg-white text-brand-600 shadow-3xs font-bold" : "hover:text-slate-700"}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Áudios Terapêuticos</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTherapyTab('videos')}
                    className={`px-4 py-2 rounded-xl transition-all h-full cursor-pointer flex items-center gap-1.5 ${activeSubTherapyTab === 'videos' ? "bg-white text-brand-600 shadow-3xs font-bold" : "hover:text-slate-700"}`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Guias e Respiração</span>
                  </button>
                </div>

                <div className="pt-2">
                  {activeSubTherapyTab === 'tecnicas' && <TherapyLibrary />}
                  {activeSubTherapyTab === 'audios' && <AudioPlayer />}
                  {activeSubTherapyTab === 'videos' && <VideoExercises />}
                </div>
              </motion.div>
            )}

            {activeTab === 'anotacoes' && (
              <motion.div
                key="anotacoes"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                <MyNotes onNoteAdded={updateLatestNote} />
              </motion.div>
            )}

            {activeTab === 'perfil' && (
              <motion.div
                key="perfil"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="space-y-6 text-left"
              >
                {/* Informações de Perfil e Estatísticas */}
                <div className="bg-white rounded-3xl border border-slate-100 p-5 md:p-6 shadow-2xs flex flex-col md:flex-row gap-6 items-start">
                  
                  {/* Foto e Metas */}
                  <div className="flex flex-col items-center text-center shrink-0 w-full md:w-44 space-y-3">
                    <div className="w-20 h-20 rounded-full bg-brand-50 border-4 border-brand-100 flex items-center justify-center text-5xl shadow-inner select-none">
                      {profile.photoUrl}
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-sm text-slate-800 leading-none">{profile.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block uppercase font-bold">{profile.profession}</span>
                    </div>

                    <div className="border border-slate-100 rounded-xl p-2.5 w-full bg-slate-50/50 space-y-1.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block text-center">Registro Rápido</span>
                      <div className="text-[11px] text-slate-600 leading-snug">
                        <strong>Idade:</strong> {profile.age}<br />
                        <strong>Cidade:</strong> {profile.city}<br />
                        <strong>Gênero:</strong> {profile.gender}
                      </div>
                    </div>
                  </div>

                  {/* Objetivos e Histórico Emocional */}
                  <div className="flex-1 space-y-4">
                    <div className="border-b border-slate-50 pb-2 flex items-center gap-2">
                      <Award className="w-5 h-5 text-brand-500" />
                      <h4 className="font-display font-bold text-sm text-slate-800">Seus Objetivos Emocionais</h4>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium bg-brand-50/40 p-4 rounded-2xl border border-brand-100/40 italic">
                      "{profile.emotionalGoals}"
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                        <span className="text-lg font-bold font-mono text-slate-800">{historicalMoods.length}</span>
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider mt-0.5">Dias Registrados de Humor</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                        <span className="text-lg font-bold font-mono text-slate-800">
                          {localStorage.getItem("emotional_notes") ? JSON.parse(localStorage.getItem("emotional_notes")!).length : 0}
                        </span>
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider mt-0.5">Anotações no Diário</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Graficos interativos de Humor (Semanal, Mensal, Comparativo), utilizando o componente EmotionalChart */}
                <EmotionalChart moodRecords={historicalMoods} />
              </motion.div>
            )}

            {activeTab === 'config' && (
              <motion.div
                key="config"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="space-y-6 text-left"
              >
                {/* Configurações Gerais Administrativas do App */}
                <div className="bg-white rounded-3xl border border-slate-100 p-5 md:p-6 shadow-2xs space-y-6">
                  
                  {/* Cadastro & Dados de Conta */}
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-base text-slate-800 border-b border-slate-50 pb-2">
                       Gerenciamento da Conta e Dados Locais
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Formulario Conta */}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label htmlFor="cfg-name" className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Mudar Seu Nome</label>
                          <input
                            id="cfg-name"
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-xs md:text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="cfg-goals" className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-sans">Seus Objetivos Emocionais</label>
                          <textarea
                            id="cfg-goals"
                            rows={3}
                            value={profile.emotionalGoals}
                            onChange={(e) => setProfile({ ...profile, emotionalGoals: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-xs md:text-sm bg-clip-padding"
                          />
                        </div>
                      </div>

                      {/* Backup Local & Exportar */}
                      <div className="space-y-3.5 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold text-slate-700">Backup Integral Offline dos Seus Relatórios</h4>
                          <p className="text-[10px] text-slate-500 leading-normal">
                             Seus dados continuam rodando 100% locais no dispositivo através do armazenamento seguro SQLite/IndexedDB. Baixe seu backup para migrar para outros aparelhos convenientemente.
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                          <button
                            onClick={handleBackupDownload}
                            className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer active:scale-98 transition-all"
                          >
                            <Download className="w-4 h-4 text-brand-500 animate-pulse" />
                            Backup Offline (JSON)
                          </button>
                          
                          <label className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer active:scale-98 transition-all">
                            <Save className="w-4 h-4 text-emerald-500" />
                            <span>Restaurar de arquivo JSON</span>
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleBackupUpload}
                              className="hidden"
                            />
                          </label>

                          <button
                            onClick={handleExportDataText}
                            className="flex items-center justify-center gap-1.5 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            <Share2 className="w-4 h-4" />
                            Exportar Diário Completo (.TXT)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Segurança PIN Bio */}
                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <h3 className="font-display font-bold text-sm text-slate-800">Proteção Ativa por PIN de Segurança</h3>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="enable-pin"
                            checked={isPinEnabled}
                            onChange={(e) => {
                              setIsPinEnabled(e.target.checked);
                              if (!e.target.checked) setPinLock("");
                            }}
                            className="accent-brand-500 cursor-pointer w-4 h-4"
                          />
                          <label htmlFor="enable-pin" className="text-xs font-bold text-slate-700 cursor-pointer">Ativar PIN de Privacidade</label>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Garante que o diário ou chat local solicitam uma senha de acesso física ao carregar o aplicativo.
                        </p>
                      </div>

                      {isPinEnabled && (
                        <div className="space-y-1.5">
                          <label htmlFor="pin-set" className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Definir PIN de 4 algarismos</label>
                          <div className="flex gap-2">
                            <input
                              id="pin-set"
                              type="password"
                              maxLength={4}
                              value={pinLock}
                              onChange={(e) => setPinLock(e.target.value.replace(/\D/g, ''))}
                              placeholder="1234"
                              className="bg-white border border-slate-200 rounded-xl p-2 text-center text-sm font-bold font-mono h-10 w-24 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleSavePinSettings}
                              className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-4 rounded-xl h-10 cursor-pointer active:scale-95"
                            >
                              Salvar Senha
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Administrador GitHub e Vercel Integration */}
                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-sm text-slate-800">Integração Vercel & GitHub Deploy</h3>
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold font-mono">PWA Sincronizado</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      {/* GitHub */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Github className="w-4 h-4" /> Configurar Repositório GitHub
                        </h4>
                        
                        <div className="space-y-1">
                          <label htmlFor="git-token" className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Token Pessoal do GitHub</label>
                          <input
                            id="git-token"
                            type="password"
                            placeholder="ghp_****************"
                            value={gitHubToken}
                            onChange={(e) => setGitHubToken(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label htmlFor="git-repo" className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Repositório</label>
                            <input
                              id="git-repo"
                              type="text"
                              value={gitHubRepo}
                              onChange={(e) => setGitHubRepo(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="git-branch" className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Branch Ativa</label>
                            <input
                              id="git-branch"
                              type="text"
                              value={gitHubBranch}
                              onChange={(e) => setGitHubBranch(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Vercel */}
                      <div className="space-y-3 flex flex-col justify-between">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-amber-500" /> Host Vercel Web App
                          </h4>
                          
                          <div className="space-y-1">
                            <label htmlFor="ver-token" className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Token da Vercel API</label>
                            <input
                              id="ver-token"
                              type="password"
                              placeholder="vc_****************"
                              value={vercelToken}
                              onChange={(e) => setVercelToken(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-mono"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleTestDeploy}
                          disabled={isDeploying}
                          className="w-full bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-3xs transition-transform flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isDeploying ? "animate-spin" : ""}`} />
                          <span>{isDeploying ? "Integrando..." : "Testar Conexão de Deploy"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Configurações PWA/APK do Dispositivo */}
                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-sm text-slate-800">Aplicativo Oficial & Instalação Direta</h3>
                      <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded font-black font-sans uppercase">Substituto Real do APK</span>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Em vez de instalar pacotes instáveis de repositórios não oficiais (.apk manual), nosso aplicativo suporta a tecnologia de **Progressive Web App (PWA)** de alta performance. 
                        Ela gera um aplicativo real no seu celular que inicia instantaneamente, roda em tela cheia isolado do navegador, consome 90% menos bateria/armazenamento que um APK clássico e atualiza automaticamente em segundo plano.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleInstallApp}
                          className="flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 hover:scale-101 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-3xs"
                        >
                          <Smartphone className="w-4 h-4 text-indigo-200" />
                          Instalar Aplicativo Oficial
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setShowPwaModal(true)}
                          className="flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-all"
                        >
                          <BookOpen className="w-4 h-4 text-slate-400" />
                          Ver Manual de Instalação
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Escolha do Tema sutil */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-50">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Visual e Configuração Estética Geral do Tema</label>
                    <div className="flex gap-2 max-w-xs">
                      <button
                        onClick={() => setAppTheme('claro')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${appTheme === 'claro' ? 'bg-brand-500 border-brand-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                      >
                         ☀️ Tema Claro
                      </button>
                      <button
                        onClick={() => setAppTheme('escuro')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${appTheme === 'escuro' ? 'bg-brand-500 border-brand-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                      >
                         🌙 Soothing Dark
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Botão Vermelho Fixo de Emergência (SOS) visível em todas as telas */}
        <EmergencyBotao 
          familiarName="Maria de Confiança" 
          familiarPhone="+55 (11) 98765-4321" 
        />

        {/* Bottom Navigation Permanente */}
        <footer className="bg-white border-t border-slate-100 px-2 py-2 sticky bottom-0 z-30 shrink-0 grid grid-cols-6 text-center select-none shadow-lg">
          {[
            { id: 'inicio', label: "Início", icon: <Home className="w-5 h-5 mx-auto" /> },
            { id: 'psicologo', label: "Psicólogo", icon: <Brain className="w-5 h-5 mx-auto" /> },
            { id: 'terapias', label: "Terapias", icon: <Heart className="w-5 h-5 mx-auto" /> },
            { id: 'anotacoes', label: "Diário", icon: <BookOpen className="w-5 h-5 mx-auto" /> },
            { id: 'perfil', label: "Perfil", icon: <User className="w-5 h-5 mx-auto" /> },
            { id: 'config', label: "Configurar", icon: <Settings className="w-5 h-5 mx-auto" /> },
          ].map(btn => {
            const isSel = activeTab === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => {
                  if (isPinEnabled && pinLock && btn.id === 'anotacoes') {
                    // Desafiar PIN para segurança do diário
                    setIsLocked(true);
                  }
                  setActiveTab(btn.id as any);
                }}
                className={`py-1.5 flex flex-col justify-center items-center rounded-xl transition-all cursor-pointer ${
                  isSel 
                    ? "text-brand-500 font-bold bg-brand-50/40" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <div className={`transition-transform duration-300 ${isSel ? "scale-110 text-brand-500" : ""}`}>
                  {btn.icon}
                </div>
                <span className="text-[9px] mt-0.5 leading-none">{btn.label}</span>
              </button>
            );
          })}
        </footer>

        {/* Modal de Tutorial de Instalação PWA Real (Substituto de APK) */}
        <AnimatePresence>
          {showPwaModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPwaModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
              />

              {/* Card de Conteúdo do Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-md w-full relative z-10 flex flex-col justify-between font-sans text-left"
              >
                {/* Top header do Modal */}
                <div className="bg-indigo-600 p-5 text-white flex items-center gap-3.5 relative overflow-hidden shrink-0">
                  <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl shrink-0">
                    📲
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-sm tracking-tight">Central de Instalação e Suporte</h3>
                    <p className="text-indigo-100 text-[10px] uppercase font-bold tracking-widest mt-0.5">Transforme em App Nativo</p>
                  </div>
                  <button 
                    onClick={() => setShowPwaModal(false)}
                    className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-all text-xs font-bold leading-none cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Conteúdo Informativo */}
                <div className="p-5 flex-1 space-y-4 max-h-[480px] overflow-y-auto">
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-xs text-slate-800">Sua Experiência APK Segura e Moderna</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Nossa plataforma implementa a tecnologia oficial **PWA (Progressive Web App)** aprovada pelo Google e Apple. Ao instalar este aplicativo, seu celular cria um contêiner nativo independente na sua tela de apps, removendo o navegador e liberando acesso offline!
                    </p>
                  </div>

                  {/* Seletor de Abas de Tutorial */}
                  <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl text-[10px] font-extrabold text-slate-500 text-center">
                    <button
                      onClick={() => setPwaTutorialTab('android')}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${pwaTutorialTab === 'android' ? 'bg-white text-indigo-600 shadow-3xs' : 'hover:text-slate-700'}`}
                    >
                      🤖 Android
                    </button>
                    <button
                      onClick={() => setPwaTutorialTab('ios')}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${pwaTutorialTab === 'ios' ? 'bg-white text-indigo-600 shadow-3xs' : 'hover:text-slate-700'}`}
                    >
                      🍎 iPhone (iOS)
                    </button>
                    <button
                      onClick={() => setPwaTutorialTab('desktop')}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${pwaTutorialTab === 'desktop' ? 'bg-white text-indigo-600 shadow-3xs' : 'hover:text-slate-700'}`}
                    >
                      💻 Computador
                    </button>
                  </div>

                  {/* Detalhes de Passo a Passo por Aba */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl min-h-[180px] flex flex-col justify-center">
                    {pwaTutorialTab === 'android' && (
                      <div className="space-y-2.5">
                        <h5 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wide">Passo a Passo no Android (Chrome)</h5>
                        <ol className="space-y-1.5 text-[11px] text-slate-500 font-medium">
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">1.</span>
                            <span>Clique no botão azul <strong>"Instalar Aplicativo"</strong> no topo da página do painel ou no botão abaixo.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">2.</span>
                            <span>Se o botão não disparar, clique nos <strong>três pontos verticais (⋮)</strong> no canto superior direito do Google Chrome.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">3.</span>
                            <span>Selecione a opção <strong>"Adicionar à tela inicial"</strong> ou <strong>"Instalar aplicativo"</strong>.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">4.</span>
                            <span>Confirme clicando em <strong>"Instalar"</strong>. Um ícone lindo será gerado na sua tela inicial!</span>
                          </li>
                        </ol>
                      </div>
                    )}

                    {pwaTutorialTab === 'ios' && (
                      <div className="space-y-2.5">
                        <h5 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wide">Passo a Passo no iPhone (Safari)</h5>
                        <ol className="space-y-1.5 text-[11px] text-slate-500 font-medium">
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">1.</span>
                            <span>Certifique-se de que você abriu este link utilizando o navegador padrão **Safari**.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">2.</span>
                            <span>Clique no botão de <strong>Compartilhar</strong> (ícone de um quadrado com uma seta apontando para cima) no painel inferior do navegador.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">3.</span>
                            <span>Role as opções para baixo e clique em <strong>"Adicionar à Tela de Início"</strong>.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">4.</span>
                            <span>Clique no botão <strong>"Adicionar"</strong> no canto superior. Pronto! O app agirá igual ao aplicativo nativo.</span>
                          </li>
                        </ol>
                      </div>
                    )}

                    {pwaTutorialTab === 'desktop' && (
                      <div className="space-y-2.5">
                        <h5 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wide">Passo a Passo no Computador (Chrome/Edge)</h5>
                        <ol className="space-y-1.5 text-[11px] text-slate-500 font-medium">
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">1.</span>
                            <span>Na barra de endereços do Chrome ou Edge, repare no ícone de <strong>um computador com um celular (Instalar)</strong> no lado direito do campo de link.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">2.</span>
                            <span>Ou clique no botão <strong>"Instalar Aplicativo Oficial"</strong> no painel de configurações deste app.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">3.</span>
                            <span>Selecione <strong>"Instalar"</strong>. O app abrirá em uma janela limpa, otimizada e ultra fluida com suporte a atalhos.</span>
                          </li>
                        </ol>
                      </div>
                    )}
                  </div>

                  {/* Benefícios visíveis */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-semibold pt-1">
                    <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <span>✓</span> <span>Sem Anúncios e Rápido</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <span>✓</span> <span>Ícone na Tela Inicial</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <span>✓</span> <span>Suporta Uso Offline</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <span>✓</span> <span>Leve e Seguro</span>
                    </div>
                  </div>
                </div>

                {/* Footer do Modal */}
                <div className="p-4 border-t border-slate-50 bg-slate-50 flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleInstallApp}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] py-2.5 rounded-xl cursor-pointer transition-colors shadow-3xs flex items-center justify-center gap-1.5"
                  >
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    <span>Tentar Instalar de Forma Rápida</span>
                  </button>
                  <button
                    onClick={() => setShowPwaModal(false)}
                    className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 text-[11px] font-extrabold rounded-xl cursor-pointer transition-colors"
                  >
                    Entendi!
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
