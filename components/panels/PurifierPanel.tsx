import React, { useState, useMemo } from 'react';
import Panel, { PanelSection } from './Panel';
import { ChevronDownIcon, ChevronUpIcon } from '../Icons';
import { SpoofedEvent } from '../../types';
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
                    <p className="text-sm font-mono text-gray-300 truncate" title={event.origin}>{event.origin}</p>
                    <p className={`text-xs ${getRiskColor(event.risk)} capitalize`}>Risk: {event.risk}</p>
                </div>
                {isExpanded ? <ChevronUpIcon className="w-4 h-4 text-gray-400" /> : <ChevronDownIcon className="w-4 h-4 text-gray-400" />}
            </div>
            {isExpanded && (
                <div className="p-2 border-t border-white/10 text-xs animate-fadeIn">
                    <p className="text-gray-400">{getTrackerDescription(event.origin)}</p>
                    <div className="mt-2 pt-2 border-t border-white/5">
                        <p className="font-semibold text-cyan-300">Intercepted Query:</p>
                        <p className="font-mono text-gray-300">{event.query}</p>
                        <p className="font-semibold text-cyan-300 mt-1">Spoofed Response:</p>
                        <p className="font-mono text-gray-300 break-all">{event.spoofedValue}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const PurifierPanel: React.FC<PurifierPanelProps> = ({
    targetUrl,
    isUrlStrippingEnabled,
    setUrlStrippingEnabled,
    isWebRtcLeakProtected,
    setWebRtcLeakProtected,
    isCanvasProtectionEnabled,
    setCanvasProtectionEnabled,
    refererPolicy,
    setRefererPolicy,
    spoofedEvents
}) => {
    const [showTrackers, setShowTrackers] = useState(true);

    const interceptedTrackers = useMemo(() => {
        const trackers: { [origin: string]: SpoofedEvent } = {};
        spoofedEvents.forEach(event => {
            const isTracker = SPOOF_ORIGINS.some(origin => event.origin.includes(origin));
            if (isTracker && !trackers[event.origin]) {
                trackers[event.origin] = event;
            }
        });
        return Object.values(trackers);
    }, [spoofedEvents]);

    return (
        <Panel title="snufulufuguspurifier" subtitle="deep cleaning tools">
            <PanelSection title="Active Defense Rules">
                <Toggle
                    label="URL Parameter Stripping"
                    description="Removes known tracking parameters (e.g., utm_*, fbclid) from URLs."
                    enabled={isUrlStrippingEnabled}
                    setEnabled={setUrlStrippingEnabled}
                />
                <Toggle
                    label="WebRTC IP Leak Protection"
                    description="Prevents sites from discovering your real IP address via WebRTC."
                    enabled={isWebRtcLeakProtected}
                    setEnabled={setWebRtcLeakProtected}
                />
                <Toggle
                    label="Canvas Fingerprint Protection"
                    description="Adds noise to canvas rendering to prevent unique fingerprinting."
                    enabled={isCanvasProtectionEnabled}
                    setEnabled={setCanvasProtectionEnabled}
                />
                <div className="py-2">
                    <label htmlFor="referer-policy" className="block text-sm font-medium text-[#00BFFF] mb-2">Referer Header Policy</label>
                    <p className="text-xs text-gray-400 mb-2">Controls how much referrer information is sent with requests.</p>
                    <select
                        id="referer-policy"
                        value={refererPolicy}
                        onChange={(e) => setRefererPolicy(e.target.value)}
                        className="w-full snufulufugus-input"
                    >
                        <option value="no-referrer">No Referrer</option>
                        <option value="same-origin">Same Origin</option>
                        <option value="secure">Strict Origin when Cross-Origin (Recommended)</option>
                    </select>
                </div>
            </PanelSection>

            <PanelSection title="Session Data Control">
                <p className="text-sm text-gray-400 mb-2">
                    Erase all session data, including cookies, local storage, and cache for the current target. This action is irreversible.
                </p>
                <button
                    onClick={() => alert(`Clearing session data for ${targetUrl}`)}
                    className="w-full snufulufugus-button"
                >
                    Clear Session Data
                </button>
            </PanelSection>
            
            <PanelSection title="Live Tracker Interception Log">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400">
                        {interceptedTrackers.length > 0 ? `${interceptedTrackers.length} unique trackers blocked on this page.` : 'No known trackers intercepted.'}
                    </p>
                     <button onClick={() => setShowTrackers(!showTrackers)} className="p-1 text-cyan-400 hover:text-white rounded-full hover:bg-white/10">
                        {showTrackers ? <ChevronUpIcon className="w-4 h-4"/> : <ChevronDownIcon className="w-4 h-4"/>}
                    </button>
                </div>
                {showTrackers && (
                     <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
                        {interceptedTrackers.length > 0 ? interceptedTrackers.map(event => (
                            <InterceptedEvent key={event.id} event={event} />
                        )) : <p className="text-xs text-gray-500 text-center py-4">Awaiting tracker activity...</p>}
                    </div>
                )}
            </PanelSection>
        </Panel>
    );
};

export default PurifierPanel;