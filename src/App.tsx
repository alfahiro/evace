import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginView from './components/LoginView';

// Administration Sub-panels imported
import AdminTurmas from './components/AdminTurmas';
import AdminAlunos from './components/AdminAlunos';
import AdminPresenca from './components/AdminPresenca';
import AdminNotasDisciplinas from './components/AdminNotasDisciplinas';
import AdminProfessores from './components/AdminProfessores';

// Pre-seeded database elements
import { 
  initialTurmas, 
  initialStudents, 
  initialModules, 
  initialAttendanceRecords, 
  initialGradeRecords, 
  mockAgendaEvents, 
  initialNotifications 
} from './data';

import { Student, Turma, Module, AttendanceRecord, GradeRecord, AgendaEvent, Notification } from './types';
import { Award, CheckSquare, GraduationCap, Trash2, Users, Briefcase } from 'lucide-react';

export default function App() {
  // Shared state databases with local storage persistence
  const [student, setStudent] = useState<Student | null>(null);

  const [turmas, setTurmas] = useState<Turma[]>(() => {
    try {
      const saved = localStorage.getItem('evace_turmas');
      return saved ? JSON.parse(saved) : initialTurmas;
    } catch {
      return initialTurmas;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('evace_students');
      return saved ? JSON.parse(saved) : initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const [modules, setModules] = useState<Module[]>(() => {
    try {
      const saved = localStorage.getItem('evace_modules');
      return saved ? JSON.parse(saved) : initialModules;
    } catch {
      return initialModules;
    }
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('evace_attendance');
      return saved ? JSON.parse(saved) : initialAttendanceRecords;
    } catch {
      return initialAttendanceRecords;
    }
  });

  const [gradeRecords, setGradeRecords] = useState<GradeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('evace_grades');
      return saved ? JSON.parse(saved) : initialGradeRecords;
    } catch {
      return initialGradeRecords;
    }
  });

  const [events, setEvents] = useState<AgendaEvent[]>(() => {
    try {
      const saved = localStorage.getItem('evace_events');
      return saved ? JSON.parse(saved) : mockAgendaEvents;
    } catch {
      return mockAgendaEvents;
    }
  });
  
  // App navigation state
  const [currentTab, setCurrentTab] = useState<'turmas' | 'alunos' | 'presenca' | 'notas_disciplinas' | 'professores'>('turmas');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    try {
      return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
    } catch {
      return true;
    }
  });
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Initialize sidebar state on mount once based on screen size, no persistent resize force
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Synchronize dynamic states with localStorage to support solid persistence
  useEffect(() => {
    localStorage.setItem('evace_turmas', JSON.stringify(turmas));
  }, [turmas]);

  useEffect(() => {
    localStorage.setItem('evace_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('evace_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('evace_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('evace_grades', JSON.stringify(gradeRecords));
  }, [gradeRecords]);

  useEffect(() => {
    localStorage.setItem('evace_events', JSON.stringify(events));
  }, [events]);

  // Load a fast-login context on start and ensure a completely clean slate database-wise
  useEffect(() => {
    setStudent({
      id: 'admin-001',
      name: 'Rômulo Carriello (Coordenação)',
      enrollmentId: 'EVA-COOR-1102',
      email: 'romulo.carriello@evace.com.br',
      turmaId: 't3'
    });

    // One-time clean wipe of all records as requested by the user
    const hasBeenWiped = localStorage.getItem('evace_wipe_all_data_2026_v2');
    if (!hasBeenWiped) {
      setTurmas([]);
      setStudents([]);
      setModules([]);
      setAttendanceRecords([]);
      setGradeRecords([]);
      setEvents([]);
      localStorage.setItem('evace_turmas', JSON.stringify([]));
      localStorage.setItem('evace_students', JSON.stringify([]));
      localStorage.setItem('evace_modules', JSON.stringify([]));
      localStorage.setItem('evace_attendance', JSON.stringify([]));
      localStorage.setItem('evace_grades', JSON.stringify([]));
      localStorage.setItem('evace_events', JSON.stringify([]));
      localStorage.setItem('evace_wipe_all_data_2026_v2', 'true');
    }
  }, []);

  const handleLogout = () => {
    setStudent(null);
  };

  const handleClearAllData = () => {
    if (window.confirm("Atenção: Você deseja excluir todas as turmas, todos os alunos e todas as disciplinas de forma permanente? Esta ação apagará todo o histórico e não poderá ser desfeita.")) {
      setTurmas([]);
      setStudents([]);
      setModules([]);
      setAttendanceRecords([]);
      setGradeRecords([]);
      setEvents([]);
      localStorage.setItem('evace_turmas', JSON.stringify([]));
      localStorage.setItem('evace_students', JSON.stringify([]));
      localStorage.setItem('evace_modules', JSON.stringify([]));
      localStorage.setItem('evace_attendance', JSON.stringify([]));
      localStorage.setItem('evace_grades', JSON.stringify([]));
      localStorage.setItem('evace_events', JSON.stringify([]));
      alert("Sucesso: Todas as turmas, alunos e disciplinas foram excluídos com sucesso!");
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Administrative State Mutators
  
  // 1. Class (Turma) Handlers
  const handleAddTurma = (newTurma: Omit<Turma, 'id'>) => {
    // Generate automatic folder structure for organizing documents as requested
    const nowStr = new Date().toLocaleDateString('pt-BR');
    const docFolderId = `fld_docs_${Date.now()}`;
    const assessmentFolderId = `fld_assess_${Date.now()}`;
    const enrollmentFolderId = `fld_enroll_${Date.now()}`;

    const defaultFolders = [
      {
        id: docFolderId,
        name: '📁 Manuais e Diretrizes',
        type: 'folder' as const,
        updatedAt: nowStr
      },
      {
        id: `file_syllabus_${Date.now()}`,
        name: '📄 Projeto_Pedagogico_Curso.pdf',
        type: 'file' as const,
        size: '1.8 MB',
        parentId: docFolderId,
        updatedAt: nowStr
      },
      {
        id: `file_cal_${Date.now()}`,
        name: '📅 Calendario_Academico_2026.pdf',
        type: 'file' as const,
        size: '850 KB',
        parentId: docFolderId,
        updatedAt: nowStr
      },
      {
        id: assessmentFolderId,
        name: '📁 Avaliações e Provas',
        type: 'folder' as const,
        updatedAt: nowStr
      },
      {
        id: enrollmentFolderId,
        name: '📁 Documentos de Matrícula (Alunos)',
        type: 'folder' as const,
        updatedAt: nowStr
      },
      {
        id: `file_term_${Date.now()}`,
        name: '📄 Termo_de_Adesao_FIP_Online.pdf',
        type: 'file' as const,
        size: '420 KB',
        parentId: enrollmentFolderId,
        updatedAt: nowStr
      }
    ];

    const fresh: Turma = {
      ...newTurma,
      id: `t_${Date.now()}`,
      folders: defaultFolders
    };
    setTurmas(prev => [...prev, fresh]);

    // Push system alert notification
    const newNotif: Notification = {
      id: `n_t_${Date.now()}`,
      message: `Nova Turma Registrada: "${fresh.title}" pelo administrador (Pasta de Documentos gerada).`,
      date: 'Agora mesmo',
      read: false,
      type: 'general'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleDeleteTurma = (id: string) => {
    setTurmas(prev => prev.filter(t => t.id !== id));
    // Cascade removal for students enrollment linkage and modules setup
    setStudents(prev => prev.map(s => s.turmaId === id ? { ...s, turmaId: '' } : s));
  };

  const handleUpdateTurma = (updatedTurma: Turma) => {
    setTurmas(prev => prev.map(t => t.id === updatedTurma.id ? updatedTurma : t));
  };

  // 2. Student (Aluno) Handlers
  const handleAddStudent = (newS: Omit<Student, 'id'>) => {
    const fresh: Student = {
      ...newS,
      id: `s_${Date.now()}`
    };
    setStudents(prev => [...prev, fresh]);
    
    // Notify in notification shelf
    const newNotif: Notification = {
      id: `n_s_${Date.now()}`,
      message: `Aluno matriculado: ${fresh.name} na turma código: ${fresh.turmaId}.`,
      date: 'Agora mesmo',
      read: false,
      type: 'general'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setGradeRecords(prev => prev.filter(g => g.studentId !== id));
  };

  // 3. Subject (Disciplina) Handlers
  const handleAddModule = (newM: Omit<Module, 'id'>) => {
    const fresh: Module = {
      ...newM,
      id: `m_${Date.now()}`
    };
    setModules(prev => [...prev, fresh]);
  };

  const handleUpdateModuleStatus = (moduleId: string, newStatus: 'concluido' | 'em_andamento' | 'agendado') => {
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, status: newStatus } : m));
  };

  const handleDeleteModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
    setAttendanceRecords(prev => prev.filter(a => a.moduleId !== id));
    setGradeRecords(prev => prev.filter(g => g.moduleId !== id));

    const targetModule = modules.find(m => m.id === id)?.title || 'Disciplina';
    const newNotif: Notification = {
      id: `n_del_m_${Date.now()}`,
      message: `Disciplina excluída: "${targetModule}".`,
      date: 'Agora mesmo',
      read: false,
      type: 'general'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 4. Daily Attendance (Presenças) Handlers
  const handleSaveAttendance = (newRecord: Omit<AttendanceRecord, 'id'>) => {
    // Check if attendance already exists for this group + subject + date
    const index = attendanceRecords.findIndex(
      r => r.turmaId === newRecord.turmaId && 
           r.moduleId === newRecord.moduleId && 
           r.date === newRecord.date
    );

    if (index !== -1) {
      setAttendanceRecords(prev => {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          presents: newRecord.presents
        };
        return copy;
      });
    } else {
      const fresh: AttendanceRecord = {
        ...newRecord,
        id: `att_${Date.now()}`
      };
      setAttendanceRecords(prev => [...prev, fresh]);
    }

    // Add alert
    const targetModule = modules.find(m => m.id === newRecord.moduleId)?.title || 'Disciplina';
    const newNotif: Notification = {
      id: `n_att_${Date.now()}`,
      message: `Ficha de presença regravada para ${targetModule} na data ${newRecord.date}.`,
      date: 'Hoje',
      read: false,
      type: 'schedule'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 5. Grading Workbook (Notas) Handlers
  const handleSaveGrades = (grades: { studentId: string; grade: number }[], turmaId: string, moduleId: string) => {
    setGradeRecords(prev => {
      // Remove ALL existing grade entries for this module context (since moduleId uniquely identifies the discipline)
      const remaining = prev.filter(
        record => record.moduleId !== moduleId
      );

      // Create new fresh grade records
      const freshRecords: GradeRecord[] = grades.map((g, i) => ({
        id: `grade_${Date.now()}_${i}`,
        studentId: g.studentId,
        turmaId,
        moduleId,
        grade: g.grade
      }));

      return [...remaining, ...freshRecords];
    });

    const targetModule = modules.find(m => m.id === moduleId)?.title || 'Disciplina';
    const newNotif: Notification = {
      id: `n_grade_${Date.now()}`,
      message: `Boletim de notas e diário de avaliações atualizados em "${targetModule}".`,
      date: 'Agora mesmo',
      read: false,
      type: 'grade'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 6. Agenda/Aulas Handlers
  const handleAddEvent = (newEvent: Omit<AgendaEvent, 'id'>) => {
    const fresh: AgendaEvent = {
      ...newEvent,
      id: `e_${Date.now()}`
    };
    setEvents(prev => [...prev, fresh]);
    
    // Notify
    const newNotif: Notification = {
      id: `n_e_${Date.now()}`,
      message: `Aula ou evento síncrono reagendado: "${fresh.title}" para ${fresh.date}.`,
      date: 'Agora mesmo',
      read: false,
      type: 'schedule'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };


  if (!student) {
    return <LoginView onLogin={(curr) => setStudent(curr)} />;
  }

  return (
    <div 
      className="min-h-screen flex flex-col font-sans relative text-slate-800 bg-[#e8f1ec]"
      id="evace-portal-layout"
    >
      {/* Geometrical background elements replicating the main low-poly theme */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50 overflow-hidden">
        <svg 
          className="w-full h-full min-h-screen" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 900" 
          preserveAspectRatio="none"
        >
          <polygon points="0,0 600,0 300,450" fill="#cee2d6" opacity="0.6" />
          <polygon points="600,0 1440,0 1000,500" fill="#e1ede5" opacity="0.7" />
          <polygon points="0,350 400,600 0,900" fill="#d8ebd2" opacity="0.5" />
          <polygon points="400,600 1000,500 700,900" fill="#c7decb" opacity="0.8" />
          <polygon points="1000,500 1440,300 1440,800" fill="#e6f0e9" opacity="0.6" />
          <polygon points="700,900 1440,800 1440,900 1000,900" fill="#bcdcc2" opacity="0.7" />
          <polygon points="300,450 1000,500 400,600" fill="#cfebd8" opacity="0.4" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col flex-grow">
        
        {/* Academic branding banner header */}
        <Header 
          student={student} 
          onLogout={handleLogout}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkAsRead}
          onClearNotifications={handleMarkAllAsRead}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 pb-20 pt-2 relative">
          
          {/* Persistent Horizontal Navigation Tab Bar */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-1.5 mb-6 border border-slate-200/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 rounded-lg shrink-0 self-start md:self-auto">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#0a4d2c] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                Secretaria Acadêmica
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 md:justify-end w-full md:w-auto">
              <button
                onClick={() => setCurrentTab('turmas')}
                className={`flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex-1 sm:flex-initial ${
                  currentTab === 'turmas'
                    ? 'bg-[#0a4d2c] text-white shadow-md shadow-emerald-950/20 scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0b4e2d] active:scale-95'
                }`}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                <span>Gerenciar Turmas</span>
              </button>

              <button
                onClick={() => setCurrentTab('presenca')}
                className={`flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex-1 sm:flex-initial ${
                  currentTab === 'presenca'
                    ? 'bg-[#0a4d2c] text-white shadow-md shadow-emerald-950/20 scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0b4e2d] active:scale-95'
                }`}
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                <span>Controle de Presença</span>
              </button>

              <button
                onClick={() => setCurrentTab('notas_disciplinas')}
                className={`flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex-1 sm:flex-initial ${
                  currentTab === 'notas_disciplinas'
                    ? 'bg-[#0a4d2c] text-white shadow-md shadow-emerald-950/20 scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0b4e2d] active:scale-95'
                }`}
              >
                <Award className="w-4 h-4 mr-2" />
                <span>Controle de Disciplinas</span>
              </button>

              <button
                onClick={() => setCurrentTab('professores')}
                className={`flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex-1 sm:flex-initial ${
                  currentTab === 'professores'
                    ? 'bg-[#0a4d2c] text-white shadow-md shadow-emerald-950/20 scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0b4e2d] active:scale-95'
                }`}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                <span>Cadastro de Professores</span>
              </button>
            </div>
          </div>

          <div 
            className="transition-all duration-300 pl-0"
            id="tab-view-viewport"
          >
            {/* CONDITIONAL RENDER ACCORDING TO TABS */}
            
            {/* TAB 1: GERENCIAR TURMAS */}
            {currentTab === 'turmas' && (
              <AdminTurmas
                turmas={turmas}
                students={students}
                modules={modules}
                onAddTurma={handleAddTurma}
                onDeleteTurma={handleDeleteTurma}
                onAddStudent={handleAddStudent}
                onAddModule={handleAddModule}
                onDeleteModule={handleDeleteModule}
                onUpdateTurma={handleUpdateTurma}
              />
            )}

            {/* TAB 2: INCLUSÃO DE ALUNOS */}
            {currentTab === 'alunos' && (
              <AdminAlunos
                students={students}
                turmas={turmas}
                onAddStudent={handleAddStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            )}

            {/* TAB 3: CONTROLE DE PRESENÇA (DIÁRIO COMPLETO) */}
            {currentTab === 'presenca' && (
              <AdminPresenca
                turmas={turmas}
                students={students}
                modules={modules}
                attendanceRecords={attendanceRecords}
                onSaveAttendance={handleSaveAttendance}
              />
            )}

            {/* TAB 4: CONTROLE DE NOTAS E DISCIPLINAS */}
            {currentTab === 'notas_disciplinas' && (
              <AdminNotasDisciplinas
                turmas={turmas}
                students={students}
                modules={modules}
                gradeRecords={gradeRecords}
                attendanceRecords={attendanceRecords}
                onUpdateModuleStatus={handleUpdateModuleStatus}
                onSaveGrades={handleSaveGrades}
              />
            )}

            {/* TAB 5: CADASTRO DE PROFESSORES */}
            {currentTab === 'professores' && (
              <AdminProfessores />
            )}



            <Footer />
          </div>

        </main>
      </div>
    </div>
  );
}
