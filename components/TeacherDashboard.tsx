import React, { useState, useRef, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { LogOut, CheckCircle, XCircle, Plus, Send, UserPlus, FileSpreadsheet, Info, Download, Trophy, Target, Users, Search, Medal, School, Rocket } from 'lucide-react';
import { CLASSES_LIST } from '../constants';

type Tab = 'overview' | 'tasks' | 'students' | 'leaderboard';

export const TeacherDashboard: React.FC = () => {
  const { user, students, logout, assignExtraTask, assignClassTask, addStudent, importStudents } = useGame();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Local State
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [taskInput, setTaskInput] = useState('');
  const [bulkTaskInput, setBulkTaskInput] = useState('');
  const [bulkTargetClass, setBulkTargetClass] = useState(user?.selectedClass || 'ALL');
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  
  // Import State
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived Data
  const classStudents = useMemo(() => students.filter(s => s.class === user?.selectedClass), [students, user?.selectedClass]);
  const filteredStudents = useMemo(() => {
    return classStudents.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [classStudents, searchTerm]);

  // Leaderboard Logic
  const schoolLeaderboard = useMemo(() => {
    return [...students]
      .sort((a, b) => b.totalXp - a.totalXp)
      .slice(0, 10);
  }, [students]);

  const classLeaderboard = useMemo(() => {
    const classStats: Record<string, { total: number, count: number }> = {};
    students.forEach(s => {
      if (!classStats[s.class]) classStats[s.class] = { total: 0, count: 0 };
      classStats[s.class].total += s.totalXp;
      classStats[s.class].count += 1;
    });

    return Object.entries(classStats)
      .map(([className, stats]) => ({
        className,
        avgXp: Math.round(stats.total / (stats.count || 1))
      }))
      .sort((a, b) => b.avgXp - a.avgXp);
  }, [students]);


  const handleAssignTask = () => {
    if (selectedStudentId && taskInput.trim()) {
      assignExtraTask(selectedStudentId, taskInput);
      setTaskInput('');
      setSelectedStudentId(null);
    }
  };

  const handleBulkAssign = async () => {
    if (!bulkTaskInput.trim()) return;
    setIsBulkSending(true);
    try {
      await assignClassTask(bulkTargetClass, bulkTaskInput);
      alert(`Tugas berhasil dikirim ke ${bulkTargetClass === 'ALL' ? 'Semua Kelas' : 'Kelas ' + bulkTargetClass}`);
      setBulkTaskInput('');
    } catch (error) {
      alert("Gagal mengirim tugas.");
    } finally {
      setIsBulkSending(false);
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim() && user?.selectedClass) {
      addStudent(newStudentName, user.selectedClass);
      setNewStudentName('');
      setShowAddModal(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = "Nama Siswa";
    const examples = "\nAhmad Dahlan\nSiti Walidah\nKi Hajar Dewantara";
    const blob = new Blob([headers + examples], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template_siswa.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.selectedClass) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const importedData = text.split(/\r?\n/)
          .map(line => {
            const [name, password] = line.split(',');
            return { name: name?.trim(), password: password?.trim() };
          })
          .filter(item => item.name && item.name.length > 0 && item.name.toLowerCase() !== 'nama siswa');
        
        if (importedData.length > 0) {
           importStudents(importedData, user.selectedClass);
           alert(`Berhasil mengimport ${importedData.length} siswa.`);
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#0B0B19] font-sans text-white flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="bg-[#151525] w-full md:w-64 border-r border-white/10 flex flex-col sticky top-0 h-auto md:h-screen z-30 shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(8,145,178,0.5)]">
              K
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">{user?.name}</h1>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-900/30 px-2 py-0.5 rounded-full border border-cyan-500/30">
                Sektor {user?.selectedClass}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'overview', icon: School, label: 'Radar Utama' },
            { id: 'tasks', icon: Target, label: 'Misi Harian' },
            { id: 'students', icon: Users, label: 'Kru Astronaut' },
            { id: 'leaderboard', icon: Trophy, label: 'Peringkat' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 shadow-[inset_0_0_10px_rgba(8,145,178,0.2)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
          >
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
        
        {/* --- VIEW: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
               <Rocket className="text-purple-400" /> Status Sektor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel p-6 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Astronaut</p>
                <p className="text-4xl font-extrabold text-white mt-2 drop-shadow-md">{classStudents.length}</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.2)] border-cyan-500/30">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Laporan Masuk</p>
                <p className="text-4xl font-extrabold text-cyan-400 mt-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                  {classStudents.filter(s => s.journalEntry.length > 0).length}
                </p>
              </div>
              <div className="glass-panel p-6 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.2)] border-amber-500/30">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Rata-rata XP</p>
                <p className="text-4xl font-extrabold text-amber-400 mt-2 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  {classStudents.length > 0 
                    ? Math.round(classStudents.reduce((acc, curr) => acc + curr.totalXp, 0) / classStudents.length) 
                    : 0}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-white/10">
              <h3 className="font-bold text-lg mb-4 text-cyan-200">Konfigurasi Data</h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-all"
                >
                  <UserPlus size={18} /> Tambah Manual
                </button>
                <div className="relative">
                  <input type="file" accept=".csv,.txt" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-white/5 border border-white/20 text-cyan-300 hover:bg-white/10 px-4 py-2 rounded-lg font-bold transition-all">
                    <FileSpreadsheet size={18} /> Import Excel
                  </button>
                </div>
                <button onClick={handleDownloadTemplate} className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 text-sm font-bold hover:underline">
                  <Download size={16} /> Download Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: TASKS --- */}
        {activeTab === 'tasks' && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-2xl font-extrabold text-white">Pusat Misi</h2>
             
             <div className="glass-panel p-8 rounded-2xl max-w-2xl bg-[#1A1A2E]/80">
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-white mb-2 flex items-center gap-2">
                    <Target className="text-amber-400" /> Buat Misi Baru
                  </h3>
                  <p className="text-slate-400 text-sm">Misi akan muncul di dashboard astronaut sebagai "Misi Spesial" bernilai +50 XP.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-cyan-200 mb-1">Target Sektor</label>
                    <select 
                      value={bulkTargetClass}
                      onChange={(e) => setBulkTargetClass(e.target.value)}
                      className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                    >
                      <option value="ALL" className="bg-slate-900">Semua Sektor</option>
                      {CLASSES_LIST.map(c => (
                        <option key={c} value={c} className="bg-slate-900">Kelas {c}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-cyan-200 mb-1">Instruksi Misi</label>
                    <textarea 
                      value={bulkTaskInput}
                      onChange={(e) => setBulkTaskInput(e.target.value)}
                      placeholder="Contoh: Hafalkan Surat Al-Maun ayat 1-3..."
                      className="w-full p-3 h-32 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium resize-none placeholder-slate-600"
                    />
                  </div>

                  <button 
                    onClick={handleBulkAssign}
                    disabled={isBulkSending || !bulkTaskInput}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-800 text-white font-bold rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
                  >
                    {isBulkSending ? 'Mengirim Transmisi...' : <><Send size={18} /> Kirim Misi</>}
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: LEADERBOARD --- */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-2xl font-extrabold text-white">Hall of Fame</h2>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* School Leaderboard */}
                <div className="glass-panel rounded-2xl overflow-hidden border-amber-500/30">
                   <div className="p-6 bg-gradient-to-r from-amber-600/80 to-orange-600/80 text-white backdrop-blur-md">
                      <h3 className="font-bold text-lg flex items-center gap-2"><Trophy className="text-yellow-200" /> Top 10 Elite (Sekolah)</h3>
                   </div>
                   <div className="p-0">
                      {schoolLeaderboard.map((student, index) => (
                        <div key={student.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index < 3 ? 'bg-amber-400 text-amber-900 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-slate-700 text-slate-300'}`}>
                                 #{index + 1}
                              </div>
                              <div>
                                <p className="font-bold text-white">{student.name}</p>
                                <p className="text-xs text-slate-400">Kelas {student.class}</p>
                              </div>
                           </div>
                           <div className="font-extrabold text-cyan-400">{student.totalXp} XP</div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Class Leaderboard */}
                <div className="glass-panel rounded-2xl overflow-hidden border-cyan-500/30 h-fit">
                   <div className="p-6 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 text-white backdrop-blur-md">
                      <h3 className="font-bold text-lg flex items-center gap-2"><Medal className="text-cyan-200" /> Sektor Terbaik (Rata-rata XP)</h3>
                   </div>
                   <div className="p-0">
                      {classLeaderboard.map((cls, index) => (
                        <div key={cls.className} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index < 3 ? 'bg-cyan-400 text-cyan-900 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-700 text-slate-300'}`}>
                                 #{index + 1}
                              </div>
                              <p className="font-bold text-white">Kelas {cls.className}</p>
                           </div>
                           <div className="font-extrabold text-amber-400">{cls.avgXp} XP <span className="text-xs text-slate-500 font-normal">/astro</span></div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: STUDENT MANAGEMENT --- */}
        {activeTab === 'students' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
               <h2 className="text-2xl font-extrabold text-white">Manifest Kru Sektor {user?.selectedClass}</h2>
               <div className="relative">
                 <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Cari nama kru..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 w-64 placeholder-slate-500"
                 />
               </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-cyan-200 text-xs uppercase font-extrabold tracking-wider border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4">Nama Kru</th>
                      <th className="px-6 py-4">Pangkat</th>
                      <th className="px-6 py-4">Total XP</th>
                      <th className="px-6 py-4 text-center">Laporan</th>
                      <th className="px-6 py-4 text-center">Misi</th>
                      <th className="px-6 py-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredStudents.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Tidak ada data kru ditemukan.</td></tr>
                    ) : (
                      filteredStudents.map(student => (
                        <tr key={student.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{student.name}</div>
                            {student.password && <div className="text-xs text-slate-500 font-mono mt-0.5">{student.password}</div>}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {student.levelTitle}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-cyan-400">{student.totalXp}</td>
                          <td className="px-6 py-4 text-center">
                            {student.journalEntry ? (
                              <div className="group relative inline-block">
                                <CheckCircle className="text-emerald-400 w-5 h-5 cursor-help mx-auto drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl">
                                  "{student.journalEntry}"
                                </div>
                              </div>
                            ) : <XCircle className="text-slate-600 w-5 h-5 mx-auto" />}
                          </td>
                          <td className="px-6 py-4 text-center">
                             {student.isExtraTaskCompleted ? <CheckCircle className="text-emerald-400 w-5 h-5 mx-auto" /> : (student.extraTask ? <span className="text-xs font-bold text-amber-400 animate-pulse">Pending</span> : <span className="text-slate-600">-</span>)}
                          </td>
                          <td className="px-6 py-4">
                            {selectedStudentId === student.id ? (
                              <div className="flex items-center gap-2">
                                <input 
                                  autoFocus
                                  type="text" 
                                  className="text-sm bg-black/50 border border-white/20 rounded px-2 py-1 w-32 text-white focus:outline-none focus:border-cyan-500"
                                  placeholder="Misi..."
                                  value={taskInput}
                                  onChange={(e) => setTaskInput(e.target.value)}
                                />
                                <button onClick={handleAssignTask} className="bg-cyan-600 text-white p-1 rounded hover:bg-cyan-500"><Send size={14} /></button>
                                <button onClick={() => setSelectedStudentId(null)} className="text-red-400 p-1 hover:text-red-300"><XCircle size={14} /></button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => { setSelectedStudentId(student.id); setTaskInput(student.extraTask || ''); }}
                                className="text-xs font-bold text-cyan-300 bg-cyan-900/30 hover:bg-cyan-800/50 border border-cyan-500/30 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                {student.extraTask ? 'Edit Misi' : 'Beri Misi'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Add Student Modal */}
      {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-[#1A1A2E] rounded-2xl p-6 w-full max-w-sm shadow-[0_0_30px_rgba(8,145,178,0.3)] border border-white/10">
                <h3 className="font-bold text-lg text-white mb-4">Rekrut Kru Baru</h3>
                <form onSubmit={handleAddStudent}>
                  <input 
                    type="text" 
                    placeholder="Nama Lengkap"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-4"
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-xl border border-white/20 text-slate-300 hover:bg-white/5 font-bold">Batal</button>
                    <button type="submit" className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg">Simpan</button>
                  </div>
                </form>
             </div>
          </div>
        )}
    </div>
  );
};