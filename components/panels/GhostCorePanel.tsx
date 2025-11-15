import React from 'react';
import Panel, { PanelSection } from './Panel';
import { VPN_REGIONS } from '../../constants';

interface GhostCorePanelProps {
    activeVpnRegion: string;
    setActiveVpnRegion: (region: string) => void;
    isGoogleSandboxEnabled: boolean;
    setGoogleSandboxEnabled: (enabled: boolean) => void;
    isUnfilteredSearchEnabled: boolean;
    setUnfilteredSearchEnabled: (enabled: boolean) => void;
    isTorModeActive: boolean;
    setIsTorModeActive: (enabled: boolean) => void;
    isAirgapRelayActive: boolean;
    setIsAirgapRelayActive: (enabled: boolean) => void;
}

const GhostCorePanel: React.FC<GhostCorePanelProps> = ({ 
    activeVpnRegion, setActiveVpnRegion, 
    isGoogleSandboxEnabled, setGoogleSandboxEnabled, 
    isUnfilteredSearchEnabled, setUnfilteredSearchEnabled,
    isTorModeActive, setIsTorModeActive,
    isAirgapRelayActive, setIsAirgapRelayActive
}) => {
  return (
    <Panel title="snufulufuguscore" subtitle="core systems">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div>
            <PanelSection title="Network Routing Strategy">
                <p className="text-sm text-gray-400 mb-4">Select the primary method for routing your traffic.</p>
                <div className="flex items-center justify-between">
                    <span className="font-medium text-[#00BFFF]">Hybrid Tor Mode</span>
                    <label htmlFor="tor-mode-toggle" className="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" checked={isTorModeActive} onChange={(e) => setIsTorModeActive(e.target.checked)} id="tor-mode-toggle" className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#262626] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00FFFF] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BFFF]"></div>
                        <span className={`ml-3 text-sm font-bold ${isTorModeActive ? 'text-green-400' : 'text-red-400'}`}>
                            {isTorModeActive ? 'ENABLED' : 'DISABLED'}
                        </span>
                    </label>
                </div>
                {isTorModeActive && (
                     <p className="text-xs text-yellow-400 mt-3 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded-md">
                        Tor Mode is active. General traffic is anonymized. Media playback will be intercepted for security analysis.
                    </p>
                )}
            </PanelSection>

            <PanelSection title="Secure VPN">
                <p className={`text-sm mb-4 ${isTorModeActive ? 'text-gray-600' : 'text-gray-400'}`}>Routes traffic through the secure network. Disabled when Tor Mode is active.</p>
                <label htmlFor="vpn-region" className={`block text-sm font-medium mb-2 ${isTorModeActive ? 'text-gray-600' : 'text-[#00BFFF]'}`}>Active Region</label>
                <select
                    id="vpn-region"
                    value={activeVpnRegion}
                    onChange={(e) => setActiveVpnRegion(e.target.value)}
                    className="w-full snufulufugus-input"
                    disabled={isTorModeActive}
                >
                    {VPN_REGIONS.map(region => (
                        <option key={region} value={region}>{region}</option>
                    ))}
                </select>
            </PanelSection>
        </div>

        <div>
            <PanelSection title="Session Isolation">
                <p className="text-sm text-gray-400 mb-4">Enhance operational security by isolating browser sessions from your local machine.</p>
                <div className="flex items-center justify-between">
                    <span className="font-medium text-[#00BFFF]">Airgap Relay</span>
                    <label htmlFor="airgap-relay-toggle" className="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" checked={isAirgapRelayActive} onChange={(e) => setIsAirgapRelayActive(e.target.checked)} id="airgap-relay-toggle" className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#262626] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00FFFF] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BFFF]"></div>
                        <span className={`ml-3 text-sm font-bold ${isAirgapRelayActive ? 'text-green-400' : 'text-red-400'}`}>
                            {isAirgapRelayActive ? 'ENABLED' : 'DISABLED'}
                        </span>
                    </label>
                </div>
                {isAirgapRelayActive && (
                     <p className="text-xs text-cyan-400 mt-3 p-2 bg-cyan-900/20 border border-cyan-500/30 rounded-md">
                        Airgap Relay is active. Your session is conceptually running in a remote, sterile environment, providing maximum isolation from your local system.
                    </p>
                )}
            </PanelSection>

            <PanelSection title="Unfiltered Search Mode">
                <p className="text-sm text-gray-400 mb-4">Bypasses personalization and localization filters to provide raw, non-customized search results.</p>
                <div className="flex items-center justify-between">
                    <span className="font-medium text-[#00BFFF]">Unfiltered Status</span>
                    <label htmlFor="unfiltered-search-toggle" className="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" checked={isUnfilteredSearchEnabled} onChange={(e) => setUnfilteredSearchEnabled(e.target.checked)} id="unfiltered-search-toggle" className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#262626] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00FFFF] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BFFF]"></div>
                        <span className={`ml-3 text-sm font-bold ${isUnfilteredSearchEnabled ? 'text-green-400' : 'text-red-400'}`}>
                            {isUnfilteredSearchEnabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                    </label>
                </div>
            </PanelSection>

            <PanelSection title="Google Services Sandboxing">
                <p className="text-sm text-gray-400 mb-4">Isolate Google services. When enabled, all traffic to Google domains is routed through a dedicated, sandboxed persona and vpn.</p>
                <div className="flex items-center justify-between">
                    <span className="font-medium text-[#00BFFF]">Sandbox Status</span>
                    <label htmlFor="google-sandbox-toggle" className="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" checked={isGoogleSandboxEnabled} onChange={(e) => setGoogleSandboxEnabled(e.target.checked)} id="google-sandbox-toggle" className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#262626] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00FFFF] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BFFF]"></div>
                        <span className={`ml-3 text-sm font-bold ${isGoogleSandboxEnabled ? 'text-green-400' : 'text-red-400'}`}>
                            {isGoogleSandboxEnabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                    </label>
                </div>
            </PanelSection>
        </div>
      </div>
    </Panel>
  );
};

export default GhostCorePanel;