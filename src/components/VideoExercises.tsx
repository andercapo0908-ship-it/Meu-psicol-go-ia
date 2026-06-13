import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Bookmark, Star, AlertCircle, RefreshCw, Volume2, VolumeX, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ExerciseVideo } from "../types";

const EXERCISES_DATABASE: ExerciseVideo[] = [
  {
    id: "ex_resp_444",
    category: "respiracao",
    title: "Respiração 4-4-4 (Prana Box)",
    duration: "4 min",
    description: "Excelente técnica militar para acalmar instantaneamente o sistema nervoso simpático e reduzir picos de ansiedade.",
    thumbnailUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=60",
    instructionType: "breath_444"
  },
  {
    id: "ex_resp_dia",
    category: "respiracao",
    title: "Respiração Diafragmática Profunda",
    duration: "5 min",
    description: "Técnica focada na expansão do abdômen para induzir o relaxamento vago-estimulado, desacelerar batimentos e focar o prana.",
    thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=60",
    instructionType: "breath_diaphragm"
  },
  {
    id: "ex_alon_pesco",
    category: "alongamento",
    title: "Descompressão Cervical e Pescoço",
    duration: "3 min",
    description: "Alivia a tensão isométrica acumulada na nuca e no trapézio devido a longas horas de estresse de tela ou má postura.",
    thumbnailUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=60",
    instructionType: "stretch_neck"
  },
  {
    id: "ex_alon_omb",
    category: "alongamento",
    title: "Estiramento de Ombros e Peitoral",
    duration: "3 min",
    description: "Abra sua caixa torácica e solte as fáscias dos ombros. Melhora a expansão respiratória natural.",
    thumbnailUrl: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=500&auto=format&fit=crop&q=60",
    instructionType: "stretch_shoulders"
  },
  {
    id: "ex_relax_musc",
    category: "relaxamento",
    title: "Relaxamento Muscular Progressivo (Jacobson)",
    duration: "8 min",
    description: "Tencione e relaxe grupos específicos de músculos alternadamente. Cria uma sensação profunda de repouso físico e mental.",
    thumbnailUrl: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=500&auto=format&fit=crop&q=60",
    instructionType: "relax_muscle"
  },
  {
    id: "ex_med_5m",
    category: "meditacao",
    title: "Meditação Mindfulness Expressa",
    duration: "5 min",
    description: "Um mergulho rápido de 5 minutos sobre foco no 'âncora' respiratório para restabelecer a calma em dias caóticos.",
    thumbnailUrl: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w=500&auto=format&fit=crop&q=60",
    instructionType: "meditation_5m"
  },
  {
    id: "ex_med_10m",
    category: "meditacao",
    title: "Meditação Atenção Plena Guiada",
    duration: "10 min",
    description: "Treinamento cognitivo focado na auto-observação generosa, ideal para afastar ruminações de pensamentos estressantes.",
    thumbnailUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=500&auto=format&fit=crop&q=60",
    instructionType: "meditation_10m"
  }
];

