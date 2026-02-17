import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GamificationCard } from './GamificationCard';
import { DashboardHeader } from './DashboardHeader';
import { StudentLeaderboard } from './StudentLeaderboard';
import { Save, Sparkles, MessageSquarePlus, Rocket } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, students, toggleMission, updateJournal, logout, toggleExtraTask } = useGame();
  
  // Find current student data
  const student = students.find(s => s.id === user?.id);
  
  const [journalText, setJournalText] = useState(student?.journalEntry || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!student) return <div className="text-white text-center mt-20">Mencari data astronaut...</div>;

  const handleSaveJournal = () => {
    updateJournal(student.id, journalText);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-md mx-auto p-4">
        
        {/* Header Section */}
        <DashboardHeader student={student} onLogout={logout} />

        {/* Extra Task Section (Conditional) */}
        {student.extraTask && (
          <div className="mb-8 animate-float">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2 drop-shadow-md">
              <MessageSquarePlus className="text-amber-400" />
              Misi Spesial Komandan
            </h2>
            <div className={`
              p-4 rounded-[25px] border-2 transition-all cursor-pointer relative overflow-hidden group
              ${student.isExtraTaskCompleted 
                ? 'bg-amber-500/20 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]' 
                : 'bg-white/5 border-dashed border-amber-500/50 hover:bg-amber-500/10'
              }
            `}
            onClick={() => toggleExtraTask(student.id)}
            >
               {/* Glow effect */}
               <div className="absolute inset-0 bg-amber-400/5 blur-xl group-hover:bg-amber-400/10 transition-colors"></div>

              <div className="flex items-start gap-3 relative z-10">
                 <div className={`mt-1 w-6 h-6 rounded border flex items-center justify-center transition-colors ${student.isExtraTaskCompleted ? 'bg-amber-500 border-amber-500' : 'border-amber-400'}`}>
                    {student.isExtraTaskCompleted && <Sparkles size={16} className="text-white" />}
                 </div>
                 <div>
                   <p className="font-bold text-amber-100">{student.extraTask}</p>
                   <p className="text-xs text-amber-300 mt-1 font-bold">+50 XP</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Missions Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 drop-shadow-md">
            <Rocket className="text-cyan-400" />
            Misi Harian
          </h2>
          <div className="flex flex-col gap-3">
            {student.missions.map(mission => (
              <GamificationCard
                key={mission.id}
                label={mission.label}
                xp={mission.xp}
                completed={mission.completed}
                iconName={mission.icon}
                onToggle={() => toggleMission(student.id, mission.id)}
              />
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <StudentLeaderboard students={students} currentStudent={student} />

        {/* Journal Entry */}
        <div className="glass-panel rounded-[30px] p-6 shadow-sm border border-white/10">
          <label className="block text-cyan-200 font-bold mb-3 text-lg flex items-center gap-2">
            <Sparkles className="text-cyan-400 w-5 h-5" /> Catatan Harian
          </label>
          <p className="text-slate-300 text-sm mb-3">
            Laporkan kebaikan yang telah dilakukan di bumi hari ini:
          </p>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            className="w-full h-32 p-4 rounded-xl glass-input focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white resize-none placeholder-slate-500 transition-all"
            placeholder="Lapor Komandan: Hari ini saya..."
          />
          <button 
            onClick={handleSaveJournal}
            disabled={isSaved}
            className={`
              w-full mt-4 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
              ${isSaved 
                ? 'bg-emerald-500/80 text-white border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)] border border-cyan-400/30'
              }
            `}
          >
            {isSaved ? 'Laporan Diterima!' : <><Save size={20} /> Kirim Laporan</>}
          </button>
        </div>

      </div>
    </div>
  );
};