import React, { useState } from "react";
import { BookOpen, Smile, Sparkles, BookCheck, ShieldAlert, Zap, Moon, Compass, Heart } from "lucide-react";
import { TherapyCategory } from "../types";
import { motion, AnimatePresence } from "motion/react";

const THERAPY_DB: TherapyCategory[] = [
  {
    id: "cat_ans",
    title: "Ansiedade e Hiperventilação",
    description: "Assuma as rédeas dos seus pensamentos ativos e estabilize os reflexos de pânico físico.",
    items: [
      {
        title: "Técnica de Aterramento 5-4-3-2-1",
        description: "Engaje seus 5 canais sensoriais para desfazer pensamentos abstratos de pânico imediato.",
        instruction: "Sente-se firme. Traga atenção consciente ao espaço e nomeie:\n\n• 5 Coisas que você pode VER (ex: o celular, uma cadeira, uma lâmpada).\n• 4 Coisas que você pode TOCAR física e sutilmente (ex: a textura da calça, do estofado).\n• 3 Coisas que você pode OUVIR (ex: o ruído do vento, um carro ao longe).\n• 2 Coisas que você pode CHEIRAR (ex: o aroma de um café ou sabonete).\n• 1 Coisa que você pode SENTIR o gosto na boca.\n\nEste exercício desvia o foco do seu cérebro límbico (emoção) de volta para o córtex sensorial racional, restabelecendo a percepção de segurança."
      },
      {
        title: "Controle de Pensamentos Acelerados",
        description: "Desmonte avalanches cognitivas de catastrofização escrevendo e examinando fatos reais.",
        instruction: "Faça o seguinte auto-exame de reestruturação de pensamentos acelerados:\n\n1. Identifique o pior cenário (Qual o pior pensamento?).\n2. Pergunte-se: Qual a real probabilidade matemática disso ocorrer agora? (0% a 100%).\n3. Quais são as evidências objetivas reais a favor deste medo? E contra este medo?\n4. Formule uma resposta equilibrada realista: 'A situação é complexa, mas eu consigo passar por isso agora de cabeça erguida'."
      },
      {
        title: "Respiração Diafragmática",
        description: "Regulação do fluxo respiratório para restaurar volumes cardíacos normais sob excitação.",
        instruction: "1. Coloque uma das mãos sobre o peitoral e a outra logo abaixo da caixa torácica.\n2. Puxe o ar vagarosamente pelo nariz, de modo que apenas a mão inferior se mova (inflando a musculatura do estômago).\n3. Prenda e segure essa energia por 2 segundos.\n4. Sopre todo o ar suavemente como se estivesse soprando velinhas, puxando o estômago para dentro.\n5. Repita por 5 minutos frequentes."
      }
    ]
  },
  {
    id: "cat_dep",
    title: "Apoio e Reestruturação da Depressão",
    description: "Reconstrução diária de atividades vitais e enfrentamento compassivo do desânimo crônico.",
    items: [
      {
        title: "Reestruturação Cognitiva TCC",
        description: "Aprenda a mapear e anular pensamentos de inutilidade e negatividade persistentes.",
        instruction: "Identifique pensamentos automáticos distorcidos (ex: 'Eu faço tudo errado' ou 'Nada vai mudar').\n\n• Desafio Compassivo: Esse pensamento é um fato gravado ou apenas uma emoção momentânea?\n• Mapeie o Filtro Mental: Estou ignorando as coisas boas que fiz recentemente?\n• Versão Saudável: 'Estou cansado(a) e com pouca energia hoje, mas isso não define minha capacidade total de construir coisas boas amanhã'."
      },
      {
        title: "Planejamento de Pequenas Metas Críticas",
        description: "Divida tarefas em microetapas quase sem esforço físico ou mental.",
        instruction: "Sob baixa energia, evite tentar concluir tarefas gigantes de uma vez. Defina micro-vitórias:\n\n• Meta 1: Lavar apenas um copo na pia.\n• Meta 2: Beber um pequeno copo d'água mineral no sol por 3 minutos.\n• Meta 3: Arrumar um único lado da cama.\n\nCelebrar cada pequeno passo ativa loops de dopamina naturais, fundamentais para a neuroplasticidade da esperança diária."
      }
    ]
  },
  {
    id: "cat_est",
    title: "Controle do Estresse e Burnout",
    description: "Sistemas biológicos de relaxamento profundo e descompressão rápida para exaustão.",
    items: [
      {
        title: "Relaxamento Muscular Progressivo",
        description: "Sinta o contraste físico real entre tensão total e relaxamento em grupos musculares.",
        instruction: "Pratique deitado ou bem acomodado na poltrona:\n\n1. Pressione com muita força os punhos por 5 segundos... sinta a tensão pura. Depois solte-os completamente por 10 segundos... sinta as fáscias derreterem.\n2. Repita esticando e apertando os ombros até a nuca por 5 segundos... e solte.\n3. Contraia os músculos faciais fechando os olhos fortes por 5 segundos... repouse.\n\nIsso reprograma seu cérebro a reconhecer espasmos crônicos de fadiga acumulada."
      },
      {
        title: "Respiração Resiliente Quadrada",
        description: "Padrão de ritmos constantes projetado para reduzir a produção de cortisol sob sobressalto.",
        instruction: "Pratique o padrão 4-4-4-4 em loop:\n\n• Inspire pelo nariz por 4 segundos completos.\n• Mantenha o pulmão cheio por 4 segundos.\n• Expire pela boca por 4 segundos.\n• Mantenha o pulmão vazio por 4 segundos antes de puxar novamente o ar."
      }
    ]
  },
  {
    id: "cat_aut",
    title: "Fortalecimento de Autoestima",
    description: "Cultivo de limites saudáveis, autocompaixão e autoconfiança de forma ativa.",
    items: [
      {
        title: "Afirmações de Auto-Sustentação Humana",
        description: "Exercício diário diante do espelho para internalizar força psicológica.",
        instruction: "Respire fundo, apoie suas mãos de forma firme e vocalize essas afirmações de sustentação:\n\n• 'Eu sou merecedor(a) de paz, amor e acolhimento interno hoje.'\n• 'Meus sentimentos ruins são válidos, mas minhas ações conscientes é que guiam meu amanhã.'\n• 'Eu tenho forças internas para passar por tempos difíceis com paciência e gentileza'."
      },
      {
        title: "Exercícios de Auto-Soberania e Limites",
        description: "Aprenda a dizer não de forma autêntica e saudável sem acumular culpas desnecessárias.",
        instruction: "Identifique um limite pessoal que precisa ser estabelecido com terceiros:\n\n1. Reconheça que dizer não é uma forma crítica de preservar sua energia mental para quem realmente importa.\n2. Pratique sentenças gentis e claras: 'Eu agradeço o convite agora, mas preciso descansar minha mente hoje por questões de cansaço acumulado. Vamos ver em outra oportunidade'."
      }
    ]
  },
  {
    id: "cat_son",
    title: "Higiene Mental para o Sono",
    description: "Ritual terapêutico integral para dissolver preocupações e induzir o repouso noturno.",
    items: [
      {
        title: "Esvaziamento Mental de Cabeceira",
        description: "Descarregue preocupações acumuladas no papel antes da luz azul se apagar.",
        instruction: "Mantenha um bloco de papel (ou use o diário de anotações do aplicativo) 30 minutos antes do descanso:\n\n1. Escreva livremente tudo que está agitando seu cérebro, sem ordem ou concordância.\n2. Finalize escrevendo: 'Tudo isso ficará salvo aqui. Agora é meu momento seguro de restaurar minhas energias nas próximas horas. Posso resolver isso amanhã'."
      },
      {
        title: "Relaxamento Fisiológico Noturno",
        description: "Desaceleração simpática ativa para entrar em ondas cerebrais profundas.",
        instruction: "Ao deitar-se de barriga para cima:\n\n• Solte todos os dentes (desencoste a mandíbula) e relaxe a língua no fundo da boca.\n• Sinta o peso da gravidade puxando seus olhos para longe das pálpebras.\n• Faça 10 respirações lentas e silenciosas, esticando a expiração para o dobro do tempo da inspiração."
      }
    ]
  }
];

