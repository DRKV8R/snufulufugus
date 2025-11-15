

import React, { useState, useMemo } from 'react';
import Panel, { PanelSection } from './Panel';
import { CrosshairIcon, ChevronDownIcon, ChevronUpIcon } from '../Icons';
import { SpoofedEvent } from '../../types';
// FIX: Import SPOOF_ORIGINS to resolve the undefined variable error.
import { SPOOF_ORIGINS } from '../../constants';

interface PurifierPanelProps {
    targetUrl: string;
    isUrlStrippingEnabled: boolean;
    setUrlStrippingEnabled: (enabled: boolean) => void;
    isWebRtcLeakProtected: boolean;
    setWebRtcLeakProtected: (enabled: boolean) => void;
    isCanvasProtectionEnabled: boolean;
    setCanvasProtectionEnabled: (enabled: boolean) => void;
    refererPolicy: string;
    setRefererPolicy: (policy: string) => void;
    spoofedEvents: SpoofedEvent[];
}

const Toggle: React.FC<{ label: string; description: string; enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ label, description, enabled, setEnabled }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
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

const TRACKER_DESCRIPTIONS: { [key: string]: string } = {
    'doubleclick.net': 'Part of Google\'s advertising network. Used for tracking user behavior, ad performance, and remarketing across websites.',
    'google-analytics.com': 'Google\'s web analytics service that tracks and reports website traffic. It provides insights into user demographics and behavior.',
    'facebook.com': 'The Facebook Pixel is used for conversion tracking, optimization, and remarketing for Facebook ad campaigns.',
    'criteo.com': 'A personalized retargeting company that tracks users\' online browsing behavior to serve relevant ads.',
    'quantserve.com': 'An analytics company that provides audience measurement and real-time advertising.',
    'scorecardresearch.com': 'A market research company that studies internet trends and behavior, often associated with Comscore.',
    'default': 'A third-party script or beacon used for analytics, advertising, or tracking user activity.'
};

const getTrackerDescription = (origin: string): string => {
    for (const key in TRACKER_DESCRIPTIONS) {
        if (origin.includes(key)) {
            return TRACKER_DESCRIPTIONS[key];
        }
    }
    return TRACKER_DESCRIPTIONS.default;
};

const getRiskColor = (risk: SpoofedEvent['risk']) => {
    switch (risk) {
        case 'high': return 'text-red-400';
        case 'medium': return 'text-yellow-400';
        default: return 'text-cyan-400';
    }
};

