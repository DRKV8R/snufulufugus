import React from 'react';
import { Pillar, PillarId } from '../types';
import { XIcon } from './Icons';

interface PanelTabBarProps {
  tabs: Pillar[];
  activeTabId: PillarId | null;
  onSelectTab: (id: PillarId) => void;
  onCloseTab: (id: PillarId) => void;
}

const PanelTabBar: React.FC<PanelTabBarProps> = ({ tabs, activeTabId, onSelectTab, onCloseTab }) => {
  if (tabs.length === 0) return null;
  
  return (
    <div className="flex items-center bg-[#1A1A1A]/80 border-b border-[rgba(0,255,255,0.15)] flex-shrink-0">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          className={`flex items-center justify-between px-4 py-2 cursor-pointer border-r border-[rgba(0,255,255,0.1)] transition-all ${
            activeTabId === tab.id
              ? 'bg-[#0D0D0D] text-[#00FFFF]'
              : 'text-gray-400 hover:bg-black/30'
          }`}
        >
          <div className="flex items-center space-x-2">
            {React.cloneElement(tab.icon as React.ReactElement, { className: "w-4 h-4" })}
            <span className="text-sm font-medium">{tab.name}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseTab(tab.id);
            }}
            className="ml-4 p-0.5 rounded-full hover:bg-white/10 text-gray-500 hover:text-white"
            title={`Close ${tab.name}`}
          >
            <XIcon className="w-3 h-3" />
          </button>
        </div>
      ))}
      <div className="flex-1 border-b border-[rgba(0,255,255,0.1)]"></div>
    </div>
  );
};

export default PanelTabBar;
