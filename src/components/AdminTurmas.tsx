import React, { useState } from 'react';
import { PlusCircle, GraduationCap, Users, BookOpen, Trash2, Calendar, FilePlus, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';
import { Turma, Student, Module } from '../types';

interface AdminTurmasProps {
  turmas: Turma[];
  students: Student[];
  modules: Module[];
  onAddTurma: (turma: Omit<Turma, 'id'>) => void;
  onDeleteTurma: (id: string) => void;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onAddModule: (module: Omit<Module, 'id'>) => void;
  onDeleteModule: (id: string) => void;
}

export default function AdminTurmas({
  turmas,
  students,
  modules,
  onAddTurma,
  onDeleteTurma,
  onAddStudent,
  onAddModule,
  onDeleteModule
}: AdminTurmasProps) {
  const [showAddTurma, setShowAddTurma] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newCategory, setNewCategory] = useState<'UTI' | 'Urgência' | 'Dermatologia' | 'Geral'>('Geral');

  // Active expanded class state
  const [expandedTurmaId, setExpandedTurmaId] = useState<string | null>(null);

  // Quick enroll student states
  const [quickStudentName, setQuickStudentName] = useState('');
  const [quickStudentEmail, setQuickStudentEmail] = useState('');
  const [quickStudentPhone, setQuickStudentPhone] = useState('');

  // Quick add module states
  const [quickModuleTitle, setQuickModuleTitle] = useState('');
  const [quickModuleProfessor, setQuickModuleProfessor] = useState('');
  const [quickModuleWorkload, setQuickModuleWorkload] = useState(40);
  const [quickModuleStatus, setQuickModuleStatus] = useState<'concluido' | 'em_andamento' | 'agendado'>('agendado');

  // Custom confirmation state for deletions
  const [confirmDeleteTurmaId, setConfirmDeleteTurmaId] = useState<string | null>(null);
  const [confirmDeleteModuleId, setConfirmDeleteModuleId] = useState<string | null>(null);

  const handleSubmitTurma = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) return;

    onAddTurma({
      title: newTitle.trim(),
      code: newCode.trim(),
      number: newNumber.trim() || `Turma: 2026.1.${Math.floor(Math.random() * 90000 + 10000)}.00002`,
      category: newCategory
    });

    // Reset
    setNewTitle('');
    setNewCode('');
    setNewNumber('');
    setShowAddTurma(false);
  };

  const handleQuickStudent = (e: React.FormEvent, turmaId: string) => {
    e.preventDefault();
    if (!quickStudentName.trim()) return;

    onAddStudent({
      name: quickStudentName.trim(),
      email: quickStudentEmail.trim() || `${quickStudentName.toLowerCase().replace(/\s+/g, '.')}@fiponline.edu.br`,
      phone: quickStudentPhone.trim() || '(83) 99999-0000',
      enrollmentId: `FIP-2026-${Math.floor(Math.random() * 8900 + 1000)}`,
      turmaId
    });

    setQuickStudentName('');
    setQuickStudentEmail('');
    setQuickStudentPhone('');
  };

  const handleQuickModule = (e: React.FormEvent, turmaId: string) => {
    e.preventDefault();
    if (!quickModuleTitle.trim() || !quickModuleProfessor.trim()) return;

    onAddModule({
      title: quickModuleTitle.trim(),
      professor: quickModuleProfessor.trim(),
      workload: Number(quickModuleWorkload),
      status: quickModuleStatus,
      turmaId
    });

    setQuickModuleTitle('');
    setQuickModuleProfessor('');
    setQuickModuleWorkload(40);
  };

  return (
    <div className="space-y-6" id="admin-turmas-viewport">
      {/* KPI stats overview panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-[#0a4d2c] rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-bold uppercase">Total de Turmas</span>
            <span className="text-xl font-extrabold text-slate-800">{turmas.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-bold uppercase">Alunos Ativos</span>
            <span className="text-xl font-extrabold text-slate-800">{students.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-bold uppercase">Disciplinas Alocadas</span>
            <span className="text-xl font-extrabold text-slate-800">{modules.length}</span>
          </div>
        </div>
      </div>

      {/* Main functional title banner */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-[#0a4d2c]" />
              Painel de Turmas e Especializações
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Cadastre, liste e configure turmas acadêmicas. Clique em uma turma abaixo para expandir e gerenciar alunos ou incluir disciplinas.
            </p>
          </div>

          <button
            onClick={() => setShowAddTurma(!showAddTurma)}
            className="px-4 py-2 bg-[#0a4d2c] hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cadastrar Nova Turma</span>
          </button>
        </div>

        {/* Collapsible New Turma form */}
        {showAddTurma && (
          <form 
            onSubmit={handleSubmitTurma}
            className="border border-blue-100 bg-blue-50/10 rounded-xl p-5 space-y-4 animate-in slide-in-from-top-3 duration-200"
          >
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Nova Especialização Acadêmica</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">Título do Curso *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Enfermagem em Obstetrícia"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">Código Curricular *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 2026.1"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">Identificador de Turma</label>
                <input
                  type="text"
                  placeholder="Ex: Turma: 2026.1.138.00001"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">Área Temática / Categoria</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-medium"
                >
                  <option value="UTI">UTI (Unidade de Terapia Intensiva)</option>
                  <option value="Urgência">Urgência e Emergência</option>
                  <option value="Dermatologia">Dermatologia</option>
                  <option value="Geral">Área Geral / Saúde</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddTurma(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50 transition-all font-semibold"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                Salvar Nova Turma
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Grid listing of all Turmas with Expandable details for enrollment/discipline addition */}
      <div className="space-y-4">
        {turmas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-emerald-50 text-[#0a4d2c] rounded-full">
              <GraduationCap className="w-8 h-8 stroke-1" />
            </div>
            <div className="max-w-md">
              <h3 className="font-bold text-slate-800 text-sm">Nenhuma Turma Cadastrada</h3>
              <p className="text-xs text-gray-400 mt-1">
                A lista de turmas cadastradas está vazia. Clique em "Cadastrar Nova Turma" acima para criar e organizar a primeira especialização acadêmica.
              </p>
            </div>
          </div>
        ) : (
          turmas.map((turma) => {
            const isExpanded = expandedTurmaId === turma.id;
            const classStudents = students.filter(s => s.turmaId === turma.id);
            const classModules = modules.filter(m => m.turmaId === turma.id);

            return (
              <div 
                key={turma.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden transition-all duration-200"
              >
                {/* Turma Header Panel (Click to expand) */}
                <div 
                  onClick={() => setExpandedTurmaId(isExpanded ? null : turma.id)}
                  className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-emerald-50/10 transition-colors select-none"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-emerald-600/10 text-[#0a4d2c] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                        {turma.category}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-gray-500">Cód: {turma.code}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-sm leading-snug group-hover:text-[#0a4d2c]">
                      {turma.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-mono font-medium">{turma.number}</p>
                  </div>

                  <div className="flex items-center space-x-6 self-stretch justify-between sm:self-auto sm:justify-end">
                    <div className="flex items-center space-x-4 text-xs font-semibold text-slate-600">
                      <span className="flex items-center" title="Alunos inscritos">
                        <Users className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {classStudents.length}
                      </span>
                      <span className="flex items-center" title="Disciplines na grade">
                        <BookOpen className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {classModules.length}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {confirmDeleteTurmaId === turma.id ? (
                        <div className="flex items-center space-x-1.5 bg-red-50 px-2 py-1 rounded-lg border border-red-100 animate-in fade-in zoom-in-95 duration-150">
                          <span className="text-[10px] font-bold text-red-700 whitespace-nowrap">Excluir?</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTurma(turma.id);
                              setConfirmDeleteTurmaId(null);
                            }}
                            className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[9px] rounded uppercase cursor-pointer"
                          >
                            Sim
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteTurmaId(null);
                            }}
                            className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[9px] rounded uppercase cursor-pointer"
                          >
                            Não
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteTurmaId(turma.id);
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Turma"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <div className="p-1 rounded-full hover:bg-slate-100 text-[#0a4d2c]">
                        {isExpanded ? <ChevronUp className="w-5 h-5 stroke-[2.5]" /> : <ChevronDown className="w-5 h-5 stroke-[2.5]" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collapsed/Expanded detailed administrative workspace */}
                {isExpanded && (
                  <div className="border-t border-slate-50 bg-slate-50/50 p-6 space-y-6">
                    
                    {/* Grid separated: Left is Alunos list & add / Right is Disciplines list & add */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* ENROLLED STUDENTS SUB-PANEL */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-50 space-y-4 shadow-2xs">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <span className="text-xs font-extrabold text-slate-800 uppercase flex items-center pr-2">
                            <Users className="w-4 h-4 mr-1.5 text-slate-500" /> Inscrever Aluno na Turma
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                            {classStudents.length} inscritos
                          </span>
                        </div>

                        {/* Add student inline form */}
                        <form onSubmit={(e) => handleQuickStudent(e, turma.id)} className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Nome Completo do Aluno *"
                              value={quickStudentName}
                              onChange={(e) => setQuickStudentName(e.target.value)}
                              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-slate-55"
                            />
                            <input
                              type="email"
                              placeholder="Email (Opcional)"
                              value={quickStudentEmail}
                              onChange={(e) => setQuickStudentEmail(e.target.value)}
                              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-slate-55"
                            />
                          </div>
                          <div className="flex gap-2.5">
                            <input
                              type="text"
                              placeholder="Celular (Ex: 83 99999-8888)"
                              value={quickStudentPhone}
                              onChange={(e) => setQuickStudentPhone(e.target.value)}
                              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-slate-55"
                            />
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
                            >
                              <FilePlus className="w-3.5 h-3.5" />
                              <span>Inscrever</span>
                            </button>
                          </div>
                        </form>

                        {/* Display current roster */}
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {classStudents.length === 0 ? (
                            <div className="py-6 text-center text-gray-400 text-xs">Nenhum aluno cadastrado para esta turma.</div>
                          ) : (
                            classStudents.map(student => (
                              <div key={student.id} className="flex justify-between items-center text-xs p-2 hover:bg-slate-50 rounded-lg border border-slate-50">
                                <div>
                                  <span className="font-bold text-slate-700 block">{student.name}</span>
                                  <span className="text-[10px] font-mono text-gray-400">{student.enrollmentId} • {student.email}</span>
                                </div>
                                <span className="text-[9px] bg-slate-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase shrink-0">
                                  Matriculado
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* CONFIGURED DISCIPLES SUB-PANEL */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-50 space-y-4 shadow-2xs">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <span className="text-xs font-extrabold text-slate-800 uppercase flex items-center pr-2">
                            <BookOpen className="w-4 h-4 mr-1.5 text-slate-500" /> Cadastrar Disciplina Curricular
                          </span>
                          <span className="text-[10px] bg-emerald-50 text-[#0a4d2c] font-bold px-2 py-0.5 rounded-full">
                            {classModules.length} matérias
                          </span>
                        </div>

                        {/* Add module inline form */}
                        <form onSubmit={(e) => handleQuickModule(e, turma.id)} className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Nome da Disciplina *"
                              value={quickModuleTitle}
                              onChange={(e) => setQuickModuleTitle(e.target.value)}
                              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c]"
                            />
                            <input
                              type="text"
                              required
                              placeholder="Professor(a) Titular *"
                              value={quickModuleProfessor}
                              onChange={(e) => setQuickModuleProfessor(e.target.value)}
                              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c]"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 shrink-0 flex items-center">
                              <input
                                type="number"
                                required
                                min={10}
                                max={120}
                                placeholder="H"
                                value={quickModuleWorkload}
                                onChange={(e) => setQuickModuleWorkload(Number(e.target.value))}
                                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c]"
                              />
                              <span className="text-[10px] text-gray-500 font-bold ml-1">Horas</span>
                            </div>

                            <select
                              value={quickModuleStatus}
                              onChange={(e) => setQuickModuleStatus(e.target.value as any)}
                              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-white font-medium text-slate-700"
                            >
                              <option value="agendado">Agendado (Em breve)</option>
                              <option value="em_andamento">Ativo (Em Andamento)</option>
                              <option value="concluido">Concluído</option>
                            </select>

                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-[#0a4d2c] hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-all flex items-center space-x-1 cursor-pointer shrink-0"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>Adicionar</span>
                            </button>
                          </div>
                        </form>

                        {/* Display current disciplines */}
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {classModules.length === 0 ? (
                            <div className="py-6 text-center text-gray-400 text-xs">Nenhuma disciplina cadastrada na grade curricular desta turma.</div>
                          ) : (
                            classModules.map(mod => (
                              <div key={mod.id} className="flex justify-between items-center text-xs p-2 hover:bg-slate-50 rounded-lg border border-slate-50">
                                <div>
                                  <span className="font-bold text-slate-700 block">{mod.title}</span>
                                  <span className="text-[10px] text-gray-400 block font-medium">Prof: {mod.professor} • Carga: {mod.workload}h</span>
                                </div>
                                <div className="flex items-center space-x-2 shrink-0">
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                    mod.status === 'concluido' ? 'bg-emerald-50 text-emerald-700' :
                                    mod.status === 'em_andamento' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {mod.status === 'concluido' ? 'Concluído' :
                                     mod.status === 'em_andamento' ? 'Ativo' : 'Agendado'}
                                  </span>
                                  {confirmDeleteModuleId === mod.id ? (
                                    <div className="flex items-center space-x-1 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 animate-in fade-in zoom-in-95 duration-150">
                                      <span className="text-[9px] font-bold text-red-700 whitespace-nowrap">Excluir?</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onDeleteModule(mod.id);
                                          setConfirmDeleteModuleId(null);
                                        }}
                                        className="px-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[8px] rounded uppercase cursor-pointer"
                                      >
                                        Sim
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setConfirmDeleteModuleId(null);
                                        }}
                                        className="px-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[8px] rounded uppercase cursor-pointer"
                                      >
                                        Não
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmDeleteModuleId(mod.id);
                                      }}
                                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                      title="Excluir Disciplina"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
