import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { User, GraduationCap, Moon, Lock, School, ChevronRight } from 'lucide-react';
import { TEACHERS_LIST, CLASSES_LIST } from '../constants';

export const LoginScreen: React.FC = () => {
  const { loginTeacher, loginStudent, students } = useGame();
  
  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher');
  
  // Teacher State
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedTeacherClass, setSelectedTeacherClass] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Student State
  const [selectedStudentClass, setSelectedStudentClass] = useState('');

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher || !selectedTeacherClass || !password) {
      setError('Mohon lengkapi semua data');
      return;
    }
    if (password !== '11223344') {
      setError('Password salah!');
      return;
    }
    loginTeacher(selectedTeacher, selectedTeacherClass);
  };

  // Filter students based on selected class for student login
  const classStudents = students.filter(s => s.class === selectedStudentClass);

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-emerald-600 rounded-b-[50px] shadow-lg z-0"></div>
      <div className="absolute top-10 right-10 z-0">
        <Moon className="text-amber-300 w-24 h-24 opacity-80" fill="#fcd34d" />
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md tracking-tight">
            Jurnal Ramadan
          </h1>
          <p className="text-white font-medium text-lg opacity-90">
            Catat Kebaikan, Raih Kemenangan!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-emerald-100">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button 
              onClick={() => setActiveTab('teacher')}
              className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'teacher' ? 'bg-emerald-50 text-black border-b-2 border-emerald-500' : 'text-gray-600 hover:text-black'}`}
            >
              <GraduationCap size={18} /> GURU
            </button>
            <button 
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'student' ? 'bg-amber-50 text-black border-b-2 border-amber-500' : 'text-gray-600 hover:text-black'}`}
            >
              <User size={18} /> MURID
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'teacher' ? (
              <form onSubmit={handleTeacherLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Nama Guru</label>
                  <select 
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  >
                    <option value="">Pilih Nama Guru...</option>
                    {TEACHERS_LIST.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-1">Kelas</label>
                  <div className="relative">
                    <School className="absolute left-3 top-3.5 text-black" size={18} />
                    <select 
                      value={selectedTeacherClass}
                      onChange={(e) => setSelectedTeacherClass(e.target.value)}
                      className="w-full p-3 pl-10 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                    >
                      <option value="">Pilih Kelas...</option>
                      {CLASSES_LIST.map((c, idx) => (
                        <option key={idx} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-black" size={18} />
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 pl-10 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-gray-500"
                      placeholder="Masukkan Password"
                    />
                  </div>
                </div>

                {error && <p className="text-red-600 text-sm text-center font-bold">{error}</p>}

                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                  Masuk Dashboard
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                 <div>
                  <label className="block text-sm font-bold text-black mb-1">Pilih Kelas Kamu</label>
                  <div className="relative">
                    <School className="absolute left-3 top-3.5 text-black" size={18} />
                    <select 
                      value={selectedStudentClass}
                      onChange={(e) => setSelectedStudentClass(e.target.value)}
                      className="w-full p-3 pl-10 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-black"
                    >
                      <option value="">Pilih Kelas...</option>
                      {CLASSES_LIST.map((c, idx) => (
                        <option key={idx} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedStudentClass && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-bold text-black mb-2">Pilih Namamu</label>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {classStudents.length === 0 ? (
                        <p className="text-black text-center py-4 text-sm">Belum ada siswa di kelas ini.</p>
                      ) : (
                        classStudents.map((student) => (
                          <button
                            key={student.id}
                            onClick={() => loginStudent(student.id)}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition-all text-left shadow-sm group"
                          >
                            <span className="font-bold text-black group-hover:text-amber-900">{student.name}</span>
                            <ChevronRight size={16} className="text-black group-hover:text-amber-700" />
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <p className="text-center text-black mt-8 text-sm opacity-80 font-medium">
          &copy; {new Date().getFullYear()} SD Islam Ceria
        </p>
      </div>
    </div>
  );
};