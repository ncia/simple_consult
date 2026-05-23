import React from 'react';
import { ShieldAlert, Phone } from 'lucide-react';

interface HeaderProps {
  onContactClick: () => void;
}

export function Header({ onContactClick }: HeaderProps) {
  return (
    <header className="bg-white/80 dark:bg-neutral-dark/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-border w-full">
      <div className="flex justify-between items-center w-full px-5 h-16 max-w-[768px] mx-auto">
        <div className="flex items-center gap-2">
          {/* Logo Brand Icon with Heart and Pulse concept */}
          <div className="bg-brand-blue text-white p-1.5 rounded-lg flex items-center justify-center shadow-md shadow-brand-blue/20">
            <ShieldAlert size={18} className="fill-current" />
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight bg-gradient-to-r from-brand-blue to-brand-blue-hover bg-clip-text text-transparent">
            InsureAnalysis
          </span>
          <span className="text-[10px] bg-brand-green-light/20 text-brand-green font-bold px-1.5 py-0.5 rounded-full hidden sm:inline">
            내 보험 바로알기
          </span>
        </div>
        
        <button
          onClick={onContactClick}
          className="flex items-center gap-1.5 font-sans font-semibold text-xs text-brand-blue hover:text-brand-blue-dark hover:bg-neutral-bg border border-brand-blue/30 px-3.5 py-2 rounded-full transition-all active:scale-95"
        >
          <Phone size={13} />
          <span>Contact</span>
        </button>
      </div>
    </header>
  );
}
