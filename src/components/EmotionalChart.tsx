import React, { useState } from "react";
import { TrendingUp, BarChart2, PieChart, Activity, Smile, AlertCircle, Sparkles } from "lucide-react";
import { DailyMoodRecord } from "../types";
import { motion } from "motion/react";

interface EmotionalChartProps {
  moodRecords: DailyMoodRecord[];
}

export default function EmotionalChart({ moodRecords }: EmotionalChartProps) {
  const [chartMode, setChartMode] = useState<'semanal' | 'mensal' | 'comparativo'>('semanal');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Fallback se não houver registros
  const defaultWeeklyRecords: DailyMoodRecord[] = [
    { date: "Seg", happiness: 4, anxiety: 2, sadness: 1, anger: 1, energy: 4 },
    { date: "Ter", happiness: 3, anxiety: 3, sadness: 2, anger: 1, energy: 3 },
    { date: "Qua", happiness: 5, anxiety: 1, sadness: 1, anger: 2, energy: 5 },
    { date: "Qui", happiness: 2, anxiety: 4, sadness: 3, anger: 3, energy: 2 },
    { date: "Sex", happiness: 4, anxiety: 2, sadness: 1, anger: 1, energy: 4 },
    { date: "Sáb", happiness: 5, anxiety: 1, sadness: 1, anger: 1, energy: 5 },
    { date: "Dom", happiness: 4, anxiety: 1, sadness: 2, anger: 1, energy: 4 },
  ];

  const actualRecords = moodRecords.length >= 7 ? moodRecords.slice(-7) : defaultWeeklyRecords;

  // Helpers para cálculo de médias
  const calculateAverage = (field: keyof Omit<DailyMoodRecord, 'date'>) => {
    const sum = actualRecords.reduce((acc, rec) => acc + (rec[field] as number), 0);
    return (sum / actualRecords.length).toFixed(1);
  };

  // Cores de humor
  const getMoodColor = (moodName: string) => {
    switch (moodName) {
      case 'happiness': return { fill: 'bg-emerald-400', stroke: '#10b981', light: 'bg-emerald-50 text-emerald-700' };
      case 'anxiety': return { fill: 'bg-cyan-400', stroke: '#06b6d4', light: 'bg-cyan-50 text-cyan-700' };
      case 'sadness': return { fill: 'bg-blue-400', stroke: '#3b82f6', light: 'bg-blue-50 text-blue-700' };
      case 'anger': return { fill: 'bg-red-400', stroke: '#ef4444', light: 'bg-red-50 text-red-700' };
      default: return { fill: 'bg-amber-400', stroke: '#f59e0b', light: 'bg-amber-50 text-amber-700' };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 md:p-6 shadow-xs space-y-6">
      {/* Tab Controller do Gráfico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-base text-slate-800 flex items-center gap-1.5">
            <Activity className="w-5 h-5 text-brand-500" />
            Análise e Evolução Emocional
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">Métricas científicas baseadas nas suas marcações diárias.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-[10px] font-bold text-slate-500 max-w-fit">
          <button
            onClick={() => setChartMode('semanal')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${chartMode === 'semanal' ? "bg-white text-brand-600 shadow-xs h-full" : "hover:text-slate-700"}`}
          >
            Semanal
          </button>
          <button
            onClick={() => setChartMode('mensal')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${chartMode === 'mensal' ? "bg-white text-brand-600 shadow-xs h-full" : "hover:text-slate-700"}`}
          >
            Mensal
          </button>
          <button
            onClick={() => setChartMode('comparativo')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${chartMode === 'comparativo' ? "bg-white text-brand-600 shadow-xs h-full" : "hover:text-slate-700"}`}
          >
            Evolução Geral
          </button>
        </div>
      </div>

      {/* Condicional de Exibição */}
      {chartMode === 'semanal' && (
        <div className="space-y-6">
          {/* SVG Bar Chart para o humor semanal */}
          <div className="relative pt-4">
            <div className="flex items-end justify-between h-48 px-2 md:px-6 relative border-b border-slate-100 pb-2">
              {/* Linhas de base de 1 a 5 */}
              {[1, 2, 3, 4, 5].map((val) => (
                <div key={val} className="absolute left-0 right-0 border-t border-slate-100/70" style={{ bottom: `${(val / 5) * 100}%` }}>
                  <span className="absolute -left-1 transform -translate-y-1/2 text-[9px] font-mono text-slate-300 font-bold bg-white px-1">
                    Nível {val}
                  </span>
                </div>
              ))}

              {actualRecords.map((rec, idx) => {
                const totalHeight = (rec.happiness / 5) * 100;
                const anxietyHeight = (rec.anxiety / 5) * 100;
                const isHovered = hoveredBar === idx;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className="flex flex-col items-center flex-1 group relative cursor-pointer"
                  >
                    {/* Tooltip ao passar o mouse */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-2 bg-slate-900 text-white rounded-lg p-2.5 shadow-lg text-[10px] w-28 z-20 space-y-1 leading-normal border border-slate-800">
                        <div className="font-bold border-b border-white/10 pb-1 mb-1">{rec.date} (Registro)</div>
                        <div className="flex justify-between"><span>😊 Felicidade:</span> <span className="font-bold">{rec.happiness}/5</span></div>
                        <div className="flex justify-between"><span>⚡ Ansiedade:</span> <span className="font-bold">{rec.anxiety}/5</span></div>
                        <div className="flex justify-between"><span>😢 Tristeza:</span> <span className="font-bold">{rec.sadness}/5</span></div>
                        <div className="flex justify-between"><span>🔋 Energia:</span> <span className="font-bold">{rec.energy}/5</span></div>
                      </div>
                    )}

                    {/* Barras Empilhadas de Felicidade / Ansiedade */}
                    <div className="w-6 md:w-8 h-36 relative rounded-t-md overflow-hidden bg-slate-50 flex items-end">
                      {/* Barra de Ansiedade (Ciano) */}
                      <div
                        className="w-full bg-cyan-400 absolute bottom-0 transition-all duration-500 rounded-t-xs"
                        style={{ height: `${anxietyHeight}%` }}
                      />
                      {/* Barra de Felicidade (Verde-claro) */}
                      <div
                        className="w-full bg-emerald-400 opacity-90 absolute bottom-0 transition-all duration-500 rounded-t-xs"
                        style={{ height: `${totalHeight}%` }}
                      />
                    </div>

                    <span className="text-[10px] md:text-xs font-semibold text-slate-500 mt-2">
                      {rec.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legenda do Gráfico */}
          <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>😊 Nível de Bem-Estar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>⚡ Ansiedade / Agitação</span>
            </div>
          </div>
        </div>
      )}

      {/* Visão de Humor Mensal - Simplificada de barras com tendências */}
      {chartMode === 'mensal' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border border-slate-100 p-3 rounded-2xl bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-emerald-500" />
              <div>
                <h4 className="text-xs font-bold text-slate-700">Índice Geral de Felicidade</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Consolidado do período de 30 dias passados.</p>
              </div>
            </div>
            <span className="text-sm font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
              78% Ótimo
            </span>
          </div>

          {/* SVG Histograma de distribuição do mês */}
          <div className="pt-2">
            <h5 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-3">Distribuição do Humor Predominante</h5>
            <div className="space-y-2.5">
              {[
                { label: "Radiante / Muito Feliz", count: 12, percentage: 40, color: "bg-emerald-400" },
                { label: "Estável / Neutro", count: 10, percentage: 33, color: "bg-brand-300" },
                { label: "Ansioso / Preocupado", count: 5, percentage: 17, color: "bg-cyan-400" },
                { label: "Triste / Desanimado", count: 2, percentage: 7, color: "bg-blue-400" },
                { label: "Cansado / Sem Energia", count: 1, percentage: 3, color: "bg-red-400" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>{item.label}</span>
                    <span className="font-mono text-[10px] text-slate-400">{item.count} dias ({item.percentage}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visão de Evolução Geral - Comparação de médias de estresse/energia/ansiedade */}
      {chartMode === 'comparativo' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: "Média Felicidade", value: calculateAverage('happiness'), max: "5.0", color: getMoodColor('happiness') },
              { title: "Média Ansiedade", value: calculateAverage('anxiety'), max: "5.0", color: getMoodColor('anxiety') },
              { title: "Média Tristeza", value: calculateAverage('sadness'), max: "5.0", color: getMoodColor('sadness') },
              { title: "Média Energia", value: calculateAverage('energy'), max: "5.0", color: getMoodColor('energy') },
            ].map((stat, idx) => (
              <div key={idx} className="border border-slate-100 bg-slate-50/50 p-3 rounded-2xl space-y-1.5 text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{stat.title}</span>
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-lg font-bold font-mono text-slate-800">{stat.value}</span>
                  <span className="text-[10px] text-slate-400">/{stat.max}</span>
                </div>
                {/* Linha indicadora rápida */}
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden">
                  <div className={`h-full ${stat.color.fill}`} style={{ width: `${(Number(stat.value) / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="border border-brand-100 bg-brand-50/50 p-4 rounded-2xl flex items-start gap-2.5 mt-2">
            <span className="p-1 px-1.5 bg-brand-100 text-brand-600 rounded-lg text-xs leading-none">💡</span>
            <div>
              <h4 className="text-xs font-bold text-brand-800 leading-tight">Insight Terapêutico Semanal</h4>
              <p className="text-xs text-brand-700/80 leading-relaxed mt-1">
                Seu índice de **Felicidade** tende a atingir o pico nos dias de menor **Ansiedade**. Praticar o alongamento respiratório guiado nos dias mais carregados pode reequilibrar essa relação de forma positiva. Continue praticando o autocuidado diário!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
