import React, { useState, useEffect } from 'react';
import { Persona, SpoofedEvent } from '../types';
import { GlobeIcon, UserIcon, ShieldIcon, ArrowLeftIcon, ArrowRightIcon, RefreshCwIcon, LockIcon, FilterOffIcon, XIcon, SearchIcon, MenuIcon } from './Icons';
import AgentCommandBar from './AgentCommandBar';
import Scorecard from './Scorecard';
import { SEARCH_ENGINES } from '../constants';

// A simple server icon for the Airgap Relay indicator
const ServerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
);


interface BrowserFrameProps {
  activePersona: Persona;
  activeVpnRegion: string;
  sentryStatus: string;
  spoofingStatus: 'active' | 'initializing' | 'failed';
  targetUrl: string;
  setTargetUrl: (url: string) => void;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  isGoogleSandboxEnabled: boolean;
  isUnfilteredSearchEnabled: boolean;
  isTorModeActive: boolean;
  spoofedEvents: SpoofedEvent[];
  onAgentQuery: (query: string) => void;
  isAgentLoading: boolean;
  isAirgapRelayActive: boolean;
}

const BrowserFrame: React.FC<BrowserFrameProps> = (props) => {
    const { 
        activePersona, activeVpnRegion, sentryStatus, spoofingStatus, 
        targetUrl, setTargetUrl, iframeRef, isGoogleSandboxEnabled, 
        isUnfilteredSearchEnabled, isTorModeActive, spoofedEvents, onAgentQuery, isAgentLoading,
        isAirgapRelayActive
    } = props;

  const [inputValue, setInputValue] = React.useState(targetUrl);
  const [showFailureTooltip, setShowFailureTooltip] = useState(false);
  const [activeSearchEngine, setActiveSearchEngine] = useState(SEARCH_ENGINES[0].name);

  const isGoogleDomain = inputValue.includes('google.com') || inputValue.includes('gmail.com');
  const isGoogleSearch = inputValue.includes('google.com/search');

  React.useEffect(() => {
    setInputValue(targetUrl);
  }, [targetUrl]);

  useEffect(() => {
    if (spoofingStatus === 'failed') {
        setShowFailureTooltip(true);
    } else {
        setShowFailureTooltip(false);
    }
  }, [spoofingStatus]);

  useEffect(() => {
    // If Tor mode is disabled and an .onion search engine was selected, switch back to a default
    const engineIsTorOnly = activeSearchEngine.includes('Tor');
    if (engineIsTorOnly && !isTorModeActive) {
      setActiveSearchEngine(SEARCH_ENGINES[0].name);
    }
  }, [isTorModeActive, activeSearchEngine]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleNavigate = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = inputValue.trim();
      if (!query) return;

      const isUrl = query.includes('.') && !query.includes(' ') || query.startsWith('http') || query.startsWith('local-archive://');

      if (isUrl) {
          let url = query;
          if (!/^(https?:\/\/|local-archive:\/\/)/i.test(url)) {
              url = 'https://' + url;
          }
          setTargetUrl(url);
      } else {
          const engine = SEARCH_ENGINES.find(se => se.name === activeSearchEngine);
          if (engine) {
              const searchUrl = engine.searchUrl.replace('%s', encodeURIComponent(query));
              setTargetUrl(searchUrl);
          }
      }
    }
  };

  const handleBack = () => {
    iframeRef.current?.contentWindow?.history.back();
  }

  const handleForward = () => {
    iframeRef.current?.contentWindow?.history.forward();
  }

  const handleRefresh = () => {
    iframeRef.current?.contentWindow?.location.reload();
  }

    const getSpoofingStatusDetails = () => {
      switch (spoofingStatus) {
          case 'active':
              return { colorClass: 'bg-green-500', text: 'Active' };
          case 'initializing':
              return { colorClass: 'bg-yellow-500 animate-pulse', text: 'Initializing' };
          case 'failed':
              return { colorClass: 'bg-red-500', text: 'Failed' };
          default:
              return { colorClass: 'bg-gray-500', text: 'Unknown' };
      }
  };

  const { colorClass, text: statusText } = getSpoofingStatusDetails();
  
  return (
    <div className="w-full bg-[#1A1A1A]/50 border-b border-[rgba(0,255,255,0.15)] p-2 shadow-md backdrop-blur-sm flex-shrink-0">
      {/* Top bar with HUD */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <h2 className="text-md font-bold text-[#00FFFF] hidden sm:block font-mono tracking-widest pl-2">SNUFULUFUGUS</h2>
        </div>
        <div className="flex items-center space-x-4 text-xs text-[#E0E0E0]">
          <Scorecard events={spoofedEvents} />
          <div className="relative">
            <div className="flex items-center space-x-1.5" title={`Spoofing Status: ${statusText}`}>
              <div className={`w-3 h-3 rounded-full transition-colors ${colorClass}`}></div>
              <span>Spoofing</span>
            </div>
            {spoofingStatus === 'failed' && showFailureTooltip && (
                <div className="absolute top-full mt-2 right-0 w-72 bg-red-900/80 border border-red-500 text-white p-3 rounded-md shadow-lg z-20 backdrop-blur-sm animate-fadeIn">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-red-400">Spoofing System Failed</p>
                            <p className="text-xs mt-1 text-gray-300">
                                Could not establish a secure spoofing connection. This may be due to a network error or an invalid agent configuration.
                            </p>
                            <p className="text-xs mt-2 text-gray-400">
                                <strong>Suggestion:</strong> Verify your network and check agent settings.
                            </p>
                        </div>
                        <button onClick={() => setShowFailureTooltip(false)} className="p-1 -mt-2 -mr-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10">
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
          </div>
          <div className="flex items-center space-x-1.5" title="Active Persona">
            <UserIcon className="w-4 h-4 text-[#00BFFF]" />
            <span>{activePersona.name}</span>
          </div>
          <div className="flex items-center space-x-1.5" title="Nomad VPN Region">
            <GlobeIcon className="w-4 h-4 text-[#00BFFF]" />
            <span>{activeVpnRegion}</span>
          </div>
          <div className="flex items-center space-x-1.5" title="Sentry Module Status">
            <ShieldIcon className="w-4 h-4 text-[#00BFFF]" />
            <span>{sentryStatus}</span>
          </div>
        </div>
      </div>
      
      {/* Navigation and Address Bar */}
      <div className="flex items-center space-x-2">
        <button onClick={handleBack} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#262626] rounded-full transition-colors"><ArrowLeftIcon className="w-4 h-4" /></button>
        <button onClick={handleForward} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#262626] rounded-full transition-colors"><ArrowRightIcon className="w-4 h-4" /></button>
        <button onClick={handleRefresh} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#262626] rounded-full transition-colors"><RefreshCwIcon className="w-4 h-4" /></button>
        
        <div className="flex-grow flex items-center bg-[#0d0d0d] border border-[rgba(0,255,255,0.15)] rounded-md h-9 overflow-hidden">
             <div className="flex-shrink-0 h-full">
                <select
                    value={activeSearchEngine}
                    onChange={(e) => setActiveSearchEngine(e.target.value)}
                    className="bg-transparent text-[#00BFFF] h-full pl-2 pr-6 text-xs border-r border-[rgba(0,255,255,0.15)] focus:outline-none appearance-none font-mono cursor-pointer static-hover"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2300BFFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.2rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.2em',
                    }}
                    title="Select Search Engine"
                >
                    {SEARCH_ENGINES.map((engine) => {
                        if (engine.name.includes('Tor') && !isTorModeActive) {
                            return null;
                        }
                        return (
                            <option key={engine.name} value={engine.name} className="bg-[#0D0D0D] text-white font-sans">
                            {engine.name}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="relative flex-grow h-full">
                <div className="absolute left-3 top-0 h-full flex items-center space-x-2 pointer-events-none z-10">
                     <SearchIcon className="w-4 h-4 text-gray-500" />
                    {isAirgapRelayActive && (
                        <div title="Airgap Relay Active: Session is running in a remote, sandboxed environment.">
                            <ServerIcon className="w-4 h-4 text-cyan-400 animate-pulse" />
                        </div>
                    )}
                    {isGoogleSandboxEnabled && isGoogleDomain && (
                        <div title="Google Services are Sandboxed">
                            <LockIcon className="w-4 h-4 text-green-400" />
                        </div>
                    )}
                    {isUnfilteredSearchEnabled && isGoogleSearch && (
                        <div title="Google search results are unfiltered">
                            <FilterOffIcon className="w-4 h-4 text-yellow-400" />
                        </div>
                    )}
                </div>
                <input 
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleNavigate}
                  placeholder="Enter URL or search query..."
                  className="w-full h-full text-sm bg-transparent focus:outline-none text-[#E0E0E0] pl-10 pr-2"
                />
            </div>
        </div>
      </div>
      
      {/* Universal Agent Command Bar */}
      <div className="mt-2">
        <AgentCommandBar onQuerySubmit={onAgentQuery} isLoading={isAgentLoading} />
      </div>

    </div>
  );
};

export default BrowserFrame;