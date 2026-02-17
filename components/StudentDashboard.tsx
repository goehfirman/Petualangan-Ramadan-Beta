import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GamificationCard } from './GamificationCard';
import { DashboardHeader } from './DashboardHeader';
import { Save, Sparkles, MessageSquarePlus } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, students, toggleMission, updateJournal, logout, toggleExtraTask } = useGame();
  
  // Find current student data
  const student = students.find(s => s.id === user?.id);
  
  const [journalText, setJournalText] = useState(student?.journalEntry || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!student) return <div>Data siswa tidak ditemukan.</div>;

  const handleSaveJournal = () => {
    updateJournal(student.id, journalText);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-emerald-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        
        {/* Header Section */}
        <DashboardHeader student={student} onLogout={logout} />

        {/* Extra Task Section (Conditional) */}
        {student.extraTask && (
          <div className="mb-6 animate-fade-in-up">
            <h2 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
              <MessageSquarePlus className="text-amber-600" />
              Tugas Tambahan Guru
            </h2>
            <div className={`
              p-4 rounded-2xl border-2 transition-all cursor-pointer
              ${student.isExtraTaskCompleted 
                ? 'bg-amber-100 border-amber-400' 
                : 'bg-white border-dashed border-amber-400 hover:bg-amber-50'
              }
            `}
            onClick={() => toggleExtraTask(student.id)}
            >
              <div className="flex items-start gap-3">
                 <div className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center ${student.isExtraTaskCompleted ? 'bg-amber-500 border-amber-500' : 'border-amber-400'}`}>
                    {student.isExtraTaskCompleted && <Sparkles size={16} className="text-white" />}
                 </div>
                 <div>
                   <p className="font-bold text-black">{student.extraTask}</p>
                   <p className="text-xs text-black mt-1 font-bold">+50 XP</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Missions Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
            <Sparkles className="text-amber-600" />
            Misi Hari Ini
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

        {/* Journal Entry */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100">
          <label className="block text-black font-bold mb-3 text-lg">
            Catatan Kebaikan
          </label>
          <p className="text-black text-sm mb-3">
            Kebaikan apa yang kamu lakukan hari ini?
          </p>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            className="w-full h-32 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-black resize-none placeholder-gray-500"
            placeholder="Contoh: Hari ini aku berbagi takjil dengan teman..."
          />
          <button 
            onClick={handleSaveJournal}
            disabled={isSaved}
            className={`
              w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
              ${isSaved 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 shadow-lg'
              }
            `}
          >
            {isSaved ? 'Tersimpan!' : <><Save size={20} /> Simpan Jurnal</>}
          </button>
        </div>

      </div>
    </div>
  );
};