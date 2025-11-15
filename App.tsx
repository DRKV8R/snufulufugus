
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Pillar, Persona, PrivateArchive, SpoofedEvent, PillarId, AgentConfig, MediaAsset, DecontaminationAsset, PersonaActivityLog, PersonaHistory } from './types';
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
import DefensePanel from './components/panels/DefensePanel';
import PolicyIntegrityPanel from './components/panels/PolicyIntegrityPanel';
import { generateRandomPersona } from './utils/personaGenerator';
import PanelTabBar from './components/PanelTabBar';


const SPOOF_QUERIES = [
    { query: 'User Agent', risk: 'low', key: 'userAgent' },
    { query: 'Canvas Fingerprint', risk: 'medium' },
    { query: 'WebGL Renderer', risk: 'medium', key: 'gpu' },
    { query: 'IP Geolocation', risk: 'medium' },
    { query: 'System Fonts', risk: 'low', key: 'installedFonts' },
    { query: 'ASN Information', risk: 'low', key: 'asnDescription' },
    { query: 'Browser Cookies', risk: 'medium', key: 'cookiesEnabled' },
    { query: 'Hardware Concurrency', risk: 'low' },
    { query: 'Camera Access', risk: 'high' },
    { query: 'Microphone Access', risk: 'high' },
    { query: 'Screen Resolution', risk: 'low', key: 'resolution' },
    { query: 'Timezone', risk: 'low', key: 'timezone' },
    { query: 'Language', risk: 'low', key: 'language' },
    { query: 'Platform', risk: 'low', key: 'platform' },
    { query: 'Do Not Track', risk: 'low', key: 'doNotTrack' },
    { query: 'Ad Block', risk: 'low' },
    { query: 'Battery Status', risk: 'medium' },
    { query: 'Network Information', risk: 'medium', key: 'connectionType' },
    { query: 'WebRTC', risk: 'high' },
    { query: 'Audio Fingerprint', risk: 'medium' },
    { query: 'Navigator Plugins', risk: 'low', key: 'plugins' },
    { query: 'Screen Color Depth', risk: 'low', key: 'colorDepth' },
    { query: 'Screen Pixel Depth', risk: 'low', key: 'pixelDepth' },
    { query: 'Device Memory', risk: 'low', key: 'deviceMemory' },
    { query: 'Touch Support', risk: 'low', key: 'touchSupport' },
    { query: 'Browser Vendor', risk: 'low', key: 'browserVendor' },
    { query: 'Download Speed', risk: 'low', key: 'downlink' },
] as const;