export default function VideoExercises() {
  const [activeCategory, setActiveCategory] = useState<'tudo' | 'respiracao' | 'alongamento' | 'relaxamento' | 'meditacao'>('tudo');
  const [selectedEx, setSelectedEx] = useState<ExerciseVideo | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("fav_exercises");
    return saved ? JSON.parse(saved) : [];
  });

  // Estados do Guia Interativo
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathState, setBreathState] = useState<'inspire' | 'segure' | 'expire' | 'repouso'>('inspire');
  const [breathCountdown, setBreathCountdown] = useState(4);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [guidanceText, setGuidanceText] = useState("");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Favoritar
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("fav_exercises", JSON.stringify(updated));
  };

  // Filtragem
  const filteredEx = EXERCISES_DATABASE.filter(ex => 
    activeCategory === 'tudo' ? true : ex.category === activeCategory
  );

  // Gerenciamento e simulação interativa das animações corporais / respiração
  useEffect(() => {
    if (!isPlaying || !selectedEx) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const type = selectedEx.instructionType;

    timerRef.current = setInterval(() => {
      setTotalElapsed(prev => prev + 1);

      if (type === 'breath_444') {
        // Ciclo Prana Box: 4s Inspire, 4s Segure cheio, 4s Expire, 4s Segure vazio (ou 4-4-4 simplificado)
        setBreathCountdown(prev => {
          if (prev <= 1) {
            // Rotacionar fase
            setBreathState(curr => {
              if (curr === 'inspire') {
                setGuidanceText("Prenda o ar... Sinta a energia concentrada.");
                return 'segure';
              } else if (curr === 'segure') {
                setGuidanceText("Sopre devagar... Solte todo o peso do estresse.");
                return 'expire';
              } else {
                setGuidanceText("Puxe o ar suavemente pelo nariz, inflando o peito.");
                return 'inspire';
              }
            });
            return 4; // Reiniciar o tempo
          }
          return prev - 1;
        });
      } else if (type === 'breath_diaphragm') {
        // Diagragmática: 5s inspire (expandindo abdômen), 5s expire (esvaziando)
        setBreathCountdown(prev => {
          if (prev <= 1) {
            setBreathState(curr => {
              if (curr === 'inspire') {
                setGuidanceText("Expire lentamente pela boca, recolhendo o diafragma.");
                return 'expire';
              } else {
                setGuidanceText("Gere volume no estômago puxando o ar... Expanda.");
                return 'inspire';
              }
            });
            return 5;
          }
          return prev - 1;
        });
      } else if (type.startsWith('stretch')) {
        // Alongamento: ciclos de 10s para manter pose
        setBreathCountdown(prev => {
          if (prev <= 1) {
            setBreathState(curr => {
              const stretchTips = type === 'stretch_neck' 
                ? [
                    "Incline a cabeça para a direita, esticando o ombro esquerdo de leve.",
                    "Incline agora a cabeça para a esquerda de forma delicada.",
                    "Gire desenhando um círculo lento com o queixo encostado no peito.",
                  ]
                : [
                    "Cruze os dedos, estique as palmas das mãos para o alto, abrindo as costas.",
                    "Gire os ombros em círculos lentos, para trás e para frente.",
                    "Leve as mãos unidas atrás da nuca e estique o tórax olhando levemente acima."
                  ];
              const randomTip = stretchTips[Math.floor(Math.random() * stretchTips.length)];
              setGuidanceText(randomTip);
              return 'repouso';
            });
            return 10;
          }
          return prev - 1;
        });
      } else {
        // Meditações e Relaxamento progressivo: sugestões dinâmicas automáticas a cada 15 segundos
        setBreathCountdown(prev => {
          if (prev <= 1) {
            const medTips = [
              "Foque na sensação do ar tocando suas narinas... Frio ao entrar, morno ao sair.",
              "Se sua mente vagar com preocupações, apenas observe e retorne docemente o foco ao corpo.",
              "Sinta o peso do seu corpo acomodado na cadeira ou colchão. Relaxe os ombros ativos.",
              "Sua mente é um céu limpo. Os pensamentos são apenas nuvens passando rapidamente.",
              "Traga gentileza interna para cada músculo tenso. Deixe-os derreterem devagar."
            ];
            const randomTip = medTips[Math.floor(Math.random() * medTips.length)];
            setGuidanceText(randomTip);
            return 12;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, selectedEx, breathState]);

  // Ao abrir o exercício, definir orientações específicas
  const handleSelectExercise = (ex: ExerciseVideo) => {
    setSelectedEx(ex);
    setIsPlaying(false);
    setTotalElapsed(0);
    setBreathState('inspire');
    
    if (ex.instructionType === 'breath_444') {
      setBreathCountdown(4);
      setGuidanceText("Puxe o ar suavemente pelo nariz, inflando o peito de ar.");
    } else if (ex.instructionType === 'breath_diaphragm') {
      setBreathCountdown(5);
      setGuidanceText("Traga o ar direcionando-o para a base dos pulmões, inflando o abdômen.");
    } else if (ex.instructionType === 'stretch_neck') {
      setBreathCountdown(10);
      setGuidanceText("Incline a cabeça de lado lateralmente, apoiando o peso da mão para alongar.");
    } else {
      setBreathCountdown(10);
      setGuidanceText("Sente-se com as costas eretas, ombros soltos, feche os olhos devagar...");
    }
  };

  return (
    <div className="space-y-6">
      {/* Categoria e Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-800 flex items-center gap-2">
            Apoio em Vídeo e Guias Corporais
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Exercícios interativos rápidos e práticas corporais guiadas para regulação neurológica imediata.
          </p>
        </div>
        
        {/* Favoritos Counters */}
        <div className="flex bg-slate-100 border border-slate-200/60 p-1.5 rounded-lg text-xs font-semibold text-slate-600 gap-1.5 shrink-0 h-fit max-w-fit">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{favorites.length} Exercícios Favoritos</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        {[
          { id: 'tudo', label: 'Todos' },
          { id: 'respiracao', label: 'Respiração' },
          { id: 'alongamento', label: 'Alongamentos' },
          { id: 'relaxamento', label: 'Relaxamento' },
          { id: 'meditacao', label: 'Meditação' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
              activeCategory === tab.id
                ? "bg-brand-500 border-brand-500 text-white shadow-xs"
                : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grade de Exercícios */}
      {!selectedEx && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEx.map(ex => {
            const isFav = favorites.includes(ex.id);
            return (
              <div
                key={ex.id}
                onClick={() => handleSelectExercise(ex)}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                <div className="relative aspect-video bg-slate-200 overflow-hidden">
                  <img
                    src={ex.thumbnailUrl}
                    alt={ex.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent flex items-end justify-between p-4">
                    <span className="text-[10px] bg-white/90 text-slate-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-xs">
                      {ex.category === 'respiracao' ? 'Respiração' : ex.category === 'alongamento' ? 'Alongamento' : ex.category === 'relaxamento' ? 'Relaxamento' : 'Meditação'}
                    </span>
                    <span className="text-[10px] bg-slate-900/80 text-white px-2 py-0.5 rounded-full font-mono">
                      {ex.duration}
                    </span>
                  </div>
                  {/* Botão de favorito */}
                  <button
                    onClick={(e) => toggleFavorite(ex.id, e)}
                    className="absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer bg-black/30 hover:bg-black/50 text-white border border-white/10"
                  >
                    <Star className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400 text-amber-400" : "text-white"}`} />
                  </button>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-800 leading-tight group-hover:text-brand-500 transition-colors">
                      {ex.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 md:line-clamp-3">
                      {ex.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-brand-600 mt-4 group-hover:gap-2 transition-all">
                    <span>Iniciar Prática</span>
                    <Play className="w-3 h-3 fill-brand-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Player de Exercício Interativo Expandido */}
      {selectedEx && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-md max-w-2xl mx-auto flex flex-col"
        >
          {/* Header do Player */}
          <div className="bg-slate-50 border-b border-slate-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Prática Corporal Guiada • {selectedEx.duration}
              </span>
              <h3 className="font-display font-bold text-base text-slate-800 leading-tight">
                {selectedEx.title}
              </h3>
            </div>
            <button
              onClick={() => {
                setSelectedEx(null);
                setIsPlaying(false);
              }}
              className="text-slate-400 hover:text-slate-600 font-bold text-xs bg-slate-200/50 hover:bg-slate-200 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
            >
              Voltar ao Catálogo
            </button>
          </div>

          {/* O Palco Interativo (Simula Vídeo de Biofeedback) */}
          <div className="aspect-video bg-gradient-to-b from-brand-50 via-safe-50 to-white relative flex flex-col items-center justify-center p-6 border-b border-slate-100">
            {/* Visualizando a Respiração (Circulo animado de expansão) */}
            {selectedEx.category === 'respiracao' ? (
              <div className="relative flex items-center justify-center w-48 h-48">
                {/* Circulo Pulsante Principal */}
                <motion.div
                  animate={{
                    scale: !isPlaying 
                      ? 1 
                      : breathState === 'inspire' 
                        ? [1, 1.45] 
                        : breathState === 'segure' 
                          ? 1.45 
                          : [1.45, 1],
                  }}
                  transition={{
                    duration: breathState === 'segure' ? 0.1 : (selectedEx.instructionType === 'breath_444' ? 4 : 5),
                    ease: "easeInOut"
                  }}
                  className={`absolute rounded-full flex items-center justify-center opacity-85 transition-all shadow-md ${
                    breathState === 'inspire' 
                      ? 'bg-gradient-to-br from-cyan-400 to-brand-300 w-32 h-32 text-cyan-950' 
                      : breathState === 'segure'
                        ? 'bg-gradient-to-br from-emerald-400 to-amber-300 w-32 h-32 text-amber-950'
                        : 'bg-gradient-to-br from-emerald-100 to-teal-200 w-32 h-32 text-teal-900'
                  }`}
                >
                  <div className="text-center font-display flex flex-col justify-center items-center">
                    <span className="text-xs uppercase tracking-widest font-black opacity-80">
                      {!isPlaying ? "Pronto" : breathState.toUpperCase()}
                    </span>
                    <span className="text-2xl font-bold mt-1">
                      {!isPlaying ? "0" : breathCountdown}s
                    </span>
                  </div>
                </motion.div>
                
                {/* Halo Decorador de Pulso adicional */}
                {isPlaying && (
                  <span className="absolute rounded-full bg-brand-200/40 w-44 h-44 animate-ping opacity-35" />
                )}
              </div>
            ) : (
              // Visual de alongamento ou meditação
              <div className="relative flex flex-col items-center justify-center h-48 w-full max-w-sm text-center px-4 space-y-4">
                <div className="p-4 bg-white/70 backdrop-blur-xs rounded-2xl border border-slate-100 shadow-xs">
                  <motion.div
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                    className="w-12 h-12 mx-auto rounded-full bg-brand-500/10 border-2 border-brand-500/20 border-t-brand-500 flex items-center justify-center text-brand-600 mb-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                  <div className="text-xs font-mono font-bold text-slate-500 mb-1">
                    TEMPO DE PRÁTICA: {Math.floor(totalElapsed / 60)}:{(totalElapsed % 60).toString().padStart(2, '0')}
                  </div>
                  <span className="text-[10px] bg-safe-100 px-2 py-0.5 rounded font-semibold text-safe-700">
                    Instrução Ativa
                  </span>
                </div>
              </div>
            )}

            {/* Texto Flutuante de Orientação em Tempo Real */}
            <div className="w-full text-center mt-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={guidanceText}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-display font-medium text-slate-700 text-[13px] md:text-sm max-w-md mx-auto leading-relaxed px-4"
                >
                  {guidanceText}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Controles de Playback */}
          <div className="p-5 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <AlertCircle className="w-3.5 h-3.5 text-brand-400" />
              <span>Ajuste o volume do seu celular e acomode-se.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTotalElapsed(0);
                  setIsPlaying(false);
                  setBreathState('inspire');
                  setBreathCountdown(selectedEx.instructionType === 'breath_444' ? 4 : 5);
                }}
                className="p-2 border border-slate-200/60 hover:bg-slate-200/40 text-slate-500 rounded-lg cursor-pointer transition-colors text-xs font-medium flex items-center gap-1"
                title="Reiniciar exercício"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`py-2 px-5 rounded-full flex items-center gap-1.5 text-xs font-semibold cursor-pointer active:scale-95 shadow-xs transition-all ${
                  isPlaying 
                    ? "bg-amber-500 hover:bg-amber-600 text-white" 
                    : "bg-brand-500 hover:bg-brand-600 text-white"
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-white" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Iniciar Prática</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
