

import React, { useMemo } from 'react';
import Panel, { PanelSection } from './Panel';
import { SpoofedEvent, Persona } from '../../types';
import CircuitMap from '../CircuitMap';

interface DashboardPanelProps {
    activePersona: Persona;
    activeVpnRegion: string;
    isTorModeActive: boolean;
    isUrlStrippingEnabled: boolean;
    isCanvasProtectionEnabled: boolean;
    targetUrl: string;
}

const StatCard: React.FC<{ title: string; value: string | number; colorClass?: string }> = ({ title, value, colorClass = 'text-[#00FFFF]' }) => (
    <div className="bg-[#0D0D0D]/50 p-4 rounded-lg border border-[rgba(0,255,255,0.1)] text-center">
        <p className="text-sm text-gray-400">{title}</p>
        <p className={`text-3xl font-bold font-mono ${colorClass}`}>{value}</p>
    </div>
);

const DashboardPanel: React.FC<DashboardPanelProps> = ({ 
    activePersona, 
    activeVpnRegion,
    isTorModeActive,
    isUrlStrippingEnabled,
    isCanvasProtectionEnabled,
    targetUrl
 }) => {

    const stats = useMemo(() => {
        const events: SpoofedEvent[] = []; // This component no longer receives events
        const total = events.length;
        const low = events.filter(e => e.risk === 'low').length;
        const medium = events.filter(e => e.risk === 'medium').length;
        const high = events.filter(e => e.risk === 'high').length;
        return { total, low, medium, high };
    }, []);

    const score = useMemo(() => {
        const events: SpoofedEvent[] = []; // This component no longer receives events
        let currentScore = 100;
        const recentEvents = events.slice(0, 20);
        recentEvents.forEach(e => {
            if (e.risk === 'high') currentScore -= 5;
            else if (e.risk === 'medium') currentScore -= 2;
            else currentScore -= 1;
        });
        return Math.max(0, currentScore);
    }, []);

    return (
        <Panel title="snufulufugus stats" subtitle="effectiveness dashboard">
             <PanelSection title="Universal Circuit Integrity Map">
                <p className="text-sm text-gray-400 mb-4">Live visualization of the operational security circuit.</p>
                <CircuitMap 
                    persona={activePersona}
                    vpnRegion={activeVpnRegion}
                    isTorActive={isTorModeActive}
                    purifierStatus={{
                        urlStripping: isUrlStrippingEnabled,
                        canvasProtection: isCanvasProtectionEnabled,
                    }}
                    targetUrl={targetUrl}
                />
            </PanelSection>

            <PanelSection title="Live Threat Matrix">
                <p className="text-sm text-gray-400 mb-4">Analysis of spoofed network queries (feed deprecated from dashboard).</p>
                <div className="grid grid-cols-2 gap-4">
                    <StatCard title="Total Spoofed" value="N/A" />
                    <StatCard title="Privacy Score" value="N/A" colorClass={'text-gray-500'} />
                </div>
            </PanelSection>

             <PanelSection title="Effectiveness Over Time">
                 <p className="text-sm text-gray-400 mb-4">Spoofing activity trend (placeholder).</p>
                 <div className="h-40 bg-[#0D0D0D]/50 border border-dashed border-[rgba(0,255,255,0.15)] rounded-lg flex items-center justify-center">
                    <p className="text-gray-600 font-mono text-sm">Chart data unavailable</p>
                 </div>
             </PanelSection>

        </Panel>
    );
};

export default DashboardPanel;