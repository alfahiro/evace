import React from 'react';
import { Home, BookOpen, Calendar, X, Menu, Users, CheckSquare, Award } from 'lucide-react';

interface SidebarProps {
  currentTab: 'turmas' | 'alunos' | 'presenca' | 'notas_disciplinas';
  onChangeTab: (tab: 'turmas' | 'alunos' | 'presenca' | 'notas_disciplinas') => void;
  isOpen: boolean;
  onToggle: (state: boolean) => void;
}

export default function Sidebar({
  currentTab,
  onChangeTab,
  isOpen,
  onToggle
}: SidebarProps) {
  // Classic navigation items matching user intent
  const navItems = [
    { id: 'turmas', label: 'Gerenciar Turmas', icon: Home },
    { id: 'alunos', label: 'Inclusão de Alunos', icon: Users },
    { id: 'presenca', label: 'Controle de Presença', icon: CheckSquare },
    { id: 'notas_disciplinas', label: 'Controle de Disciplinas', icon: Award }
  ] as const;

  if (!isOpen) {
    return (
      <button
        onClick={() => onToggle(true)}
        id="btn-sidebar-trigger-open"
        className="fixed top-20 left-4 z-40 bg-[#0a4d2c] text-white hover:bg-emerald-800 border border-emerald-700 p-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer lg:hidden"
        title="Abrir Menu Administrativo"
      >
        <Menu className="w-5 h-5 stroke-[2.5]" />
        <span className="ml-2 font-bold text-xs uppercase tracking-wider text-white hidden sm:inline-block pr-1">
          Painel Adm
        </span>
      </button>
    );
  }

  return (
    <>
      {/* Dim overlay */}
      <div
        className="fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-30 pointer-events-auto block lg:hidden"
        onClick={() => onToggle(false)}
      />

      <div
        id="evace-navigation-sidebar"
        className="fixed top-20 left-4 z-40 w-64 bg-white border border-slate-100 shadow-2xl rounded-2xl py-4 select-none animate-in slide-in-from-left duration-250 max-h-[calc(100vh-100px)] overflow-y-auto"
      >
        {/* Circular close button */}
        <div className="absolute -top-3 -right-3 lg:hidden">
          <button
            onClick={() => onToggle(false)}
            id="btn-sidebar-close"
            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-100 cursor-pointer border border-white"
            title="Fechar Menu"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Admin Brand */}
        <div className="px-5 pb-3 mb-3 border-b border-slate-100">
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block">Perfil de Acesso</span>
          <span className="text-xs font-extrabold text-[#0a4d2c] bg-emerald-50 px-2 py-1 rounded inline-block mt-1">
            SECRETARIA ACADÊMICA
          </span>
        </div>

        {/* Navigation buttons */}
        <nav className="flex flex-col space-y-1 px-2" id="sidebar-navigation-container">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeTab(item.id);
                  if (window.innerWidth < 1024) {
                    onToggle(false);
                  }
                }}
                id={`nav-item-${item.id}`}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-xs font-extrabold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-[#0a4d2c] border-l-4 border-[#0a4d2c] pl-3 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#0a4d2c]'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 mr-3 ${isActive ? 'text-[#0a4d2c] animate-pulse' : 'text-gray-400'}`} />
                <span className="tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 pt-4 border-t border-slate-50 px-5 text-center">
          <p className="text-[10px] text-gray-400 font-bold">EVACE Cursos e Treinamentos</p>
          <p className="text-[9px] text-[#0a4d2c] font-mono mt-0.5">Módulo de Administração v3.0</p>
        </div>
      </div>
    </>
  );
}
