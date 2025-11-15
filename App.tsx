import React, { useState, useRef, useEffect } from 'react';
import { Pillar, Persona, PrivateArchive, SpoofedEvent, PillarId, AgentConfig, MediaAsset, DecontaminationAsset } from './types';
// FIX: Import SPOOF_ORIGINS from the shared constants file.
import { PILLARS, DEFAULT_PERSONAS, VPN_REGIONS, DEFAULT_PRIVATE_ARCHIVES, SPOOF_ORIGINS } from './constants';
import Sidebar from './components/Sidebar';
import BrowserFrame from './components/BrowserFrame';
import GhostCorePanel from './components/panels/GhostCorePanel';
import SkeletonKeyPanel from './components/panels/SkeletonKeyPanel';
import AnalystsToolkitPanel from './components/panels/AnalystsToolkitPanel';
import ChroniclerPanel from './components/panels/ChroniclerPanel';
import DashboardPanel from './components/panels/DashboardPanel';
import InstallerModal from './components/InstallerModal';
import PurifierPanel from './components/panels/PurifierPanel';
import PersonaDatabasePanel from './components/panels/PersonaDatabasePanel';
import AgentResponseModal from './components/AgentResponseModal';
import { runAgentQuery } from './services/agentService';
import SettingsPanel from './components/panels/SettingsPanel';
import MediaDecontaminationModal from './components/MediaDecontaminationModal';


// FIX: Add 'as const' to ensure `risk` properties are inferred as literal types
// instead of `string`, matching the `SpoofedEvent` interface.
const SPOOF_QUERIES = [
    { query: 'User Agent', risk: 'low', key: 'userAgent' },
    { query: 'Canvas Fingerprint', risk: 'medium' },
    { query: 'WebGL Renderer', risk: 'medium' },
    { query: 'IP Geolocation', risk: 'medium' },
    { query: 'System Fonts', risk: 'low' },
    { query: 'Browser Cookies', risk: 'medium' },
    { query: 'Hardware Concurrency', risk: 'low' },
    { query: 'Camera Access', risk: 'high' },
    { query: 'Microphone Access', risk: 'high' },
    { query: 'Screen Resolution', risk: 'low', key: 'resolution' },
    { query: 'Timezone', risk: 'low', key: 'timezone' },
    { query: 'Language', risk: 'low', key: 'language' },
    { query: 'Platform', risk: 'low', key: 'platform' },
    { query: 'Do Not Track', risk: 'low' },
    { query: 'Ad Block', risk: 'low' },
    { query: 'Battery Status', risk: 'medium' },
    { query: 'Network Information', risk: 'medium' },
    { query: 'WebRTC', risk: 'high' },
] as const;