export default function TherapyLibrary() {
  const [selectedCat, setSelectedCat] = useState<TherapyCategory | null>(null);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-2xl text-slate-800 flex items-center gap-2">
          Biblioteca de Técnicas Terapêuticas
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Explore guias e exercícios práticos baseados em TCC, Inteligência Emocional e Psicologia Positiva para auto-regulação cotidiana.
        </p>
      </div>

      {/* Grid de Categorias */}
      {!selectedCat && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {THERAPY_DB.map(cat => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCat(cat);
                setActiveItemIndex(null);
              }}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:border-brand-200/50 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group h-full"
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base leading-none ${
                  cat.id === "cat_ans" ? "bg-cyan-50 text-cyan-500" :
                  cat.id === "cat_dep" ? "bg-brand-50 text-brand-500" :
                  cat.id === "cat_est" ? "bg-emerald-50 text-emerald-500" :
                  cat.id === "cat_aut" ? "bg-pink-50 text-pink-500" : "bg-purple-100 text-purple-600"
                }`}>
                  {cat.id === "cat_ans" ? <Compass className="w-5 h-5" /> :
                   cat.id === "cat_dep" ? <Heart className="w-5 h-5 text-brand-500" /> :
                   cat.id === "cat_est" ? <Zap className="w-5 h-5" /> :
                   cat.id === "cat_aut" ? <Sparkles className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-800 leading-snug group-hover:text-brand-500 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{cat.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-brand-600 mt-5 pt-3 border-t border-slate-50">
                <span>{cat.items.length} Exercícios Clínicos</span>
                <span className="group-hover:translate-x-1 transition-transform">Visualizar →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detalhe da Categoria Escolhida */}
      {selectedCat && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs p-6 space-y-6"
        >
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] bg-brand-50 text-brand-600 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                Categoria Clínica
              </span>
              <h3 className="font-display font-bold text-base md:text-lg text-slate-800 tracking-tight leading-tight mt-1.5">
                {selectedCat.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {selectedCat.description}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCat(null);
                setActiveItemIndex(null);
              }}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold bg-slate-100 hover:bg-slate-250 py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
            >
              Voltar Categorias
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Lista de Exercícios na Esquerda */}
            <div className="md:col-span-5 space-y-2.5">
              <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase mb-2">Exercícios Práticos</h4>
              {selectedCat.items.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setActiveItemIndex(index)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                    activeItemIndex === index
                      ? "bg-brand-50/70 border-brand-200 shadow-3xs"
                      : "bg-white border-slate-100 hover:border-slate-200/60"
                  }`}
                >
                  <h5 className="font-display font-semibold text-xs md:text-sm text-slate-800 leading-snug">
                    {item.title}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Roteiro e Instruções Detalhadas na Direita */}
            <div className="md:col-span-7">
              {activeItemIndex !== null ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItemIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="border border-slate-150 rounded-2xl p-5 bg-slate-50/20 space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-brand-500 rounded-full" />
                      <h4 className="font-display font-bold text-sm text-slate-800">
                        {selectedCat.items[activeItemIndex].title}
                      </h4>
                    </div>

                    <div className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap border-t border-slate-105 pt-4">
                      {selectedCat.items[activeItemIndex].instruction}
                    </div>

                    <div className="flex bg-safe-50 border border-safe-100/60 p-3 rounded-xl gap-2 mt-4 text-[11px] text-safe-700">
                      <BookCheck className="w-5 h-5 text-safe-500 shrink-0" />
                      <div>
                        <strong>Indicação de Prática:</strong> Recomendamos praticar lentamente em local silencioso por pelo menos 5 minutos, anotando qualquer alteração de humor antes e depois do exercício no diário emocional do aplicativo.
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center h-48 flex flex-col items-center justify-center bg-slate-50/30">
                  <BookOpen className="w-8 h-8 text-slate-300 mb-2.5" />
                  <h5 className="text-xs font-semibold text-slate-500">Selecione um exercício prático</h5>
                  <p className="text-[10px] text-slate-400 max-w-xs mt-1 leading-normal">
                    Trabalhe sua respiração, enfrente padrões automáticos e explore soluções guiadas em seu próprio ritmo de acolhimento.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
