export type Role = 'teacher' | 'student';

export interface Mission {
  id: string;
  label: string;
  xp: number;
  completed: boolean;
  icon: string; // Icon name as string to be mapped
}

export interface Student {
  id: string;
  name: string;
  password?: string; // Added password field
  class: string;
  totalXp: number;
  levelTitle: string;
  missions: Mission[];
  journalEntry: string;
  extraTask?: string; // Task assigned by teacher
  isExtraTaskCompleted: boolean;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  selectedClass?: string; // Track which class the teacher is currently managing
}

export const LEVEL_TITLES = [
  { minXp: 0, title: "Prajurit Puasa" },
  { minXp: 500, title: "Kapten Kebaikan" },
  { minXp: 1000, title: "Jenderal Ramadan" },
  { minXp: 2000, title: "Sultan Taqwa" },
];