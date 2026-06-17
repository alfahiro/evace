import React, { useState } from 'react';
import { Mail, Shield, Award, User, AlertCircle, ArrowRight } from 'lucide-react';
import { Student } from '../types';
import EvaceLogo from './EvaceLogo';

interface LoginViewProps {
  onLogin: (customStudent: Student) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [name, setName] = useState('Rômulo Carriello');
  const [enrollment, setEnrollment] = useState('EVA-2026-9844');
  const [email, setEmail] = useState('romulo.carriello@evace.com.br');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe seu nome.');
      return;
    }
    
    onLogin({
      id: `s_login_${Date.now()}`,
      name: name.trim(),
      role: 'Coordenador / Aluno',
      enrollmentId: enrollment || `EVA-${Math.floor(Math.random() * 8999 + 1000)}`,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@evace.com.br`,
      turmaId: 't3'
    });
  };

  const loadDefaultStudent = () => {
    onLogin({
      id: 'admin-001',
      name: 'Rômulo Carriello',
      role: 'Coordenador Acadêmico',
      enrollmentId: 'EVA-2026-9844',
      email: 'romulo.carriello@evace.com.br',
      turmaId: 't1'
    });
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-100"
      id="login-view-container"
    >
      {/* Geometrical background elements replicating the main low-poly theme on an emerald palette */}
      <div className="absolute inset-0 z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <polygon points="0,0 400,0 200,300" fill="#c2ffd3" />
          <polygon points="400,0 1000,0 700,500" fill="#d1f8e5" />
          <polygon points="200,300 700,500 0,600" fill="#bbf7d0" />
          <polygon points="700,500 1000,300 1000,800" fill="#ecfdf5" />
          <polygon points="0,600 700,500 500,1000" fill="#a7f3d0" />
          <polygon points="700,500 1000,800 1000,1000 500,1000" fill="#d1fae5" />
        </svg>
      </div>

      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 relative z-10 space-y-6 animate-in zoom-in-95 duration-250 flex flex-col"
        id="login-card"
      >
        {/* Brand Logo and Title */}
        <div className="flex flex-col items-center justify-center space-y-2 pb-2">
          <EvaceLogo size="lg" variant="dark" showText={true} className="flex-col !space-x-0 text-center" />
          <div className="text-[10px] font-black uppercase tracking-widest text-[#0a4d2c] bg-emerald-50 px-3 py-1.5 rounded-full mt-3 border border-emerald-100/50">
            Portal de Gestão Integrada
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-3 rounded-lg text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Seu Nome Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Rômulo Carriello"
                className="w-full pl-9 pr-4 py-2.5 text-xs text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-slate-55 font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Identificador de Vínculo (Matrícula)</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={enrollment}
                onChange={(e) => setEnrollment(e.target.value)}
                placeholder="Ex: EVA-2026-9844"
                className="w-full pl-9 pr-4 py-2.5 text-xs text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-slate-55 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">E-mail Acadêmico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: romulo@evace.com.br"
                className="w-full pl-9 pr-4 py-2.5 text-xs text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-slate-55"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#0a4d2c] hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer mt-4"
          >
            <span>Entrar no Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-3 text-[10px] text-gray-400 uppercase font-black tracking-widest">Ou acesse direto</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        <button
          onClick={loadDefaultStudent}
          className="w-full py-3 bg-slate-50 hover:bg-emerald-50 text-[#0a4d2c] border border-dashed border-emerald-700/30 hover:border-[#0a4d2c] font-bold text-xs rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Award className="w-4 h-4 text-[#0a4d2c]" />
          <span>Acesso Demonstrativo (Coordenação)</span>
        </button>

        <div className="text-center pt-2">
          <p className="text-[10px] text-gray-400 font-medium">EVACE Cursos e Treinamentos</p>
          <p className="text-[9px] text-emerald-700 font-mono">Gerenciamento Integrado de Alunos e Turmas</p>
        </div>
      </div>
    </div>
  );
}
