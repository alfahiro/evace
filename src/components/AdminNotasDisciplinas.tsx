import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Settings, CheckCircle, Save, Star, Users, CheckCircle2, RefreshCw, Sparkles, Printer } from 'lucide-react';
import { Turma, Student, Module, GradeRecord, AttendanceRecord } from '../types';
import DiarioOficialModal from './DiarioOficialModal';

interface AdminNotasDisciplinasProps {
  turmas: Turma[];
  students: Student[];
  modules: Module[];
  gradeRecords: GradeRecord[];
  attendanceRecords: AttendanceRecord[];
  onUpdateModuleStatus: (id: string, status: 'concluido' | 'em_andamento' | 'agendado') => void;
  onSaveGrades: (grades: { studentId: string; grade: number }[], turmaId: string, moduleId: string) => void;
}

export default function AdminNotasDisciplinas({
  turmas,
  students,
  modules,
  gradeRecords,
  attendanceRecords,
  onUpdateModuleStatus,
  onSaveGrades
}: AdminNotasDisciplinasProps) {
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>(turmas[0]?.id || '');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Filter components
  const classModules = modules.filter(m => m.turmaId === selectedTurmaId);
  const classStudents = students.filter(s => s.turmaId === selectedTurmaId);

  // Selected module detailed item
  const selectedModuleObj = modules.find(m => m.id === selectedModuleId);

  // Buffer state to keep student grade entries while typing, mapping studentId -> gradeValue (as a string to make typing pleasant)
  const [gradeInputs, setGradeInputs] = useState<Record<string, string>>({});
  const [isGradebookLoaded, setIsGradebookLoaded] = useState(false);

  // Auto-load and synchronize grades whenever selected class, module, or saved database records change
  useEffect(() => {
    if (selectedTurmaId && selectedModuleId) {
      const prefilled: Record<string, string> = {};
      classStudents.forEach(stu => {
        const match = [...gradeRecords].reverse().find(g => g.studentId === stu.id && g.moduleId === selectedModuleId);
        prefilled[stu.id] = match && match.grade !== undefined ? match.grade.toString().replace('.', ',') : '';
      });
      setGradeInputs(prefilled);
      setIsGradebookLoaded(true);
    } else {
      setIsGradebookLoaded(false);
      setGradeInputs({});
    }
  }, [selectedTurmaId, selectedModuleId, gradeRecords, students]);

  const handleLoadGradebook = () => {
    if (!selectedTurmaId || !selectedModuleId) return;

    const prefilled: Record<string, string> = {};
    classStudents.forEach(stu => {
      const match = [...gradeRecords].reverse().find(g => g.studentId === stu.id && g.moduleId === selectedModuleId);
      prefilled[stu.id] = match && match.grade !== undefined ? match.grade.toString().replace('.', ',') : '';
    });

    setGradeInputs(prefilled);
    setIsGradebookLoaded(true);
  };

  const handleGradeInputChange = (studentId: string, value: string) => {
    setGradeInputs(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleSaveAllGrades = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTurmaId || !selectedModuleId) return;

    const gradesToSubmit: { studentId: string; grade: number }[] = [];
    
    for (const studentId of Object.keys(gradeInputs)) {
      const valStr = gradeInputs[studentId];
      if (valStr && valStr.trim() !== '') {
        const parsed = parseFloat(valStr.replace(',', '.'));
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
          gradesToSubmit.push({
            studentId,
            grade: parsed
          });
        }
      }
    }

    onSaveGrades(gradesToSubmit, selectedTurmaId, selectedModuleId);
    alert("Notas e Boletins da EVACE atualizados com sucesso!");
    // Keep isGradebookLoaded true to keep the sheet displayed so the user sees their values saved!
  };

  const handleStatusChange = (status: 'concluido' | 'em_andamento' | 'agendado') => {
    if (!selectedModuleId) return;
    onUpdateModuleStatus(selectedModuleId, status);
  };

  const getClassName = (id: string) => {
    return turmas.find(t => t.id === id)?.title || 'Turma';
  };

  return (
    <div className="space-y-6" id="grades-workspace">
      {/* Pick Class/Discipline Selector */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-50 pb-3">
          <h2 className="text-base font-extrabold text-slate-800 flex items-center">
            <Award className="w-5 h-5 mr-2 text-[#0a4d2c]" />
            Controle de Disciplinas, Status & Notas
          </h2>
          <p className="text-xs text-gray-400 mt-1">Insira e autorize notas de pós-graduandos e gerencie o cronograma de andamento dos módulos curriculares.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 block uppercase">Especialização / Turma</label>
            <select
              value={selectedTurmaId}
              onChange={(e) => {
                setSelectedTurmaId(e.target.value);
                setSelectedModuleId('');
                setIsGradebookLoaded(false);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-semibold focus:outline-none focus:border-[#0a4d2c]"
            >
              <option value="">Selecione uma turma...</option>
              {turmas.map(t => (
                <option key={t.id} value={t.id}>({t.category}) {t.title.slice(0,35)}...</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 block uppercase">Disciplina Curricular</label>
            <select
              value={selectedModuleId}
              onChange={(e) => {
                setSelectedModuleId(e.target.value);
                setIsGradebookLoaded(false);
              }}
              disabled={!selectedTurmaId}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-semibold focus:outline-none focus:border-[#0a4d2c]"
            >
              <option value="">Selecione a disciplina...</option>
              {classModules.map(m => (
                <option key={m.id} value={m.id}>{m.title} ({m.workload}h)</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleLoadGradebook}
              disabled={!selectedTurmaId || !selectedModuleId}
              className="w-full py-2 bg-[#0a4d2c] disabled:bg-slate-250 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-all focus:outline-none cursor-pointer text-center text-xs"
            >
              Abrir Caderneta de Notas & Status
            </button>
          </div>
        </div>
      </div>

      {isGradebookLoaded && selectedModuleObj && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in zoom-in-99 duration-150">
          
          {/* Left Column: Discipline progress, Professor assignment, and Workload details */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <span className="text-[10px] uppercase font-bold text-indigo-600 block">Status da Disciplina</span>
              <h3 className="font-extrabold text-slate-800 text-sm leading-tight">{selectedModuleObj.title}</h3>
              
              <div className="space-y-2 text-xs text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                <p><span className="text-gray-400">Professor:</span> {selectedModuleObj.professor}</p>
                <p><span className="text-gray-400">Carga Horária:</span> {selectedModuleObj.workload} horas aula</p>
                <p><span className="text-gray-400">Turma associada:</span> {getClassName(selectedModuleObj.turmaId).slice(0,30)}...</p>
              </div>

              {/* Status Update selectors */}
              <div className="space-y-2" id="module-status-selector">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Alterar Progresso Acadêmico</span>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-wider">
                  <button
                    onClick={() => handleStatusChange('agendado')}
                    className={`py-2 px-1 rounded-lg border cursor-pointer select-none ${
                      selectedModuleObj.status === 'agendado' 
                        ? 'bg-slate-200 text-slate-800 border-slate-300' 
                        : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-500'
                    }`}
                  >
                    Agendado
                  </button>
                  <button
                    onClick={() => handleStatusChange('em_andamento')}
                    className={`py-2 px-1 rounded-lg border cursor-pointer select-none ${
                      selectedModuleObj.status === 'em_andamento' 
                        ? 'bg-amber-100/70 text-amber-700 border-amber-200' 
                        : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-500'
                    }`}
                  >
                    Ativo
                  </button>
                  <button
                    onClick={() => handleStatusChange('concluido')}
                    className={`py-2 px-1 rounded-lg border cursor-pointer select-none ${
                      selectedModuleObj.status === 'concluido' 
                        ? 'bg-emerald-100/70 text-emerald-700 border-emerald-200' 
                        : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-500'
                    }`}
                  >
                    Concluído
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Takes 2 span): Student list interactive grades entry sheet */}
          <div className="lg:col-span-2 space-y-4">
            <form onSubmit={handleSaveAllGrades} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-emerald-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#0a4d2c] block">Boletim acadêmico integrado</span>
                  <h3 className="font-extrabold text-slate-800 text-sm">Lançamento de Notas / Avaliações</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsPdfModalOpen(true)}
                    className="px-3 py-1.5 bg-[#0a4d2c] hover:bg-emerald-800 text-white font-extrabold text-[10px] rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer select-none uppercase tracking-wide no-print"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Emitir Diário (PDF)</span>
                  </button>
                  <span className="text-[10px] bg-white text-slate-600 font-mono font-bold px-2 py-1 rounded inline-block border border-slate-100">
                    Escala: 0 a 10
                  </span>
                </div>
              </div>

              {/* Grade items body */}
              <div className="p-6 space-y-3">
                {classStudents.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    Nenhum aluno matriculado nesta turma para lançar notas. Vincule alunos na aba "Gerenciar Turmas" ou "Inclusão de Alunos".
                  </div>
                ) : (
                  <div className="space-y-2">
                    {classStudents.map(student => (
                      <div key={student.id} className="flex justify-between items-center text-xs p-3 hover:bg-slate-50 rounded-xl border border-slate-100/40">
                        <div className="pr-4">
                          <span className="font-extrabold text-slate-700 block">{student.name}</span>
                          <span className="text-[9px] font-mono text-gray-400 font-medium uppercase">{student.enrollmentId}</span>
                        </div>

                        {/* Input Value */}
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="S/N"
                            value={gradeInputs[student.id] || ''}
                            onChange={(e) => handleGradeInputChange(student.id, e.target.value)}
                            className="w-16 px-2 py-1.5 text-center text-xs font-bold border border-slate-200 rounded-lg bg-slate-50/70 focus:outline-none focus:border-[#0a4d2c] text-slate-800"
                          />
                          {gradeInputs[student.id] !== '' && parseFloat(gradeInputs[student.id]) >= 7.0 && (
                            <span className="text-emerald-500" title="Aprovado por Média">
                              <CheckCircle2 className="w-4.5 h-4.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {classStudents.length > 0 && (
                  <div className="border-t border-slate-55 pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Caderneta de Notas</span>
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

        </div>
      )}

      {isPdfModalOpen && selectedModuleObj && (
        <DiarioOficialModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          turma={turmas.find(t => t.id === selectedTurmaId)!}
          module={selectedModuleObj}
          students={classStudents}
          gradeRecords={gradeRecords}
          attendanceRecords={attendanceRecords}
        />
      )}
    </div>
  );
}
