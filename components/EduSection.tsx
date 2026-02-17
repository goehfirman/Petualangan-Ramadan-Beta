import React, { useState } from 'react';
import { EDU_CONTENT } from '../constants';
import { Book, ChevronDown, ChevronUp, Scroll } from 'lucide-react';

export const EduSection: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <div className="glass-panel rounded-[30px] p-6 mb-8 border border-purple-500/30">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Book className="text-purple-400" /> Pusat Data Puasa
      </h2>
      
      <div className="space-y-3">
        {/* Definition */}
        <div className="bg-black/20 rounded-xl overflow-hidden border border-white/5">
            <button onClick={() => toggle('def')} className="w-full flex justify-between items-center p-4 text-left hover:bg-white/5">
                <span className="font-bold text-purple-200 text-sm">Pengertian & Hukum</span>
                {openSection === 'def' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSection === 'def' && (
                <div className="p-4 pt-0 text-sm text-slate-300 space-y-3 animate-fade-in">
                    <div>
                        <strong className="text-amber-400 block mb-1">{EDU_CONTENT.definitions.title}</strong>
                        <p>{EDU_CONTENT.definitions.content}</p>
                    </div>
                    <div>
                        <strong className="text-amber-400 block mb-1">{EDU_CONTENT.hukum.title}</strong>
                        <p>{EDU_CONTENT.hukum.content}</p>
                    </div>
                </div>
            )}
        </div>

        {/* Syarat & Rukun */}
        <div className="bg-black/20 rounded-xl overflow-hidden border border-white/5">
            <button onClick={() => toggle('syarat')} className="w-full flex justify-between items-center p-4 text-left hover:bg-white/5">
                <span className="font-bold text-purple-200 text-sm">Rukun & Syarat</span>
                {openSection === 'syarat' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSection === 'syarat' && (
                <div className="p-4 pt-0 text-sm text-slate-300 space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong className="text-cyan-400 block mb-1">{EDU_CONTENT.rukun.title}</strong>
                            <ul className="list-disc pl-4 space-y-1">
                                {EDU_CONTENT.rukun.items.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div>
                            <strong className="text-cyan-400 block mb-1">{EDU_CONTENT.syarat.title}</strong>
                            <ul className="list-disc pl-4 space-y-1">
                                {EDU_CONTENT.syarat.items.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Niat & Doa */}
        <div className="bg-black/20 rounded-xl overflow-hidden border border-white/5">
            <button onClick={() => toggle('niat')} className="w-full flex justify-between items-center p-4 text-left hover:bg-white/5">
                <span className="font-bold text-purple-200 text-sm">Niat & Doa Berbuka</span>
                {openSection === 'niat' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSection === 'niat' && (
                <div className="p-4 pt-0 text-sm space-y-4 animate-fade-in">
                    <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/20">
                        <strong className="text-amber-400 block mb-2 text-center">Niat Puasa</strong>
                        <p className="text-right font-arabic text-xl mb-2 leading-loose">{EDU_CONTENT.niat_doa.niat.arab}</p>
                        <p className="text-xs text-slate-400 italic mb-1">{EDU_CONTENT.niat_doa.niat.latin}</p>
                        <p className="text-xs text-white">"{EDU_CONTENT.niat_doa.niat.arti}"</p>
                    </div>
                    <div className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/20">
                        <strong className="text-emerald-400 block mb-2 text-center">Doa Berbuka (Shahih)</strong>
                        <p className="text-right font-arabic text-xl mb-2 leading-loose">{EDU_CONTENT.niat_doa.buka.arab}</p>
                        <p className="text-xs text-slate-400 italic mb-1">{EDU_CONTENT.niat_doa.buka.latin}</p>
                        <p className="text-xs text-white">"{EDU_CONTENT.niat_doa.buka.arti}"</p>
                    </div>
                    <div>
                        <strong className="text-cyan-400 block mb-1">{EDU_CONTENT.tata_cara_buka.title}</strong>
                        <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                             {EDU_CONTENT.tata_cara_buka.steps.map((item, i) => <li key={i}>{item}</li>)}
                        </ol>
                    </div>
                </div>
            )}
        </div>

        {/* Sunnah & Keutamaan */}
        <div className="bg-black/20 rounded-xl overflow-hidden border border-white/5">
            <button onClick={() => toggle('sunnah')} className="w-full flex justify-between items-center p-4 text-left hover:bg-white/5">
                <span className="font-bold text-purple-200 text-sm">Sunnah & Keutamaan</span>
                {openSection === 'sunnah' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSection === 'sunnah' && (
                <div className="p-4 pt-0 text-sm text-slate-300 space-y-3 animate-fade-in">
                    <div>
                         <strong className="text-amber-400 block mb-1">{EDU_CONTENT.sunnah.title}</strong>
                         <ul className="list-disc pl-4 space-y-1">
                             {EDU_CONTENT.sunnah.items.map((item, i) => <li key={i}>{item}</li>)}
                         </ul>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                         <strong className="text-amber-400 block mb-1">{EDU_CONTENT.keutamaan.title}</strong>
                         <ul className="list-disc pl-4 space-y-1">
                             {EDU_CONTENT.keutamaan.items.map((item, i) => <li key={i}>{item}</li>)}
                         </ul>
                    </div>
                </div>
            )}
        </div>

        {/* Batal & Kaffarah */}
        <div className="bg-black/20 rounded-xl overflow-hidden border border-white/5">
            <button onClick={() => toggle('batal')} className="w-full flex justify-between items-center p-4 text-left hover:bg-white/5">
                <span className="font-bold text-purple-200 text-sm">Pembatal & Keringanan</span>
                {openSection === 'batal' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSection === 'batal' && (
                <div className="p-4 pt-0 text-sm text-slate-300 space-y-3 animate-fade-in">
                    <div>
                         <strong className="text-red-400 block mb-1">Hal Membatalkan</strong>
                         <ul className="list-disc pl-4 space-y-1">
                             {EDU_CONTENT.batal_exempt.batal.map((item, i) => <li key={i}>{item}</li>)}
                         </ul>
                    </div>
                    <div>
                         <strong className="text-emerald-400 block mb-1">Boleh Tidak Puasa (Rukhsah)</strong>
                         <ul className="list-disc pl-4 space-y-1">
                             {EDU_CONTENT.batal_exempt.exempt.map((item, i) => <li key={i}>{item}</li>)}
                         </ul>
                    </div>
                    <div className="bg-red-900/10 p-3 rounded-lg border border-red-500/20 mt-2">
                        <strong className="text-red-300 block mb-1">{EDU_CONTENT.kaffarah.title}</strong>
                        <p>{EDU_CONTENT.kaffarah.content}</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};