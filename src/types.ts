export interface Student {
  id: string;
  name: string;
  enrollmentId: string;
  email: string;
  turmaId: string; // Class reference
  avatarUrl?: string;
  phone?: string;
  role?: string;
}

export interface Module {
  id: string;
  turmaId: string; // Reference to class
  title: string;
  professor: string;
  workload: number;
  status: 'concluido' | 'em_andamento' | 'agendado';
}

export interface FolderItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  updatedAt: string;
  parentId?: string;
}

export interface Turma {
  id: string;
  title: string;
  number: string;
  code: string;
  category: 'UTI' | 'Urgência' | 'Dermatologia' | 'Geral';
  folders?: FolderItem[];
}

export interface AttendanceRecord {
  id: string;
  turmaId: string;
  moduleId: string; // Discipline reference
  date: string; // YYYY-MM-DD
  presents: string[]; // List of Student IDs present
}

export interface GradeRecord {
  id: string;
  studentId: string;
  turmaId: string;
  moduleId: string; // Discipline reference
  grade: number; // 0.0 to 10.0
}

export interface AgendaEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: 'aula' | 'prova' | 'seminario' | 'entrega';
  turmaId?: string;
  location?: string;
  description?: string;
}

export interface Book {
  id: string;
  title: string;
  authors: string;
  subject: 'UTI' | 'Urgência' | 'Dermatologia' | 'Metodologia' | 'Enfermagem';
  year: number;
  pages: number;
  coverColor: string;
  synopsis: string;
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
  type: 'grade' | 'schedule' | 'general';
}
