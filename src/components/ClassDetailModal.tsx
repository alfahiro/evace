import React from 'react';
import { X, Award, BookOpen, Clock, CheckCircle2, AlertCircle, Calendar, Download, FileText } from 'lucide-react';
import { Turma } from '../types';

interface ClassDetailModalProps {
  turma: any | null;
  onClose: () => void;
}

export default function ClassDetailModal({ turma, onClose }: ClassDetailModalProps) {
  if (!turma) return null;

  // Estimate total workload completed vs total
  const completedModules = turma.modules.filter(m => m.status === 'concluido').length;
  const totalModules = turma.modules.length;
  
  // Calculate average grade
  const gradedModules = turma.modules.filter(m => m.grade !== undefined);
  const averageGrade = gradedModules.length > 0
    ? (gradedModules.reduce((sum, m) => sum + (m.grade || 0), 0) / gradedModules.length).toFixed(1)
    : null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
      id="class-details-modal-overlay"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200"
        id="class-details-modal"
      >
        {/* Modal Header */}
        <div className="bg-[#0a4d2c] text-white px-6 py-5 flex justify-between items-start">
          <div className="flex-1 pr-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100 bg-white/10 px-2 py-0.5 rounded">
              {turma.category} • Detalhes da Turma
            </span>
            <h3 className="text-lg font-bold mt-1.5 leading-snug">{turma.title}</h3>
            <p className="text-xs text-emerald-100 font-mono mt-0.5">{turma.number}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-slate-200 p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Progress Tracker Strip */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                <span>Progresso Acadêmico integrado</span>
                <span>{turma.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${turma.progress}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 shrink-0">
              <div className="text-center">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Módulos</span>
                <span className="font-extrabold text-slate-700 text-base">{completedModules}/{totalModules}</span>
              </div>
              {averageGrade && (
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Nota Média</span>
                  <span className="font-extrabold text-[#0a4d2c] text-base">{averageGrade}</span>
                </div>
              )}
            </div>
          </div>

          {/* Modules List Heading */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-[#0a4d2c]" />
              Estrutura Curricular e Notas
            </h4>

            {/* Modules Grid */}
            <div className="space-y-3">
              {turma.modules.map((mod) => (
                <div 
                  key={mod.id}
                  className="border border-slate-100 rounded-lg p-3 hover:border-slate-200 bg-white transition-colors flex justify-between items-start gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-800">{mod.title}</span>
                      {mod.status === 'concluido' && (
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center">
                          <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Concluído
                        </span>
                      )}
                      {mod.status === 'em_andamento' && (
                        <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center">
                          <Clock className="w-2.5 h-2.5 mr-0.5 animate-spin" /> Em Andamento
                        </span>
                      )}
                      {mod.status === 'agendado' && (
                        <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Agendado
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">Prof: {mod.professor}</p>
                    <p className="text-[10px] font-mono text-slate-400">Carga Horária: {mod.workload}h</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block">Nota</span>
                    <span className={`text-sm font-bold block ${mod.grade !== undefined && mod.grade >= 7 ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {mod.grade !== undefined ? mod.grade.toFixed(1) : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Materials simulator */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-[#0a4d2c]" />
              Material de Apoio e Bibliografia Complementar
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a 
                href="#"
                onClick={(e) => { e.preventDefault(); alert("Fazendo download de: Roteiro_Pratico_UTI.pdf"); }}
                className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="bg-emerald-50 p-2 rounded text-[#0a4d2c]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-slate-700 block truncate max-w-[160px]">Roteiro Prático UTI</span>
                    <span className="text-[9px] text-slate-400 block">PDF • 2.4 MB</span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-[#0a4d2c] opacity-70 hover:opacity-100" />
              </a>

              <a 
                href="#"
                onClick={(e) => { e.preventDefault(); alert("Fazendo download de: Manual_Condutas_Enfermagem.pdf"); }}
                className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="bg-rose-50 p-2 rounded text-rose-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-slate-700 block truncate max-w-[160px]">Manual de Condutas</span>
                    <span className="text-[9px] text-slate-400 block">PDF • 5.1 MB</span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-rose-600 opacity-70 hover:opacity-100" />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end space-x-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs hover:bg-white active:bg-slate-50 transition-all"
          >
            Imprimir Histórico
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0a4d2c] hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs transition-all shadow-sm"
          >
            Fechar detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
