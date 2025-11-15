import React, { useMemo } from 'react';
import Panel, { PanelSection } from './Panel';
import { CrosshairIcon } from '../Icons';
import { SpoofedEvent } from '../../types';

interface PolicyIntegrityPanelProps {
    targetUrl: string;
    onAgentQuery: (query: string) => void;
    spoofedEvents: SpoofedEvent[];
}

const getDomain = (url: string): string => {
    try {
        if (url.startsWith('local-archive://')) {
            return url.replace('local-archive://', '');
        }
        return new URL(url).hostname;
    } catch (e) {
        return url;
    }
}

const PolicyIntegrityPanel: React.FC<PolicyIntegrityPanelProps> = ({ targetUrl, onAgentQuery, spoofedEvents }) => {
    const isOfflineArchive = targetUrl.startsWith('local-archive://');
    const domain = getDomain(targetUrl);

    const trackerOrigins = useMemo(() => {
        return [...new Set(spoofedEvents.map(e => e.origin).filter(o => o !== domain && !o.includes(domain)))];
    }, [spoofedEvents, domain]);

    const handlePolicyAnalysis = () => {
        if (isOfflineArchive) {
            alert("This analysis can only be run on live targets.");
            return;
        }
        
        const trackerSummary = trackerOrigins.length > 0 
            ? `The following third-party tracking domains have been observed on this site: ${trackerOrigins.join(', ')}.` 
            : "No significant third-party trackers have been observed during this session.";
        
        onAgentQuery(`Analyze the privacy policy of the website at ${targetUrl}. First, find the URL for their privacy policy page. Second, summarize the key points regarding data collection, use, and sharing with third parties. Finally, compare these stated policies with the observed tracking behavior. ${trackerSummary} Report any discrepancies or concerning clauses in a clear, actionable format.`);
    };

  return (
    <Panel title="snufulufuguspolicy" subtitle="policy integrity analysis">
        <PanelSection title="Target Analysis">
            <p className="text-sm text-gray-400 mb-4">
                Use the AI Engine to cross-reference the target's privacy policy with its observed tracking behavior.
            </p>
             <div className="flex items-center bg-[#1A1A1A] border border-[rgba(0,255,255,0.15)] rounded-md p-2 mb-4">
                <CrosshairIcon className="w-4 h-4 text-[#00BFFF] mr-3 flex-shrink-0"/>
                <span className="text-sm text-gray-300 truncate font-mono" title={targetUrl}>{targetUrl}</span>
            </div>
             <button 
                onClick={handlePolicyAnalysis}
                className="w-full snufulufugus-button primary disabled:opacity-50"
                disabled={isOfflineArchive}
                title={isOfflineArchive ? "Disabled for offline archives" : "Analyze Privacy Policy vs. Trackers"}
            >
                Initiate Policy vs. Tracker Analysis
            </button>
        </PanelSection>
        
        <PanelSection title="Observed Third-Party Trackers">
            <p className="text-sm text-gray-400 mb-4">
                The following third-party domains have been intercepted making tracking queries on the current target. This list will be provided to the AI for analysis.
            </p>
            <div className="max-h-60 overflow-y-auto pr-2 bg-black/40 p-3 rounded-md border border-white/10">
                {trackerOrigins.length > 0 ? (
                    <ul className="space-y-2">
                        {trackerOrigins.map(origin => (
                            <li key={origin} className="font-mono text-sm text-yellow-300 bg-yellow-900/20 px-2 py-1 rounded">
                                {origin}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No third-party trackers detected yet.</p>
                )}
            </div>
        </PanelSection>
    </Panel>
  );
};

export default PolicyIntegrityPanel;