import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { GamificationCard } from './GamificationCard';
import { DashboardHeader } from './DashboardHeader';
import { StudentLeaderboard } from './StudentLeaderboard';
import { PrayerCompass } from './PrayerCompass';
import { EduSection } from './EduSection';
import { QuranTips } from './QuranTips';
import { Save, Sparkles, MessageSquarePlus, Rocket, Quote } from 'lucide-react';
import { RAMADAN_QUOTES } from '../constants';

export const StudentDashboard: React.FC = () => {
  const { user, students, toggleMission, updateJournal, logout, toggleExtraTask } = useGame();
  
  // Find current student data
  const student = students.find(s => s.id === user?.id);
  
  const [journalText, setJournalText] = useState(student?.journalEntry || '');
  const [isSaved, setIsSaved] = useState(false);

  // Daily Quote Logic (Cycle based on Day of Month or simply random for now)
  const todayQuote = useMemo(() => {
    const day = new Date().getDate();
    return RAMADAN_QUOTES[(day - 1) % RAMADAN_QUOTES.length];
  }, []);

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

        {/* Prayer Times & Qibla Widget */}
        <PrayerCompass />

        {/* Daily Quote Widget */}
        <div className="mb-8 relative p-6 glass-panel rounded-2xl border-amber-500/20 text-center">
            <Quote className="absolute top-4 left-4 text-amber-500/30 w-8 h-8 rotate-180" />
            <p className="text-amber-100 font-medium italic relative z-10 text-sm">
                "{todayQuote}"
            </p>
            <Quote className="absolute bottom-4 right-4 text-amber-500/30 w-8 h-8" />
        </div>

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

        {/* Daily Missions Grid (Updated with Infaq, Dhikr, Matsurat) */}
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

        {/* Educational Section (Fiqh) */}
        <EduSection />

        {/* Quran Khatam Tips */}
        <QuranTips />

        {/* Leaderboard Section */}
        <StudentLeaderboard students={students} currentStudent={student} />

        {/* Journal Entry */}
        <div className="glass-panel rounded-[30px] p-6 shadow-sm border border-white/10 mb-8">
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

        {/* Kaffaratul Majlis (Closing Dua) */}
        <div className="glass-panel rounded-2xl p-6 border-slate-700 bg-slate-900/50 text-center">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-3">Doa Penutup Majelis</p>
            <p className="text-xl font-arabic leading-loose text-white mb-2">
                سُبْحَانَكَ اللّٰهُمَّ وبِحَمْدِكَ أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوْبُ إِلَيْكَ
            </p>
            <p className="text-xs text-slate-400 italic mb-2">
                Subḫânakallâhumma wa biḫamdika asyhadu an-lâilâha illâ anta astaghfiruka wa atûbu ilaik.
            </p>
            <p className="text-xs text-slate-500">
                "Mahasuci Engkau, ya Allah. Segala sanjungan untuk-Mu. Aku bersaksi bahwa tiada tuhan melainkan Engkau. Aku memohon ampun dan bertaubat kepada-Mu."
            </p>
        </div>

      </div>
    </div>
  );
};