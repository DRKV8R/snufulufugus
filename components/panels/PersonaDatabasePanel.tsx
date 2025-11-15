
import React, { useState, useMemo, useEffect } from 'react';
import Panel, { PanelSection } from './Panel';
import { Persona, SpoofedEvent } from '../../types';
import PersonaDetailModal from '../PersonaDetailModal';
import { ChevronUpIcon, ChevronDownIcon } from '../Icons';
import FingerprintVisual from '../FingerprintVisual';

interface PersonaDatabasePanelProps {
    personas: Persona[];
    activePersona: Persona;
    setActivePersona: (persona: Persona) => void;
    spoofedEvents: SpoofedEvent[];
    targetUrl: string;
}

const PersonaDatabasePanel: React.FC<PersonaDatabasePanelProps> = ({ personas, activePersona, setActivePersona, spoofedEvents, targetUrl }) => {
    
    const [viewingPersona, setViewingPersona] = useState<Persona | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Persona; direction: 'ascending' | 'descending' }>({ key: 'name', direction: 'ascending' });
    const [showScanResults, setShowScanResults] = useState<boolean>(false);

    useEffect(() => {
        // Reset the scan view when the active persona or target changes
        setShowScanResults(false);
    }, [activePersona, targetUrl]);

    const sortedPersonas = useMemo(() => {
        const sortableItems = [...personas];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [personas, sortConfig]);

    const requestSort = (key: keyof Persona) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader: React.FC<{ columnKey: keyof Persona, title: string, className?: string }> = ({ columnKey, title, className }) => (
        <th className={`p-2 text-[#00BFFF] ${className}`}>
            <button onClick={() => requestSort(columnKey)} className="flex items-center space-x-1 transition-colors hover:text-white">
                <span>{title}</span>
                {sortConfig.key === columnKey && (
                    sortConfig.direction === 'ascending' ? 
                    <ChevronUpIcon className="w-4 h-4 text-[#00FFFF]" /> : 
                    <ChevronDownIcon className="w-4 h-4 text-[#00FFFF]" />
                )}
            </button>
        </th>
    );

    const handleExport = () => {
        const headers = [
            'id', 'name', 'team', 'occupation', 'backstory', 
            'region', 'userAgent', 'resolution', 'language', 'timezone'
        ];
        
        const escapeCsvField = (field: string) => {
            if (field.includes(',') || field.includes('"') || field.includes('\n')) {
                // Wrap field in double quotes and escape existing double quotes
                return `"${field.replace(/"/g, '""')}"`;
            }
            return field;
        };

        const csvRows = [
            headers.join(','), // Header row
            ...personas.map(p => 
                headers.map(header => 
                    escapeCsvField(String(p[header as keyof Persona]))
                ).join(',')
            )
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'snufulufugus_personas.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <Panel title="snufulufugus database" subtitle="persona management system">
                <PanelSection title="Active Persona Fingerprint">
                    <p className="text-sm text-gray-400 mb-2">Analyze the complete digital fingerprint being presented by the active persona.</p>
                     <div className="flex items-center bg-[#1A1A1A] border border-[rgba(0,255,255,0.15)] rounded-md p-2 mb-3">
                        <span className="text-sm text-gray-400 mr-2">Active:</span>
                        <span className="text-sm text-cyan-300 truncate font-mono font-bold" title={activePersona.name}>{activePersona.name}</span>
                    </div>
                    
                    {!showScanResults ? (
                        <button onClick={() => setShowScanResults(true)} className="w-full snufulufugus-button primary">
                            Analyze Site Fingerprint
                        </button>
                    ) : (
                        <FingerprintVisual 
                            persona={activePersona} 
                            spoofedEvents={spoofedEvents}
                            targetUrl={targetUrl}
                        />
                    )}
                </PanelSection>

                <PanelSection title="Available Personas">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-400">Select a persona to view details and activate.</p>
                        <button 
                            onClick={handleExport} 
                            className="snufulufugus-button text-xs py-1 px-3"
                            title="Export all personas to snufulufugus_personas.csv"
                        >
                            Export to CSV
                        </button>
                    </div>
                    <div className="max-h-[45vh] overflow-y-auto pr-2">
                        <table className="w-full text-left text-sm table-fixed">
                            <thead className="sticky top-0 bg-[#141414]/80 backdrop-blur-sm z-10">
                                <tr className="border-b border-[rgba(0,255,255,0.15)]">
                                    <SortableHeader columnKey="name" title="Name" className="w-1/4" />
                                    <SortableHeader columnKey="team" title="Team" className="w-1/4" />
                                    <SortableHeader columnKey="occupation" title="Occupation" className="w-1/4" />
                                    <SortableHeader columnKey="region" title="Region" className="w-1/4" />
                                </tr>
                            </thead>
                            <tbody className="font-mono">
                                {sortedPersonas.map(persona => (
                                    <tr 
                                        key={persona.id} 
                                        onClick={() => setViewingPersona(persona)}
                                        className={`cursor-pointer border-b border-[rgba(0,255,255,0.1)] transition-colors static-hover hover:bg-[rgba(0,255,255,0.05)] ${activePersona.id === persona.id ? 'bg-[rgba(0,255,255,0.1)]' : ''}`}
                                    >
                                        <td className="p-2 font-semibold text-[#00FFFF] truncate" title={persona.name}>{persona.name}</td>
                                        <td className="p-2 text-gray-300 truncate" title={persona.team}>{persona.team}</td>
                                        <td className="p-2 text-gray-300 truncate" title={persona.occupation}>{persona.occupation}</td>
                                        <td className="p-2 text-gray-300 truncate" title={persona.region}>{persona.region}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </PanelSection>
            </Panel>
            <PersonaDetailModal 
                persona={viewingPersona}
                onClose={() => setViewingPersona(null)}
                onActivate={setActivePersona}
                isActive={activePersona.id === viewingPersona?.id}
            />
        </>
    );
};

export default PersonaDatabasePanel;
