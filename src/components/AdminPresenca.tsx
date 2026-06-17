import React, { useState } from 'react';
import { CheckSquare, Calendar, UserCheck, AlertCircle, Save, CheckCircle, XCircle, ChevronRight, BarChart2 } from 'lucide-react';
import { Turma, Student, Module, AttendanceRecord } from '../types';

interface AdminPresencaProps {
  turmas: Turma[];
  students: Student[];
  modules: Module[];
  attendanceRecords: AttendanceRecord[];
  onSaveAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
}

export default function AdminPresenca({
  turmas,
  students,
  modules,
  attendanceRecords,
  onSaveAttendance
}: AdminPresencaProps) {
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>(turmas[0]?.id || '');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  
  // Get date in format YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [attendanceDate, setAttendanceDate] = useState<string>(todayStr);

  // Filter modules/subjects belonging to the selected class
  const classModules = modules.filter(m => m.turmaId === selectedTurmaId);
  
  // Filter students belonging to the selected class
  const classStudents = students.filter(s => s.turmaId === selectedTurmaId);

  // Keep track of ticked present student IDs
  const [presentIds, setPresentIds] = useState<string[]>([]);
  const [isAttendanceLoaded, setIsAttendanceLoaded] = useState(false);

  // Load existing attendances or preset clean list
  const handleLoadAttendanceGrid = () => {
    if (!selectedTurmaId || !selectedModuleId) {
      alert("Por favor, selecione a Turma e a Disciplina Primeiro.");
      return;
    }

    // Check if we have an existing log for this exact combination
    const existing = attendanceRecords.find(
      r => r.turmaId === selectedTurmaId && 
           r.moduleId === selectedModuleId && 
           r.date === attendanceDate
    );

    if (existing) {
      setPresentIds(existing.presents);
    } else {
      // Clean slate: set everyone present by default (happier classroom!)
      setPresentIds(classStudents.map(s => s.id));
    }
    setIsAttendanceLoaded(true);
  };

  const toggleStudentPresence = (studentId: string) => {
    setPresentIds(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const handleMarkAllPresent = () => {
    setPresentIds(classStudents.map(s => s.id));
  };

  const handleMarkAllAbsent = () => {
    setPresentIds([]);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTurmaId || !selectedModuleId || !attendanceDate) return;

    onSaveAttendance({
      turmaId: selectedTurmaId,
      moduleId: selectedModuleId,
      date: attendanceDate,
      presents: presentIds
    });

    alert("Controle de Presença Diário gravado com sucesso no servidor da EVACE!");
    setIsAttendanceLoaded(false);
  };

  // Historic records for this class
  const classHistory = attendanceRecords
    .filter(r => r.turmaId === selectedTurmaId && (selectedModuleId ? r.moduleId === selectedModuleId : true))
    .sort((a,b) => b.date.localeCompare(a.date));

  const getModuleName = (id: string) => {
    return modules.find(m => m.id === id)?.title || 'Disciplina';
  };

  return (
    <div className="space-y-6" id="attendance-panel-layout">
      {/* Configuration Header Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-50 pb-3">
          <h2 className="text-base font-extrabold text-slate-800 flex items-center">
            <CheckSquare className="w-5 h-5 mr-2 text-[#0a4d2c]" />
            Controle Diário de Presença (Diário de Classe)
          </h2>
          <p className="text-xs text-gray-400 mt-1">Gere relatórios de frequência em tempo real. Escolha a turma, a disciplina e configure a pauta de chamada.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Pick Class */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 block uppercase">Selecionar Turma</label>
            <select
              value={selectedTurmaId}
              onChange={(e) => {
                setSelectedTurmaId(e.target.value);
                setSelectedModuleId('');
                setIsAttendanceLoaded(false);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-semibold focus:outline-none"
            >
              <option value="">Selecione uma turma...</option>
              {turmas.map(t => (
                <option key={t.id} value={t.id}>({t.category}) {t.title.slice(0,35)}...</option>
              ))}
            </select>
          </div>

          {/* Pick Discipline */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 block uppercase">Selecionar Disciplina</label>
            <select
              value={selectedModuleId}
              onChange={(e) => {
                setSelectedModuleId(e.target.value);
                setIsAttendanceLoaded(false);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-semibold focus:outline-none"
              disabled={!selectedTurmaId}
            >
              <option value="">Selecione a disciplina...</option>
              {classModules.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          {/* Pick Date */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 block uppercase">Data da Aula</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => {
                setAttendanceDate(e.target.value);
                setIsAttendanceLoaded(false);
              }}
              className="w-full px-3 py-1.5 text-xs text-slate-700 font-mono border border-slate-200 rounded-lg bg-white focus:outline-none"
            />
          </div>

          {/* Action Trigger button */}
          <div className="flex items-end">
            <button
              onClick={handleLoadAttendanceGrid}
              disabled={!selectedTurmaId || !selectedModuleId}
              className="w-full py-2 bg-[#0a4d2c] disabled:bg-slate-250 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-all focus:outline-none cursor-pointer text-center"
            >
              Iniciar / Carregar Chamada
            </button>
          </div>
        </div>
      </div>

      {/* Daily list check interface and checklist */}
      {isAttendanceLoaded && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in zoom-in-99 duration-150">
          <div className="bg-emerald-50/50 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-[9px] uppercase font-bold text-[#0a4d2c] tracking-wider block">
                Ficha de Chamada Pauta
              </span>
              <h3 className="font-extrabold text-slate-800 text-sm">
                Lista de Presença - {getModuleName(selectedModuleId)}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">Turma de Alunos Ativos ({classStudents.length} inscritos)</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleMarkAllPresent}
                className="px-2.5 py-1 text-[10px] border border-emerald-200 text-emerald-700 bg-emerald-50 rounded font-bold hover:bg-emerald-100 transition-all cursor-pointer"
              >
                Todos Presentes
              </button>
              <button
                onClick={handleMarkAllAbsent}
                className="px-2.5 py-1 text-[10px] border border-rose-200 text-rose-700 bg-rose-50 rounded font-bold hover:bg-rose-100 transition-all cursor-pointer"
              >
                Zerada (Faltas)
              </button>
            </div>
          </div>

          {/* Student attendance Checklist body */}
          <div className="p-6 space-y-4">
            {classStudents.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                Não há alunos matriculados nesta turma para realizar a pauta de presença. Vá na aba "Gerenciar Turmas" ou "Inclusão de Alunos" para integrá-los de antemão.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="attendance-checklist">
                {classStudents.map(stud => {
                  const isPresent = presentIds.includes(stud.id);
                  return (
                    <div
                      key={stud.id}
                      onClick={() => toggleStudentPresence(stud.id)}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer select-none ${
                        isPresent 
                          ? 'border-emerald-200 bg-emerald-50/20 text-[#0a4d2c]'
                          : 'border-slate-100 bg-slate-50/30 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 pr-2">
                        <div className={`w-3.5 h-3.5 rounded-full ${isPresent ? 'bg-emerald-500' : 'bg-slate-300'} transition-colors shrink-0`} />
                        <div>
                          <span className="font-extrabold text-xs block text-slate-800">{stud.name}</span>
                          <span className="text-[9px] font-mono font-medium text-gray-400 uppercase">{stud.enrollmentId}</span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isPresent ? (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center uppercase border border-emerald-200">
                            <CheckCircle className="w-3 h-3 mr-1" /> Presente
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center uppercase border border-rose-200">
                            <XCircle className="w-3 h-3 mr-1" /> Ausente
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Save Buttons */}
            {classStudents.length > 0 && (
              <div className="border-t border-slate-100 pt-5 flex justify-end">
                <button
                  onClick={handleSaveAttendance}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Diário de Classe</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Historical Logs List for records verification */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center">
          <BarChart2 className="w-4.5 h-4.5 mr-2 text-indigo-600" />
          Registros Diários Feitos (Históricos)
        </h3>
        
        <div className="space-y-2">
          {classHistory.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-xs">
              Nenhuma pauta de presença registrada historicamente para esta turma.
            </div>
          ) : (
            classHistory.map(hist => {
              const totalStuds = classStudents.length || students.filter(s => s.turmaId === hist.turmaId).length || 1;
              const presencePercent = Math.round((hist.presents.length / totalStuds) * 100);

              const dParts = hist.date.split('-');
              const fDate = dParts.length === 3 ? `${dParts[2]}/${dParts[1]}/${dParts[0]}` : hist.date;

              return (
                <div key={hist.id} className="flex flex-col sm:flex-row sm:items-center justify-between items-start bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 hover:bg-slate-50 transition-colors text-xs text-slate-600 gap-3">
                  <div className="space-y-1 w-full sm:w-auto">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-slate-800 text-[13px] sm:text-xs">{getModuleName(hist.moduleId)}</span>
                      <span className="text-[10px] bg-emerald-50 text-[#0a4d2c] px-2 py-0.5 rounded font-bold font-mono">{fDate}</span>
                    </div>
                    <span className="text-[11px] sm:text-[10px] text-gray-400 font-medium block">
                      Presentes: {hist.presents.length} de {totalStuds} estudantes cadastrados
                    </span>
                  </div>

                  <div className="sm:text-right shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 flex sm:flex-col justify-between items-center sm:items-end">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Aproveitamento</span>
                    <span className={`font-black text-[13px] sm:text-sm block ${presencePercent >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {presencePercent}% Presença
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
