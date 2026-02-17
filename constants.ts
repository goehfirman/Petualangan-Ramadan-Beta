import { Student, Mission } from './types';

export const TEACHERS_LIST = [
  "YAYAH MUNYATI",
  "DESY RATNA SARI",
  "NARARIA PIARDINI",
  "ISTA ANNISA",
  "TINA VIOLENTA",
  "RIRI DZIKRIYANTI",
  "WINDA INDRI HASTUTI",
  "SITI JULAEHA",
  "CHRISTINA MURBANILAH",
  "RISTRIYONO AHMAD NUGROHO",
  "IQBAL NURZEHA",
  "SRI JAYATI",
  "SUPARJA",
  "TEGUH FIRMANSYAH APRILIANA",
  "YUNI SULISTYATI",
  "PRABOWO SETYA NUGROHO",
  "MARSELINUS BOYMAU",
  "MUCHARI TRI WIDODO"
];

export const CLASSES_LIST = [
  "1A", "1B", "1C", 
  "2A", "2B", 
  "3", 
  "4A", "4B", "4C", 
  "5A", "5B", "5C", 
  "6A", "6B"
];

export const INITIAL_MISSIONS: Mission[] = [
  { id: 'm1', label: 'Makan Sahur', xp: 20, completed: false, icon: 'Utensils' },
  { id: 'm2', label: 'Puasa (Setengah/Full)', xp: 50, completed: false, icon: 'Sun' },
  { id: 'm3', label: 'Shalat 5 Waktu', xp: 50, completed: false, icon: 'CheckCircle' },
  { id: 'm4', label: 'Shalat Tarawih', xp: 30, completed: false, icon: 'Moon' },
  { id: 'm5', label: 'Tadarus Al-Quran', xp: 30, completed: false, icon: 'BookOpen' },
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Ali bin Abi Thalib',
    class: '4A',
    totalXp: 120,
    levelTitle: 'Prajurit Puasa',
    missions: JSON.parse(JSON.stringify(INITIAL_MISSIONS)), 
    journalEntry: '',
    isExtraTaskCompleted: false,
  },
  {
    id: 's2',
    name: 'Siti Aisyah',
    class: '4A',
    totalXp: 650,
    levelTitle: 'Kapten Kebaikan',
    missions: JSON.parse(JSON.stringify(INITIAL_MISSIONS)),
    journalEntry: 'Hari ini aku membantu ibu menyiapkan berbuka.',
    isExtraTaskCompleted: true,
  },
  {
    id: 's3',
    name: 'Umar Faruq',
    class: '4B',
    totalXp: 40,
    levelTitle: 'Prajurit Puasa',
    missions: JSON.parse(JSON.stringify(INITIAL_MISSIONS)),
    journalEntry: '',
    isExtraTaskCompleted: false,
  },
];