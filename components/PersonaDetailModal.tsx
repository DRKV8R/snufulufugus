import React, { useState } from 'react';
import { Persona, PersonaActivityLog } from '../types';
import { XIcon, UserIcon, HistoryIcon, BeakerIcon } from './Icons';

interface PersonaDetailModalProps {
  persona: Persona | null;
  onClose: () => void;
  onActivate: (persona: Persona) => void;
  isActive: boolean;
  history: PersonaActivityLog[];
}

const DetailRow: React.FC<{ label: string; value: string | number | boolean; isMono?: boolean }> = ({ label, value, isMono = false }) => (
    <div className="py-2 border-b border-[rgba(0,255,255,0.05)]">
        <p className="text-xs text-[#00BFFF]">{label}</p>
        <p className={`text-sm text-white break-words ${isMono ? 'font-mono' : ''}`}>
            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
        </p>
    </div>
);

const PersonaDetailModal: React.FC<PersonaDetailModalProps> = ({ persona, onClose, onActivate, isActive, history }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  
  if (!persona) return null;

  const handleActivate = () => {
    onActivate(persona);
    onClose();
  };
  
  const LogIcon: React.FC<{type: PersonaActivityLog['type']}> = ({ type }) => {
    switch(type) {
      case 'activation': return <UserIcon className="w-4 h-4 text-green-400 flex-shrink-0" />;
      case 'visit': return <HistoryIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />;
      case 'intercept': return <BeakerIcon className="w-4 h-4 text-yellow-400 flex-shrink-0" />;
      default: return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#141414] border border-[rgba(0,255,255,0.15)] rounded-lg shadow-2xl shadow-cyan-500/10 w-full max-w-4xl m-4 relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-[rgba(0,255,255,0.15)] flex-shrink-0">
            <div className="flex items-center space-x-3">
                <UserIcon className="w-6 h-6 text-[#00FFFF]" />
                <h3 className="font-bold text-xl text-[#00FFFF] truncate">{persona.name}</h3>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white hover:bg-[#262626] rounded-full">
                <XIcon className="w-5 h-5" />
            </button>
        </div>
        
        <div className="border-b border-[rgba(0,255,255,0.15)] flex-shrink-0">
            <div className="flex px-6">
                <button 
                    onClick={() => setActiveTab('details')}
                    className={`py-2 px-4 text-sm font-medium border-b-2 ${activeTab === 'details' ? 'border-[#00FFFF] text-[#00FFFF]' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Persona Details
                </button>
                 <button 
                    onClick={() => setActiveTab('history')}
                    className={`py-2 px-4 text-sm font-medium border-b-2 ${activeTab === 'history' ? 'border-[#00FFFF] text-[#00FFFF]' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Comprehensive Activity Log
                </button>
            </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {activeTab === 'details' ? (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Column 1 */}
                  <div>
                      <h4 className="text-lg font-semibold text-cyan-300 mb-2 border-b border-cyan-500/20 pb-1">Core Profile</h4>
                      <DetailRow label="Team" value={persona.team} />
                      <DetailRow label="Occupation" value={persona.occupation} />
                      <DetailRow label="Region" value={persona.region} />
                      <DetailRow label="Ethnicity" value={persona.ethnicity} />
                      <DetailRow label="Political Alignment" value={persona.politicalAlignment} />
                      
                      <h4 className="text-lg font-semibold text-cyan-300 mb-2 border-b border-cyan-500/20 pb-1 mt-6">Behavioral Profile (Inferred)</h4>
                      <DetailRow label="Income Level" value={persona.incomeLevel} />
                      <DetailRow label="Education" value={persona.educationLevel} />
                      <DetailRow label="Interests" value={persona.interests.join(', ')} />
                      <DetailRow label="Shopping Habits" value={persona.shoppingHabits} />
                      <DetailRow label="Social Media Presence" value={persona.socialMediaPresence} />
                  </div>

                  {/* Column 2 */}
                  <div>
                      <h4 className="text-lg font-semibold text-cyan-300 mb-2 border-b border-cyan-500/20 pb-1">Hardware & Network</h4>
                      <DetailRow label="Platform" value={persona.platform} isMono />
                      <DetailRow label="Device Memory (RAM)" value={`${persona.deviceMemory} GB`} isMono />
                      <DetailRow label="GPU" value={persona.gpu} isMono />
                      <DetailRow label="Screen Resolution" value={persona.resolution} isMono />
                      <DetailRow label="Color/Pixel Depth" value={`${persona.colorDepth}-bit / ${persona.pixelDepth}-bit`} isMono />
                      <DetailRow label="Touch Support" value={persona.touchSupport} />
                      <DetailRow label="Connection" value={`${persona.connectionType} (${persona.downlink} Mbps)`} isMono />
                      <DetailRow label="ASN" value={`${persona.asn} (${persona.asnDescription})`} isMono />
                      
                      <h4 className="text-lg font-semibold text-cyan-300 mb-2 border-b border-cyan-500/20 pb-1 mt-6">Browser & Locale</h4>
                      <DetailRow label="Browser Vendor" value={persona.browserVendor} />
                      <DetailRow label="Language" value={persona.language} />
                      <DetailRow label="Accepted Languages" value={persona.acceptLanguages} isMono />
                      <DetailRow label="Timezone" value={persona.timezone} />
                      <DetailRow label="Cookies Enabled" value={persona.cookiesEnabled} />
                      <DetailRow label="Do Not Track" value={persona.doNotTrack} />
                  </div>
                  
                  <div className="md:col-span-2">
                      <h4 className="text-lg font-semibold text-cyan-300 mb-2 border-b border-cyan-500/20 pb-1">Full Fingerprint Details</h4>
                      <DetailRow label="User Agent" value={persona.userAgent} isMono />
                      <DetailRow label="Installed Fonts" value={persona.installedFonts.join(', ')} isMono />
                      <DetailRow label="Reported Plugins" value={persona.plugins} isMono />
                  </div>
              </div>
              
              <div className="mt-6">
                  <h4 className="text-lg font-semibold text-cyan-300 mb-2">Backstory</h4>
                  <p className="text-sm text-gray-300 bg-black/30 p-4 rounded-md border border-white/10 italic leading-relaxed">
                      {persona.backstory}
                  </p>
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-cyan-300 mb-2 border-b border-cyan-500/20 pb-1">Activity Stream</h4>
                   {history.length > 0 ? (
                    <div className="space-y-3">
                      {history.map(log => (
                        <div key={log.timestamp} className="flex items-start space-x-3">
                          <LogIcon type={log.type} />
                          <div className="flex-1">
                            <p className="text-xs font-mono text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                            <p className="text-sm text-gray-200">{log.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                   ) : (
                    <p className="text-sm text-gray-500 italic">No activity recorded for this persona yet.</p>
                   )}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-cyan-300 mb-2 border-b border-cyan-500/20 pb-1">Behavioral Analytics (Conceptual)</h4>
                   <p className="text-sm text-gray-400 mb-4">A simulation of how this persona's digital 'body language' would be analyzed.</p>
                  <div className="space-y-2 text-sm font-mono">
                    <p><strong>Mouse Movement:</strong> <span className="text-green-400">Natural (Bézier curves)</span></p>
                    <p><strong>Typing Cadence:</strong> <span className="text-green-400">~65 WPM, moderate variance</span></p>
                    <p><strong>Click Precision:</strong> <span className="text-yellow-400">Slightly off-center (human-like)</span></p>
                    <p><strong>Session Pattern:</strong> <span className="text-cyan-400">Primarily nocturnal, long sessions</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
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