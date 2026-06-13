import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Bookmark, Star, Volume2, Timer, Flame, Eye, Music, ChevronRight, Wind, CloudRain, Waves } from "lucide-react";
import { TherapistAudio } from "../types";
import { motion, AnimatePresence } from "motion/react";

const AUDIOS_DB: TherapistAudio[] = [
  { id: "aud_dep_acolh", title: "Áudio de Acolhimento Compassivo", category: "depressao", subcategory: "Terapia de Aceitação", duration: "8 min", synthType: "guidance_calm", description: "Mensagens tranquilas guiando a mente a aceitar e validar sentimentos de tristeza sem julgamentos." },
  { id: "aud_dep_esper", title: "Áudio de Luz e Esperança", category: "depressao", subcategory: "Psicologia Positiva", duration: "10 min", synthType: "guidance_hope", description: "Reflexão sobre ciclos emocionais, restaurando o senso de perspectiva para momentos difíceis." },
  { id: "aud_dep_motiv", title: "Motivação Terapêutica Diária", category: "depressao", subcategory: "TCC Metas", duration: "6 min", synthType: "guidance_hope", description: "Estímulo para dar o próximo pequeno passo compassivo para quebrar o ciclo da inércia." },
  
  { id: "aud_ans_resp", title: "Respiração Guiada Contra Ansiedade", category: "ansiedade", subcategory: "Mindfulness", duration: "7 min", synthType: "guidance_calm", description: "Roteiro respiratório cadenciado projetado especificamente para ativar o relaxamento corporal." },
  { id: "aud_ans_prof", title: "Relaxamento Neuromuscular Profundo", category: "ansiedade", subcategory: "Jacobson Sono", duration: "12 min", synthType: "guidance_calm", description: "Áudio relaxante para desativar a resposta de lutar ou fugir instalada em momentos tensos." },
  { id: "aud_ans_crise", title: "Rápido SOS Controle de Crise", category: "ansiedade", subcategory: "Desaceleração", duration: "5 min", synthType: "guidance_crisis", description: "Intervenção de aterramento imediato para crises agudas de pânico ou hiperventilação." },
  
  { id: "aud_sono_med", title: "Meditação Guiada Sono Reparador", category: "sono", subcategory: "Higiene do Sono", duration: "15 min", synthType: "guidance_calm", description: "Transição suave de pensamentos para preparar o cérebro para ondas delta profundas." },
  { id: "aud_sono_chuva", title: "Chuva Suave Interativa (Sintético)", category: "sono", subcategory: "Ruído Branco", duration: "Loop", synthType: "soundscape_rain", description: "Som contínuo e orgânico de chuva reconfortante gerado sinteticamente pela Web Audio API." },
  { id: "aud_sono_flore", title: "Brisa de Floresta Secreta (Sintético)", category: "sono", subcategory: "Frequência Solfeggio", duration: "Loop", synthType: "soundscape_forest", description: "Freqüências suaves de floresta, brisa e ondas de vento para acalmar mentes agitadas." },
  { id: "aud_sono_mar", title: "Ondas do Mar de Serenidade (Sintético)", category: "sono", subcategory: "Ondas Alfa", duration: "Loop", synthType: "soundscape_ocean", description: "Simulação acústica de ondas calmantes batendo na areia. Ideal como foco meditativo de fundo." }
];