export default function App(): React.ReactElement {
  const [activePillar, setActivePillar] = useState<Pillar>(PILLARS[0]);
  const [personas] = useState<Persona[]>(DEFAULT_PERSONAS);
  const [activePersona, setActivePersona] = useState<Persona>(personas[0]);
  const [activeVpnRegion, setActiveVpnRegion] = useState<string>(VPN_REGIONS[2]);
  const [sentryStatus, setSentryStatus] = useState<string>('Idle');
  const [targetUrl, setTargetUrl] = useState('https://aistudio.google.com/app');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [privateArchives, setPrivateArchives] = useState<PrivateArchive[]>(DEFAULT_PRIVATE_ARCHIVES);
  const [isGoogleSandboxEnabled, setGoogleSandboxEnabled] = useState<boolean>(true);
  const [isUnfilteredSearchEnabled, setUnfilteredSearchEnabled] = useState<boolean>(true);
  const [spoofingStatus, setSpoofingStatus] = useState<'active' | 'initializing' | 'failed'>('initializing');
  const [spoofedEvents, setSpoofedEvents] = useState<SpoofedEvent[]>([]);
  const [showInstaller, setShowInstaller] = useState<boolean>(false);
  
  // Purifier state
  const [isUrlStrippingEnabled, setUrlStrippingEnabled] = useState(true);
  const [isWebRtcLeakProtected, setWebRtcLeakProtected] = useState(true);
  const [isCanvasProtectionEnabled, setCanvasProtectionEnabled] = useState(true);
  const [refererPolicy, setRefererPolicy] = useState('secure');
  
  // Universal Agent state
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentReport, setAgentReport] = useState('');
  const [isAgentLoading, setIsAgentLoading] = useState(false);

  // Agent configuration state
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({ provider: 'gemini' });
  
  // New Hybrid Tor / Decontamination state
  const [isTorModeActive, setIsTorModeActive] = useState<boolean>(false);
  const [decontaminationAsset, setDecontaminationAsset] = useState<DecontaminationAsset | null>(null);
  const [mediaAnalysisReport, setMediaAnalysisReport] = useState<string>('');
  const [isMediaAnalyzing, setIsMediaAnalyzing] = useState<boolean>(false);


  useEffect(() => {
    // Load agent config from localStorage on initial load
    const savedAgentConfig = localStorage.getItem('snufulufugus_agent_config');
    if (savedAgentConfig) {
      try {
        setAgentConfig(JSON.parse(savedAgentConfig));
      } catch (e) {
        console.error("Failed to parse agent config from localStorage", e);
      }
    }

    const isInstalled = localStorage.getItem('snufulufugus_installed');
    if (!isInstalled) {
        setShowInstaller(true);
    }

    const statusTimer = setTimeout(() => {
      setSpoofingStatus('active');
    }, 2500);
    
    // Increased frequency for more realistic fingerprinting
    const eventInterval = setInterval(() => {
        const randomQuery = SPOOF_QUERIES[Math.floor(Math.random() * SPOOF_QUERIES.length)];
        
        let randomOrigin = SPOOF_ORIGINS[Math.floor(Math.random() * SPOOF_ORIGINS.length)];
        // Simulate some queries coming from the main domain
        if (Math.random() > 0.7) {
            try {
                randomOrigin = new URL(targetUrl).hostname;
            } catch (e) { /* ignore invalid url */ }
        }

        const getSpoofedValue = (): string => {
            if ('key' in randomQuery) {
                return activePersona[randomQuery.key as keyof Persona] || 'N/A';
            }
            // For queries without a direct persona key, generate plausible fake data
            switch(randomQuery.query) {
                case 'Canvas Fingerprint': return `canvas-hash-${Math.random().toString(36).substring(2, 10)}`;
                case 'WebGL Renderer': return 'ANGLE (Intel, Intel(R) Iris(R) Xe Graphics, OpenGL 4.6)';
                case 'IP Geolocation': return `${(Math.random() * 180 - 90).toFixed(4)}, ${(Math.random() * 360 - 180).toFixed(4)}`;
                case 'System Fonts': return 'Arial, Calibri, Helvetica, Times New Roman, Courier New';
                case 'Browser Cookies': return 'Enabled';
                case 'Hardware Concurrency': return ['4', '8', '16'][Math.floor(Math.random() * 3)];
                case 'Camera Access': return 'Denied';
                case 'Microphone Access': return 'Denied';
                case 'Do Not Track': return '1';
                case 'Ad Block': return 'Enabled';
                case 'Battery Status': return `${Math.floor(Math.random() * 100)}%`;
                case 'Network Information': return '4g';
                case 'WebRTC': return 'Blocked';
                default: return `spoofed-val-${Math.random().toString(36).substring(2, 8)}`;
            }
        }

        const newEvent: SpoofedEvent = {
            id: Date.now() + Math.random(),
            origin: randomOrigin,
            query: randomQuery.query,
            risk: randomQuery.risk,
            spoofedValue: getSpoofedValue(),
        };
        setSpoofedEvents(prev => [newEvent, ...prev].slice(0, 100)); // Keep the list to a manageable size
    }, 800);


    return () => {
        clearTimeout(statusTimer);
        clearInterval(eventInterval);
    };
  }, [targetUrl, activePersona]);

  const handleInstallComplete = () => {
    localStorage.setItem('snufulufugus_installed', 'true');
    setShowInstaller(false);
  };
  
  const handleAgentQuerySubmit = async (query: string) => {
    setIsAgentLoading(true);
    setAgentReport('');
    setIsAgentModalOpen(true);
    const response = await runAgentQuery(query, agentConfig);
    setAgentReport(response);
    setIsAgentLoading(false);
  };
  
  const handleSaveAgentConfig = (config: AgentConfig) => {
    setAgentConfig(config);
    localStorage.setItem('snufulufugus_agent_config', JSON.stringify(config));
    alert('Agent configuration saved.');
  };

  const handleCreateArchive = (url: string) => {
    try {
        const domain = new URL(url).hostname;
        const newArchive: PrivateArchive = {
            id: `pa${Date.now()}`,
            domain,
            capturedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            size: '...',
            status: 'Crawling...'
        };
        setPrivateArchives(prev => [newArchive, ...prev]);

        setTimeout(() => {
            setPrivateArchives(prev => prev.map(a => a.id === newArchive.id ? { ...a, status: 'Completed', size: `${(Math.random() * 2 + 0.5).toFixed(1)} GB` } : a));
        }, 5000 * Math.random() + 3000);

    } catch (e) {
        alert("Invalid URL for archival.");
    }
  };

  const handleDeleteArchive = (id: string) => {
    setPrivateArchives(prev => prev.filter(a => a.id !== id));
  };

  const handleScrapeArchive = (archive: PrivateArchive) => {
    const analystPillar = PILLARS.find(p => p.id === 'snufulufugus_toolkit');
    if (analystPillar) {
        setActivePillar(analystPillar);
    }
    setTargetUrl(`local-archive://${archive.domain}`);
    alert(`Switched to snufulufugus toolkit. Scraper is now targeting the offline archive for ${archive.domain}.`);
  };
  
  const handleInitiateDecontamination = async (asset: MediaAsset, archive: PrivateArchive) => {
    setDecontaminationAsset({ ...asset, originArchive: archive.domain });
    setIsMediaAnalyzing(true);
    setMediaAnalysisReport('');

    const query = `Perform a security analysis on the following media file intercepted from an offline archive. Report any potential threats, suspicious metadata, or embedded trackers. File: ${asset.name}, Type: ${asset.type}, Origin: ${archive.domain}`;
    
    // Simulate a slightly longer analysis time for effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const response = await runAgentQuery(query, agentConfig);
    setMediaAnalysisReport(response);
    setIsMediaAnalyzing(false);
  };


  const renderActivePanel = () => {
    switch (activePillar.id) {
      case 'snufulufugus_stats':
        return <DashboardPanel 
                    activePersona={activePersona}
                    activeVpnRegion={activeVpnRegion}
                    isTorModeActive={isTorModeActive}
                    isUrlStrippingEnabled={isUrlStrippingEnabled}
                    isCanvasProtectionEnabled={isCanvasProtectionEnabled}
                    targetUrl={targetUrl}
                />;
      case 'snufulufugus_core':
        return <GhostCorePanel 
                    activeVpnRegion={activeVpnRegion} 
                    setActiveVpnRegion={setActiveVpnRegion}
                    isGoogleSandboxEnabled={isGoogleSandboxEnabled}
                    setGoogleSandboxEnabled={setGoogleSandboxEnabled}
                    isUnfilteredSearchEnabled={isUnfilteredSearchEnabled}
                    setUnfilteredSearchEnabled={setUnfilteredSearchEnabled}
                    isTorModeActive={isTorModeActive}
                    setIsTorModeActive={setIsTorModeActive}
                />;
      case 'snufulufugus_database':
        return <PersonaDatabasePanel
                    personas={personas}
                    activePersona={activePersona}
                    setActivePersona={setActivePersona}
                    spoofedEvents={spoofedEvents}
                    targetUrl={targetUrl}
                />;
      case 'snufulufugus_key':
        return <SkeletonKeyPanel setSentryStatus={setSentryStatus} setActiveVpnRegion={setActiveVpnRegion} />;
      case 'snufulufugus_toolkit':
        return <AnalystsToolkitPanel targetUrl={targetUrl} />;
      case 'snufulufugus_archive':
        return <ChroniclerPanel 
                    targetUrl={targetUrl} 
                    privateArchives={privateArchives}
                    onCreateArchive={handleCreateArchive}
                    onDeleteArchive={handleDeleteArchive}
                    onScrapeArchive={handleScrapeArchive}
                    isTorModeActive={isTorModeActive}
                    onDecontaminateMedia={handleInitiateDecontamination}
                />;
      case 'snufulufugus_purifier':
        return <PurifierPanel
                    targetUrl={targetUrl}
                    isUrlStrippingEnabled={isUrlStrippingEnabled}
                    setUrlStrippingEnabled={setUrlStrippingEnabled}
                    isWebRtcLeakProtected={isWebRtcLeakProtected}
                    setWebRtcLeakProtected={setWebRtcLeakProtected}
                    isCanvasProtectionEnabled={isCanvasProtectionEnabled}
                    setCanvasProtectionEnabled={setCanvasProtectionEnabled}
                    refererPolicy={refererPolicy}
                    setRefererPolicy={setRefererPolicy}
                    spoofedEvents={spoofedEvents}
                />
      case 'snufulufugus_settings':
        return <SettingsPanel
                    currentConfig={agentConfig}
                    onSaveConfig={handleSaveAgentConfig}
                />
      default:
        return <div className="p-8">Select a pillar from the left.</div>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0D0D0D] text-[#E0E0E0] overflow-hidden">
      {showInstaller && <InstallerModal onComplete={handleInstallComplete} />}
      <AgentResponseModal 
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        report={agentReport}
        isLoading={isAgentLoading}
      />
      <MediaDecontaminationModal
        asset={decontaminationAsset}
        onClose={() => setDecontaminationAsset(null)}
        analysisReport={mediaAnalysisReport}
        isAnalyzing={isMediaAnalyzing}
      />
      <Sidebar activePillar={activePillar} setActivePillar={setActivePillar} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <BrowserFrame 
            activePersona={activePersona} 
            activeVpnRegion={activeVpnRegion} 
            sentryStatus={sentryStatus}
            spoofingStatus={spoofingStatus}
            targetUrl={targetUrl}
            setTargetUrl={setTargetUrl}
            iframeRef={iframeRef}
            isGoogleSandboxEnabled={isGoogleSandboxEnabled}
            isUnfilteredSearchEnabled={isUnfilteredSearchEnabled}
            spoofedEvents={spoofedEvents}
            onAgentQuery={handleAgentQuerySubmit}
            isAgentLoading={isAgentLoading}
        />
        <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 bg-[#0D0D0D]">
                <iframe
                    ref={iframeRef}
                    src={targetUrl.startsWith('local-archive://') ? undefined : targetUrl}
                    srcDoc={targetUrl.startsWith('local-archive://') ? `<div style="color: #A0A0A0; font-family: 'Roboto Mono', monospace; display: flex; align-items: center; justify-content: center; height: 100%; font-size: 1rem; background-color: #1A1A1A; border: 1px dashed rgba(0, 255, 255, 0.15); padding: 2rem; text-align: center;">Viewing offline archive:<br/>${targetUrl}</div>` : undefined}
                    className="w-full h-full"
                    title="snufulufugus view"
                    sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                    referrerPolicy="no-referrer"
                />
            </div>
            <aside className="w-[450px] flex-shrink-0 bg-[#141414] border-l border-[rgba(0,255,255,0.15)] overflow-y-auto">
                 <div className="p-4 md:p-6">
                    {renderActivePanel()}
                </div>
            </aside>
        </div>
      </main>
    </div>
  );
}