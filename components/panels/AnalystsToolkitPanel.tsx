
import React from 'react';
import Panel, { PanelSection } from './Panel';
import { CrosshairIcon } from '../Icons';

interface AnalystsToolkitPanelProps {
    targetUrl: string;
}

const getDomain = (url: string): string => {
    try {
        if (url.startsWith('local-archive://')) {
            return url.replace('local-archive://', '');
        }
        return new URL(url).hostname;
    } catch (e) {
        return url; // fallback for invalid or special URLs
    }
}

const OSINT_TOOLS = {
    'Shodan': (domain: string) => `https://www.shodan.io/search?query=hostname:${domain}`,
    'VirusTotal': (domain: string) => `https://www.virustotal.com/gui/domain/${domain}`,
    'WHOIS': (domain: string) => `https://who.is/whois/${domain}`,
    'Wayback': (url: string) => `https://web.archive.org/web/*/${url}`,
    'Sherlock': () => `https://www.sherlock-project.com/`, // Not domain specific
    'HIBP': () => `https://haveibeenpwned.com/`, // Not domain specific
};

const AnalystsToolkitPanel: React.FC<AnalystsToolkitPanelProps> = ({ targetUrl }) => {
    const isOfflineArchive = targetUrl.startsWith('local-archive://');
    const domain = getDomain(targetUrl);

    const handleOsintClick = (tool: keyof typeof OSINT_TOOLS) => {
        if (isOfflineArchive) {
            alert("OSINT tools can only be run on live targets, not offline archives.");
            return;
        }
        let url = '';
        if (tool === 'Wayback') {
            url = OSINT_TOOLS[tool](targetUrl);
        } else if (tool === 'Sherlock' || tool === 'HIBP') {
            url = OSINT_TOOLS[tool]();
        } else if (domain) {
            url = OSINT_TOOLS[tool](domain);
        }
        
        if(url) {
            window.open(url, '_blank');
        } else {
            alert('Invalid target URL to perform this action.');
        }
    }

    const handleScrape = () => {
        if (isOfflineArchive) {
             alert(`Offline scraper activated for the local archive of ${domain}.`);
        } else {
            alert(`Visual scraper activated for ${targetUrl}.`);
        }
    }

  return (
    <Panel title="snufulufugus toolkit" subtitle="analysis tools">
      <PanelSection title="snufulufugus scraper">
          <p className="text-sm text-gray-400 mb-4">
            {isOfflineArchive
              ? "Targeting offline archive. Activate for local data extraction."
              : "Targeting active page. Activate for data extraction."
            }
          </p>
          <div className="flex items-center bg-[#1A1A1A] border border-[rgba(0,255,255,0.15)] rounded-md p-2">
              <CrosshairIcon className="w-4 h-4 text-[#00BFFF] mr-3 flex-shrink-0"/>
              <span className="text-sm text-gray-300 truncate font-mono" title={targetUrl}>{targetUrl}</span>
          </div>
          <button 
              onClick={handleScrape}
              className="w-full mt-3 snufulufugus-button primary"
          >
              {isOfflineArchive ? 'Activate Offline Scraper' : 'Activate Visual Scraper'}
          </button>
      </PanelSection>

      <PanelSection title="Integrated OSINT Suite">
            <p className="text-sm text-gray-400 mb-4">Run one-click OSINT queries on the current target domain.</p>
            <div className="flex flex-wrap gap-2">
                {(Object.keys(OSINT_TOOLS) as Array<keyof typeof OSINT_TOOLS>).map(tool => (
                     <button 
                        key={tool} 
                        onClick={() => handleOsintClick(tool)}
                        className="snufulufugus-button text-xs py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-[#A0A0A0]"
                        disabled={isOfflineArchive}
                        title={isOfflineArchive ? "Disabled for offline archives" : ""}
                     >
                        {tool}
                     </button>
                ))}
            </div>
        </PanelSection>
    </Panel>
  );
};

export default AnalystsToolkitPanel;
