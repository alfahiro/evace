import React, { useState, useEffect } from 'react';
import { X, Check, AlertTriangle, HelpCircle, Edit3, Download, FileSpreadsheet, Printer } from 'lucide-react';
import { Student, Module, Turma, GradeRecord, AttendanceRecord } from '../types';
import EvaceLogo from './EvaceLogo';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface DiarioOficialModalProps {
  isOpen: boolean;
  onClose: () => void;
  turma: Turma;
  module: Module;
  students: Student[];
  gradeRecords: GradeRecord[];
  attendanceRecords: AttendanceRecord[];
}

export default function DiarioOficialModal({
  isOpen,
  onClose,
  turma,
  module,
  students,
  gradeRecords,
  attendanceRecords
}: DiarioOficialModalProps) {
  // Sorted students alphabetically by name to make the class journal look professional
  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));

  // Form custom overrides for header metadata
  const [curso, setCurso] = useState(turma.title);
  const [local, setLocal] = useState('Evace Cursos e Treinamentos / MACAÉ - RJ');
  const [turmaCode, setTurmaCode] = useState(turma.code || turma.number || '2025.1.6122.00002');
  const [professor, setProfessor] = useState(module.professor || 'Rômulo Carriello');
  const [semestre, setSemestre] = useState('2025.1');
  const [turno, setTurno] = useState('MATUTINO');
  const [disciplina, setDisciplina] = useState(module.title);
  const [cargaHoraria, setCargaHoraria] = useState(String(module.workload));
  const [inicioCurso, setInicioCurso] = useState('15/3/2025');
  const [matrizCurricular, setMatrizCurricular] = useState('4');
  const [cargaHorariaTotal, setCargaHorariaTotal] = useState('450');

  // Print date-time string
  const [currentPrintTime, setCurrentPrintTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const dateFormatted = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
    const timeFormatted = `${now.getHours()}:${minutes}`;
    setCurrentPrintTime(`${dateFormatted} ${timeFormatted}`);
  }, [isOpen]);

  // Filter attendance records to match class and current module context
  const moduleAttendances = attendanceRecords.filter(
    ar => ar.turmaId === turma.id && ar.moduleId === module.id
  );

  const getStudentMetrics = (studentId: string) => {
    // 1. Grade Record
    const gradeMatch = [...gradeRecords].reverse().find(
      gr => gr.studentId === studentId && gr.moduleId === module.id
    );
    const gradeVal = gradeMatch ? gradeMatch.grade : null;

    // 2. Absences Calculation: Check out occurrences of student is absent in registered days
    // Count days where there is a roll call and student.id is NOT in .presents
    let absences = 0;
    if (moduleAttendances.length > 0) {
      moduleAttendances.forEach(rec => {
        if (!rec.presents.includes(studentId)) {
          absences += 1;
        }
      });
    }

    // 3. Status logic
    let status = 'EM PROGRESSO';
    if (gradeVal !== null) {
      // Absences shouldn't exceed 25% of hours (each absence represents 1 class day, let's assume standard limit)
      const parsedCH = parseInt(cargaHoraria) || 20;
      const parsedAbsences = absences;
      
      if (gradeVal >= 7.0) {
        status = 'APROVADO';
      } else {
        status = 'REPROVADO';
      }
    }

    return {
      grade: gradeVal,
      absences,
      status
    };
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-journal-sheet');
    if (!element) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Enhances text and vector sharpness in generated PDF
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794, // Force standard A4 width at 96 DPI
        windowWidth: 794, // Enforce standard layout landscape calculations
        onclone: (clonedDoc) => {
          // 1. Sanitize style tags and replace any oklch or oklab with a safe rgb fallback
          const styleElements = Array.from(clonedDoc.querySelectorAll('style'));
          styleElements.forEach(style => {
            if (style.textContent) {
              style.textContent = style.textContent
                .replace(/oklch\([^)]+\)/gi, '#10b981')
                .replace(/oklab\([^)]+\)/gi, '#10b981');
            }
          });

          // 2. Sanitize element inline styles
          const allEls = Array.from(clonedDoc.querySelectorAll('*'));
          allEls.forEach(el => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.style) {
              for (let i = 0; i < htmlEl.style.length; i++) {
                const propName = htmlEl.style[i];
                const propVal = htmlEl.style.getPropertyValue(propName);
                if (propVal && (propVal.includes('oklch') || propVal.includes('oklab'))) {
                   htmlEl.style.setProperty(propName, '#10b981');
                }
              }
            }
          });

          // 3. For all parsed stylesheets in the cloned document, delete rules that contain oklch or oklab
          // to completely protect the html2canvas internal CSS parser from crashing.
          for (let i = 0; i < clonedDoc.styleSheets.length; i++) {
            const sheet = clonedDoc.styleSheets[i] as CSSStyleSheet;
            try {
              if (sheet.cssRules) {
                for (let j = sheet.cssRules.length - 1; j >= 0; j--) {
                  const rule = sheet.cssRules[j];
                  if (rule.cssText && (rule.cssText.includes('oklch') || rule.cssText.includes('oklab'))) {
                    try {
                      sheet.deleteRule(j);
                    } catch (err) {
                      // fallback if rule cannot be deleted
                    }
                  }
                }
              }
            } catch (e) {
              console.warn('Could not read/sanitize cloned styleSheet:', e);
            }
          }

          // 4. Force the printable cloned element to have fixed, exact desktop A4 dimensions so that it matches the preview exactly
          const clonedElement = clonedDoc.getElementById('printable-journal-sheet');
          if (clonedElement) {
            clonedDoc.body.innerHTML = '';
            clonedDoc.body.style.margin = '0';
            clonedDoc.body.style.padding = '0';
            clonedDoc.body.style.width = '794px';
            clonedDoc.body.style.backgroundColor = '#ffffff';
            clonedDoc.body.appendChild(clonedElement);

            clonedElement.style.setProperty('width', '794px', 'important');
            clonedElement.style.setProperty('max-width', '794px', 'important');
            clonedElement.style.setProperty('min-width', '794px', 'important');
            clonedElement.style.setProperty('min-height', '1123px', 'important');
            clonedElement.style.setProperty('box-sizing', 'border-box', 'important');
            clonedElement.style.setProperty('padding', '38px', 'important');
            clonedElement.style.setProperty('margin', '0 auto', 'important');
            clonedElement.style.setProperty('background-color', '#ffffff', 'important');
            clonedElement.style.setProperty('box-shadow', 'none', 'important');
            clonedElement.style.setProperty('border', 'none', 'important');
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      // Calculate scaled dimensions to center the document inside the PDF page with professional 10mm margins
      const marginX = 10; // 10mm left and right margin
      const marginY = 10; // 10mm top and bottom margin
      const printableWidth = pdfWidth - (marginX * 2); // 190mm printable width (centered mathematically)
      const imgHeightInPdf = (canvasHeight * printableWidth) / canvasWidth;
      
      let heightLeft = imgHeightInPdf;
      let position = 0;
      
      // Render page 1
      pdf.addImage(imgData, 'PNG', marginX, marginY + position, printableWidth, imgHeightInPdf);
      heightLeft -= (pdfHeight - (marginY * 2));
      
      // Render additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeightInPdf;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', marginX, marginY + position, printableWidth, imgHeightInPdf);
        heightLeft -= (pdfHeight - (marginY * 2));
      }
      
      const safeCursoName = curso.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const safeDisciplinaName = disciplina.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      pdf.save(`diario_oficial_${safeCursoName}_${safeDisciplinaName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintOnlyDiv = () => {
    window.print();
  };

  const handleDownloadExcel = () => {
    setIsDownloading(true);
    try {
      const data = [
        ["EVACE CURSOS E TREINAMENTOS - DIÁRIO OFICIAL DE NOTAS E FREQUÊNCIAS"],
        [],
        ["DADOS DA DISCIPLINA / CURSO"],
        ["Curso", curso, "", "Semestre", semestre],
        ["Local", local, "", "Turno", turno],
        ["Turma", turmaCode, "", "Disciplina", disciplina],
        ["Professor", professor, "", "Carga Horária (Disciplina)", `${cargaHoraria}h`],
        ["Início do Curso", inicioCurso, "", "Matriz Curricular", matrizCurricular],
        ["Carga Horária Total Curso", `${cargaHorariaTotal}h`],
        [],
        ["ALUNOS E RENDIMENTO"],
        ["Seq.", "Matrícula", "Aluno", "Nota/Média", "Faltas", "Situação"]
      ];

      sortedStudents.forEach((stud, idx) => {
        const metrics = getStudentMetrics(stud.id);
        const displayGrade = metrics.grade !== null 
          ? metrics.grade
          : '';
        data.push([
          (idx + 1).toString(),
          stud.enrollmentId,
          stud.name.toUpperCase(),
          displayGrade,
          metrics.absences,
          metrics.status
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(data);

      // Auto-fit column widths
      const maxColLengths = data.reduce((acc, row) => {
        row.forEach((cell, colIndex) => {
          const val = cell !== null && cell !== undefined ? String(cell) : '';
          acc[colIndex] = Math.max(acc[colIndex] || 0, val.length);
        });
        return acc;
      }, [] as number[]);

      worksheet['!cols'] = maxColLengths.map(len => ({ wch: Math.max(len + 3, 10) }));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Diário Oficial");

      const safeCursoName = curso.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const safeDisciplinaName = disciplina.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      XLSX.writeFile(workbook, `diario_oficial_${safeCursoName}_${safeDisciplinaName}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Ocorreu um erro ao gerar a planilha Excel. Por favor, tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center items-start py-8 px-4" id="diario-pdf-modal">
      
      {/* Dynamic Print CSS to hide everything except the print-area layout */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          /* Hide all outer page contents */
          body * {
            visibility: hidden !important;
          }
          /* Clean layout and hide buttons, sidebar, panels and customizer widgets */
          .no-print, .no-print *, header, footer, aside, button, nav, #header-bar, #evace-primary-footer {
            display: none !important;
            visibility: hidden !important;
          }
          /* Isolate and render only the official journal sheet document */
          #printable-journal-sheet, #printable-journal-sheet * {
            visibility: visible !important;
          }
          #printable-journal-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
          table, th, td, tr {
            border-color: black !important;
            color: black !important;
          }
        }
      `}} />

      <div className="bg-slate-50 w-full max-w-6xl rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col lg:flex-row h-auto max-h-[90vh]">
        
        {/* Left Side: Parameters Customizer */}
        <div className="w-full lg:w-80 bg-white p-6 border-b lg:border-b-0 lg:border-r border-slate-100 overflow-y-auto max-h-[30vh] lg:max-h-full space-y-4 shrink-0 no-print">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">Geração de Relatório</h3>
              <p className="text-[10px] text-gray-400">Ajuste o cabeçalho impresso oficial</p>
            </div>
            <div className="p-1 px-2.5 bg-emerald-50 text-[#0a4d2c] rounded-md text-[9px] font-bold uppercase tracking-wide">
              PDF / EXCEL
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nome do Curso / Especialização</label>
              <input
                type="text"
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#0a4d2c]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Unidade / Local</label>
              <input
                type="text"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#0a4d2c]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Turma Mapeada</label>
                <input
                  type="text"
                  value={turmaCode}
                  onChange={(e) => setTurmaCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#0a4d2c]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Semestre</label>
                <input
                  type="text"
                  value={semestre}
                  onChange={(e) => setSemestre(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#0a4d2c]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Professor Responsável</label>
              <input
                type="text"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#0a4d2c]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Turno</label>
                <select
                  value={turno}
                  onChange={(e) => setTurno(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#0a4d2c] bg-white"
                >
                  <option value="MATUTINO">Matutino</option>
                  <option value="VESPERTINO">Vespertino</option>
                  <option value="NOTURNO">Noturno</option>
                  <option value="INTEGRAL">Integral</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">CH Disciplina</label>
                <input
                  type="text"
                  value={cargaHoraria}
                  onChange={(e) => setCargaHoraria(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#0a4d2c]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nome da Disciplina</label>
              <input
                type="text"
                value={disciplina}
                onChange={(e) => setDisciplina(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#0a4d2c]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Início das Aulas</label>
                <input
                  type="text"
                  value={inicioCurso}
                  onChange={(e) => setInicioCurso(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#0a4d2c]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Matriz Curr.</label>
                <input
                  type="text"
                  value={matrizCurricular}
                  onChange={(e) => setMatrizCurricular(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#0a4d2c]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Carga Horária Total Curso</label>
              <input
                type="text"
                value={cargaHorariaTotal}
                onChange={(e) => setCargaHorariaTotal(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#0a4d2c]"
              />
            </div>
          </div>

          {/* Buttons block removed as requested */}
        </div>

        {/* Right Side: Virtual Document Preview Sheet (Simulating real A4 page) */}
        <div className="flex-1 bg-slate-100 p-4 sm:p-8 overflow-y-auto max-h-[60vh] lg:max-h-full flex flex-col items-center">
          
          {/* Modal Close float bar for desktop inside modal layout */}
          <div className="w-full max-w-[210mm] flex justify-between items-center mb-4 no-print">
            <span className="text-xs text-slate-500 font-medium">Pré-visualização do Documento Oficial (Visualização A4)</span>
            <button 
              onClick={onClose}
              className="p-1.5 bg-white text-slate-500 hover:text-slate-800 rounded-full border border-slate-200 cursor-pointer hover:shadow-xs transition-all"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Printable Page Structure (A4 proportions relative layout target) */}
          <div 
            className="print-area bg-white text-black p-10 shadow-lg border border-slate-200/60 rounded-sm w-full max-w-[210mm] min-h-[297mm] flex flex-col justify-between whitespace-normal relative"
            style={{ 
              fontFamily: '"Calibri", "Candara", "Segoe UI", Arial, sans-serif',
              fontSize: '12px' 
            }}
            id="printable-journal-sheet"
          >
            {/* Absolute floating actions inside print preview card, excluded from printing */}
            <div className="absolute top-4 right-4 no-print flex space-x-2">
              <button
                onClick={handlePrintOnlyDiv}
                title="Imprimir Documento"
                className="p-2 bg-slate-900 text-white hover:text-emerald-400 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
              >
                <Printer className="w-5 h-5" />
              </button>
            </div>

            <div>
              {/* Header section replica */}
              <div className="flex flex-col items-center justify-center pb-4 text-center border-b border-black">
                
                {/* Brand Logo Wing */}
                <div className="flex items-center justify-center select-none mb-3">
                  <div className="flex flex-col items-center border border-black rounded p-2 text-center bg-white">
                    <EvaceLogo variant="dark" size="md" showText={true} />
                  </div>
                </div>

                {/* Center title details */}
                <div className="text-center w-full">
                  <h1 className="text-sm font-black tracking-wide uppercase text-[#0a4d2c] style-calibri">
                    EVACE Cursos e Treinamentos
                  </h1>
                  <h2 className="text-base font-black tracking-widest uppercase text-slate-900 mt-1 style-calibri">
                    Diário Oficial de Notas e Frequências
                  </h2>
                </div>
              </div>

              {/* Course descriptor grid aligned perfectly as a bordered form mockup */}
              <div className="border border-black text-[12px] uppercase text-black font-semibold mt-4">
                {/* Row 1 */}
                <div className="flex w-full border-b border-black">
                  <div className="w-2/3 p-2 border-r border-black">
                    <span className="font-extrabold text-[10px] text-gray-500 block leading-none mb-1">Curso / Especialização</span>
                    <span className="font-bold text-[12px] text-slate-900">{curso}</span>
                  </div>
                  <div className="w-1/3 p-2">
                    <span className="font-extrabold text-[10px] text-gray-500 block leading-none mb-1">Semestre / Período</span>
                    <span className="font-bold text-[12px] text-slate-900">{semestre}</span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex w-full border-b border-black">
                  <div className="w-1/2 p-2 border-r border-black">
                    <span className="font-extrabold text-[10px] text-gray-500 block leading-none mb-1">Local / Unidade</span>
                    <span className="font-bold text-[12px] text-slate-900">{local}</span>
                  </div>
                  <div className="w-1/4 p-2 border-r border-black">
                    <span className="font-extrabold text-[10px] text-gray-500 block leading-none mb-1">Turma Mapeada</span>
                    <span className="font-bold text-[12px] text-slate-900">{turmaCode}</span>
                  </div>
                  <div className="w-1/4 p-2">
                    <span className="font-extrabold text-[10px] text-gray-500 block leading-none mb-1">Turno</span>
                    <span className="font-bold text-[12px] text-slate-900">{turno}</span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="flex w-full border-b border-black">
                  <div className="w-full p-2">
                    <span className="font-extrabold text-[10px] text-gray-500 block leading-none mb-1">Professor Responsável</span>
                    <span className="font-bold text-[12px] text-slate-900">{professor}</span>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="flex w-full border-b border-black">
                  <div className="w-2/3 p-2 border-r border-black">
                    <span className="font-extrabold text-[10px] text-gray-500 block leading-none mb-1">Nome da Disciplina</span>
                    <span className="font-bold text-[12px] text-slate-900">{disciplina}</span>
                  </div>
                  <div className="w-1/3 p-2">
                    <span className="font-extrabold text-[10px] text-gray-500 block leading-none mb-1">Carga Horária (Disc.)</span>
                    <span className="font-bold text-[12px] text-slate-900">{cargaHoraria}</span>
                  </div>
                </div>

                {/* Row 5 */}
                <div className="flex w-full col-span-12">
                  <div className="w-1/3 p-2 border-r border-black">
                    <span className="font-extrabold text-[10px] text-gray-500 block leading-none mb-1">Início das Aulas</span>
                    <span className="font-bold text-[12px] text-slate-900">{inicioCurso}</span>
                  </div>
                  <div className="w-1/3 p-2 border-r border-black">
                    <span className="font-extrabold text-[10px] text-gray-500 block leading-none mb-1">Matriz Curricular</span>
                    <span className="font-bold text-[12px] text-slate-900">{matrizCurricular}</span>
                  </div>
                  <div className="w-1/3 p-2">
                    <span className="font-extrabold text-[10px] text-gray-500 block leading-none mb-1">CH Total do Curso</span>
                    <span className="font-bold text-[12px] text-slate-900">{cargaHorariaTotal}</span>
                  </div>
                </div>
              </div>

              {/* Table header boundary */}
              <div className="mt-4">
                <table className="w-full border-collapse border border-black text-[12px] uppercase font-semibold text-black">
                  <thead>
                    <tr className="bg-slate-100/50 text-center text-black border-b border-black text-[12px]">
                      <th className="border-r border-black p-2 font-extrabold w-12">Seq.</th>
                      <th className="border-r border-black p-2 font-extrabold w-36">Matrícula</th>
                      <th className="border-r border-black p-2 font-extrabold text-left pl-3">Nome Completo do Aluno</th>
                      <th className="border-r border-black p-2 font-extrabold w-20 text-center">Nota Final</th>
                      <th className="border-r border-black p-2 font-extrabold w-16 text-center">Faltas</th>
                      <th className="border-r border-black p-2 font-extrabold w-20 text-center">Média</th>
                      <th className="border-black p-2 font-extrabold w-32 text-center">Situação Regular</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-gray-500 lowercase italic">
                          Nenhum estudante matriculado nesta turma para exibição no diário oficial.
                        </td>
                      </tr>
                    ) : (
                      sortedStudents.map((stud, idx) => {
                        const metrics = getStudentMetrics(stud.id);
                        
                        // Format grade to match the Portuguese decimal standard with commas, e.g. "10,0"
                        const displayGrade = metrics.grade !== null 
                          ? metrics.grade.toFixed(1).replace('.', ',') 
                          : '';
                        
                        return (
                           <tr key={stud.id} className="border-b border-black hover:bg-slate-50 transition-colors text-center hover:no-print">
                            <td className="border-r border-black p-2 text-center text-[12px]">{idx + 1}</td>
                            <td className="border-r border-black p-2 text-center tracking-wider text-[12px]">{stud.enrollmentId}</td>
                            <td className="border-r border-black p-2 text-left pl-3 text-[12px] uppercase font-bold text-slate-950">{stud.name}</td>
                            <td className="border-r border-black p-2 text-center font-bold text-[12px]">{displayGrade || '-'}</td>
                            <td className="border-r border-black p-2 text-center text-[12px]">{metrics.absences}</td>
                            <td className="border-r border-black p-2 text-center font-bold text-[12px]">{displayGrade || '-'}</td>
                            <td className="p-2 text-center font-extrabold text-[12px]">
                              <span className={metrics.status === 'APROVADO' ? 'text-emerald-800' : 'text-rose-700'}>
                                {metrics.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Signature panel / footer */}
            <div className="mt-16 no-break-inside">
              <div className="flex flex-col items-center justify-center">
                <div className="w-80 border-t border-black py-1.5 text-center text-[11px] uppercase font-bold tracking-wider text-black">
                  Assinatura do Docente: {professor}
                </div>
              </div>

              {/* Running Print Date and Page tag details */}
              <div className="flex justify-between items-end text-[10px] font-medium text-slate-500 mt-10 pt-4 border-t border-slate-100 border-dashed">
                <span>{currentPrintTime}</span>
                <span className="uppercase text-[10px] font-sans font-bold">Pág. 1</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
