import React, { useState } from 'react';
import { Pillar, PillarId } from '../types';
import { PILLARS } from '../constants';
import { MenuIcon, XIcon } from './Icons';

interface GooeyMenuProps {
  onSelectPillar: (pillar: Pillar) => void;
  activePillarId: PillarId | null;
}

const Sidebar: React.FC<GooeyMenuProps> = ({ onSelectPillar, activePillarId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = PILLARS;
  const radius = 150; // px
  const angleStep = 90 / (menuItems.length - 1); // Arc over 90 degrees

  return (
    <nav className="gooey-menu">
      {menuItems.map((pillar, index) => {
        const angle = angleStep * index;
        const angleRad = angle * (Math.PI / 180);
        const x = radius * Math.cos(angleRad);
        const y = -radius * Math.sin(angleRad);
        
        const transform = isOpen ? `translate3d(${x}px, ${y}px, 0) scale(1)` : 'translate3d(0, 0, 0) scale(0)';
        const transitionDelay = isOpen ? `${index * 0.03}s` : `${(menuItems.length - index) * 0.03}s`;

        const isActive = activePillarId === pillar.id;

        return (
          <button
            key={pillar.id}
            className="gooey-menu__item"
            onClick={() => {
              onSelectPillar(pillar);
              setIsOpen(false);
            }}
            style={{
              transform,
              transitionDelay,
              backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--accent-secondary)'
            }}
            title={pillar.name}
          >
            {React.cloneElement(pillar.icon as React.ReactElement, { className: "w-6 h-6" })}
          </button>
        );
      })}
      
      <button className="gooey-menu__toggle" onClick={() => setIsOpen(!isOpen)} title="Toggle Menu">
        {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>
    </nav>
  );
};

export default Sidebar;
