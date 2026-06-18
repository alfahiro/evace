import React, { useState } from 'react';
import { 
  PlusCircle, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Trash2, 
  Calendar, 
  FilePlus, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Sparkles, 
  X, 
  FolderOpen, 
  FileText, 
  UploadCloud, 
  Search, 
  FolderPlus, 
  HardDrive 
} from 'lucide-react';
import { Turma, Student, Module, FolderItem } from '../types';

interface AdminTurmasProps {
  turmas: Turma[];
  students: Student[];
  modules: Module[];
  onAddTurma: (turma: Omit<Turma, 'id'>) => void;
  onDeleteTurma: (id: string) => void;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onAddModule: (module: Omit<Module, 'id'>) => void;
  onDeleteModule: (id: string) => void;
  onUpdateTurma: (turma: Turma) => void;
}

export default function AdminTurmas({
  turmas,
  students,
  modules,
  onAddTurma,
  onDeleteTurma,
  onAddStudent,
  onAddModule,
  onDeleteModule,
  onUpdateTurma
}: AdminTurmasProps) {
  const [showAddTurma, setShowAddTurma] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newCategory, setNewCategory] = useState<'UTI' | 'Urgência' | 'Dermatologia' | 'Geral'>('Geral');

  // Selected class for administrative floating workspace modal
  const [activeTurmaIdForModal, setActiveTurmaIdForModal] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'students' | 'modules' | 'folder'>('students');

  // File system management states
  const [foldSearchQuery, setFoldSearchQuery] = useState('');
  const [newSubfolderName, setNewSubfolderName] = useState('');
  const [showNewSubfolderInput, setShowNewSubfolderInput] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string>('root');
  const [newFileName, setNewFileName] = useState('');
  const [newFileSize, setNewFileSize] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);

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

  const handleCreateFolder = (selectedTurma: Turma) => {
    if (!newSubfolderName.trim()) return;
    const nowStr = new Date().toLocaleDateString('pt-BR');
    const newFolder: FolderItem = {
      id: `fld_user_${Date.now()}`,
      name: `📁 ${newSubfolderName.trim()}`,
      type: 'folder',
      updatedAt: nowStr
    };

    const currentFolders = selectedTurma.folders || [];
    const updatedTurma: Turma = {
      ...selectedTurma,
      folders: [...currentFolders, newFolder]
    };

    onUpdateTurma(updatedTurma);
    setNewSubfolderName('');
    setShowNewSubfolderInput(false);
  };

  const handleCreateFile = (selectedTurma: Turma) => {
    if (!newFileName.trim()) return;
    const nowStr = new Date().toLocaleDateString('pt-BR');
    
    let rawName = newFileName.trim();
    if (!rawName.startsWith('📄 ') && !rawName.startsWith('📅 ') && !rawName.startsWith('📋 ')) {
      rawName = '📄 ' + rawName;
    }
    if (!rawName.includes('.')) {
      rawName += '.pdf';
    }

    const calculatedSize = newFileSize.trim() || `${Math.floor(Math.random() * 8 + 1)}.${Math.floor(Math.random() * 9)} MB`;

    const newFile: FolderItem = {
      id: `file_user_${Date.now()}`,
      name: rawName,
      type: 'file',
      size: calculatedSize,
      parentId: selectedParentId === 'root' ? undefined : selectedParentId,
      updatedAt: nowStr
    };

    const currentFolders = selectedTurma.folders || [];
    const updatedTurma: Turma = {
      ...selectedTurma,
      folders: [...currentFolders, newFile]
    };

    onUpdateTurma(updatedTurma);
    setNewFileName('');
    setNewFileSize('');
    setShowNewFileInput(false);
  };

  const handleDeleteFolderItem = (selectedTurma: Turma, itemId: string) => {
    const currentFolders = selectedTurma.folders || [];
    const updatedFolders = currentFolders.filter(item => item.id !== itemId && item.parentId !== itemId);
    
    const updatedTurma: Turma = {
      ...selectedTurma,
      folders: updatedFolders
    };

    onUpdateTurma(updatedTurma);
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

      {/* Grid listing of all Turmas with floating workspace detail modal */}
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
            const classStudents = students.filter(s => s.turmaId === turma.id);
            const classModules = modules.filter(m => m.turmaId === turma.id);

            return (
              <div 
                key={turma.id}
                onClick={() => {
                  setActiveTurmaIdForModal(turma.id);
                  setModalTab('students');
                }}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden hover:border-emerald-700/30 transition-all duration-200 cursor-pointer hover:shadow-md hover:translate-y-[-1px] select-none group"
              >
                {/* Turma Header Panel - Clean and Compact */}
                <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#0a4d2c]/10 text-[#0a4d2c] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                        {turma.category}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-gray-500">Cód: {turma.code}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-sm leading-snug group-hover:text-[#0b4e2d] transition-colors">
                      {turma.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-mono font-medium">{turma.number}</p>
                  </div>

                  <div className="flex items-center space-x-6 self-stretch justify-between sm:self-auto sm:justify-end">
                    {/* Size 3x3 simple clean indicators as requested */}
                    <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTurmaIdForModal(turma.id);
                          setModalTab('students');
                        }}
                        className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-emerald-50 rounded-lg border border-slate-100 hover:border-emerald-700/20 transition-all cursor-pointer group/btn active:scale-95"
                        title="Ver alunos matriculados"
                      >
                        <Users className="w-3 h-3 text-slate-400 group-hover/btn:text-emerald-700 transition-colors" />
                        <span className="text-[11px] font-bold text-slate-600 group-hover/btn:text-emerald-800">{classStudents.length}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTurmaIdForModal(turma.id);
                          setModalTab('modules');
                        }}
                        className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-emerald-50 rounded-lg border border-slate-100 hover:border-emerald-700/20 transition-all cursor-pointer group/btn active:scale-95"
                        title="Ver disciplinas curriculares"
                      >
                        <BookOpen className="w-3 h-3 text-slate-400 group-hover/btn:text-emerald-700 transition-colors" />
                        <span className="text-[11px] font-bold text-slate-600 group-hover/btn:text-emerald-800">{classModules.length}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTurmaIdForModal(turma.id);
                          setModalTab('folder');
                        }}
                        className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-indigo-50/80 hover:bg-indigo-100/80 rounded-lg border border-indigo-100 transition-all cursor-pointer group/btn active:scale-95"
                        title={`Ver pasta de arquivos da turma (${(turma.folders || []).length} itens)`}
                      >
                        <FolderOpen className="w-3 h-3 text-indigo-500 group-hover/btn:text-indigo-600 transition-colors" />
                        <span className="text-[11px] font-bold text-indigo-700 group-hover/btn:text-indigo-900">
                          {(turma.folders || []).filter(f => f.type === 'file').length} Arqs
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {confirmDeleteTurmaId === turma.id ? (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center space-x-1.5 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100 animate-in fade-in zoom-in-95 duration-150"
                        >
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
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Unified Floating Administrative Workspace Modal */}
      {activeTurmaIdForModal && (() => {
        const selectedTurma = turmas.find(t => t.id === activeTurmaIdForModal);
        if (!selectedTurma) return null;

        const classStudents = students.filter(s => s.turmaId === selectedTurma.id);
        const classModules = modules.filter(m => m.turmaId === selectedTurma.id);

        return (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-250">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
              
              {/* Header */}
              <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100 flex justify-between items-start shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#0a4d2c]/10 text-[#0a4d2c] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                      {selectedTurma.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-gray-500">Cód: {selectedTurma.code}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-800 leading-snug">
                    {selectedTurma.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono font-medium">{selectedTurma.number}</p>
                </div>
                <button
                  onClick={() => setActiveTurmaIdForModal(null)}
                  className="p-2 hover:bg-slate-200/50 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs Switcher for Modal */}
              <div className="px-6 bg-slate-50/20 border-b border-slate-100 flex space-x-1 shrink-0">
                <button
                  onClick={() => setModalTab('students')}
                  className={`py-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    modalTab === 'students'
                      ? 'border-[#0a4d2c] text-[#0a4d2c]'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Alunos Inscritos ({classStudents.length})</span>
                </button>

                <button
                  onClick={() => setModalTab('modules')}
                  className={`py-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    modalTab === 'modules'
                      ? 'border-[#0a4d2c] text-[#0a4d2c]'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Grade de Disciplinas ({classModules.length})</span>
                </button>

                <button
                  onClick={() => setModalTab('folder')}
                  className={`py-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    modalTab === 'folder'
                      ? 'border-[#0a4d2c] text-[#0a4d2c]'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">Pasta de Documentos ({(selectedTurma.folders || []).length})</span>
                </button>
              </div>

              {/* Scrollable Content Workspace */}
              <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-5 bg-white">
                
                {/* STUDENTS WORKSPACE */}
                {modalTab === 'students' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Add student inline form */}
                    <div className="bg-slate-50/60 rounded-2xl border border-slate-100 p-4 space-y-3">
                      <span className="text-[10px] font-extrabold text-slate-700 uppercase block tracking-wider">
                        Inscrever Novo Aluno
                      </span>
                      <form onSubmit={(e) => handleQuickStudent(e, selectedTurma.id)} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Nome Completo do Aluno *"
                            value={quickStudentName}
                            onChange={(e) => setQuickStudentName(e.target.value)}
                            className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-white transition-colors"
                          />
                          <input
                            type="email"
                            placeholder="Email (Opcional)"
                            value={quickStudentEmail}
                            onChange={(e) => setQuickStudentEmail(e.target.value)}
                            className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-white transition-colors"
                          />
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Celular (Ex: 83 99999-8888)"
                            value={quickStudentPhone}
                            onChange={(e) => setQuickStudentPhone(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-white transition-colors"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
                          >
                            <FilePlus className="w-3.5 h-3.5" />
                            <span>Inscrever</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Display current roster */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase block tracking-wider">
                        Estudantes Matriculados
                      </span>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {classStudents.length === 0 ? (
                          <div className="py-10 text-center text-gray-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                            Nenhum aluno inscrito nesta turma ainda. Use o formulário acima para efetuar a primeira matrícula.
                          </div>
                        ) : (
                          classStudents.map(student => (
                            <div 
                              key={student.id} 
                              className="flex justify-between items-center text-xs p-3 hover:bg-slate-50/80 rounded-xl border border-slate-100 shadow-3xs bg-white"
                            >
                              <div>
                                <span className="font-extrabold text-slate-800 block">{student.name}</span>
                                <span className="text-[10px] font-mono text-gray-400 mt-0.5 block">
                                  Matrícula: {student.enrollmentId} • {student.email}
                                </span>
                                {student.phone && (
                                  <span className="text-[10px] text-slate-500 mt-0.5 block">{student.phone}</span>
                                )}
                              </div>
                              <span className="text-[9px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-extrabold uppercase shrink-0">
                                Ativo
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* DISCIPLINE grade WORKSPACE */}
                {modalTab === 'modules' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Add module inline form */}
                    <div className="bg-slate-50/60 rounded-2xl border border-slate-100 p-4 space-y-3">
                      <span className="text-[10px] font-extrabold text-slate-700 uppercase block tracking-wider">
                        Cadastrar Nova Disciplina
                      </span>
                      <form onSubmit={(e) => handleQuickModule(e, selectedTurma.id)} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Nome da Disciplina *"
                            value={quickModuleTitle}
                            onChange={(e) => setQuickModuleTitle(e.target.value)}
                            className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-white text-slate-800"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Professor(a) Titular *"
                            value={quickModuleProfessor}
                            onChange={(e) => setQuickModuleProfessor(e.target.value)}
                            className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-white text-slate-800"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <div className="w-full sm:w-28 shrink-0 flex items-center">
                            <input
                              type="number"
                              required
                              min={10}
                              max={120}
                              placeholder="H"
                              value={quickModuleWorkload}
                              onChange={(e) => setQuickModuleWorkload(Number(e.target.value))}
                              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-white"
                            />
                            <span className="text-[10px] text-gray-500 font-bold ml-1.5">Horas</span>
                          </div>

                          <select
                            value={quickModuleStatus}
                            onChange={(e) => setQuickModuleStatus(e.target.value as any)}
                            className="w-full sm:flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-white font-medium text-slate-755"
                          >
                            <option value="agendado">Agendado (Em breve)</option>
                            <option value="em_andamento">Ativo (Em Andamento)</option>
                            <option value="concluido">Concluído</option>
                          </select>

                          <button
                            type="submit"
                            className="w-full sm:w-auto px-4 py-2 bg-[#0a4d2c] hover:bg-[#083b22]/90 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer shrink-0"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Adicionar</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Display current disciplines */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase block tracking-wider">
                        Grade Curricular Atual
                      </span>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {classModules.length === 0 ? (
                          <div className="py-10 text-center text-gray-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                            Nenhuma disciplina cadastrada na grade curricular desta turma ainda. Use o formulário acima para adicionar.
                          </div>
                        ) : (
                          classModules.map(mod => (
                            <div 
                              key={mod.id} 
                              className="flex justify-between items-center text-xs p-3 hover:bg-slate-50/80 rounded-xl border border-slate-100 shadow-3xs bg-white"
                            >
                              <div>
                                <span className="font-extrabold text-slate-800 block text-xs">{mod.title}</span>
                                <span className="text-[10px] text-gray-400 block font-medium mt-0.5">
                                  Prof: <span className="font-semibold text-slate-700">{mod.professor}</span>
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                                  Carga Horária: {mod.workload}h
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 shrink-0">
                                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
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
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
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
                )}

                {/* DOCUMENT DRIVE WORKSPACE */}
                {modalTab === 'folder' && (
                  <div className="space-y-4 animate-in fade-in duration-200 text-left">
                    {/* Folder explanation alert */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-950 p-4 rounded-2xl border border-indigo-100 flex items-start space-x-3 shadow-xs">
                      <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl mt-0.5 shrink-0">
                        <FolderOpen className="w-4 h-4" />
                      </div>
                      <div className="text-xs space-y-1">
                        <span className="font-extrabold text-indigo-900 block">Pasta Digital da Turma Ativa</span>
                        <p className="text-slate-600 leading-relaxed leading-[1.4]">
                          Esta pasta é de criação automática ao cadastrar a turma <strong className="text-indigo-950 font-bold">{selectedTurma.code}</strong>. Use este workspace centralizador para anexar, gerenciar e revisar toda a documentação da especialização.
                        </p>
                      </div>
                    </div>

                    {/* Controls Row: Search, Create Folder, Upload File */}
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                      <div className="flex-1 relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Buscar documentos..."
                          value={foldSearchQuery}
                          onChange={(e) => setFoldSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white text-slate-800"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewSubfolderInput(!showNewSubfolderInput);
                            setShowNewFileInput(false);
                          }}
                          className={`px-3 py-2 text-xs font-bold rounded-xl border border-indigo-200 flex items-center space-x-1.5 transition-all text-indigo-600 hover:bg-indigo-50 cursor-pointer ${
                            showNewSubfolderInput ? 'bg-indigo-100' : 'bg-white'
                          }`}
                        >
                          <FolderPlus className="w-3.5 h-3.5" />
                          <span>Nova Pasta</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowNewFileInput(!showNewFileInput);
                            setShowNewSubfolderInput(false);
                          }}
                          className={`px-3 py-2 text-xs font-bold rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-all flex items-center space-x-1.5 cursor-pointer ${
                            showNewFileInput ? 'bg-emerald-100' : 'bg-white'
                          }`}
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Adicionar Arquivo</span>
                        </button>
                      </div>
                    </div>

                    {/* Expandable Form: Create Folder */}
                    {showNewSubfolderInput && (
                      <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-3 animate-in slide-in-from-top-1 duration-200">
                        <span className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-wider block">Criar Subpasta Administrativa</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ex: Contratos de Estágio, Relatórios Finais"
                            value={newSubfolderName}
                            onChange={(e) => setNewSubfolderName(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500 text-slate-800"
                          />
                          <button
                            type="button"
                            onClick={() => handleCreateFolder(selectedTurma)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                          >
                            Criar Pasta
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Expandable Form: Upload File */}
                    {showNewFileInput && (
                      <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-3 animate-in slide-in-from-top-1 duration-200">
                        <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Importar Documento Técnico / PDF</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Nome do Arquivo (Ex: Cronograma_Equipamentos.pdf)"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-500 text-slate-800"
                          />
                          <input
                            type="text"
                            placeholder="Tamanho (Opcional, Ex: 1.5 MB)"
                            value={newFileSize}
                            onChange={(e) => setNewFileSize(e.target.value)}
                            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-500 text-slate-800"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 items-center">
                          <div className="w-full sm:flex-1 shrink-0 flex items-center">
                            <span className="text-[10px] text-gray-500 font-bold mr-2 whitespace-nowrap">Local de Destino:</span>
                            <select
                              value={selectedParentId}
                              onChange={(e) => setSelectedParentId(e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800"
                            >
                              <option value="root">Raiz da Pasta (/)</option>
                              {(selectedTurma.folders || [])
                                .filter(item => item.type === 'folder')
                                .map(fold => (
                                  <option key={fold.id} value={fold.id}>
                                    {fold.name.replace('📁 ', '')}
                                  </option>
                                ))
                              }
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCreateFile(selectedTurma)}
                            className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                          >
                            Importar para a Pasta
                          </button>
                        </div>
                      </div>
                    )}

                    {/* File system file render list hierarchy */}
                    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-3xs">
                      {/* Active directory hierarchy structure render */}
                      {(() => {
                        const items = selectedTurma.folders || [];
                        const query = foldSearchQuery.toLowerCase().trim();
                        
                        // Filter items if search query is provided
                        const matchedItems = items.filter(item => 
                          item.name.toLowerCase().includes(query)
                        );

                        if (items.length === 0) {
                          return (
                            <div className="p-8 text-center text-slate-400 text-xs">
                              Esta pasta está vazia. Crie uma pasta ou faça upload de documentos acima para começar.
                            </div>
                          );
                        }

                        // Helper render logic:
                        // Separating top-level folders, child files, and root level files
                        const folders = query ? [] : items.filter(item => item.type === 'folder');
                        const filesWithoutParent = query ? matchedItems : items.filter(item => item.type === 'file' && !item.parentId);

                        return (
                          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                            {/* 1. RENDER FOLDERS AND CORRESPONDING NESTED FILES */}
                            {folders.map(folder => {
                              const childFiles = items.filter(file => file.type === 'file' && file.parentId === folder.id);
                              return (
                                <div key={folder.id} className="bg-slate-50/25">
                                  {/* Folder bar header */}
                                  <div className="p-3 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all select-none">
                                    <div className="flex items-center space-x-2">
                                      <FolderOpen className="w-4 h-4 text-indigo-500 fill-indigo-100" />
                                      <span className="font-extrabold">{folder.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-mono font-medium">
                                      <span>Atualizado em: {folder.updatedAt}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteFolderItem(selectedTurma, folder.id)}
                                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                        title="Excluir Pasta e Conteúdos"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Nested files listing inside that folder */}
                                  <div className="pl-4 divide-y divide-slate-50/80">
                                    {childFiles.length === 0 ? (
                                      <div className="py-2 pl-6 pr-4 text-[10px] italic text-slate-400">
                                        Subpasta vazia. Selecione esta subpasta ao anexar um novo documento.
                                      </div>
                                    ) : (
                                      childFiles.map(file => (
                                        <div key={file.id} className="p-2.5 pl-6 flex justify-between items-center text-xs text-slate-600 hover:bg-indigo-50/20 transition-all">
                                          <div className="flex items-center space-x-2">
                                            <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                            <span>{file.name}</span>
                                          </div>
                                          <div className="flex items-center space-x-4 shrink-0 font-mono text-[10px] font-semibold text-slate-400">
                                            <span>{file.size}</span>
                                            <span>{file.updatedAt}</span>
                                            <button
                                              type="button"
                                              onClick={() => handleDeleteFolderItem(selectedTurma, file.id)}
                                              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                              title="Excluir Arquivo"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                            {/* 2. RENDER ROOT-LEVEL FILES OR MATCHED DOCUMENTS FROM SEARCH */}
                            {filesWithoutParent.length > 0 && (
                              <div className="bg-white">
                                {query && (
                                  <div className="p-2 bg-slate-50 text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider pl-4">
                                    Documentos Encontrados ({filesWithoutParent.length})
                                  </div>
                                )}
                                {filesWithoutParent.map(file => (
                                  <div key={file.id} className="p-3 pl-4 flex justify-between items-center text-xs text-slate-700 hover:bg-slate-50 transition-all">
                                    <div className="flex items-center space-x-2">
                                      <FileText className="w-4 h-4 text-slate-400 fill-slate-50 shrink-0" />
                                      <span className="font-medium">{file.name}</span>
                                      {items.find(fol => fol.id === file.parentId) && (
                                        <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-extrabold ml-2">
                                          Em: {items.find(fol => fol.id === file.parentId)?.name.replace('📁 ', '')}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-4 shrink-0 font-mono text-[10px] font-semibold text-gray-400">
                                      <span>{file.size}</span>
                                      <span>{file.updatedAt}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteFolderItem(selectedTurma, file.id)}
                                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50/80 rounded transition-colors"
                                        title="Excluir Arquivo"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Empty Query Case */}
                            {query && matchedItems.length === 0 && (
                              <div className="p-8 text-center text-slate-400 text-xs">
                                Nenhum documento correspondente à busca encontrado nesta pasta.
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTurmaIdForModal(null)}
                  className="px-5 py-2 bg-[#0a4d2c] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Voltar ao Painel
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
