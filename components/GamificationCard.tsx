import React from 'react';
import { CheckCircle2, Circle, LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

interface GamificationCardProps {
  label: string;
  xp: number;
  completed: boolean;
  iconName: string;
  onToggle: () => void;
}

export const GamificationCard: React.FC<GamificationCardProps> = ({ label, xp, completed, iconName, onToggle }) => {
  // Dynamically get icon
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[iconName] as LucideIcon || Icons.Star;

  return (
    <div 
      onClick={onToggle}
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
        rounded-2xl border p-4 flex items-center gap-4 backdrop-blur-sm
        ${completed 
          ? 'glass-panel border-cyan-500/50 bg-cyan-900/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
          : 'glass-panel border-white/10 hover:border-cyan-400/40 hover:bg-white/5'
        }
      `}
    >
      {/* Icon Background Glow */}
      <div className={`
        absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-20
        ${completed ? 'bg-cyan-400' : 'bg-slate-600'}
      `} />

      {/* Icon Box */}
      <div className={`
        flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg border border-white/10
        transition-colors duration-300
        ${completed 
          ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
          : 'bg-gradient-to-br from-slate-700 to-slate-800'
        }
      `}>
        <IconComponent size={24} className={completed ? 'animate-pulse' : ''} />
      </div>

      {/* Text Content */}
      <div className="flex-1 z-10">
        <h3 className={`font-bold text-lg leading-tight ${completed ? 'text-cyan-100' : 'text-slate-200'}`}>
          {label}
        </h3>
        <p className="text-sm font-bold text-amber-400 flex items-center gap-1 drop-shadow-sm">
          +{xp} XP
        </p>
      </div>

      {/* Checkbox Visual */}
      <div className="z-10">
        {completed ? (
          <CheckCircle2 size={32} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" fill="rgba(6,182,212,0.2)" />
        ) : (
          <Circle size={32} className="text-slate-600" />
        )}
      </div>
    </div>
  );
};