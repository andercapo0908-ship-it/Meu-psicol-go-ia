import React, { useState } from "react";
import { User, Mail, Lock, CheckCircle, Shield, Chrome, Facebook, LogIn, ChevronRight, Apple } from "lucide-react";
import { UserProfile } from "../types";
import { motion } from "motion/react";

interface LoginScreenProps {
  onLoginSuccess: (profile: UserProfile) => void;
}

const AVATAR_PRESETS = [
  "🍀", "🦕", "🕊️", "🌸", "🌻", "🍵", "🍃", "🐬"
];

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [view, setView] = useState<'login' | 'register' | 'forgot_password'>('login');
  
  // Register / Login Form
  const [name, setName] = useState("Ana Silva");
  const [email, setEmail] = useState("ana.emocional@gmail.com");
  const [password, setPassword] = useState("senha123");
  const [confirmPassword, setConfirmPassword] = useState("senha123");
  const [selectedAvatar, setSelectedAvatar] = useState("🍀");

  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (view === 'register') {
      if (password !== confirmPassword) {
        setMessage("As senhas informadas não coincidem.");
        return;
      }
    }

    if (view === 'forgot_password') {
      setMessage(`Um e-mail de redefinição de segurança foi simulado para ${email}. Verifique sua caixa de entrada.`);
      setTimeout(() => setView('login'), 3500);
      return;
    }

    // Perfil inicial preenchido automaticamente
    const initialProfile: UserProfile = {
      name: name,
      photoUrl: selectedAvatar,
      email: email,
      age: "28 anos",
      gender: "Feminino",
      city: "São Paulo - SP",
      profession: "Arquiteta",
      emotionalGoals: "Aprender a regrar a ansiedade diária no trabalho, praticar mindfulness e manter pensamentos saudáveis.",
    };

    onLoginSuccess(initialProfile);
  };

  const handleGuestAccess = () => {
    const guestProfile: UserProfile = {
      name: "Convidado de Luz",
      photoUrl: "🕊️",
      email: "convidado@pessoal.com",
      age: "Não informada",
      gender: "Não especificado",
      city: "Geral",
      profession: "Autocuidado",
      emotionalGoals: "Utilizar ferramentas de meditação e diário terapêutico para auto-regulação rápida offline."
    };
    onLoginSuccess(guestProfile);
  };

  return (
    <div className="bg-gradient-to-br from-brand-50 via-safe-50 to-white min-h-[600px] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden w-full max-w-sm flex flex-col pt-6 pb-5 px-6 space-y-5"
      >
        {/* Identidade do Aplicativo */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-brand-400 to-safe-400 text-white rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-sm animate-pulse">
            🧠
          </div>
          <h2 className="font-display font-bold text-lg text-slate-800 tracking-tight">Meu Psicólogo Pessoal</h2>
          <p className="text-xs text-slate-500 leading-normal px-2">
            Seu refúgio mental equilibrado de segurança emocional e autodescoberta.
          </p>
        </div>

        {message && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] p-3 rounded-xl flex items-center gap-2 leading-relaxed">
            <span className="text-xs">⚠️</span>
            <span>{message}</span>
          </div>
        )}

        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          {view === 'register' && (
            <>
              {/* Nome */}
              <div className="space-y-1">
                <label htmlFor="reg-name" className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    id="reg-name"
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-3 text-xs md:text-sm focus:outline-none focus:border-brand-400"
                  />
                </div>
              </div>

              {/* Seletor de Avatar */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Identificador (Avatar)</label>
                <div className="flex gap-2 justify-between">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSelectedAvatar(preset)}
                      className={`text-xl p-1.5 rounded-lg border transition-all cursor-pointer ${
                        selectedAvatar === preset 
                          ? "bg-brand-100 border-brand-300 scale-110 font-bold" 
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="auth-email" className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">E-mail de Acesso</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                id="auth-email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@email.com"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-3 text-xs md:text-sm focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          {view !== 'forgot_password' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="auth-pass" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sua Senha</label>
                {view === 'login' && (
                  <button
                    type="button"
                    onClick={() => setView('forgot_password')}
                    className="text-[10px] text-brand-500 hover:underline font-semibold cursor-pointer"
                  >
                    Esqueceu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="auth-pass"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-3 text-xs md:text-sm focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>
          )}

          {view === 'register' && (
            <div className="space-y-1">
              <label htmlFor="reg-confirm" className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="reg-confirm"
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="******"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-3 text-xs md:text-sm focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>
          )}

          {/* Botões do Formulário */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-brand-500 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>
                {view === 'login' ? "Entrar na Conta" : view === 'register' ? "Criar Minha Conta" : "Receber Recuperação"}
              </span>
            </button>
          </div>
        </form>

        {/* Alternância de Visualização */}
        <div className="text-center text-xs text-slate-400">
          {view === 'login' ? (
            <p>
              Não tem uma conta?{" "}
              <button onClick={() => setView('register')} className="text-brand-500 font-bold hover:underline cursor-pointer">
                Criar agora
              </button>
            </p>
          ) : (
            <p>
              Já possui registro?{" "}
              <button onClick={() => setView('login')} className="text-brand-500 font-bold hover:underline cursor-pointer">
                Fazer login
              </button>
            </p>
          )}
        </div>

        {/* Divisor de Entrada */}
        <div className="flex items-center gap-2 text-[10px] text-slate-350 uppercase select-none font-bold">
          <div className="flex-1 h-px bg-slate-100" />
          <span>ou entre com</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Integração Social Credenciais */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleGuestAccess}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-150 bg-slate-50 hover:bg-slate-100 active:scale-95 text-[9px] text-slate-500 font-bold cursor-pointer transition-transform"
          >
            <span>🕊️</span>
            <span className="mt-1">Anonimato</span>
          </button>
          <button
            type="button"
            onClick={handleGuestAccess}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-150 bg-slate-50 hover:bg-slate-100 active:scale-95 text-[9px] text-slate-500 font-bold cursor-pointer transition-transform"
          >
            <Chrome className="w-4 h-4 text-red-500 shrink-0" />
            <span className="mt-1 font-sans">Google</span>
          </button>
          <button
            type="button"
            onClick={handleGuestAccess}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-150 bg-slate-50 hover:bg-slate-100 active:scale-95 text-[9px] text-slate-500 font-bold cursor-pointer transition-transform"
          >
            <Apple className="w-4 h-4 text-slate-800 shrink-0" />
            <span className="mt-1 font-sans">Apple</span>
          </button>
        </div>

        {/* Aviso de Segurança de Dados Criptografados */}
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400/90 justify-center leading-normal pt-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/40">
          <Shield className="w-3.5 h-3.5 text-safe-500" />
          <span>Dados criptografados de ponta a ponta.</span>
        </div>
      </motion.div>
    </div>
  );
}
