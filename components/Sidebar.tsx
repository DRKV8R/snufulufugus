import React from 'react';
import { Pillar } from '../types';
import { PILLARS } from '../constants';

interface SidebarProps {
  activePillar: Pillar;
  setActivePillar: (pillar: Pillar) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePillar, setActivePillar }) => {
  return (
    <nav className="flex flex-col items-center bg-[#0D0D0D] border-r border-[rgba(0,255,255,0.15)] p-2 md:p-4 space-y-4">
      <div className="text-[#00FFFF] text-center pb-4 border-b border-[rgba(0,255,255,0.15)] hidden md:block">
        <h1 className="text-xl font-bold font-mono tracking-widest">SNUFULUFUGUS</h1>
        <p className="text-xs text-[#00BFFF]">v1.0</p>
      </div>
      <div className="flex-1 flex flex-col items-center md:items-stretch space-y-2">
        {PILLARS.map((pillar) => (
          <button
            key={pillar.id}
            onClick={() => setActivePillar(pillar)}
            className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-200 static-hover ${
              activePillar.id === pillar.id
                ? 'bg-[rgba(0,255,255,0.1)] text-[#00FFFF] shadow-lg shadow-cyan-500/10'
                : 'text-[#A0A0E0] hover:bg-[#1A1A1A] hover:text-white'
            }`}
            title={pillar.name}
          >
            {pillar.icon}
            <span className="hidden md:inline">{pillar.name}</span>
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-600 text-center hidden md:block font-mono">
        &copy; 2025 snufulufugus.
      </div>
    </nav>
  );
};

export default Sidebar;