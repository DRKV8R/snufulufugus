

import React, { useState, useMemo, useEffect } from 'react';
import Panel, { PanelSection } from './Panel';
import { Persona, SpoofedEvent, PersonaHistory } from '../../types';
import PersonaDetailModal from '../PersonaDetailModal';
import { ChevronUpIcon, ChevronDownIcon, StarIcon } from '../Icons';
import FingerprintVisual from '../FingerprintVisual';

interface PersonaDatabasePanelProps {
    personas: Persona[];
    activePersona: Persona;
    setActivePersona: (persona: Persona) => void;
    spoofedEvents: SpoofedEvent[];
    targetUrl: string;
    onGeneratePersona: () => void;
    personaHistory: PersonaHistory;
}

const PersonaDatabasePanel: React.FC<PersonaDatabasePanelProps> = ({ personas, activePersona, setActivePersona, spoofedEvents, targetUrl, onGeneratePersona, personaHistory }) => {
    
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

    const activationHistory = useMemo(() => {
        const allActivations = Object.entries(personaHistory)
            .flatMap(([personaId, logs]) => {
                // FIX: Add a type guard to ensure 'logs' is an array. Data from localStorage could be malformed.
                if (!Array.isArray(logs)) {
                    return [];
                }
                return logs
                    .filter(log => log.type === 'activation')
                    .map(log => ({ ...log, personaId }));
            })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return allActivations.slice(0, 10); // Show last 10 activations
    }, [personaHistory]);

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
            <Panel title="snufulufugusdatabase" subtitle="persona management system">
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
                        <p className="text-sm text-gray-400">Select a persona to activate, or generate a new one.</p>
                        <div className="flex space-x-2">
                             <button 
                                onClick={onGeneratePersona} 
                                className="snufulufugus-button text-xs py-1 px-3"
                                title="Generate a new random persona"
                            >
                                Generate Random Persona
                            </button>
                            <button 
                                onClick={handleExport} 
                                className="snufulufugus-button text-xs py-1 px-3"
                                title="Export all personas to snufulufugus_personas.csv"
                            >
                                Export to CSV
                            </button>
                        </div>
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
                                        <td className="p-2 font-semibold text-[#00FFFF] truncate" title={persona.name}>
                                            <div className="flex items-center">
                                                {persona.isGenerated && <StarIcon className="w-3 h-3 text-yellow-400 mr-2 flex-shrink-0" title="Generated Persona"/>}
                                                <span className="truncate">{persona.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-2 text-gray-300 truncate" title={persona.team}>{persona.team}</td>
                                        <td className="p-2 text-gray-300 truncate" title={persona.occupation}>{persona.occupation}</td>
                                        <td className="p-2 text-gray-300 truncate" title={persona.region}>{persona.region}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </PanelSection>
                
                 <PanelSection title="Persona Activation History">
                    <p className="text-sm text-gray-400 mb-2">Most recent persona activations for this session.</p>
                    <div className="max-h-40 overflow-y-auto pr-2">
                        {activationHistory.length > 0 ? (
                            <ul className="space-y-2">
                                {activationHistory.map((log, index) => {
                                    const persona = personas.find(p => p.id === log.personaId);
                                    return (
                                        <li key={index} className="text-xs font-mono p-2 bg-black/30 rounded">
                                            <span className="text-cyan-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                            <span className="text-gray-400 mx-2">-</span>
                                            <span className="text-white font-semibold">{persona?.name || 'Unknown Persona'}</span>
                                            <span className="text-gray-500"> activated.</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : (
                            <p className="text-xs text-gray-500 text-center py-4">No personas activated yet.</p>
                        )}
                    </div>
                </PanelSection>
            </Panel>
            <PersonaDetailModal 
                persona={viewingPersona}
                onClose={() => setViewingPersona(null)}
                onActivate={setActivePersona}
                isActive={activePersona.id === viewingPersona?.id}
                history={viewingPersona ? personaHistory[viewingPersona.id] || [] : []}
            />
        </>
    );
};

export default PersonaDatabasePanel;
