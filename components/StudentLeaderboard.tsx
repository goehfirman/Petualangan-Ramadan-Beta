import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { Trophy, Medal, Crown } from 'lucide-react';

interface StudentLeaderboardProps {
  students: Student[];
  currentStudent: Student;
}

export const StudentLeaderboard: React.FC<StudentLeaderboardProps> = ({ students, currentStudent }) => {
  const [view, setView] = useState<'class' | 'school'>('class');

  // Logic: Get Top 10 School
  const schoolLeaderboard = useMemo(() => {
    return [...students]
      .sort((a, b) => b.totalXp - a.totalXp)
      .slice(0, 10); // Top 10 Only
  }, [students]);

  // Logic: Get All Classmates sorted
  const classLeaderboard = useMemo(() => {
    return students
      .filter(s => s.class === currentStudent.class)
      .sort((a, b) => b.totalXp - a.totalXp);
  }, [students, currentStudent.class]);

  const dataToShow = view === 'class' ? classLeaderboard : schoolLeaderboard;

  // Helper for Rank Colors (Dark Mode)
  const getRankStyle = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50 text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.15)]"; // Gold
    if (index === 1) return "bg-gradient-to-r from-slate-400/20 to-gray-500/20 border-slate-400/50 text-slate-200"; // Silver
    if (index === 2) return "bg-gradient-to-r from-orange-700/20 to-red-900/20 border-orange-500/50 text-orange-200"; // Bronze
    return "bg-white/5 border-white/5 text-slate-300";
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown size={20} className="text-yellow-400 fill-yellow-500 animate-bounce" />;
    if (index === 1) return <Medal size={20} className="text-slate-300" />;
    if (index === 2) return <Medal size={20} className="text-orange-400" />;
    return <span className="font-bold text-sm w-5 text-center text-white/50">{index + 1}</span>;
  };

  return (
    <div className="glass-panel rounded-[30px] p-6 shadow-sm mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="text-amber-400 fill-amber-500/20" />
          Papan Juara
        </h2>
        
        <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setView('class')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'class' ? 'bg-cyan-600/30 text-cyan-300 shadow-[0_0_10px_rgba(8,145,178,0.3)] border border-cyan-500/30' : 'text-slate-500 hover:text-white'}`}
          >
            Kelas {currentStudent.class}
          </button>
          <button 
            onClick={() => setView('school')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'school' ? 'bg-amber-600/30 text-amber-300 shadow-[0_0_10px_rgba(217,119,6,0.3)] border border-amber-500/30' : 'text-slate-500 hover:text-white'}`}
          >
            Sekolah
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
        {dataToShow.map((student, index) => {
          const isMe = student.id === currentStudent.id;
          return (
            <div 
              key={student.id} 
              className={`
                flex items-center justify-between p-3 rounded-2xl border transition-all
                ${getRankStyle(index)}
                ${isMe ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-slate-900 scale-[1.02]' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center font-bold">
                  {getRankIcon(index)}
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight text-white">
                    {student.name} {isMe && <span className="text-[10px] bg-cyan-600 text-white px-1.5 py-0.5 rounded-full ml-1">Saya</span>}
                  </p>
                  <p className="text-[10px] opacity-70 font-bold uppercase text-slate-300">{student.levelTitle}</p>
                </div>
              </div>
              <div className="font-extrabold text-sm whitespace-nowrap text-cyan-300">
                {student.totalXp} XP
              </div>
            </div>
          );
        })}
        {dataToShow.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-4">Belum ada data di radar.</p>
        )}
      </div>
    </div>
  );
};