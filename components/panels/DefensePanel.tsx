import React, { useState, useEffect } from 'react';
import Panel, { PanelSection } from './Panel';
import { ShieldCheckIcon } from '../Icons';

interface DefensePanelProps {
    onAgentQuery: (query: string) => void;
}

const Toggle: React.FC<{ label: string; description: string; enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ label, description, enabled, setEnabled }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5">
        <div>
            <span className="font-medium text-[#00BFFF]">{label}</span>
            <p className="text-xs text-gray-400">{description}</p>
        </div>
        <label htmlFor={`toggle-${label}`} className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} id={`toggle-${label}`} className="sr-only peer" />
            <div className="w-11 h-6 bg-[#262626] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00FFFF] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BFFF]"></div>
        </label>
    </div>
);

const DefensePanel: React.FC<DefensePanelProps> = ({ onAgentQuery }) => {
    const [isThreatShieldActive, setThreatShieldActive] = useState(true);
    const [isThreatMonitorActive, setThreatMonitorActive] = useState(false);
    const [monitorLogs, setMonitorLogs] = useState<string[]>([]);
    
    const [scriptsScanned, setScriptsScanned] = useState(1337);
    const [threatsNeutralized, setThreatsNeutralized] = useState(42);

    useEffect(() => {
        let logInterval: number;
        if (isThreatMonitorActive) {
            setMonitorLogs(['[SYSTEM] Threat monitor deployed. Monitoring for unauthorized connections...']);
            logInterval = window.setInterval(() => {
                const ip = `1${Math.floor(Math.random()*99)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
                const port = [22, 80, 443, 3306, 502, 102][Math.floor(Math.random()*6)];
                const log = `[${new Date().toLocaleTimeString()}] Suspicious connection from ${ip} on port ${port}. Connection logged and sandboxed.`;
                setMonitorLogs(prev => [log, ...prev].slice(0, 50));
            }, 5000 * Math.random() + 2000);
        } else {
            setMonitorLogs([]);
        }
        return () => clearInterval(logInterval);
    }, [isThreatMonitorActive]);
    
    useEffect(() => {
        let counterInterval: number;
        if (isThreatShieldActive) {
            counterInterval = window.setInterval(() => {
                setScriptsScanned(c => c + Math.floor(Math.random() * 5));
                if (Math.random() < 0.01) {
                    setThreatsNeutralized(c => c + 1);
                }
            }, 1500);
        }
        return () => clearInterval(counterInterval);
    }, [isThreatShieldActive]);

    const handleWebcamScan = () => {
        onAgentQuery('Scan the current page for any scripts or APIs attempting to enumerate or access webcam/camera devices. Report findings.');
    };

    return (
        <Panel title="snufulufugusdefense" subtitle="active protection systems">
            <PanelSection title="Threat Shield">
                <Toggle
                    label="Real-time Shield"
                    description="Actively analyzes scripts and downloads for malicious signatures."
                    enabled={isThreatShieldActive}
                    setEnabled={setThreatShieldActive}
                />
                <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                    <div className="bg-black/40 p-3 rounded">
                        <p className="text-2xl font-mono text-cyan-400">{isThreatShieldActive ? scriptsScanned.toLocaleString() : 'N/A'}</p>
                        <p className="text-xs text-gray-400">Scripts Scanned</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded">
                        <p className="text-2xl font-mono text-green-400">{isThreatShieldActive ? threatsNeutralized : 'N/A'}</p>
                        <p className="text-xs text-gray-400">Threats Neutralized</p>
                    </div>
                </div>
            </PanelSection>

            <PanelSection title="Webcam Security">
                 <div className="flex items-center justify-between py-3">
                    <div>
                        <span className="font-medium text-red-400">Webcam Access Status</span>
                        <p className="text-xs text-gray-400">Hardware-level access is blocked by default.</p>
                    </div>
                    <p className="font-bold text-red-400 font-mono">FORCE DISABLED</p>
                </div>
                <button onClick={handleWebcamScan} className="w-full snufulufugus-button mt-2">
                    Scan for Device Enumeration Scripts
                </button>
            </PanelSection>

            <PanelSection title="Threat Monitor">
                <Toggle
                    label="Deploy Monitor"
                    description="Simulate services to attract and log suspicious connections."
                    enabled={isThreatMonitorActive}
                    setEnabled={setThreatMonitorActive}
                />
                <div className="mt-4">
                    <p className="text-sm text-cyan-300 mb-2">Live Monitor Log:</p>
                    <div className="h-48 bg-black/50 p-2 rounded border border-white/10 font-mono text-xs text-green-400 overflow-y-auto flex flex-col-reverse">
                        {isThreatMonitorActive ? (
                            monitorLogs.map((log, i) => <p key={i} className={i === 0 ? 'animate-fadeIn' : ''}>{log}</p>)
                        ) : (
                             <p className="text-gray-500 m-auto">Monitor is offline.</p>
                        )}
                    </div>
                </div>
            </PanelSection>
        </Panel>
    );
};

export default DefensePanel;