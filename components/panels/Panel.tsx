import React from 'react';

interface PanelProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, subtitle, children }) => {
  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#00FFFF] tracking-wide relative pb-2" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.3)' }}>
          {title}
          <span className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-gradient-to-r from-[#00FFFF] to-transparent"></span>
        </h2>
        <p className="text-[#00BFFF] font-mono text-sm mt-1">{subtitle}</p>
      </div>
      <div>{children}</div>
    </div>
  );
};

interface PanelSectionProps {
    title: string;
    children: React.ReactNode;
}

export const PanelSection: React.FC<PanelSectionProps> = ({ title, children }) => {
    return (
        <div className="bg-[#1A1A1A]/50 border border-[rgba(0,255,255,0.15)] rounded-lg p-4 mb-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-[#00FFFF] mb-3 border-b border-[rgba(0,255,255,0.1)] pb-2">{title}</h3>
            <div>{children}</div>
        </div>
    )
}


export default Panel;