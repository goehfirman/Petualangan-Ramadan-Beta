import React, { useState, useRef, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { LogOut, CheckCircle, XCircle, Plus, Send, UserPlus, FileSpreadsheet, Info, Download, Trophy, Target, Users, Search, Medal, School } from 'lucide-react';
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
    const headers = "Nama Siswa,Password";
    const examples = "\nAhmad Dahlan,12345\nSiti Walidah,rahasia123\nKi Hajar Dewantara,kodepuasa";
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
    <div className="min-h-screen bg-slate-50 font-sans text-black flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="bg-white w-full md:w-64 border-r border-slate-200 flex flex-col sticky top-0 h-auto md:h-screen z-30">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200">
              G
            </div>
            <div>
              <h1 className="font-bold text-black text-lg leading-tight">{user?.name}</h1>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Kelas {user?.selectedClass}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <School size={20} /> Ringkasan
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'tasks' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Target size={20} /> Tugas Harian
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'students' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Users size={20} /> Manajemen Siswa
          </button>
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'leaderboard' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Trophy size={20} /> Peringkat
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        {/* --- VIEW: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold text-black">Ringkasan Kelas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-sm font-bold">Total Siswa</p>
                <p className="text-4xl font-extrabold text-black mt-2">{classStudents.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-sm font-bold">Jurnal Terisi Hari Ini</p>
                <p className="text-4xl font-extrabold text-emerald-600 mt-2">
                  {classStudents.filter(s => s.journalEntry.length > 0).length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-sm font-bold">Rata-rata XP Kelas</p>
                <p className="text-4xl font-extrabold text-amber-500 mt-2">
                  {classStudents.length > 0 
                    ? Math.round(classStudents.reduce((acc, curr) => acc + curr.totalXp, 0) / classStudents.length) 
                    : 0}
                </p>
              </div>
            </div>

            {/* Quick Actions for Import/Add */}
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <h3 className="font-bold text-lg mb-4 text-emerald-900">Setup Data Siswa</h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all"
                >
                  <UserPlus size={18} /> Tambah Manual
                </button>
                <div className="relative">
                  <input type="file" accept=".csv,.txt" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg font-bold shadow-sm">
                    <FileSpreadsheet size={18} /> Import Excel
                  </button>
                </div>
                <button onClick={handleDownloadTemplate} className="flex items-center gap-2 text-emerald-700 hover:underline px-4 py-2 text-sm font-bold">
                  <Download size={16} /> Download Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: TASKS --- */}
        {activeTab === 'tasks' && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-2xl font-extrabold text-black">Manajemen Tugas Harian</h2>
             
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-2xl">
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-black mb-2 flex items-center gap-2">
                    <Target className="text-amber-500" /> Buat Tugas Baru
                  </h3>
                  <p className="text-slate-500 text-sm">Tugas ini akan muncul di dashboard siswa sebagai "Tugas Tambahan" bernilai +50 XP.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Target Kelas</label>
                    <select 
                      value={bulkTargetClass}
                      onChange={(e) => setBulkTargetClass(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    >
                      <option value="ALL">Semua Kelas</option>
                      {CLASSES_LIST.map(c => (
                        <option key={c} value={c}>Kelas {c}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Isi Tugas</label>
                    <textarea 
                      value={bulkTaskInput}
                      onChange={(e) => setBulkTaskInput(e.target.value)}
                      placeholder="Contoh: Hafalkan Surat Al-Maun ayat 1-3..."
                      className="w-full p-3 h-32 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium resize-none"
                    />
                  </div>

                  <button 
                    onClick={handleBulkAssign}
                    disabled={isBulkSending || !bulkTaskInput}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2"
                  >
                    {isBulkSending ? 'Mengirim...' : <><Send size={18} /> Kirim Tugas Sekarang</>}
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: LEADERBOARD --- */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-2xl font-extrabold text-black">Papan Peringkat</h2>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* School Leaderboard */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                   <div className="p-6 bg-gradient-to-r from-amber-400 to-orange-400 text-white">
                      <h3 className="font-bold text-lg flex items-center gap-2"><Trophy /> Top 10 Siswa (Sekolah)</h3>
                   </div>
                   <div className="p-0">
                      {schoolLeaderboard.map((student, index) => (
                        <div key={student.id} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                           <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                 #{index + 1}
                              </div>
                              <div>
                                <p className="font-bold text-black">{student.name}</p>
                                <p className="text-xs text-slate-500">Kelas {student.class}</p>
                              </div>
                           </div>
                           <div className="font-extrabold text-emerald-600">{student.totalXp} XP</div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Class Leaderboard */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-fit">
                   <div className="p-6 bg-emerald-600 text-white">
                      <h3 className="font-bold text-lg flex items-center gap-2"><Medal /> Kelas Terrajin (Rata-rata XP)</h3>
                   </div>
                   <div className="p-0">
                      {classLeaderboard.map((cls, index) => (
                        <div key={cls.className} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                           <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index < 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                 #{index + 1}
                              </div>
                              <p className="font-bold text-black">Kelas {cls.className}</p>
                           </div>
                           <div className="font-extrabold text-amber-600">{cls.avgXp} XP <span className="text-xs text-slate-400 font-normal">/siswa</span></div>
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
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-extrabold text-black">Daftar Siswa Kelas {user?.selectedClass}</h2>
               <div className="relative">
                 <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Cari nama siswa..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                 />
               </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-extrabold">
                    <tr>
                      <th className="px-6 py-4">Nama Siswa</th>
                      <th className="px-6 py-4">Level</th>
                      <th className="px-6 py-4">Total XP</th>
                      <th className="px-6 py-4 text-center">Jurnal</th>
                      <th className="px-6 py-4 text-center">Tugas</th>
                      <th className="px-6 py-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredStudents.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Tidak ada siswa ditemukan.</td></tr>
                    ) : (
                      filteredStudents.map(student => (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-black">{student.name}</div>
                            {student.password && <div className="text-xs text-slate-400 font-mono mt-0.5">{student.password}</div>}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              {student.levelTitle}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-emerald-600">{student.totalXp}</td>
                          <td className="px-6 py-4 text-center">
                            {student.journalEntry ? (
                              <div className="group relative inline-block">
                                <CheckCircle className="text-emerald-500 w-5 h-5 cursor-help mx-auto" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                                  "{student.journalEntry}"
                                </div>
                              </div>
                            ) : <XCircle className="text-slate-300 w-5 h-5 mx-auto" />}
                          </td>
                          <td className="px-6 py-4 text-center">
                             {student.isExtraTaskCompleted ? <CheckCircle className="text-emerald-500 w-5 h-5 mx-auto" /> : (student.extraTask ? <span className="text-xs font-bold text-amber-500">Pending</span> : <span className="text-slate-300">-</span>)}
                          </td>
                          <td className="px-6 py-4">
                            {selectedStudentId === student.id ? (
                              <div className="flex items-center gap-2">
                                <input 
                                  autoFocus
                                  type="text" 
                                  className="text-sm border rounded px-2 py-1 w-32"
                                  placeholder="Tugas..."
                                  value={taskInput}
                                  onChange={(e) => setTaskInput(e.target.value)}
                                />
                                <button onClick={handleAssignTask} className="bg-emerald-600 text-white p-1 rounded"><Send size={14} /></button>
                                <button onClick={() => setSelectedStudentId(null)} className="text-red-500 p-1"><XCircle size={14} /></button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => { setSelectedStudentId(student.id); setTaskInput(student.extraTask || ''); }}
                                className="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                {student.extraTask ? 'Edit Tugas' : 'Beri Tugas'}
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
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                <h3 className="font-bold text-lg text-black mb-4">Tambah Siswa Baru</h3>
                <form onSubmit={handleAddStudent}>
                  <input 
                    type="text" 
                    placeholder="Nama Lengkap Siswa"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-xl border border-slate-300 font-bold">Batal</button>
                    <button type="submit" className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold">Simpan</button>
                  </div>
                </form>
             </div>
          </div>
        )}
    </div>
  );
};