export default function App(): React.ReactElement {
  const [personas, setPersonas] = useState<Persona[]>(DEFAULT_PERSONAS);
  const [activePersona, setActivePersona] = useState<Persona>(personas[0]);
  const [activeVpnRegion, setActiveVpnRegion] = useState<string>(VPN_REGIONS[2]);
  const [sentryStatus, setSentryStatus] = useState<string>('Idle');
  const [targetUrl, setTargetUrl] = useState('https://en.wikipedia.org/wiki/Special:Random');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [privateArchives, setPrivateArchives] = useState<PrivateArchive[]>(DEFAULT_PRIVATE_ARCHIVES);
  const [isGoogleSandboxEnabled, setGoogleSandboxEnabled] = useState<boolean>(true);
  const [isUnfilteredSearchEnabled, setUnfilteredSearchEnabled] = useState<boolean>(true);
  const [spoofingStatus, setSpoofingStatus] = useState<'active' | 'initializing' | 'failed'>('initializing');
  const [spoofedEvents, setSpoofedEvents] = useState<SpoofedEvent[]>([]);
  const [showInstaller, setShowInstaller] = useState<boolean>(false);
  
  // New UI State
  const [openTabs, setOpenTabs] = useState<Pillar[]>([PILLARS[0]]);
  const [activeTabId, setActiveTabId] = useState<PillarId | null>(PILLARS[0].id);

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
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({ 
    provider: 'gemini',
    endpoint: '',
    apiKey: '',
    collaborativeEndpoint1: '',
    collaborativeEndpoint2: ''
  });
  
  // New Hybrid Tor / Decontamination state
  const [isTorModeActive, setIsTorModeActive] = useState<boolean>(false);
  const [decontaminationAsset, setDecontaminationAsset] = useState<DecontaminationAsset | null>(null);
  const [mediaAnalysisReport, setMediaAnalysisReport] = useState<string>('');
  const [isMediaAnalyzing, setIsMediaAnalyzing] = useState<boolean>(false);
  
  // Airgap Relay State
  const [isAirgapRelayActive, setIsAirgapRelayActive] = useState<boolean>(false);
  
  // Persona History State
  const [personaHistory, setPersonaHistory] = useState<PersonaHistory>(() => {
    try {
      const savedHistory = localStorage.getItem('snufulufugus_persona_history');
      return savedHistory ? JSON.parse(savedHistory) : {};
    } catch (error) {
      console.error("Could not parse persona history from localStorage", error);
      return {};
    }
  });

  const activePillar = useMemo(() => PILLARS.find(p => p.id === activeTabId), [activeTabId]);

  useEffect(() => {
    const isInstalled = localStorage.getItem('snufulufugus_installed');
    if (!isInstalled) {
        setShowInstaller(true);
    }
  }, []);
  
  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('snufulufugus_persona_history', JSON.stringify(personaHistory));
    } catch (error) {
      console.error("Could not save persona history to localStorage", error);
    }
  }, [personaHistory]);
  
  const logPersonaActivity = (personaId: string, log: PersonaActivityLog) => {
    setPersonaHistory(prev => {
      const newHistory = { ...prev };
      if (!newHistory[personaId]) {
        newHistory[personaId] = [];
      }
      newHistory[personaId].unshift(log); // Add to the beginning of the array
      // Keep logs to a reasonable size, e.g., 100 entries per persona
      if (newHistory[personaId].length > 100) {
        newHistory[personaId] = newHistory[personaId].slice(0, 100);
      }
      return newHistory;
    });
  };

  const handlePillarSelect = (pillar: Pillar) => {
    if (!openTabs.some(tab => tab.id === pillar.id)) {
      setOpenTabs(prev => [...prev, pillar]);
    }
    setActiveTabId(pillar.id);
  };

  const handleCloseTab = (tabIdToClose: PillarId) => {
    const newTabs = openTabs.filter(tab => tab.id !== tabIdToClose);
    setOpenTabs(newTabs);

    if (activeTabId === tabIdToClose) {
      if (newTabs.length > 0) {
        const closingTabIndex = openTabs.findIndex(tab => tab.id === tabIdToClose);
        setActiveTabId(newTabs[Math.max(0, closingTabIndex - 1)].id);
      } else {
        setActiveTabId(null);
      }
    }
  };

  const handleInstallComplete = () => {
    localStorage.setItem('snufulufugus_installed', 'true');
    setShowInstaller(false);
  }

  const handleAgentQuery = async (query: string) => {
    setIsAgentModalOpen(true);
    setIsAgentLoading(true);
    setAgentReport('');
    const result = await runAgentQuery(query, agentConfig);
    setAgentReport(result);
    setIsAgentLoading(false);
  };

  const handleCreateArchive = (url: string) => {
    const domain = new URL(url).hostname;
    const newArchive: PrivateArchive = {
        id: `pa${privateArchives.length + 1}`,
        domain,
        capturedAt: new Date().toISOString().split('T')[0],
        size: '0 MB',
        status: 'Crawling...'
    };
    setPrivateArchives(prev => [newArchive, ...prev]);
    // Simulate crawl
    setTimeout(() => {
        setPrivateArchives(prev => prev.map(a => 
            a.id === newArchive.id ? { ...a, status: 'Completed', size: `${(Math.random() * 2 + 0.5).toFixed(1)} GB` } : a
        ));
    }, 5000);
  }

  const handleDeleteArchive = (id: string) => {
    if (window.confirm('Are you sure you want to delete this private archive? This action is irreversible.')) {
        setPrivateArchives(prev => prev.filter(a => a.id !== id));
    }
  }

  const handleScrapeArchive = (archive: PrivateArchive) => {
    setTargetUrl(`local-archive://${archive.domain}`);
    alert(`Loaded local archive for ${archive.domain}. OSINT tools will be disabled.`);
  }

  const handleDecontaminateMedia = (asset: MediaAsset, archive: PrivateArchive) => {
    const fullAsset: DecontaminationAsset = {
        ...asset,
        originArchive: archive.domain,
    };
    setDecontaminationAsset(fullAsset);
    setIsMediaAnalyzing(true);
    setMediaAnalysisReport('');

    setTimeout(async () => {
        const query = `Analyze the following media asset for potential security threats. File: ${asset.name}, Type: ${asset.type}. Check for metadata trackers, steganography, or malicious payloads.`;
        const report = await runAgentQuery(query, agentConfig);
        setMediaAnalysisReport(report);
        setIsMediaAnalyzing(false);
    }, 2500);
  }
  
  const handleGeneratePersona = () => {
    const newPersona = generateRandomPersona();
    setPersonas(prev => [...prev, newPersona]);
  };
  
  const handleSetActivePersona = (persona: Persona) => {
    setActivePersona(persona);
    logPersonaActivity(persona.id, {
      type: 'activation',
      timestamp: new Date().toISOString(),
      details: 'Persona activated for browsing session.'
    });
  };

  useEffect(() => {
    const initTimer = setTimeout(() => {
        setSpoofingStatus('active');
    }, 2000);

    const eventInterval = setInterval(() => {
        const randomQuery = SPOOF_QUERIES[Math.floor(Math.random() * SPOOF_QUERIES.length)];
        const randomOrigin = SPOOF_ORIGINS[Math.floor(Math.random() * SPOOF_ORIGINS.length)];
        
        let spoofedValue = 'Access Denied / Spoofed';
        if ('key' in randomQuery) {
            const key = randomQuery.key;
            const personaValue = activePersona[key];
            if (typeof personaValue === 'object' && personaValue !== null) {
                spoofedValue = JSON.stringify(personaValue);
            } else if (personaValue !== undefined) {
                spoofedValue = String(personaValue);
            }
        }

        const newEvent: SpoofedEvent = {
            id: Date.now() + Math.random(),
            origin: randomOrigin,
            query: randomQuery.query,
            risk: randomQuery.risk,
            spoofedValue,
        };
        setSpoofedEvents(prev => [newEvent, ...prev].slice(0, 100));
        logPersonaActivity(activePersona.id, {
          type: 'intercept',
          timestamp: new Date().toISOString(),
          details: `Intercepted query "${randomQuery.query}" from ${randomOrigin}.`
        });
    }, 3000);
    
    // Log site visit when targetUrl changes
    if (targetUrl) {
      logPersonaActivity(activePersona.id, {
        type: 'visit',
        timestamp: new Date().toISOString(),
        details: `Visited URL: ${targetUrl}`
      });
    }

    return () => {
        clearTimeout(initTimer);
        clearInterval(eventInterval);
    };
  }, [activePersona, targetUrl]); // Rerun effect when active persona or URL changes

  const renderActivePanel = () => {
    if (!activePillar) return null;

    switch (activePillar.id) {
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
              isAirgapRelayActive={isAirgapRelayActive}
              setIsAirgapRelayActive={setIsAirgapRelayActive}
            />;
        case 'snufulufugus_key':
            return <SkeletonKeyPanel setSentryStatus={setSentryStatus} setActiveVpnRegion={setActiveVpnRegion} />;
        case 'snufulufugus_toolkit':
            return <AnalystsToolkitPanel targetUrl={targetUrl} onAgentQuery={handleAgentQuery} spoofedEvents={spoofedEvents} />;
        case 'snufulufugus_archive':
            return <ChroniclerPanel 
                        targetUrl={targetUrl} 
                        privateArchives={privateArchives} 
                        onCreateArchive={handleCreateArchive}
                        onDeleteArchive={handleDeleteArchive}
                        onScrapeArchive={handleScrapeArchive}
                        isTorModeActive={isTorModeActive}
                        onDecontaminateMedia={handleDecontaminateMedia}
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
            />;
        case 'snufulufugus_database':
            return <PersonaDatabasePanel
                personas={personas}
                activePersona={activePersona}
                setActivePersona={handleSetActivePersona}
                spoofedEvents={spoofedEvents}
                targetUrl={targetUrl}
                onGeneratePersona={handleGeneratePersona}
                personaHistory={personaHistory}
             />;
        case 'snufulufugus_settings':
            return <SettingsPanel currentConfig={agentConfig} onSaveConfig={setAgentConfig} />;
        case 'snufulufugus_defense':
            return <DefensePanel onAgentQuery={handleAgentQuery} />;
        case 'snufulufugus_policy':
            return <PolicyIntegrityPanel targetUrl={targetUrl} onAgentQuery={handleAgentQuery} spoofedEvents={spoofedEvents} />;
        case 'snufulufugus_stats':
        default:
            return <DashboardPanel 
                activePersona={activePersona} 
                activeVpnRegion={activeVpnRegion}
                isTorModeActive={isTorModeActive}
                isUrlStrippingEnabled={isUrlStrippingEnabled}
                isCanvasProtectionEnabled={isCanvasProtectionEnabled}
                targetUrl={targetUrl}
            />;
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden flex-col bg-black">
      {showInstaller && <InstallerModal onComplete={handleInstallComplete} />}
      <Sidebar 
        onSelectPillar={handlePillarSelect} 
        activePillarId={activeTabId}
      />
      <main className="flex-1 flex flex-col bg-[#0D0D0D] overflow-hidden">
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
          isTorModeActive={isTorModeActive}
          spoofedEvents={spoofedEvents}
          onAgentQuery={handleAgentQuery}
          isAgentLoading={isAgentLoading}
          isAirgapRelayActive={isAirgapRelayActive}
        />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black border-t border-[rgba(0,255,255,0.15)]">
            <iframe
              ref={iframeRef}
              src={targetUrl}
              className="w-full h-full"
              title="snufulufugus browser content"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
          {openTabs.length > 0 && activeTabId && (
            <div className="flex flex-col flex-shrink-0" style={{ maxHeight: '45vh', minHeight: '250px' }}>
              <PanelTabBar
                tabs={openTabs}
                activeTabId={activeTabId}
                onSelectTab={setActiveTabId}
                onCloseTab={handleCloseTab}
              />
              <div className="w-full flex-1 p-4 md:p-6 overflow-y-auto bg-[#0D0D0D] border-t border-[rgba(0,255,255,0.15)]">
                {renderActivePanel()}
              </div>
            </div>
          )}
        </div>
      </main>
      <AgentResponseModal 
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        // FIX: Pass the correct state variable 'agentReport' to the modal.
        report={agentReport}
        isLoading={isAgentLoading}
      />
      <MediaDecontaminationModal 
        asset={decontaminationAsset}
        onClose={() => setDecontaminationAsset(null)}
        analysisReport={mediaAnalysisReport}
        isAnalyzing={isMediaAnalyzing}
      />
    </div>
  );
}
