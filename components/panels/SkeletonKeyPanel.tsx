import React, { useState } from 'react';
import Panel, { PanelSection } from './Panel';
import { DEFAULT_SENTRY_PACKETS, DEFAULT_HYDRA_SCRIPTS } from '../../constants';
import { HydraScript, SentryPacket } from '../../types';

interface SkeletonKeyPanelProps {
    setSentryStatus: (status: string) => void;
    setActiveVpnRegion: (region: string) => void;
}

const SkeletonKeyPanel: React.FC<SkeletonKeyPanelProps> = ({ setSentryStatus, setActiveVpnRegion }) => {
    const [selectedScript, setSelectedScript] = useState<HydraScript>(DEFAULT_HYDRA_SCRIPTS[0]);

    const handleReplay = (packet: SentryPacket) => {
        setSentryStatus(`Matching VPN to ${packet.region}...`);

        setTimeout(() => {
            setActiveVpnRegion(packet.region);
            setSentryStatus(`Replaying ${packet.type} on ${packet.domain}...`);

            setTimeout(() => setSentryStatus('Success'), 2000);
            setTimeout(() => setSentryStatus('Idle'), 4000);
        }, 1500);
    }

  return (
    <Panel title="snufulufuguskey" subtitle="automation engine">
      <div className="grid grid-cols-1 gap-6">
        <PanelSection title="Challenge Solver">
            <p className="text-sm text-gray-400 mb-4">System for CAPTCHAs and age gates.</p>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {DEFAULT_SENTRY_PACKETS.map(packet => (
                    <div key={packet.id} className="bg-[#1A1A1A] p-3 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-[#00FFFF]">{packet.domain}</p>
                            <p className="text-xs text-gray-400 font-mono">{packet.type} - Solved: {packet.solvedAt}</p>
                            <p className="text-xs text-[#00BFFF] mt-1 font-mono">Region: {packet.region}</p>
                        </div>
                        <button 
                            onClick={() => handleReplay(packet)}
                            className="snufulufugus-button text-xs py-1 px-3"
                        >
                            Replay
                        </button>
                    </div>
                ))}
            </div>
        </PanelSection>
        
        <PanelSection title="Automation Scripts">
            <p className="text-sm text-gray-400 mb-4">In-browser scripting for automation.</p>
            <div className="space-y-4">
                <div>
                    <h5 className="text-sm font-semibold mb-2 text-[#00BFFF]">Select Script</h5>
                    <div className="flex flex-wrap gap-2">
                        {DEFAULT_HYDRA_SCRIPTS.map(script => (
                            <button
                                key={script.id}
                                onClick={() => setSelectedScript(script)}
                                className={`text-left p-2 rounded-md text-sm transition-colors border ${selectedScript.id === script.id ? 'bg-[rgba(0,255,255,0.1)] text-[#00FFFF] border-[#00FFFF]' : 'border-[rgba(0,255,255,0.15)] hover:bg-[#1A1A1A]'}`}
                            >
                                {script.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h5 className="text-sm font-semibold mb-2 text-[#00BFFF]">Editor</h5>
                    <textarea
                        readOnly
                        value={selectedScript.code}
                        className="w-full h-48 bg-black/50 border border-[rgba(0,255,255,0.15)] rounded-md p-2 text-xs font-mono text-green-400 resize-none focus:outline-none focus:ring-1 focus:ring-[#00FFFF]"
                    />
                     <button className="mt-2 w-full snufulufugus-button primary">
                        Execute Script
                    </button>
                </div>
            </div>
        </PanelSection>
      </div>
    </Panel>
  );
};

export default SkeletonKeyPanel;