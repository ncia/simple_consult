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
            핀토스 보험케어
          </span>
          <span className="text-[10px] bg-brand-green text-white font-bold px-1.5 py-0.5 rounded-full hidden sm:inline">
            내 보험 바로알기
          </span>
        </div>
        
        <a
          href="tel:01026277771"
          className="flex items-center gap-1.5 font-sans font-semibold text-xs bg-white text-brand-blue border border-brand-blue hover:bg-brand-blue hover:text-white px-3.5 py-2 rounded-full transition-colors duration-300 active:scale-95 shadow-sm group"
        >
          <Phone size={13} className="text-brand-blue group-hover:text-white transition-colors duration-300" />
          <span>빠른상담</span>
        </a>
      </div>
    </header>
  );
}
