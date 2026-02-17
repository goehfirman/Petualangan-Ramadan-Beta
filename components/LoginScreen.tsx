import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { User, GraduationCap, Rocket, Lock, School, ChevronRight, Trophy, Crown, Medal, Sparkles } from 'lucide-react';
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

  // Public Leaderboard State
  const [leaderboardView, setLeaderboardView] = useState<'school' | 'class'>('school');
  const [leaderboardClass, setLeaderboardClass] = useState<string>(CLASSES_LIST[0]);

  // Derived Leaderboard Logic
  const displayedLeaderboard = useMemo(() => {
    let data = [...students];
    
    // Filter if class view
    if (leaderboardView === 'class') {
      data = data.filter(s => s.class === leaderboardClass);
    }

    // Sort by XP descending and take top 5
    return data
      .sort((a, b) => b.totalXp - a.totalXp)
      .slice(0, 5);
  }, [students, leaderboardView, leaderboardClass]);

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

  const classStudents = students.filter(s => s.class === selectedStudentClass);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-y-auto">
      
      {/* Cosmic Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black -z-20"></div>
      <div className="fixed top-20 right-20 w-32 h-32 bg-purple-500 rounded-full blur-[100px] opacity-40 animate-pulse-slow -z-10"></div>
      <div className="fixed bottom-20 left-20 w-48 h-48 bg-cyan-500 rounded-full blur-[120px] opacity-30 animate-pulse-slow -z-10"></div>

      <div className="z-10 w-full max-w-6xl flex flex-col items-center">
        <div className="text-center mb-10 mt-4 animate-float">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] tracking-tight">
            Petualangan Ramadan
          </h1>
          <p className="text-cyan-100 font-medium text-lg opacity-90 flex items-center justify-center gap-2">
            <Rocket className="w-5 h-5 text-amber-400" />
            Jelajahi Semesta Kebaikan!
          </p>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-8 items-start justify-center">
          
          {/* LOGIN CARD */}
          <div className="w-full max-w-md glass-panel rounded-[30px] shadow-[0_0_30px_rgba(99,102,241,0.3)] overflow-hidden flex-shrink-0 mx-auto transition-all hover:scale-[1.01]">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button 
                onClick={() => setActiveTab('teacher')}
                className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'teacher' ? 'bg-white/10 text-cyan-300 border-b-2 border-cyan-400 shadow-[inset_0_0_20px_rgba(34,211,238,0.2)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <GraduationCap size={18} /> GURU
              </button>
              <button 
                onClick={() => setActiveTab('student')}
                className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'student' ? 'bg-white/10 text-amber-300 border-b-2 border-amber-400 shadow-[inset_0_0_20px_rgba(251,191,36,0.2)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <User size={18} /> MURID
              </button>
            </div>

            <div className="p-8">
              {activeTab === 'teacher' ? (
                <form onSubmit={handleTeacherLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-cyan-100 mb-2">Nama Kapten (Guru)</label>
                    <select 
                      value={selectedTeacher}
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                      className="w-full p-3 rounded-xl glass-input focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    >
                      <option value="" className="bg-slate-900">Pilih Nama...</option>
                      {TEACHERS_LIST.map((t, idx) => (
                        <option key={idx} value={t} className="bg-slate-900">{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cyan-100 mb-2">Sektor (Kelas)</label>
                    <div className="relative">
                      <School className="absolute left-3 top-3.5 text-slate-400" size={18} />
                      <select 
                        value={selectedTeacherClass}
                        onChange={(e) => setSelectedTeacherClass(e.target.value)}
                        className="w-full p-3 pl-10 rounded-xl glass-input focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      >
                        <option value="" className="bg-slate-900">Pilih Kelas...</option>
                        {CLASSES_LIST.map((c, idx) => (
                          <option key={idx} value={c} className="bg-slate-900">{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cyan-100 mb-2">Kode Akses</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 pl-10 rounded-xl glass-input focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-slate-500"
                        placeholder="Masukkan Kode"
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-sm text-center font-bold bg-red-900/30 p-2 rounded-lg border border-red-500/50">{error}</p>}

                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.5)] border border-cyan-400/50 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Rocket size={20} /> Masuk Kokpit
                  </button>
                </form>
              ) : (
                <div className="space-y-5">
                   <div>
                    <label className="block text-sm font-bold text-amber-100 mb-2">Pilih Sektor (Kelas)</label>
                    <div className="relative">
                      <School className="absolute left-3 top-3.5 text-slate-400" size={18} />
                      <select 
                        value={selectedStudentClass}
                        onChange={(e) => setSelectedStudentClass(e.target.value)}
                        className="w-full p-3 pl-10 rounded-xl glass-input focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      >
                        <option value="" className="bg-slate-900">Pilih Kelas...</option>
                        {CLASSES_LIST.map((c, idx) => (
                          <option key={idx} value={c} className="bg-slate-900">{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedStudentClass && (
                    <div className="animate-fade-in">
                      <label className="block text-sm font-bold text-amber-100 mb-2">Pilih Astronaut</label>
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {classStudents.length === 0 ? (
                          <p className="text-slate-400 text-center py-4 text-sm">Belum ada astronaut di sektor ini.</p>
                        ) : (
                          classStudents.map((student) => (
                            <button
                              key={student.id}
                              onClick={() => loginStudent(student.id)}
                              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/5 hover:border-amber-400/50 transition-all text-left group"
                            >
                              <span className="font-bold text-slate-200 group-hover:text-amber-300">{student.name}</span>
                              <ChevronRight size={16} className="text-slate-500 group-hover:text-amber-400" />
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

          {/* PUBLIC LEADERBOARD CARD */}
          <div className="w-full max-w-md glass-panel rounded-[30px] shadow-[0_0_30px_rgba(251,191,36,0.15)] overflow-hidden border border-amber-500/20 p-6 flex-shrink-0 mx-auto animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-extrabold text-amber-400 flex items-center gap-2 drop-shadow-md">
                      <Trophy className="fill-amber-500 text-amber-200" /> 
                      Hall of Fame
                  </h3>
                  
                  {/* Toggle Button */}
                  <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                    <button 
                      onClick={() => setLeaderboardView('school')}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${leaderboardView === 'school' ? 'bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'text-slate-500 hover:text-amber-200'}`}
                    >
                      Sekolah
                    </button>
                    <button 
                      onClick={() => setLeaderboardView('class')}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${leaderboardView === 'class' ? 'bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'text-slate-500 hover:text-amber-200'}`}
                    >
                      Kelas
                    </button>
                  </div>
              </div>

              {/* Class Selector Dropdown */}
              {leaderboardView === 'class' && (
                <div className="mb-4 animate-fade-in">
                  <select 
                    value={leaderboardClass}
                    onChange={(e) => setLeaderboardClass(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/30 border border-amber-500/30 text-sm font-bold text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {CLASSES_LIST.map(c => (
                      <option key={c} value={c} className="bg-slate-900">Kelas {c}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-3 min-h-[300px]">
                  {displayedLeaderboard.length === 0 ? (
                      <div className="text-center py-8">
                         <div className="bg-white/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                            <Sparkles className="text-slate-600" size={32} />
                         </div>
                         <p className="text-slate-500 font-medium">Belum ada data astronaut.</p>
                      </div>
                  ) : (
                      displayedLeaderboard.map((student, index) => (
                          <div 
                              key={student.id} 
                              className={`flex items-center justify-between p-3 rounded-2xl border transition-all hover:scale-[1.02] ${
                                  index === 0 ? "bg-yellow-500/20 border-yellow-400/50 text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.2)]" :
                                  index === 1 ? "bg-slate-300/10 border-slate-400/50 text-slate-300" :
                                  index === 2 ? "bg-orange-500/10 border-orange-400/50 text-orange-300" :
                                  "bg-white/5 border-white/5 text-slate-300"
                              }`}
                          >
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 flex items-center justify-center font-bold">
                                    {index === 0 ? <Crown size={20} className="text-yellow-400 fill-yellow-500" /> :
                                     index === 1 ? <Medal size={20} className="text-slate-300" /> :
                                     index === 2 ? <Medal size={20} className="text-orange-400" /> :
                                     <span className="font-bold text-sm w-5 text-center text-white/50">{index + 1}</span>}
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm leading-tight text-white">{student.name}</p>
                                    <p className="text-[10px] opacity-70 font-bold uppercase">{student.class} • {student.levelTitle}</p>
                                  </div>
                               </div>
                               <div className="font-extrabold text-sm whitespace-nowrap text-cyan-300 drop-shadow-sm">{student.totalXp} XP</div>
                          </div>
                      ))
                  )}
              </div>
              
               <div className="mt-6 pt-4 border-t border-white/10 text-center">
                  <p className="text-xs text-cyan-200/50 italic">
                      "Menjelajah semesta dengan akhlak mulia"
                  </p>
              </div>
          </div>

        </div>

        <p className="text-center text-cyan-500/60 mt-8 mb-4 text-sm opacity-80 font-medium z-10">
          &copy; {new Date().getFullYear()} Space Academy
        </p>
      </div>
    </div>
  );
};