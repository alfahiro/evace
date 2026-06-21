import React, { useState, useRef } from 'react';
import { 
  Student, 
  Turma, 
  Module, 
  AttendanceRecord, 
  GradeRecord 
} from '../types';
import { 
  Printer, 
  Award, 
  CheckSquare, 
  GraduationCap, 
  FileText, 
  Calendar, 
  BookOpen, 
  Percent, 
  Clock, 
  Mail, 
  Phone, 
  ArrowRight, 
  Check, 
  X,
  MapPin,
  Sparkles
} from 'lucide-react';
import EvaceLogo from './EvaceLogo';

interface StudentPortalViewProps {
  student: Student;
  turmas: Turma[];
  modules: Module[];
  attendanceRecords: AttendanceRecord[];
  gradeRecords: GradeRecord[];
  onLogout: () => void;
}

export default function StudentPortalView({
  student,
  turmas,
  modules,
  attendanceRecords,
  gradeRecords,
  onLogout
}: StudentPortalViewProps) {
  const [activePortalTab, setActivePortalTab] = useState<'boletim' | 'frequencia' | 'detalhes'>('boletim');

  // Find student's class
  const studentTurma = turmas.find(t => t.id === student.turmaId);
  
  // Find modules of student's class
  const studentModules = modules.filter(m => m.turmaId === student.turmaId);

  // Helper: Get student grade for module
  const getGradeForModule = (moduleId: string): number | null => {
    const record = gradeRecords.find(
      g => g.studentId === student.id && g.moduleId === moduleId
    );
    return record ? record.grade : null;
  };

  // Helper: Get student attendance calculations for a module
  const getAttendanceForModule = (moduleId: string) => {
    const records = attendanceRecords.filter(
      r => r.turmaId === student.turmaId && r.moduleId === moduleId
    );
    const totalClasses = records.length;
    if (totalClasses === 0) return { attended: 0, total: 0, percentage: 100, noClasses: true };

    const attended = records.filter(r => r.presents.includes(student.id)).length;
    const percentage = Math.round((attended / totalClasses) * 100);
    return { attended, total: totalClasses, percentage, noClasses: false };
  };

  // Overall calculations
  const totalModulesCount = studentModules.length;
  
  // Overall GPA (Média Geral)
  const gradedModules = studentModules.map(m => getGradeForModule(m.id)).filter((g): g is number => g !== null);
  const averageGrade = gradedModules.length > 0 
    ? Number((gradedModules.reduce((sum, g) => sum + g, 0) / gradedModules.length).toFixed(1))
    : null;

  // Overall Attendance Rate
  const moduleAttendanceRates = studentModules.map(m => getAttendanceForModule(m.id)).filter(a => !a.noClasses);
  const overallAttendanceRate = moduleAttendanceRates.length > 0
    ? Math.round(moduleAttendanceRates.reduce((sum, a) => sum + a.percentage, 0) / moduleAttendanceRates.length)
    : 100;

  // Completed Workload (Carga Horária Concluída)
  const completedWorkload = studentModules
    .filter(m => m.status === 'concluido')
    .reduce((sum, m) => sum + m.workload, 0);

  const totalClassWorkload = studentModules.reduce((sum, m) => sum + m.workload, 0);

  // Print function
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6" id="student-portal-viewport">
      {/* Dynamic Printing Rules for Student Portal */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body * {
            visibility: hidden !important;
          }
          .no-print, .no-print *, header, footer, aside, button, nav, #evace-primary-header, #secondary-greeting-bar, #portal-navigation-subbar {
            display: none !important;
            visibility: hidden !important;
          }
          #student-report-print-sheet, #student-report-print-sheet * {
            visibility: visible !important;
          }
          #student-report-print-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            display: block !important;
          }
          table, th, td, tr, div, span, h1, h2, h3 {
            border-color: #000000 !important;
            color: #000000 !important;
          }
          .print-header-strip {
            background-color: #f2f2f2 !important;
            border: 1px solid #000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />

      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-[#0a4d2c] to-emerald-950 text-white p-6 md:p-8 rounded-3xl shadow-lg border border-emerald-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 bg-emerald-800/50 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider text-emerald-300 w-fit border border-emerald-700/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Painel do Estudante</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase">
            {student.name}
          </h1>
          <p className="text-xs text-emerald-200/80 font-medium flex-wrap flex items-center gap-x-2">
            <span>Matrícula: <strong className="font-mono font-bold text-white bg-emerald-950/40 px-1.5 py-0.5 rounded">{student.enrollmentId}</strong></span>
            <span>•</span>
            <span>Turma: <strong className="text-emerald-100 font-bold">{studentTurma?.title || 'Não designada'}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <button
            onClick={handlePrintReport}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-black shadow-md transition-all duration-150 cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Simular Boletim Oficial (A4)
          </button>
        </div>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
        {/* GPA CARD */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/50 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">MÉDIA GERAL (GPA)</span>
          <div className="my-2">
            <span className="text-2xl md:text-3xl font-black text-slate-800">
              {averageGrade !== null ? averageGrade.toFixed(1) : 'S/N'}
            </span>
            {averageGrade !== null && (
              <span className={`text-[10px] font-bold block mt-1 ${averageGrade >= 7 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {averageGrade >= 7 ? 'Desempenho Excelente' : 'Abaixo da meta (7.0)'}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-semibold">
            <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{gradedModules.length} de {totalModulesCount} disciplinas normativas avaliadas</span>
          </div>
        </div>

        {/* ATTENDANCE CARD */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/50 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">FREQUÊNCIA DOS DIÁRIOS</span>
          <div className="my-2">
            <span className="text-2xl md:text-3xl font-black text-slate-800">
              {overallAttendanceRate}%
            </span>
            <span className={`text-[10px] font-bold block mt-1 ${overallAttendanceRate >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {overallAttendanceRate >= 75 ? 'Frequência regular (apto)' : 'Frequência abaixo de 75%'}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-semibold">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Média das pautas disponibilizadas</span>
          </div>
        </div>

        {/* COMPLETED WORKLOAD CARD */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/50 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">CARGA HORÁRIA</span>
          <div className="my-2">
            <span className="text-2xl md:text-3xl font-black text-slate-800">
              {completedWorkload}h
            </span>
            <span className="text-[10px] font-bold text-slate-500 block mt-1">
              de {totalClassWorkload}h totais da grade curricular
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
            <div 
              className="bg-emerald-600 h-1.5 rounded-full" 
              style={{ width: `${totalClassWorkload > 0 ? (completedWorkload / totalClassWorkload) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* ACADEMIC STATUS */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/50 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">STATUS DO CURSO</span>
          <div className="my-2">
            <span className={`inline-flex px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg ${
              averageGrade && averageGrade >= 7.0 && overallAttendanceRate >= 75
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/50'
                : 'bg-amber-50 text-amber-800 border border-amber-200/50'
            }`}>
              {averageGrade && averageGrade >= 7.0 && overallAttendanceRate >= 75 ? 'APROVADO' : 'EM ANDAMENTO'}
            </span>
            <span className="text-[10px] font-medium text-slate-500 block mt-2">
              Verificado conforme regimento lato sensu
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-semibold pt-1">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Pós-Graduação Lato Sensu</span>
          </div>
        </div>
      </div>

      {/* PORTAL INTERNAL TABS */}
      <div className="border-b border-slate-200/60 flex space-x-4 no-print" id="portal-navigation-subbar">
        <button
          onClick={() => setActivePortalTab('boletim')}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activePortalTab === 'boletim' 
              ? 'border-[#0a4d2c] text-[#0a4d2c]' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Notas e Rendimento
        </button>
        <button
          onClick={() => setActivePortalTab('frequencia')}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activePortalTab === 'frequencia' 
              ? 'border-[#0a4d2c] text-[#0a4d2c]' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Diários de Frequência
        </button>
      </div>

      {/* TAB CONTENT: BOLETIM */}
      {activePortalTab === 'boletim' && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm p-6 no-print space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
              Boletim Acadêmico Detalhado
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-200/40">
              {studentModules.length} componentes listados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                  <th className="p-3 uppercase text-[10px] tracking-wider rounded-l-lg">Componente Curricular (Módulo)</th>
                  <th className="p-3 uppercase text-[10px] tracking-wider text-center">Carga Horária</th>
                  <th className="p-3 uppercase text-[10px] tracking-wider text-center">Nota Final</th>
                  <th className="p-3 uppercase text-[10px] tracking-wider text-center">Frequência</th>
                  <th className="p-3 uppercase text-[10px] tracking-wider text-center rounded-r-lg">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentModules.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400 font-semibold">
                      Ainda não há disciplinas lançadas para a sua turma.
                    </td>
                  </tr>
                ) : (
                  studentModules.map((m) => {
                    const grade = getGradeForModule(m.id);
                    const attendance = getAttendanceForModule(m.id);
                    const isApproved = grade !== null && grade >= 7.0 && (attendance.noClasses || attendance.percentage >= 75);

                    return (
                      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 py-4">
                          <p className="font-extrabold text-slate-700 uppercase">{m.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Professor(a): <span className="uppercase text-slate-500">{m.professor}</span></p>
                        </td>
                        <td className="p-3 text-center font-mono font-semibold text-slate-600">
                          {m.workload}h
                        </td>
                        <td className="p-3 text-center">
                          {grade !== null ? (
                            <span className={`font-mono font-black text-sm px-2.5 py-1 rounded ${
                              grade >= 7.0 
                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/30' 
                                : 'text-amber-700 bg-amber-50 border border-amber-200/30'
                            }`}>
                              {grade.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Pendente</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {attendance.noClasses ? (
                            <span className="text-slate-400 italic text-[10px]">Não aferido</span>
                          ) : (
                            <span className={`font-mono font-bold ${attendance.percentage >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {attendance.percentage}% ({attendance.attended}/{attendance.total})
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {grade === null ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/40">
                              CURSANDO
                            </span>
                          ) : isApproved ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/40 flex items-center justify-center gap-1 w-fit mx-auto">
                              <Check className="w-3 h-3 shrink-0" /> APROVADO
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/40 flex items-center justify-center gap-1 w-fit mx-auto">
                              <X className="w-3 h-3 shrink-0" /> REPROVADO
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FREQUÊNCIA */}
      {activePortalTab === 'frequencia' && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm p-6 no-print space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
              Acompanhamento de Frequência Diária
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase">
              Verificação em tempo real
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl font-medium">
            Segue a discriminação de suas presenças consolidadas em cada diário de classe das disciplinas ministradas. O regimento acadêmico exige frequência mínima de 75%.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {studentModules.map((m) => {
              const attend = getAttendanceForModule(m.id);
              return (
                <div key={m.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div className="pr-3 min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-700 uppercase truncate">
                      {m.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      Professor: <span className="uppercase">{m.professor}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[15px] font-black font-mono block ${attend.noClasses ? 'text-slate-400' : attend.percentage >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {attend.noClasses ? 'Não Iniciado' : `${attend.percentage}%`}
                    </span>
                    {!attend.noClasses && (
                      <span className="text-[9px] font-bold text-slate-400 block font-mono">
                        {attend.attended} presenças de {attend.total} aulas
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* BOLETIM ESCULAR PRE-MOLDADO PARA IMPRESSÃO A4 (HIDDEN UNLESS PRINTING) */}
      <div 
        id="student-report-print-sheet" 
        className="hidden bg-white text-black p-10 font-sans text-xs flex-col justify-between"
        style={{ fontFamily: '"Calibri", "Candara", "Segoe UI", Arial, sans-serif', width: '210mm', minHeight: '297mm' }}
      >
        <div>
          {/* Logo on Stamp */}
          <div className="flex flex-col items-center justify-center mb-6">
            <EvaceLogo size="md" variant="dark" showText={true} />
            <span className="text-[9px] uppercase tracking-widest text-[#0a4d2c] font-black mt-2">
              PORTAL DO ESTUDANTE CORPORATIVO
            </span>
          </div>

          <div className="text-center mb-4">
            <h1 className="text-xs font-bold italic">Programa de Pós-Graduação Lato Sensu</h1>
          </div>

          <div className="print-header-strip text-center bg-[#f2f2f2] border border-black py-2 mb-6">
            <h2 className="text-xs font-black tracking-wider text-black">
              BOLETIM DE RENDIMENTO CURRICULAR OFICIAL
            </h2>
          </div>

          {/* Student General Data Block */}
          <div className="border border-black p-4 mb-6 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[9px] uppercase font-bold text-slate-600">Nome do(a) Aluno(a)</p>
              <p className="text-xs font-black uppercase text-black">{student.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] uppercase font-bold text-slate-600">Matrícula</p>
              <p className="text-xs font-black font-mono text-black">{student.enrollmentId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] uppercase font-bold text-slate-600">Turma Designada</p>
              <p className="text-xs font-black uppercase text-black">{studentTurma?.title || 'FIP Pós-Graduação'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] uppercase font-bold text-slate-600">Carga Horária Concluída</p>
              <p className="text-xs font-black text-black">{completedWorkload}h de {totalClassWorkload}h totais ({totalModulesCount} disciplinas)</p>
            </div>
          </div>

          {/* Grades Table */}
          <table className="w-full text-left border-collapse border border-black">
            <thead>
              <tr className="bg-slate-100 border-b border-black text-black font-bold">
                <th className="p-2 border border-black uppercase text-[9px] tracking-wide">Componente Curricular (Módulo)</th>
                <th className="p-2 border border-black uppercase text-[9px] tracking-wide text-center w-28">Carga Horária</th>
                <th className="p-2 border border-black uppercase text-[9px] tracking-wide text-center w-24">Nota Final</th>
                <th className="p-2 border border-black uppercase text-[9px] tracking-wide text-center w-24">Frequência</th>
                <th className="p-2 border border-black uppercase text-[9px] tracking-wide text-center w-28">Situação</th>
              </tr>
            </thead>
            <tbody>
              {studentModules.map((m) => {
                const grade = getGradeForModule(m.id);
                const attendance = getAttendanceForModule(m.id);
                const isApproved = grade !== null && grade >= 7.0 && (attendance.noClasses || attendance.percentage >= 75);

                return (
                  <tr key={m.id} className="border-b border-black">
                    <td className="p-2 border border-black font-semibold text-black uppercase">
                      {m.title}
                      <p className="text-[8px] text-slate-500 lowercase mt-0.5 font-normal">Professor(a): {m.professor}</p>
                    </td>
                    <td className="p-2 border border-black text-center font-mono font-bold text-black">
                      {m.workload}h
                    </td>
                    <td className="p-2 border border-black text-center font-mono font-black text-black">
                      {grade !== null ? grade.toFixed(1) : 'S/N'}
                    </td>
                    <td className="p-2 border border-black text-center font-mono text-black">
                      {attendance.noClasses ? '100%' : `${attendance.percentage}%`}
                    </td>
                    <td className="p-2 border border-black text-center font-bold text-black uppercase text-[10px]">
                      {grade === null ? 'CURSANDO' : isApproved ? 'APROVADO' : 'REPROVADO'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary Indicators */}
          <div className="mt-8 grid grid-cols-2 gap-4 border border-black p-4">
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-600">Média Geral Acadêmica (GPA)</p>
              <p className="text-lg font-black text-black">{averageGrade !== null ? averageGrade.toFixed(1) : 'S/N'}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-600">Resultado Geral Lato Sensu</p>
              <p className="text-xs font-black uppercase text-black">
                {averageGrade && averageGrade >= 7.0 && overallAttendanceRate >= 75 ? 'APROVADO E APTO PARA CERTIFICAÇÃO' : 'DIRETRIZ CURRICULAR EM CURSO'}
              </p>
            </div>
          </div>
        </div>

        {/* Date and Signature Block */}
        <div className="mt-16 text-center space-y-8">
          <p className="text-xs font-bold">
            Gerado eletronicamente em {new Date().toLocaleDateString('pt-BR')} pelo Sistema Acadêmico EVACE
          </p>
          
          <div className="flex justify-around pt-12">
            <div className="text-center w-60">
              <div className="border-t border-black w-full my-1"></div>
              <p className="text-[9px] uppercase font-bold text-slate-500">Secretaria Acadêmica FIP - EVACE</p>
            </div>
            <div className="text-center w-60">
              <div className="border-t border-black w-full my-1"></div>
              <p className="text-[9px] uppercase font-bold text-slate-500">Coordenador do Curso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
