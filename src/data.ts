import { Student, Module, Turma, AgendaEvent, Book, Notification, AttendanceRecord, GradeRecord } from './types';

// Pre-seeded classes (Turmas)
export const initialTurmas: Turma[] = [
  {
    id: 't_urgencia_uti_01',
    title: 'Especialização em Urgência, Emergência e UTI',
    number: 'T01',
    code: 'MCR-UTI-2025',
    category: 'UTI',
    folders: [
      {
        id: 'fld_seeded_manuais',
        name: '📁 Manuais e Diretrizes',
        type: 'folder',
        updatedAt: '12/06/2026'
      },
      {
        id: 'file_seeded_syllabus',
        name: '📄 Projeto_Pedagogico_Curso.pdf',
        type: 'file',
        size: '1.8 MB',
        parentId: 'fld_seeded_manuais',
        updatedAt: '12/06/2026'
      },
      {
        id: 'file_seeded_calendar',
        name: '📅 Calendario_Academico_2026.pdf',
        type: 'file',
        size: '850 KB',
        parentId: 'fld_seeded_manuais',
        updatedAt: '12/06/2026'
      },
      {
        id: 'fld_seeded_avaliacoes',
        name: '📁 Avaliações e Provas',
        type: 'folder',
        updatedAt: '15/06/2026'
      },
      {
        id: 'file_seeded_prova1',
        name: '📄 Prova_Pratica_Simulada_UTI_PacienteCritico.pdf',
        type: 'file',
        size: '1.1 MB',
        parentId: 'fld_seeded_avaliacoes',
        updatedAt: '15/06/2026'
      },
      {
        id: 'fld_seeded_matriculas',
        name: '📁 Documentos de Matrícula (Alunos)',
        type: 'folder',
        updatedAt: '10/06/2026'
      },
      {
        id: 'file_seeded_documentacao',
        name: '📄 Regimento_Interno_FIP_Online.pdf',
        type: 'file',
        size: '540 KB',
        parentId: 'fld_seeded_matriculas',
        updatedAt: '10/06/2026'
      }
    ]
  }
];

// Pre-seeded disciplines (Modules) for classes
export const initialModules: Module[] = [
  {
    id: 'm_urg_uti_01',
    turmaId: 't_urgencia_uti_01',
    title: 'Urgência e Emergência UTI',
    professor: 'Dr. Rômulo Carriello',
    workload: 40,
    status: 'em_andamento'
  },
  {
    id: 'm_urg_uti_02',
    turmaId: 't_urgencia_uti_01',
    title: 'Suporte Avançado de Vida e Farmacologia Intensiva',
    professor: 'Dra. Patrícia Oliveira',
    workload: 30,
    status: 'agendado'
  },
  {
    id: 'm_urg_uti_03',
    turmaId: 't_urgencia_uti_01',
    title: 'Procedimentos Invasivos e Ventilação Mecânica',
    professor: 'Dr. Leonardo Cavalcanti',
    workload: 45,
    status: 'concluido'
  }
];

// Pre-seeded students distributed across classes (Enfermagem)
export const initialStudents: Student[] = [
  {
    id: 's_mauro_jorge',
    name: 'MAURO JORGE RIBEIRO DA SILVA',
    enrollmentId: 'EVA-UTI-M25',
    email: 'mauro55raux@hotmail.com',
    phone: '(22) 99983-4390',
    turmaId: 't_urgencia_uti_01',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 's_rute_maria',
    name: 'RUTE MARIA DE SOUZA',
    enrollmentId: 'EVA-UTI-R84',
    email: 'ranguinho385@gmail.com',
    phone: '(22) 98109-9635',
    turmaId: 't_urgencia_uti_01',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  }
];

// Pre-seeded Attendance records (Daily presence)
export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att_seeded_01',
    turmaId: 't_urgencia_uti_01',
    moduleId: 'm_urg_uti_01',
    date: '2026-06-12',
    presents: ['s_mauro_jorge', 's_rute_maria']
  },
  {
    id: 'att_seeded_02',
    turmaId: 't_urgencia_uti_01',
    moduleId: 'm_urg_uti_03',
    date: '2026-06-10',
    presents: ['s_mauro_jorge', 's_rute_maria']
  }
];

// Pre-seeded Grade entries
export const initialGradeRecords: GradeRecord[] = [
  {
    id: 'grade_seeded_01',
    studentId: 's_mauro_jorge',
    turmaId: 't_urgencia_uti_01',
    moduleId: 'm_urg_uti_01',
    grade: 9.5
  },
  {
    id: 'grade_seeded_02',
    studentId: 's_mauro_jorge',
    turmaId: 't_urgencia_uti_01',
    moduleId: 'm_urg_uti_03',
    grade: 8.8
  },
  {
    id: 'grade_seeded_03',
    studentId: 's_rute_maria',
    turmaId: 't_urgencia_uti_01',
    moduleId: 'm_urg_uti_01',
    grade: 9.2
  },
  {
    id: 'grade_seeded_04',
    studentId: 's_rute_maria',
    turmaId: 't_urgencia_uti_01',
    moduleId: 'm_urg_uti_03',
    grade: 9.0
  }
];

export const mockAgendaEvents: AgendaEvent[] = [];

export const mockBooks: Book[] = [
  {
    id: 'b1',
    title: 'Tratado de Enfermagem em Unidade de Terapia Intensiva',
    authors: 'Sandra de Souza Martins, Marcos Albuquerque Santos',
    subject: 'UTI',
    year: 2023,
    pages: 640,
    coverColor: 'bg-indigo-700',
    synopsis: 'Obra de referência nacional direcionada para enfermeiros intensivistas.'
  },
  {
    id: 'b2',
    title: 'Tratado de Urgência e Emergência na Prática de Enfermagem',
    authors: 'Thais Maria Ferreira, Leonardo Cavalcanti',
    subject: 'Urgência',
    year: 2024,
    pages: 512,
    coverColor: 'bg-rose-700',
    synopsis: 'Um manual prático e de raciocínio dinâmico que estrutura algoritmos de tomadas de decisão imediatas baseadas nos consensos.'
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'n1',
    message: 'Sistema administrativo iniciado. Você tem controle total sobre turmas, disciplinas e alunos.',
    date: 'Hoje, 14:30',
    read: false,
    type: 'general'
  }
];
