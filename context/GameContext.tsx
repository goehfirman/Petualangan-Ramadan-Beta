import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, User, Role, LEVEL_TITLES, Mission } from '../types';
import { INITIAL_MISSIONS, MOCK_STUDENTS } from '../constants';
import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  onSnapshot, 
  setDoc, 
  writeBatch,
  query,
  where
} from 'firebase/firestore';

interface GameContextType {
  user: User | null;
  students: Student[];
  loginTeacher: (name: string, selectedClass: string) => void;
  loginStudent: (studentId: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleMission: (studentId: string, missionId: string) => void;
  updateJournal: (studentId: string, text: string) => void;
  assignExtraTask: (studentId: string, task: string) => void;
  assignClassTask: (className: string, task: string) => Promise<void>; // New feature
  toggleExtraTask: (studentId: string) => void;
  addStudent: (name: string, className: string) => void;
  importStudents: (data: { name: string; password?: string }[], className: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // Initialize with MOCK_STUDENTS so data appears immediately even if DB is not connected
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);

  // 1. Real-time Listener for Students Data
  useEffect(() => {
    // Subscribe to the 'students' collection in Firestore
    const unsubscribe = onSnapshot(collection(db, 'students'), (snapshot) => {
      const fetchedStudents: Student[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Student));
      
      // Only overwrite mock data if we actually got data from the database
      if (fetchedStudents.length > 0) {
        setStudents(fetchedStudents);
        
        // Update local user state if the logged-in user is a student and data changed
        if (user?.role === 'student') {
          const currentUserData = fetchedStudents.find(s => s.id === user.id);
          if (currentUserData) {
            // Keep user session details but update name/class if changed
            setUser(prev => prev ? { ...prev, name: currentUserData.name, selectedClass: currentUserData.class } : null);
          }
        }
      }
    }, (error) => {
       console.log("Firebase connection error (using mock data):", error);
    });

    return () => unsubscribe();
  }, [user?.role, user?.id]);

  // Helper to calculate new level title based on XP
  const getLevelTitle = (xp: number) => {
    const level = [...LEVEL_TITLES].reverse().find(l => xp >= l.minXp);
    return level ? level.title : LEVEL_TITLES[0].title;
  };

  const loginTeacher = (name: string, selectedClass: string) => {
    setUser({ 
      id: `teacher-${name}`, 
      name: name, 
      role: 'teacher',
      selectedClass: selectedClass 
    });
  };

