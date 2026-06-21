import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  User, 
  AlertCircle, 
  ArrowRight, 
  Lock,
  Eye,
  EyeOff,
  HelpCircle,
  Key
} from 'lucide-react';
import { Student, Turma } from '../types';
import EvaceLogo from './EvaceLogo';
import { UserAccount } from './AdminUsuarios';

interface LoginViewProps {
  onLogin: (customUser: Student) => void;
  students: Student[];
  turmas: Turma[];
}

export default function LoginView({ onLogin, students, turmas }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showQuickTips, setShowQuickTips] = useState(true);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);

  // Seed and load user accounts so they're instantly queryable
  useEffect(() => {
    try {
      const savedAccounts = localStorage.getItem('evace_auth_users');
      let parsed: UserAccount[] = savedAccounts ? JSON.parse(savedAccounts) : [];

      // Check if user "renan" exists; if not, seed him as admin
      const hasRenan = parsed.some(u => u.username.toLowerCase() === 'renan');
      if (!hasRenan) {
        const seeded: UserAccount[] = [
          {
            id: 'seeded-renan-admin',
            username: 'renan',
            password: '88165169',
            name: 'Renan Cabral',
            role: 'admin',
            email: 'renancabralbatista@gmail.com',
            createdAt: new Date().toISOString()
          },
          {
            id: 'seeded-romulo-admin',
            username: 'romulo',
            password: 'admin123',
            name: 'Rômulo Carriello',
            role: 'admin',
            email: 'romulo.carriello@evace.com.br',
            createdAt: new Date().toISOString()
          },
          {
            id: 'seeded-patricia-prof',
            username: 'patricia',
            password: '123',
            name: 'Prof.ª Patrícia Walker',
            role: 'professor',
            associatedId: 'prof-1',
            email: 'patricia.walker@evace.com.br',
            createdAt: new Date().toISOString()
          },
          {
            id: 'seeded-marcos-prof',
            username: 'marcos',
            password: '123',
            name: 'Prof. Dr. Marcos Albuquerque',
            role: 'professor',
            associatedId: 'prof-2',
            email: 'marcos.albuquerque@evace.com.br',
            createdAt: new Date().toISOString()
          }
        ];

        // Seed default students login for evaluating ease
        students.forEach((s, idx) => {
          const defaultUsername = s.name.toLowerCase().split(' ')[0] + (idx + 1);
          seeded.push({
            id: `seeded-student-${s.id}`,
            username: defaultUsername,
            password: '123',
            name: s.name,
            role: 'aluno',
            associatedId: s.id,
            email: s.email,
            createdAt: new Date().toISOString()
          });
        });

        parsed = [...seeded, ...parsed];
        localStorage.setItem('evace_auth_users', JSON.stringify(parsed));
      }

      setAccounts(parsed);
    } catch {
      setAccounts([]);
    }
  }, [students]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const targetUser = username.trim().toLowerCase();
    const targetPass = password.trim();

    if (!targetUser) {
      setError('Por favor, informe seu login de acesso.');
      return;
    }
    if (!targetPass) {
      setError('Por favor, digite sua senha.');
      return;
    }

    // Lookup credentials
    const lookup = accounts.find(acc => acc.username.toLowerCase() === targetUser && acc.password === targetPass);

    if (!lookup) {
      setError('Credenciais incorretas. Verifique seu login e senha.');
      return;
    }

    // Role Mapping to pass back to App
    if (lookup.role === 'admin') {
      onLogin({
        id: lookup.id,
        name: lookup.name,
        role: 'admin',
        enrollmentId: 'EVA-COOR-1102',
        email: lookup.email || 'contato@evace.com.br',
        turmaId: turmas[0]?.id || 't1'
      });
    } else if (lookup.role === 'professor') {
      onLogin({
        id: lookup.associatedId || lookup.id,
        name: lookup.name,
        role: 'professor',
        enrollmentId: 'EVA-PROF-DOCENTE',
        email: lookup.email || 'professor@evace.com.br',
        turmaId: turmas[0]?.id || 't1'
      });
    } else {
      // student profile
      // Check physical records if associated
      const matchedPhysicalStudent = students.find(s => s.id === lookup.associatedId);
      onLogin({
        id: matchedPhysicalStudent?.id || lookup.id,
        name: matchedPhysicalStudent?.name || lookup.name,
        role: 'aluno',
        enrollmentId: matchedPhysicalStudent?.enrollmentId || 'EVA-MOCK-ALUNO',
        email: matchedPhysicalStudent?.email || lookup.email || 'aluno@evace.com.br',
        turmaId: matchedPhysicalStudent?.turmaId || turmas[0]?.id || 't1',
        phone: matchedPhysicalStudent?.phone,
        avatarUrl: matchedPhysicalStudent?.avatarUrl
      });
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#e8f1ec]"
      id="login-view-container"
    >
      {/* Dynamic geometrical backgrounds matching low-poly styling */}
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
        className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-100 p-8 relative z-10 space-y-6 animate-in zoom-in-95 duration-200 flex flex-col"
        id="login-card"
      >
        {/* Header Logo */}
        <div className="flex flex-col items-center justify-center space-y-2 pb-1">
          <EvaceLogo size="lg" variant="dark" showText={true} className="flex-col !space-x-0 text-center" />
          <div className="text-[10px] font-black uppercase tracking-widest text-[#0a4d2c] bg-emerald-50 px-4 py-1.5 rounded-full mt-3 border border-emerald-100/30">
            Acesso ao Sistema
          </div>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* USERNAME */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Login / Usuário</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0a4d2c]" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu login da instituição"
                className="w-full pl-9 pr-4 py-2.5 text-xs text-slate-700 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a4d2c] bg-slate-50 font-bold"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Senha secreta</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0a4d2c]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha corporativa"
                className="w-full pl-9 pr-10 py-2.5 text-xs text-slate-700 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a4d2c] bg-slate-50 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#0a4d2c] hover:bg-emerald-800 active:scale-98 text-white font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer mt-5"
          >
            <span>Autenticar no Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* DEFAULT ACCOUNTS SUGGESTIONS ACCORDION */}
        {showQuickTips && (
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/40 p-3.5 space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-850" />
                Dica de Contas Seeded
              </span>
              <button 
                onClick={() => setShowQuickTips(false)}
                className="text-[9px] text-[#0a4d2c] font-black hover:underline cursor-pointer"
              >
                Ocultar
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-1.5 font-mono text-[9px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200/20">
              <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                <span className="font-bold text-slate-700">COORDENAÇÃO (Você)</span>
                <span className="text-emerald-800 font-bold">renan / 88165169</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                <span className="font-bold text-slate-700">Coordenador Secundário</span>
                <span className="text-emerald-800 font-bold">romulo / admin123</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                <span className="font-bold text-slate-700">Professora Patrícia</span>
                <span className="text-emerald-800 font-bold">patricia / 123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Alunos Iniciais</span>
                <span className="text-emerald-800 font-bold">aluno + número / 123 (Ex: romulo1)</span>
              </div>
            </div>
          </div>
        )}

        <div className="text-center pt-2 border-t border-slate-100 flex flex-col gap-0.5">
          <p className="text-[10px] text-gray-400 font-bold font-mono">EVACE Cursos e Treinamentos</p>
          <p className="text-[9px] text-[#0a4d2c] font-black uppercase tracking-widest">Acesso Unificado por Login & Senha</p>
        </div>
      </div>
    </div>
  );
}
