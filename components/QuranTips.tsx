import React from 'react';
import { QURAN_TIPS } from '../constants';
import { BookOpen, Target } from 'lucide-react';

export const QuranTips: React.FC = () => {
  return (
    <div className="glass-panel rounded-[30px] p-6 mb-8 border border-emerald-500/30">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="text-emerald-400" /> Strategi Khatam Quran
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {QURAN_TIPS.map((tip, index) => (
                <div key={index} className="bg-black/20 p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-extrabold text-emerald-300">{tip.target}</span>
                        <BookOpen size={16} className="text-emerald-600" />
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {tip.strategy}
                    </p>
                </div>
            ))}
        </div>
    </div>
  );
};