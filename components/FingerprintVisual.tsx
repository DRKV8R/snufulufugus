
import React, { useState, useEffect, useMemo } from 'react';
import { Persona, SpoofedEvent } from '../types';
import { FingerprintIcon } from './Icons';

interface FingerprintVisualProps {
  persona: Persona;
  spoofedEvents: SpoofedEvent[];
  targetUrl: string;
}

const getRiskColor = (risk: SpoofedEvent['risk']) => {
    switch (risk) {
        case 'high': return 'text-red-400';
        case 'medium': return 'text-yellow-400';
        default: return 'text-cyan-400';
    }
};

const FingerprintVisual: React.FC<FingerprintVisualProps> = ({ persona, spoofedEvents, targetUrl }) => {
  const [isScanning, setIsScanning] = useState(true);

  const targetHostname = useMemo(() => {
    try {
        if (targetUrl.startsWith('local-archive://')) {
            return targetUrl.replace('local-archive://', '');
        }
        return new URL(targetUrl).hostname.replace(/^www\./, '');
    } catch (e) {
        return null;
    }
  }, [targetUrl]);

  const relevantEvents = useMemo(() => {
    if (!targetHostname) return [];
    return spoofedEvents.filter(event => event.origin.includes(targetHostname));
  }, [spoofedEvents, targetHostname]);

  useEffect(() => {
    setIsScanning(true);
    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 1500); // Animation duration

    return () => clearTimeout(timer);
  }, [persona, targetUrl]); // Rescan when persona or URL changes

  if (isScanning) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-black/30 border border-dashed border-[rgba(0,255,255,0.15)] rounded-lg">
        <FingerprintIcon className="w-16 h-16 text-cyan-400 animate-pulse" />
        <p className="mt-4 text-cyan-400 font-mono">Analyzing fingerprint for {targetHostname}...</p>
      </div>
    );
  }

  return (
    <div className="bg-black/30 border border-[rgba(0,255,255,0.15)] rounded-lg p-4 animate-fadeIn">
        <h4 className="text-md font-semibold text-[#00FFFF] mb-3">Live Fingerprint Intercept Log</h4>
        <p className="text-xs text-gray-400 mb-3">Displaying all <strong className="text-cyan-300">{relevantEvents.length}</strong> queries intercepted and spoofed for the domain <strong className="text-cyan-300">{targetHostname}</strong>.</p>
        <div className="max-h-96 overflow-y-auto pr-2">
            {relevantEvents.length > 0 ? (
                <table className="w-full text-left text-xs table-fixed">
                     <thead className="sticky top-0 bg-[#1A1A1A] z-10">
                        <tr className="border-b border-[rgba(0,255,255,0.15)]">
                            <th className="p-2 text-[#00BFFF] w-[50%]">Queried Entry</th>
                            <th className="p-2 text-[#00BFFF] w-[35%]">Queried By</th>
                            <th className="p-2 text-[#00BFFF] w-[15%]">Risk</th>
                        </tr>
                    </thead>
                    <tbody className="font-mono">
                        {relevantEvents.map(event => (
                            <tr key={event.id} className="border-b border-[rgba(0,255,255,0.05)] hover:bg-white/5">
                                <td className="p-2 text-gray-200 truncate" title={event.query}>{event.query}</td>
                                <td className="p-2 text-gray-400 truncate" title={event.origin}>{event.origin}</td>
                                <td className={`p-2 font-bold ${getRiskColor(event.risk)}`}>{event.risk}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                 <div className="flex items-center justify-center h-32 text-center">
                    <p className="text-gray-500 font-mono">No fingerprinting queries intercepted for this domain yet.<br/>Activity will appear here in real-time.</p>
                 </div>
            )}
        </div>
    </div>
  );
};

export default FingerprintVisual;
