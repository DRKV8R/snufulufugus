import React from 'react';
import { Persona } from '../types';
import { XIcon, UserIcon } from './Icons';

interface PersonaDetailModalProps {
  persona: Persona | null;
  onClose: () => void;
  onActivate: (persona: Persona) => void;
  isActive: boolean;
}

const DetailRow: React.FC<{ label: string; value: string; isMono?: boolean }> = ({ label, value, isMono = false }) => (
    <div className="py-2 border-b border-[rgba(0,255,255,0.05)]">
        <p className="text-xs text-[#00BFFF]">{label}</p>
        <p className={`text-sm text-white break-words ${isMono ? 'font-mono' : ''}`}>{value}</p>
    </div>
);

const PersonaDetailModal: React.FC<PersonaDetailModalProps> = ({ persona, onClose, onActivate, isActive }) => {
  if (!persona) return null;

  const handleActivate = () => {
    onActivate(persona);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#141414] border border-[rgba(0,255,255,0.15)] rounded-lg shadow-2xl shadow-cyan-500/10 w-full max-w-2xl m-4 relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-[rgba(0,255,255,0.15)] flex-shrink-0">
            <div className="flex items-center space-x-3">
                <UserIcon className="w-6 h-6 text-[#00FFFF]" />
                <h3 className="font-bold text-xl text-[#00FFFF] truncate">{persona.name}</h3>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white hover:bg-[#262626] rounded-full">
                <XIcon className="w-5 h-5" />
            </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-lg font-semibold text-cyan-300 mb-2">Profile</h4>
                    <DetailRow label="Team" value={persona.team} />
                    <DetailRow label="Occupation" value={persona.occupation} />
                    <DetailRow label="Region" value={persona.region} />
                    <DetailRow label="Language" value={persona.language} />
                    <DetailRow label="Timezone" value={persona.timezone} />
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-cyan-300 mb-2">Technical Fingerprint</h4>
                    <DetailRow label="Screen Resolution" value={persona.resolution} isMono />
                    <DetailRow label="User Agent" value={persona.userAgent} isMono />
                </div>
            </div>
            
            <div className="mt-6">
                 <h4 className="text-lg font-semibold text-cyan-300 mb-2">Backstory</h4>
                 <p className="text-sm text-gray-300 bg-black/30 p-4 rounded-md border border-white/10 italic leading-relaxed">
                    {persona.backstory}
                 </p>
            </div>
        </div>

        <div className="p-4 border-t border-[rgba(0,255,255,0.15)] flex-shrink-0 flex justify-end">
            <button 
                onClick={handleActivate}
                disabled={isActive}
                className="snufulufugus-button primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isActive ? 'Currently Active' : 'Activate Persona'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PersonaDetailModal;