const InterceptedEvent: React.FC<{ event: SpoofedEvent }> = ({ event }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className="bg-black/40 rounded border border-transparent hover:border-cyan-500/30 transition-colors">
            <div className="p-2 flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex-1 truncate">
                    <p className="text-cyan-300 truncate font-semibold" title={event.origin}>{event.origin}</p>
                    <p className="text-gray-400 text-xs truncate" title={event.query}>{event.query}</p>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${getRiskColor(event.risk)}`}>{event.risk}</span>
                    <button className="text-gray-400 hover:text-white">
                        {isExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="px-3 pb-3 pt-2 border-t border-cyan-500/20 text-xs animate-fadeIn">
                    <p className="italic text-gray-400 mb-2">{getTrackerDescription(event.origin)}</p>
                    <div className="space-y-2">
                        <div>
                            <p className="text-[#00BFFF] font-semibold">Full Request URL:</p>
                            <p className="text-gray-300 bg-black/50 p-1 rounded break-all">{`https://${event.origin}/collect?v=1&data=${event.query}`}</p>
                        </div>
                         <div>
                            <p className="text-[#00BFFF] font-semibold">Queried Parameter:</p>
                            <p className="text-gray-300 bg-black/50 p-1 rounded">{event.query}</p>
                        </div>
                        <div>
                            <p className="text-[#00BFFF] font-semibold">Spoofed Response:</p>
                            <p className="text-green-300 bg-black/50 p-1 rounded break-all">{event.spoofedValue}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const ScanResults: React.FC<{ events: SpoofedEvent[], targetUrl: string }> = ({ events, targetUrl }) => {
    const [activeTab, setActiveTab] = useState<'log' | 'cookies'>('log');
    
    const targetHostname = useMemo(() => {
        try {
            if (targetUrl.startsWith('local-archive://')) return targetUrl.replace('local-archive://', '');
            return new URL(targetUrl).hostname.replace(/^www\./, '');
        } catch { return null; }
    }, [targetUrl]);

    const relevantEvents = useMemo(() => {
        if (!targetHostname) return [];
        return events.filter(event => event.origin.includes(targetHostname) || SPOOF_ORIGINS.some(o => event.origin.includes(o)));
    }, [events, targetHostname]);

    const summary = {
        trackers: relevantEvents.length,
        cookies: Math.floor(Math.random() * 8 + 3),
    };
    
    return (
        <div className="mt-4 p-3 bg-black/40 border border-[rgba(0,255,255,0.1)] rounded-md font-mono text-gray-300 text-xs">
            <p><strong>Scan Complete for {targetHostname}:</strong></p>
            <ul className="list-disc list-inside my-2 space-y-1">
                <li><span className="text-green-400">{summary.trackers} Trackers/Queries</span> Intercepted</li>
                <li><span className="text-cyan-400">{summary.cookies} Session Cookies</span> Identified</li>
            </ul>
            
            <div className="border-t border-[rgba(0,255,255,0.1)] pt-3 mt-3">
                <div className="flex space-x-2 mb-3">
                    <button onClick={() => setActiveTab('log')} className={`px-3 py-1 text-xs rounded-md border transition-colors ${activeTab === 'log' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'border-transparent text-gray-400 hover:bg-white/10'}`}>
                        Intercept Log ({relevantEvents.length})
                    </button>
                    {/* Placeholder for future cookie analysis */}
                    <button onClick={() => setActiveTab('cookies')} className={`px-3 py-1 text-xs rounded-md border transition-colors ${activeTab === 'cookies' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'border-transparent text-gray-400 hover:bg-white/10'}`}>
                        Cookies ({summary.cookies})
                    </button>
                </div>

                {activeTab === 'log' && (
                    <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
                        {relevantEvents.length > 0 ? (
                            relevantEvents.map(event => <InterceptedEvent key={event.id} event={event} />)
                        ) : (
                            <p className="text-gray-500 text-center py-4">No tracking activity intercepted for this domain during this session.</p>
                        )}
                    </div>
                )}
                
                {activeTab === 'cookies' && (
                    <div className="max-h-60 overflow-y-auto pr-2 flex items-center justify-center h-40">
                       <p className="text-gray-500 text-center">Cookie analysis module offline.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


const PurifierPanel: React.FC<PurifierPanelProps> = (props) => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState<boolean>(false);
    
    const handleNuke = () => {
        if(confirm('This will irreversibly destroy all session data for the current target. Are you sure?')) {
            alert(`Session data for ${props.targetUrl} has been destroyed. The page will now reload.`);
            // In a real app, this would trigger iframeRef.current.src = iframeRef.current.src
        }
    }
    
    const handleScan = () => {
        setIsScanning(true);
        setScanComplete(false);
        setTimeout(() => {
            setScanComplete(true);
            setIsScanning(false);
        }, 3000);
    }
    
  return (
    <Panel title="snufulufugus purifier" subtitle="deep cleaning tools">
      <PanelSection title="Active Sanitization Rules">
            <p className="text-sm text-gray-400 mb-4">Real-time defenses against tracking and fingerprinting.</p>
            <div className="text-sm space-y-2">
                <Toggle label="URL Parameter Stripping" description="Remove trackers like 'utm_' from URLs." enabled={props.isUrlStrippingEnabled} setEnabled={props.setUrlStrippingEnabled} />
                <Toggle label="WebRTC IP Leak Protection" description="Prevent your real IP from leaking." enabled={props.isWebRtcLeakProtected} setEnabled={props.setWebRtcLeakProtected} />
                <Toggle label="Canvas Fingerprint Protection" description="Return randomized canvas data." enabled={props.isCanvasProtectionEnabled} setEnabled={props.setCanvasProtectionEnabled} />
                
                <div className="flex items-center justify-between py-2">
                     <div>
                        <span className="font-medium text-[#00BFFF]">Referer Policy</span>
                         <p className="text-xs text-gray-400">Control what sites see about your origin.</p>
                    </div>
                    <select
                        value={props.refererPolicy}
                        onChange={(e) => props.setRefererPolicy(e.target.value)}
                        className="snufulufugus-input text-sm py-1 w-40"
                    >
                        <option value="secure">Secure (Default)</option>
                        <option value="strict">Strict (Same-Origin)</option>
                        <option value="none">None (Block)</option>
                    </select>
                </div>
            </div>
      </PanelSection>

      <PanelSection title="Session Extermination">
          <p className="text-sm text-gray-400 mb-4">Instantly destroy all session data for the current target.</p>
           <button 
              onClick={handleNuke}
              className="w-full snufulufugus-button border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white"
          >
              Nuke Current Session
          </button>
      </PanelSection>
      
       <PanelSection title="Deep Scan & Analysis">
          <p className="text-sm text-gray-400 mb-4">Perform a deep analysis of the target's scripts, cookies, and trackers.</p>
          <div className="flex items-center bg-[#1A1A1A] border border-[rgba(0,255,255,0.15)] rounded-md p-2">
              <CrosshairIcon className="w-4 h-4 text-[#00BFFF] mr-3 flex-shrink-0"/>
              <span className="text-sm text-gray-300 truncate font-mono" title={props.targetUrl}>{props.targetUrl}</span>
          </div>
          <button 
              onClick={handleScan}
              className="w-full mt-3 snufulufugus-button primary"
              disabled={isScanning}
          >
              {isScanning ? 'Scanning...' : 'Initiate Deep Scan'}
          </button>
           {isScanning && (
             <div className="mt-4 p-3 bg-black/40 border border-[rgba(0,255,255,0.1)] rounded-md font-mono text-gray-300">
                <div className="animate-pulse">Analyzing target... This will be a verbose output with spoofed details.</div>
            </div>
           )}
           {scanComplete && <ScanResults events={props.spoofedEvents} targetUrl={props.targetUrl} />}
      </PanelSection>
    </Panel>
  );
};

export default PurifierPanel;