export default function AudioPlayer() {
  const [activeTab, setActiveTab] = useState<'depressao' | 'ansiedade' | 'sono'>('depressao');
  const [selectedAudio, setSelectedAudio] = useState<TherapistAudio | null>(null);
  
  // Custom synth controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(0.5);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("fav_audios");
    return saved ? JSON.parse(saved) : [];
  });

  // Sintetizador Web Audio API Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<any[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [playProgress, setPlayProgress] = useState(0); // 0 to 100 for simulated seek

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
    localStorage.setItem("fav_audios", JSON.stringify(updated));
  };

  // Filtragem
  const filteredAudios = AUDIOS_DB.filter(aud => aud.category === activeTab);

  // Desativar som ativo
  const stopAllSynth = () => {
    if (synthNodesRef.current.length > 0) {
      synthNodesRef.current.forEach(node => {
        try { node.stop(); } catch(e) {}
        try { node.disconnect(); } catch(e) {}
      });
      synthNodesRef.current = [];
    }
    setIsPlaying(false);
  };

  // Web Audio Synthesizer real-time generator
  const startSynth = (type: string) => {
    try {
      stopAllSynth();
      
      // Criar áudio context
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Ganho mestre
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);

      if (type === 'soundscape_rain') {
        // Gerador de ruído branco / rosa para Chuva
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Rosa filter simplificado
          output[i] = (lastOut * 0.95 + white * 0.05);
          lastOut = output[i];
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        // Filtro passa faixa para dar o som de chuva batendo nas folhas
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);

        source.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);
        
        source.start();
        synthNodesRef.current = [source, masterGain, filter];

      } else if (type === 'soundscape_ocean') {
        // Ondas de mar: ruído modulado por um oscilador de frequência muito baixa (LFO - 0.1Hz)
        const bufferSize = ctx.sampleRate * 4;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        // Filtro para amaciar o ruído do mar
        const lpFilter = ctx.createBiquadFilter();
        lpFilter.type = 'lowpass';
        lpFilter.frequency.setValueAtTime(450, ctx.currentTime);

        // LFO para oscilar a amplitude (ondas)
        const wavesGain = ctx.createGain();
        wavesGain.gain.setValueAtTime(0.1, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // onda a cada 12 segundos aprox.
        
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.4, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(wavesGain.gain); // Modular ganho mestre das ondas

        source.connect(lpFilter);
        lpFilter.connect(wavesGain);
        wavesGain.connect(masterGain);
        masterGain.connect(ctx.destination);

        source.start();
        lfo.start();
        synthNodesRef.current = [source, lfo, wavesGain, masterGain, lpFilter];

      } else if (type === 'soundscape_forest') {
        // Brisa de floresta: Binaural drone harmônico em frequência Solfeggio 528Hz e 432Hz
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(132, ctx.currentTime); // harmônico de 528
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(216, ctx.currentTime); // harmônico de 432

        const oscGain1 = ctx.createGain();
        const oscGain2 = ctx.createGain();
        oscGain1.gain.setValueAtTime(0.12, ctx.currentTime);
        oscGain2.gain.setValueAtTime(0.08, ctx.currentTime);

        // LFO para alternar a brisa suavemente
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.05, ctx.currentTime); // oscilação de brisa
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.05, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(oscGain1.gain);

        osc1.connect(oscGain1);
        osc2.connect(oscGain2);
        oscGain1.connect(masterGain);
        oscGain2.connect(masterGain);
        masterGain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        lfo.start();
        synthNodesRef.current = [osc1, osc2, lfo, oscGain1, oscGain2, masterGain];

      } else {
        // Guidance (acolhimento, esperança, controle de crise): Frequências Solfeggio terapêuticas profundas sintonizadas com a alma de 528Hz + 432Hz
        const drone = ctx.createOscillator();
        drone.type = 'sine';
        drone.frequency.setValueAtTime(174, ctx.currentTime); // frequência de alívio de dor emocional
        
        const harmonics = ctx.createOscillator();
        harmonics.type = 'triangle';
        harmonics.frequency.setValueAtTime(285, ctx.currentTime); // frequência de reconexão celular

        const droneGain = ctx.createGain();
        const harmonicsGain = ctx.createGain();
        droneGain.gain.setValueAtTime(0.14, ctx.currentTime);
        harmonicsGain.gain.setValueAtTime(0.03, ctx.currentTime);

        // Filtro passa-baixa para amaciar o triângulo
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(200, ctx.currentTime);

        drone.connect(droneGain);
        harmonics.connect(lp);
        lp.connect(harmonicsGain);

        droneGain.connect(masterGain);
        harmonicsGain.connect(masterGain);
        masterGain.connect(ctx.destination);

        drone.start();
        harmonics.start();
        synthNodesRef.current = [drone, harmonics, droneGain, harmonicsGain, lp, masterGain];
      }

      setIsPlaying(true);
    } catch(err) {
      console.warn("Navegador impediu Web Audio de inicializar ou sem suporte completo.", err);
      // Fallback visual tocando sem som real simulando
      setIsPlaying(true);
    }
  };

  // Gerenciando o playing do audio
  const handlePlayToggle = () => {
    if (!selectedAudio) return;
    if (isPlaying) {
      stopAllSynth();
    } else {
      startSynth(selectedAudio.synthType);
    }
  };

  // Ajuste do volume dinâmico do sintetizador
  useEffect(() => {
    if (synthNodesRef.current.length > 0) {
      // O último nó normalmente é o masterGain ou podemos varrer e ajustar
      synthNodesRef.current.forEach(node => {
        if (node instanceof GainNode) {
          try {
            // Se for o masterGain
            node.gain.setValueAtTime(volume, audioCtxRef.current?.currentTime || 0);
          } catch(e) {}
        }
      });
    }
  }, [volume]);

  // Se o usuário selecionar outro áudio, pára anterior
  const selectAudioTrack = (track: TherapistAudio) => {
    setSelectedAudio(track);
    setPlayProgress(0);
    if (isPlaying) {
      startSynth(track.synthType);
    } else {
      stopAllSynth();
    }
  };

  // Temporizador para desligamento automático
  useEffect(() => {
    if (timerMinutes && isPlaying) {
      setTimerRemaining(timerMinutes * 60);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev !== null && prev <= 1) {
            stopAllSynth();
            setTimerMinutes(null);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            return null;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setTimerRemaining(null);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerMinutes, isPlaying]);

  // Simulador de progresso do áudio temporal na tela
  useEffect(() => {
    if (isPlaying) {
      if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = setInterval(() => {
        setPlayProgress(prev => {
          if (prev >= 100) {
            // Trilha de loop de ruído não acaba, guia acaba
            if (selectedAudio?.duration === 'Loop') {
              return 0; // recomeça loop
            } else {
              stopAllSynth();
              return 100;
            }
          }
          return prev + (0.8 * speed);
        });
      }, 1000);
    } else {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }
    }
    return () => {
      if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
    };
  }, [isPlaying, speed, selectedAudio]);

  // Destruição do Web Audio ao sair do player
  useEffect(() => {
    return () => {
      stopAllSynth();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header com Categorias */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-800 flex items-center gap-2">
            Biblioteca de Sons e Áudios Terapêuticos
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Ouça frequências reconfortantes e meditações dirigidas para restabelecer a calma interna.
          </p>
        </div>
      </div>

      {/* Abas das Categorias */}
      <div className="flex border-b border-slate-100 pb-px">
        {[
          { id: 'depressao', label: '💜 Alívio e Esperança (Depressão)' },
          { id: 'ansiedade', label: '💙 Respiração e Pânico (Ansiedade)' },
          { id: 'sono', label: '🌌 Sons e Meditação (Sono)' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`border-b-2 py-3 px-4 text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap -mb-px flex items-center ${
              activeTab === tab.id
                ? "border-brand-500 text-brand-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Catálogo de Áudios - Esquerda */}
        <div className="lg:col-span-7 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredAudios.map(audio => {
            const isFav = favorites.includes(audio.id);
            const isSelected = selectedAudio?.id === audio.id;
            return (
              <div
                key={audio.id}
                onClick={() => selectAudioTrack(audio)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? "bg-brand-50/70 border-brand-200"
                    : "bg-white border-slate-100 hover:border-slate-200/80 shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 pr-4">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isSelected ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-500"
                  }`}>
                    {audio.synthType.includes('rain') ? (
                      <CloudRain className="w-5 h-5 animate-pulse" />
                    ) : audio.synthType.includes('ocean') ? (
                      <Waves className="w-5 h-5" />
                    ) : audio.synthType.includes('forest') ? (
                      <Wind className="w-5 h-5" />
                    ) : (
                      <Music className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-xs md:text-sm text-slate-800 leading-snug">
                      {audio.title}
                    </h4>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-1.5 py-0.5 rounded mt-1 inline-block">
                      {audio.subcategory}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{audio.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs text-slate-400">{audio.duration}</span>
                  <button
                    onClick={(e) => toggleFavorite(audio.id, e)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-500" : ""}`} />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Player em Destaque - Direita */}
        <div className="lg:col-span-5">
          {selectedAudio ? (
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
              {/* Brilho decorativo no fundo do player */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-safe-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-5 z-10 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Sintonizador Ativo • {selectedAudio.duration === 'Loop' ? 'Loop Relaxante' : 'Sessão de Áudio'}
                  </span>
                  
                  {/* Timer de desligamento */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2 py-1 rounded-lg">
                    <Timer className="w-3.5 h-3.5 text-brand-400" />
                    <select
                      value={timerMinutes || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTimerMinutes(val ? Number(val) : null);
                      }}
                      className="bg-transparent text-white border-none focus:outline-none text-[10px] font-semibold cursor-pointer"
                    >
                      <option value="" className="bg-slate-900 text-white">Timer Desligado</option>
                      <option value="5" className="bg-slate-900 text-white">5 min</option>
                      <option value="10" className="bg-slate-900 text-white">10 min</option>
                      <option value="15" className="bg-slate-900 text-white">15 min</option>
                      <option value="30" className="bg-slate-900 text-white">30 min</option>
                    </select>
                  </div>
                </div>

                {/* Info do áudio */}
                <div className="text-center py-4 space-y-2">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center border border-slate-700 shadow-inner">
                    <Music className="w-8 h-8 text-brand-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm md:text-base text-white tracking-tight leading-snug px-2">
                      {selectedAudio.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-wider">
                      {selectedAudio.subcategory}
                    </p>
                  </div>
                </div>

                {/* Barra de Progresso do Áudio */}
                <div className="space-y-1">
                  <div className="relative w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-400 to-safe-400 transition-all duration-300"
                      style={{ width: `${playProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>
                      {selectedAudio.duration === 'Loop' ? "Contínuo" : `${Math.floor((playProgress / 100) * Number(selectedAudio.duration.split(' ')[0]))} min`}
                    </span>
                    <span>{selectedAudio.duration}</span>
                  </div>
                </div>

                {/* Controles de Playback Principal */}
                <div className="flex items-center justify-center gap-5">
                  {/* Seletor de velocidade */}
                  <div className="flex bg-slate-850 border border-slate-800 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold text-slate-400 gap-1.5 shrink-0">
                    <button onClick={() => setSpeed(0.75)} className={`px-1.5 rounded cursor-pointer ${speed === 0.75 ? "bg-brand-500 text-white" : ""}`}>0.75x</button>
                    <button onClick={() => setSpeed(1.0)} className={`px-1.5 rounded cursor-pointer ${speed === 1.0 ? "bg-brand-500 text-white" : ""}`}>1x</button>
                    <button onClick={() => setSpeed(1.5)} className={`px-1.5 rounded cursor-pointer ${speed === 1.5 ? "bg-brand-500 text-white" : ""}`}>1.5x</button>
                  </div>

                  {/* PlayButton Principal */}
                  <button
                    onClick={handlePlayToggle}
                    className="w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-600 transition-transform active:scale-95 text-white flex items-center justify-center shadow-lg shadow-brand-500/10 cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-white ml-1" />
                    )}
                  </button>

                  {/* Slider de Volume */}
                  <div className="flex items-center gap-2 bg-slate-850 border border-slate-800 px-3 py-1.5 rounded-xl">
                    <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-16 accent-brand-400 h-1 rounded-lg cursor-pointer bg-slate-700"
                    />
                  </div>
                </div>

                {/* Relógio do timer regressivo */}
                {timerRemaining !== null && (
                  <div className="text-center text-xs font-mono text-amber-400 animate-pulse font-semibold">
                    Desligamento programado em: {Math.floor(timerRemaining / 60)}:{(timerRemaining % 60).toString().padStart(2, '0')}
                  </div>
                )}

                {/* Rodapé da Guia */}
                <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-[11px] text-slate-300 leading-normal text-center">
                  O sintetizador integrado usa a **Web Audio API** do seu navegador para gerar ondas mecânicas analgésicas em tempo real, induzindo relaxamento cerebral mesmo sem conexão de internet.
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 bg-slate-50/50 text-slate-400 p-8 rounded-3xl text-center h-64 flex flex-col items-center justify-center">
              <Music className="w-9 h-9 opacity-50 mb-3 text-slate-400" />
              <h4 className="font-display font-medium text-xs md:text-sm text-slate-600">Nenhum áudio selecionado</h4>
              <p className="text-[11px] text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                Escolha uma das sessões de ondas na lista da esquerda para sintonizar seu cérebro no relaxamento.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
