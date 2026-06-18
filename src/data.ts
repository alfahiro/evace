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
export const initialModules: Module[] = [];

// Pre-seeded students distributed across classes (Enfermagem)
export const initialStudents: Student[] = [];

// Pre-seeded Attendance records (Daily presence)
export const initialAttendanceRecords: AttendanceRecord[] = [];

// Pre-seeded Grade entries
export const initialGradeRecords: GradeRecord[] = [];

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
