import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Search, Star, Eye, Calendar, Smile, AlertCircle, RefreshCw, X, Heart } from "lucide-react";
import { EmotionalNote } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface MyNotesProps {
  onNoteAdded?: () => void;
}

export default function MyNotes({ onNoteAdded }: MyNotesProps) {
  const [notes, setNotes] = useState<EmotionalNote[]>(() => {
    const saved = localStorage.getItem("emotional_notes");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  
  // Mapeamento dos campos do formulário
  const [noteMood, setNoteMood] = useState<'feliz' | 'ansioso' | 'triste' | 'com_raiva' | 'sem_energia'>('feliz');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [noteText, setNoteText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("emotional_notes", JSON.stringify(notes));
  }, [notes]);

  // Lista de emoções comuns para tagueamento sutil
  const EMOTIONS_TAGS = [
    "Aliviado", "Calmo", "Grato", "Preocupado", "Inseguro", "Cansado", "Frustrado", 
    "Triste", "Otimista", "Solitário", "Agitado", "Confiante", "Impaciente"
  ];

  const handleToggleEmotion = (tag: string) => {
    setSelectedEmotions(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Salvar nota (Nova ou Editada)
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    if (editingNoteId) {
      // Editar
      setNotes(prev =>
        prev.map(note =>
          note.id === editingNoteId
            ? {
                ...note,
                mood: noteMood,
                emotions: selectedEmotions,
                text: noteText
              }
            : note
        )
      );
      setEditingNoteId(null);
    } else {
      // Criar nova
      const newNote: EmotionalNote = {
        id: `note_${Date.now()}`,
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        mood: noteMood,
        emotions: selectedEmotions,
        text: noteText,
        isFavorite: false
      };
      setNotes(prev => [newNote, ...prev]);
    }

    // Reset formulário
    setNoteText("");
    setSelectedEmotions([]);
    setNoteMood('feliz');
    setIsFormOpen(false);
    
    if (onNoteAdded) {
      onNoteAdded();
    }
  };

  // Carregar para Edição
  const startEditNote = (note: EmotionalNote) => {
    setEditingNoteId(note.id);
    setNoteMood(note.mood);
    setSelectedEmotions(note.emotions);
    setNoteText(note.text);
    setIsFormOpen(true);
  };

  // Deletar Nota
  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Gostaria de apagar permanentemente esta anotação do diário emocional?")) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  // Favoritar Nota
  const toggleFavoriteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
    );
  };

  // Filtragem de anotações por busca e favoritos
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.emotions.some(em => em.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Emojis de Humor
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'feliz': return "😊";
      case 'ansioso': return "⚡";
      case 'triste': return "😢";
      case 'com_raiva': return "😠";
      case 'sem_energia': return "🔋";
      default: return "📝";
    }
  };

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case 'feliz': return "Equilibrado / Feliz";
      case 'ansioso': return "Ansioso / Agitado";
      case 'triste': return "Triste / Desanimado";
      case 'com_raiva': return "Com Raiva / Tenso";
      case 'sem_energia': return "Sem Energia / Esmagado";
      default: return "Indefinido";
    }
  };

  return (
    <div className="space-y-6">
      {/* Topo do diário */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-800 flex items-center gap-2">
            Diário de Anotações Emocionais
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Mantenha um registro constante dos seus sentimentos, pensamentos e insights das terapias cotidianas.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingNoteId(null);
            setNoteText("");
            setSelectedEmotions([]);
            setNoteMood('feliz');
            setIsFormOpen(true);
          }}
          className="bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-semibold text-xs py-3 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs border border-brand-500 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          Nova Anotação
        </button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative w-full max-w-md">
        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar por palavras-chave ou emoções..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:border-brand-400 transition-colors"
        />
      </div>

      {/* Formulário de Adicionar/Editar Nota */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl p-6 shadow-xl w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto space-y-5 border border-slate-100"
            >
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <h3 className="font-display font-bold text-base text-slate-800">
                  {editingNoteId ? "Editar Anotação Emocional" : "Novo Registro de Diário"}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNote} className="space-y-4 text-left">
                {/* Seleção de Humor */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Como está seu humor?</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: 'feliz', label: "😊 Feliz", col: "hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 select-emerald" },
                      { id: 'ansioso', label: "⚡ Ansioso", col: "hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-700 select-cyan" },
                      { id: 'triste', label: "😢 Triste", col: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 select-blue" },
                      { id: 'com_raiva', label: "😠 Raiva", col: "hover:bg-red-50 hover:border-red-200 hover:text-red-700 select-red" },
                      { id: 'sem_energia', label: "🔋 Cansado", col: "hover:bg-slate-100 hover:border-slate-350 hover:text-slate-800 select-gray" }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setNoteMood(opt.id as any)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          noteMood === opt.id
                            ? "bg-brand-500 border-brand-500 text-white font-bold"
                            : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-base mb-1">{opt.label.split(" ")[0]}</span>
                        <span className="text-[9px] uppercase tracking-wider leading-none opacity-80">{opt.label.split(" ")[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags de emoções adicionais */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">O que você está sentindo? (Selecione)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {EMOTIONS_TAGS.map(tag => {
                      const isSelected = selectedEmotions.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleEmotion(tag)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
                            isSelected
                              ? "bg-brand-100 border-brand-200 text-brand-700 font-bold"
                              : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Texto livre diário */}
                <div className="space-y-2">
                  <label htmlFor="note-text" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Escreva livremente sobre o seu dia:</label>
                  <textarea
                    id="note-text"
                    required
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={6}
                    placeholder="Escreva livremente aqui o que passou na sua mente, possíveis insights das sessões, preocupações ou vitórias..."
                    className="w-full p-4 border border-slate-200/80 rounded-2xl text-xs md:text-sm focus:outline-none focus:border-brand-400 transition-colors bg-clip-padding"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-semibold text-xs py-3.5 rounded-xl cursor-pointer shadow-sm transition-all text-center"
                  >
                    {editingNoteId ? "Salvar Alterações" : "Gravar Registro no Diário"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lista de Anotações */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map(note => {
            const isFav = note.isFavorite;
            return (
              <div
                key={note.id}
                onClick={() => startEditNote(note)}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between hover:border-slate-200 group"
              >
                <div>
                  {/* Cabeçalho de registro */}
                  <div className="flex items-start justify-between border-b border-slate-50 pb-2.5 mb-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg leading-none shrink-0" title={getMoodLabel(note.mood)}>
                        {getMoodEmoji(note.mood)}
                      </span>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block leading-none select-none">DATA DO TEXTO</span>
                        <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
                          {note.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => toggleFavoriteNote(note.id, e)}
                        className="p-1 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Favoritar Nota"
                      >
                        <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-500" : ""}`} />
                      </button>
                      <button
                        onClick={(e) => deleteNote(note.id, e)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer opacity-80 hover:opacity-100"
                        title="Deletar Nota"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Texto */}
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line line-clamp-4">
                    {note.text}
                  </p>
                </div>

                {/* Emoções associadas */}
                {note.emotions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-slate-50">
                    {note.emotions.map(em => (
                      <span key={em} className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded">
                        {em}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-slate-200 bg-slate-50/50 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[250px]">
          <Calendar className="w-10 h-10 text-slate-300 mb-2.5" />
          <h4 className="font-display font-medium text-xs md:text-sm text-slate-600">Seu Diário Emocional está em branco</h4>
          <p className="text-[11px] text-slate-400 max-w-xs mt-1 leading-relaxed">
            Escrever ajuda na autorreflexão e reduz sintomas de ansiedade. Grave seu primeiro registro terapêutico agora!
          </p>
          <button
            onClick={() => {
              setEditingNoteId(null);
              setNoteText("");
              setSelectedEmotions([]);
              setNoteMood('feliz');
              setIsFormOpen(true);
            }}
            className="mt-4 bg-brand-100 hover:bg-brand-200 text-brand-700 font-bold text-xs py-2 px-3.5 rounded-xl cursor-pointer"
          >
            Começar a Escrever
          </button>
        </div>
      )}
    </div>
  );
}
