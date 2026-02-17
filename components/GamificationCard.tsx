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
        rounded-2xl border-2 p-4 flex items-center gap-4 shadow-sm
        ${completed 
          ? 'bg-emerald-100 border-emerald-500 shadow-emerald-200' 
          : 'bg-white border-slate-200 hover:border-emerald-300'
        }
      `}
    >
      {/* Icon Background Blob */}
      <div className={`
        absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10
        ${completed ? 'bg-emerald-600' : 'bg-slate-400'}
      `} />

      {/* Icon Box */}
      <div className={`
        flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md
        transition-colors duration-300
        ${completed ? 'bg-emerald-500' : 'bg-slate-300'}
      `}>
        <IconComponent size={24} />
      </div>

      {/* Text Content */}
      <div className="flex-1 z-10">
        <h3 className={`font-bold text-lg leading-tight ${completed ? 'text-black' : 'text-black'}`}>
          {label}
        </h3>
        <p className="text-sm font-bold text-amber-600 flex items-center gap-1">
          +{xp} XP
        </p>
      </div>

      {/* Checkbox Visual */}
      <div className="z-10 text-emerald-600">
        {completed ? <CheckCircle2 size={32} fill="#10b981" className="text-white" /> : <Circle size={32} className="text-slate-300" />}
      </div>
    </div>
  );
};