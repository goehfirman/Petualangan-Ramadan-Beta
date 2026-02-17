import React from 'react';
import { Trophy, Star, LogOut } from 'lucide-react';
import { Student } from '../types';

interface DashboardHeaderProps {
  student: Student;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ student, onLogout }) => {
  // Calculate progress to next level (mock logic: Levels every 500 XP)
  const nextLevelXp = Math.ceil((student.totalXp + 1) / 500) * 500;
  const currentLevelBase = nextLevelXp - 500;
  const progressPercent = Math.min(100, Math.max(0, ((student.totalXp - currentLevelBase) / 500) * 100));

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-6 rounded-3xl shadow-lg mb-6 relative overflow-hidden">
      
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400 opacity-10 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      <div className="relative z-10 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-amber-300 shadow-inner">
            <Trophy className="text-amber-300 w-8 h-8 drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{student.name}</h1>
            <div className="flex items-center gap-2 text-white font-medium">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>{student.levelTitle}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors text-white"
          title="Keluar"
        >
          <LogOut size={20} />
        </button>
      </div>

      <div className="mt-6 relative">
        <div className="flex justify-between text-sm mb-2 font-bold text-white">
          <span>XP Saat Ini: {student.totalXp}</span>
          <span>Next Level: {nextLevelXp}</span>
        </div>
        <div className="h-4 bg-emerald-900/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-1000 ease-out relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};