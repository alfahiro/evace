import React, { useState } from 'react';
import { PlusCircle, Search, Users, Trash2, Mail, Phone, BookOpen, UserPlus, Sparkles } from 'lucide-react';
import { Student, Turma } from '../types';

interface AdminAlunosProps {
  students: Student[];
  turmas: Turma[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: string) => void;
}

export default function AdminAlunos({
  students,
  turmas,
  onAddStudent,
  onDeleteStudent
}: AdminAlunosProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurmaFilter, setSelectedTurmaFilter] = useState<string>('Todos');
  const [confirmDeleteStudentId, setConfirmDeleteStudentId] = useState<string | null>(null);

  // New Student state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [targetTurmaId, setTargetTurmaId] = useState('');

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetTurmaId) return;

    onAddStudent({
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@fiponline.edu.br`,
      phone: phone.trim() || '(83) 99999-0000',
      enrollmentId: `FIP-2026-${Math.floor(Math.random() * 8900 + 1000)}`,
      turmaId: targetTurmaId
    });

    // Reset fields
    setName('');
    setEmail('');
    setPhone('');
    setTargetTurmaId('');
    setShowAddForm(false);
  };

  const getClassName = (id: string) => {
    const found = turmas.find(t => t.id === id);
    return found ? found.title : 'Turma Não Identificada';
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTurma = selectedTurmaFilter === 'Todos' || student.turmaId === selectedTurmaFilter;
    return matchesSearch && matchesTurma;
  });

  return (
    <div className="space-y-6" id="admin-alunos-tab">
      {/* Filtering and Adding Controls Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-50 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-[#0a4d2c]" />
              Inclusão & Diretório de Alunos
            </h2>
            <p className="text-xs text-gray-400 mt-1">Inscreva novos acadêmicos e gerencie cadastros vinculados às especializações da EVACE.</p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-[#0a4d2c] hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cadastrar Aluno</span>
          </button>
        </div>

        {/* Collapsible Student Form */}
        {showAddForm && (
          <form 
            onSubmit={handleCreateStudent}
            className="border border-emerald-100 bg-emerald-50/10 rounded-xl p-5 space-y-4 animate-in slide-in-from-top-3 duration-200"
          >
            <h3 className="text-xs font-extrabold text-[#0a4d2c] uppercase tracking-wider flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-[#0a4d2c]" /> Registro para Ficha Cadastral Acadêmica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block">Nome do Estudante *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rômulo Carriello"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0a4d2c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block">E-mail Acadêmico</label>
                <input
                  type="email"
                  placeholder="Ex: romulo@evace.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0a4d2c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block">Celular / Contato</label>
                <input
                  type="text"
                  placeholder="Ex: (83) 99847-1122"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0a4d2c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block font-bold">Turma de Vínculo *</label>
                <select
                  required
                  value={targetTurmaId}
                  onChange={(e) => setTargetTurmaId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-semibold focus:outline-none focus:border-[#0a4d2c]"
                >
                  <option value="">Selecione uma Turma Ativa...</option>
                  {turmas.map(t => (
                    <option key={t.id} value={t.id}>
                      [{t.category}] {t.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50 transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                Inscrever Aluno Regular
              </button>
            </div>
          </form>
        )}

        {/* Filter and Search controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Procurar aluno por nome ou número de matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-[#0a4d2c]"
            />
          </div>

          {/* Selection dropdown filter */}
          <div className="w-full sm:w-64">
            <select
              value={selectedTurmaFilter}
              onChange={(e) => setSelectedTurmaFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-600 font-bold focus:outline-none focus:border-[#0a4d2c]"
            >
              <option value="Todos">Filtrar por Turmas: Todas</option>
              {turmas.map(t => (
                <option key={t.id} value={t.id}>({t.category}) {t.title.slice(0, 30)}...</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Roster list Grid/Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs">
            <Users className="w-12 h-12 stroke-1 text-gray-300 mx-auto mb-2" />
            Nenhum aluno localizado neste escopo de pesquisa.
          </div>
        ) : (
          <>
            {/* Desktop and Widescreen Tablet Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0a4d2c] text-white text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-3.5 px-5">Estudante / Matrícula</th>
                    <th className="py-3.5 px-4">E-mail Acadêmico</th>
                    <th className="py-3.5 px-4">Telefone</th>
                    <th className="py-3.5 px-4">Especialização Inscrita</th>
                    <th className="py-3.5 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredStudents.map((stud) => (
                    <tr key={stud.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0a4d2c] to-emerald-400 text-white font-black flex items-center justify-center text-[11px] border border-white shrink-0">
                            {stud.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-800 block leading-tight">{stud.name}</span>
                            <span className="text-[10px] font-mono font-medium text-gray-400 uppercase">{stud.enrollmentId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="flex items-center text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                          {stud.email}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        <span className="flex items-center">
                          <Phone className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                          {stud.phone || 'Sem contato'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-1 rounded inline-block max-w-[200px] truncate leading-none text-[10px]">
                          {getClassName(stud.turmaId)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {confirmDeleteStudentId === stud.id ? (
                          <div className="inline-flex items-center space-x-1.5 bg-red-50 px-2 py-1 rounded-lg border border-red-100 animate-in fade-in zoom-in-95 duration-150">
                            <span className="text-[10px] font-bold text-red-700 whitespace-nowrap">Excluir?</span>
                            <button
                              onClick={() => {
                                onDeleteStudent(stud.id);
                                setConfirmDeleteStudentId(null);
                              }}
                              className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[9px] rounded uppercase cursor-pointer"
                            >
                              Sim
                            </button>
                            <button
                              onClick={() => setConfirmDeleteStudentId(null)}
                              className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[9px] rounded uppercase cursor-pointer"
                            >
                              Não
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteStudentId(stud.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer inline-block"
                            title="Desvincular Aluno"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile and Compact Tablet Cards View */}
            <div className="md:hidden grid grid-cols-1 gap-3 p-4 bg-slate-50/50">
              {filteredStudents.map((stud) => (
                <div 
                  key={stud.id}
                  className="bg-white rounded-xl border border-slate-100 p-4 shadow-2xs flex flex-col space-y-3 animate-in fade-in duration-150"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0a4d2c] to-emerald-400 text-white font-black flex items-center justify-center text-xs border border-white shrink-0">
                        {stud.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800 block text-xs leading-tight">{stud.name}</span>
                        <span className="text-[9px] font-mono font-semibold text-gray-400 uppercase">{stud.enrollmentId}</span>
                      </div>
                    </div>
                    
                    {/* Action delete toggle */}
                    <div className="shrink-0">
                      {confirmDeleteStudentId === stud.id ? (
                        <div className="flex items-center space-x-1 bg-red-50 px-1.5 py-1 rounded-lg border border-red-100 animate-in fade-in zoom-in-95 duration-100">
                          <button
                            onClick={() => {
                              onDeleteStudent(stud.id);
                              setConfirmDeleteStudentId(null);
                            }}
                            className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[9px] rounded uppercase cursor-pointer"
                          >
                            Sim
                          </button>
                          <button
                            onClick={() => setConfirmDeleteStudentId(null)}
                            className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[9px] rounded uppercase cursor-pointer"
                          >
                            Não
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteStudentId(stud.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90 cursor-pointer"
                          title="Desvincular Aluno"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-xs border-t border-slate-100 pt-2.5 text-slate-600">
                    <div className="flex items-center min-w-0">
                      <Mail className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                      <span className="truncate text-[11px] font-medium">{stud.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                      <span className="text-[11px] font-medium">{stud.phone || 'Sem contato'}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50/80 p-2.5 rounded-lg flex flex-col gap-1">
                    <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Especialização Vínculo</span>
                    <span className="text-[#0a4d2c] font-extrabold text-[11px] truncate leading-tight">
                      {getClassName(stud.turmaId)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
