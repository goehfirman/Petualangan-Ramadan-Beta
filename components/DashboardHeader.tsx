import React from 'react';
import { Trophy, Star, LogOut, Rocket } from 'lucide-react';
import { Student } from '../types';

interface DashboardHeaderProps {
  student: Student;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ student, onLogout }) => {
  // Calculate progress to next level
  const nextLevelXp = Math.ceil((student.totalXp + 1) / 500) * 500;
  const currentLevelBase = nextLevelXp - 500;
  const progressPercent = Math.min(100, Math.max(0, ((student.totalXp - currentLevelBase) / 500) * 100));

  return (
    <div className="glass-panel border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 text-white p-6 rounded-[30px] shadow-[0_0_25px_rgba(139,92,246,0.3)] mb-8 relative overflow-hidden group">
      
      {/* Decorative Planet Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none group-hover:bg-purple-600/30 transition-all duration-1000"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-600/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none group-hover:bg-cyan-600/30 transition-all duration-1000"></div>

      <div className="relative z-10 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Rocket className="text-cyan-300 w-8 h-8 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-md">{student.name}</h1>
            <div className="flex items-center gap-2 text-cyan-200 font-medium text-sm bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-500/30 w-fit mt-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span>{student.levelTitle}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 p-2.5 rounded-xl transition-all text-white/70 hover:text-red-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          title="Keluar Misi"
        >
          <LogOut size={20} />
        </button>
      </div>

      <div className="mt-6 relative">
        <div className="flex justify-between text-xs mb-2 font-bold text-cyan-100/80 tracking-wider uppercase">
          <span>XP Saat Ini: <span className="text-white text-base">{student.totalXp}</span></span>
          <span>Target: {nextLevelXp}</span>
        </div>
        <div className="h-4 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-1000 ease-out relative shadow-[0_0_20px_rgba(6,182,212,0.6)]"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-30 animate-pulse"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/80 shadow-[0_0_10px_white]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};