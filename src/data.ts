import { Student, Module, Turma, AgendaEvent, Book, Notification, AttendanceRecord, GradeRecord } from './types';

// Pre-seeded classes (Turmas)
export const initialTurmas: Turma[] = [];

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