  const loginStudent = async (studentId: string, password: string): Promise<boolean> => {
    const student = students.find(s => s.id === studentId);
    
    // Check if student exists and password matches
    // Note: In a real app, use bcrypt or similar. Here we use simple string comparison for the school project.
    if (student && student.password === password) {
      setUser({ 
        id: student.id, 
        name: student.name, 
        role: 'student',
        selectedClass: student.class
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  // Add single student to Firebase
  const addStudent = async (name: string, className: string) => {
    const id = `s-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newStudent: Student = {
      id,
      name,
      class: className,
      totalXp: 0,
      levelTitle: LEVEL_TITLES[0].title,
      missions: JSON.parse(JSON.stringify(INITIAL_MISSIONS)),
      journalEntry: '',
      isExtraTaskCompleted: false,
    };
    
    try {
      await setDoc(doc(db, 'students', id), newStudent);
    } catch (e) {
      console.error("Error adding student: ", e);
      // Fallback for local update if DB fails
      setStudents(prev => [...prev, newStudent]);
      alert("Mode Offline: Data disimpan sementara di browser.");
    }
  };

  // Import batch to Firebase
  const importStudents = async (data: { name: string; password?: string }[], className: string) => {
    const batch = writeBatch(db);
    const tempStudents: Student[] = [];
    
    data.forEach((item) => {
      const id = `s-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newStudent: Student = {
        id,
        name: item.name.trim(),
        password: item.password?.trim(),
        class: className,
        totalXp: 0,
        levelTitle: LEVEL_TITLES[0].title,
        missions: JSON.parse(JSON.stringify(INITIAL_MISSIONS)),
        journalEntry: '',
        isExtraTaskCompleted: false,
      };
      
      if (newStudent.name.length > 0) {
        const ref = doc(db, 'students', id);
        batch.set(ref, newStudent);
        tempStudents.push(newStudent);
      }
    });

    try {
      await batch.commit();
    } catch (e) {
      console.error("Batch commit failed", e);
      // Fallback local
      setStudents(prev => [...prev, ...tempStudents]);
      alert("Mode Offline: Data disimpan sementara di browser.");
    }
  };

  const toggleMission = async (studentId: string, missionId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const updatedMissions = student.missions.map(m => {
      if (m.id === missionId) return { ...m, completed: !m.completed };
      return m;
    });

    const mission = student.missions.find(m => m.id === missionId);
    let newTotalXp = student.totalXp;
    if (mission) {
       newTotalXp = mission.completed ? newTotalXp - mission.xp : newTotalXp + mission.xp;
    }
    
    // Optimistic Update
    setStudents(prev => prev.map(s => s.id === studentId ? {
        ...s,
        missions: updatedMissions,
        totalXp: newTotalXp,
        levelTitle: getLevelTitle(newTotalXp)
    } : s));

    try {
      const studentRef = doc(db, 'students', studentId);
      await updateDoc(studentRef, {
        missions: updatedMissions,
        totalXp: newTotalXp,
        levelTitle: getLevelTitle(newTotalXp)
      });
    } catch (e) {
      console.error("Error updating mission (offline mode)", e);
    }
  };

  const toggleExtraTask = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const isCompleted = !student.isExtraTaskCompleted;
    let newTotalXp = student.totalXp;
    
    if (isCompleted) newTotalXp += 50;
    else newTotalXp -= 50;

    // Optimistic Update
    setStudents(prev => prev.map(s => s.id === studentId ? {
        ...s,
        isExtraTaskCompleted: isCompleted,
        totalXp: newTotalXp,
        levelTitle: getLevelTitle(newTotalXp)
    } : s));

    try {
      await updateDoc(doc(db, 'students', studentId), {
        isExtraTaskCompleted: isCompleted,
        totalXp: newTotalXp,
        levelTitle: getLevelTitle(newTotalXp)
      });
    } catch (e) {
      console.error("Error toggling extra task", e);
    }
  };

  const updateJournal = async (studentId: string, text: string) => {
    // Optimistic Update
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, journalEntry: text } : s));
    
    try {
      await updateDoc(doc(db, 'students', studentId), { journalEntry: text });
    } catch (e) {
      console.error("Error updating journal", e);
    }
  };

  const assignExtraTask = async (studentId: string, task: string) => {
    // Optimistic Update
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, extraTask: task, isExtraTaskCompleted: false } : s));

    try {
      await updateDoc(doc(db, 'students', studentId), { 
        extraTask: task,
        isExtraTaskCompleted: false 
      });
    } catch (e) {
      console.error("Error assigning task", e);
    }
  };

  // Feature: Assign task to entire class (or all classes)
  const assignClassTask = async (className: string, task: string) => {
    const batch = writeBatch(db);
    let targets = [];
    
    if (className === 'ALL') {
      targets = students;
    } else {
      targets = students.filter(s => s.class === className);
    }

    // Optimistic Update
    setStudents(prev => prev.map(s => {
        if (className === 'ALL' || s.class === className) {
            return { ...s, extraTask: task, isExtraTaskCompleted: false };
        }
        return s;
    }));

    targets.forEach(s => {
      const ref = doc(db, 'students', s.id);
      batch.update(ref, { 
        extraTask: task, 
        isExtraTaskCompleted: false 
      });
    });

    try {
      await batch.commit();
    } catch (e) {
      console.error("Error batch assigning task", e);
    }
  };

  return (
    <GameContext.Provider value={{ 
      user, 
      students, 
      loginTeacher, 
      loginStudent, 
      logout, 
      toggleMission, 
      updateJournal, 
      assignExtraTask, 
      assignClassTask,
      toggleExtraTask,
      addStudent,
      importStudents
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};