import React, { useMemo } from 'react';
import { Persona } from '../types';
import { UserIcon, GlobeIcon, FilterIcon, CrosshairIcon, ArrowRightIcon } from './Icons';

interface CircuitMapProps {
  persona: Persona;
  vpnRegion: string;
  isTorActive: boolean;
  purifierStatus: {
    urlStripping: boolean;
    canvasProtection: boolean;
  };
  targetUrl: string;
}

const CircuitNode: React.FC<{ icon: React.ReactNode; title: string; value: string; status: 'secure' | 'nominal' | 'warning' }> = ({ icon, title, value, status }) => {
    const statusColors = {
        secure: 'border-green-500/50 bg-green-900/20 text-green-300',
        nominal: 'border-cyan-500/50 bg-cyan-900/20 text-cyan-300',
        warning: 'border-yellow-500/50 bg-yellow-900/20 text-yellow-300',
    }

    return (
        <div className={`flex-1 p-3 border rounded-lg ${statusColors[status]}`}>
            <div className="flex items-center space-x-2 mb-1">
                {icon}
                <h4 className="font-bold text-sm">{title}</h4>
            </div>
            <p className="text-xs truncate font-mono" title={value}>{value}</p>
        </div>
    )
};

const CircuitMap: React.FC<CircuitMapProps> = ({ persona, vpnRegion, isTorActive, purifierStatus, targetUrl }) => {
    
    const { score, color } = useMemo(() => {
        let risk = 0;
        if (!isTorActive) risk += 2;
        if (!purifierStatus.urlStripping) risk += 1;
        if (!purifierStatus.canvasProtection) risk += 1;
        
        if (risk === 0) return { score: "Minimal", color: "text-green-400" };
        if (risk <= 2) return { score: "Low", color: "text-yellow-400" };
        return { score: "Moderate", color: "text-red-400" };
    }, [isTorActive, purifierStatus]);
    
    const targetDomain = useMemo(() => {
        try {
            if (targetUrl.startsWith('local-archive://')) return targetUrl.replace('local-archive://', '');
            return new URL(targetUrl).hostname;
        } catch { return 'Invalid URL'; }
    }, [targetUrl]);

    return (
        <div className="space-y-3">
            <div className="flex items-center space-x-2">
                <CircuitNode
                    icon={<UserIcon className="w-4 h-4"/>}
                    title="Persona"
                    value={persona.name}
                    status="nominal"
                />
                <ArrowRightIcon className="w-5 h-5 text-gray-600 flex-shrink-0"/>
                <CircuitNode
                    icon={<GlobeIcon className="w-4 h-4"/>}
                    title="Network"
                    value={isTorActive ? 'Tor Anonymized' : `VPN: ${vpnRegion}`}
                    status={isTorActive ? 'secure' : 'nominal'}
                />
            </div>
             <div className="flex items-center space-x-2">
                 <CircuitNode
                    icon={<FilterIcon className="w-4 h-4"/>}
                    title="Purifier"
                    value={purifierStatus.urlStripping && purifierStatus.canvasProtection ? "All Rules Active" : "Partial Rules"}
                    status={purifierStatus.urlStripping && purifierStatus.canvasProtection ? 'secure' : 'warning'}
                />
                 <ArrowRightIcon className="w-5 h-5 text-gray-600 flex-shrink-0"/>
                <CircuitNode
                    icon={<CrosshairIcon className="w-4 h-4"/>}
                    title="Target"
                    value={targetDomain}
                    status="nominal"
                />
            </div>
            <div className="pt-3 text-center border-t border-dashed border-white/10 mt-3">
                <p className="text-sm text-gray-400">Data Leakage Potential: <span className={`font-bold font-mono ${color}`}>{score}</span></p>
            </div>
        </div>
    );
};

export default CircuitMap;