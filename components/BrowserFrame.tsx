
import React, 'react';
import { Persona, SpoofedEvent } from '../types';
import { GlobeIcon, UserIcon, ShieldIcon, ArrowLeftIcon, ArrowRightIcon, RefreshCwIcon, LockIcon, FilterOffIcon } from './Icons';
import AgentCommandBar from './AgentCommandBar';
import Scorecard from './Scorecard';

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
  spoofedEvents: SpoofedEvent[];
  onAgentQuery: (query: string) => void;
  isAgentLoading: boolean;
}

const BrowserFrame: React.FC<BrowserFrameProps> = (props) => {
    const { 
        activePersona, activeVpnRegion, sentryStatus, spoofingStatus, 
        targetUrl, setTargetUrl, iframeRef, isGoogleSandboxEnabled, 
        isUnfilteredSearchEnabled, spoofedEvents, onAgentQuery, isAgentLoading 
    } = props;

  const [inputValue, setInputValue] = React.useState(targetUrl);

  const isGoogleDomain = inputValue.includes('google.com') || inputValue.includes('gmail.com');
  const isGoogleSearch = inputValue.includes('google.com/search');

  React.useEffect(() => {
    setInputValue(targetUrl);
  }, [targetUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleNavigate = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      let url = inputValue.trim();
      if (!/^(https?:\/\/|local-archive:\/\/)/i.test(url)) {
          url = 'https://' + url;
      }
      setTargetUrl(url);
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
        <h2 className="text-md font-bold text-[#00FFFF] hidden sm:block font-mono tracking-widest">SNUFULUFUGUS</h2>
        <div className="flex items-center space-x-4 text-xs text-[#E0E0E0]">
          <Scorecard events={spoofedEvents} />
          <div className="flex items-center space-x-1.5" title={`Spoofing Status: ${statusText}`}>
            <div className={`w-3 h-3 rounded-full transition-colors ${colorClass}`}></div>
            <span>Spoofing</span>
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
        <div className="relative flex-grow flex items-center bg-[#0d0d0d] border border-[rgba(0,255,255,0.15)] rounded-md h-9 overflow-hidden">
            <div className="absolute left-3 top-0 h-full flex items-center space-x-2 pointer-events-none z-10">
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
              placeholder="Enter target URL..."
              className="w-full h-full text-sm bg-transparent focus:outline-none text-[#E0E0E0] pl-10 pr-2"
            />
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
