import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LoginView from './components/LoginView';

// Administration Sub-panels imported
import AdminTurmas from './components/AdminTurmas';
import AdminAlunos from './components/AdminAlunos';
import AdminPresenca from './components/AdminPresenca';
import AdminNotasDisciplinas from './components/AdminNotasDisciplinas';

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
import { Award, CheckSquare, GraduationCap, Users } from 'lucide-react';

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
  const [currentTab, setCurrentTab] = useState<'turmas' | 'alunos' | 'presenca' | 'notas_disciplinas'>('turmas');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    try {
      return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
    } catch {
      return true;
    }
  });
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Force sidebar open on desktop screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
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

  // Load a fast-login context on start (Auto-sign in as coordinator for premium ease-of-use)
  useEffect(() => {
    setStudent({
      id: 'admin-001',
      name: 'Rômulo Carriello (Coordenação)',
      enrollmentId: 'EVA-COOR-1102',
      email: 'romulo.carriello@evace.com.br',
      turmaId: 't3'
    });

    // Automatically inject/merge student and class from form if missing from state
    setTurmas(prev => {
      const merged = [...prev];
      initialTurmas.forEach(t => {
        if (!merged.some(item => item.id === t.id)) {
          merged.push(t);
        }
      });
      return merged;
    });

    setStudents(prev => {
      const merged = [...prev];
      initialStudents.forEach(s => {
        if (!merged.some(item => item.id === s.id)) {
          merged.push(s);
        }
      });
      return merged;
    });

    setModules(prev => {
      const merged = [...prev];
      initialModules.forEach(m => {
        if (!merged.some(item => item.id === m.id)) {
          merged.push(m);
        }
      });
      return merged;
    });

    setAttendanceRecords(prev => {
      const merged = [...prev];
      initialAttendanceRecords.forEach(a => {
        // Find existing attendance by id and replace, or push
        const flag = merged.findIndex(item => item.id === a.id);
        if (flag > -1) {
          merged[flag] = a;
        } else {
          merged.push(a);
        }
      });
      return merged;
    });

    setGradeRecords(prev => {
      const merged = [...prev];
      initialGradeRecords.forEach(g => {
        const flag = merged.findIndex(item => item.id === g.id);
        if (flag > -1) {
          merged[flag] = g;
        } else {
          merged.push(g);
        }
      });
      return merged;
    });
  }, []);

  const handleLogout = () => {
    setStudent(null);
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
    const fresh: Turma = {
      ...newTurma,
      id: `t_${Date.now()}`
    };
    setTurmas(prev => [...prev, fresh]);

    // Push system alert notification
    const newNotif: Notification = {
      id: `n_t_${Date.now()}`,
      message: `Nova Turma Registrada: "${fresh.title}" pelo administrador.`,
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
          
          <Sidebar 
            currentTab={currentTab as any} 
            onChangeTab={(tab) => {
              setCurrentTab(tab as any);
              if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
              }
            }} 
            isOpen={isSidebarOpen}
            onToggle={setIsSidebarOpen}
          />

          <div 
            className={`transition-all duration-300 ${isSidebarOpen ? 'lg:pl-[272px]' : 'pl-0'}`}
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



            <Footer />
          </div>

        </main>
      </div>
    </div>
  );
}
