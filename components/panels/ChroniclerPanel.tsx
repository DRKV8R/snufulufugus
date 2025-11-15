import React, { useState, useEffect, useMemo } from 'react';
import Panel, { PanelSection } from './Panel';
import { PrivateArchive, MediaAsset } from '../../types';
import { SearchIcon, Trash2Icon, DatabaseIcon, ColumnsIcon, PlayCircleIcon, MusicIcon, FileTextIcon } from '../Icons';
import MediaViewerModal from '../MediaViewerModal';


interface ChroniclerPanelProps {
    targetUrl: string;
    privateArchives: PrivateArchive[];
    onCreateArchive: (url: string) => void;
    onDeleteArchive: (id: string) => void;
    onScrapeArchive: (archive: PrivateArchive) => void;
    isTorModeActive: boolean;
    onDecontaminateMedia: (asset: MediaAsset, archive: PrivateArchive) => void;
}

const ChroniclerPanel: React.FC<ChroniclerPanelProps> = ({ 
    targetUrl, privateArchives, onCreateArchive, onDeleteArchive, onScrapeArchive,
    isTorModeActive, onDecontaminateMedia
}) => {
    const [publicUrl, setPublicUrl] = useState(targetUrl);
    const [privateUrl, setPrivateUrl] = useState(targetUrl);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<string[] | null>(null);
    
    const [diffDateA, setDiffDateA] = useState('2023-01-15');
    const [diffDateB, setDiffDateB] = useState('2024-01-15');
    const [diffResult, setDiffResult] = useState<string | null>(null);
    const [isDiffing, setIsDiffing] = useState(false);

    const [archiveSearch, setArchiveSearch] = useState('');
    const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
    const [expandedArchives, setExpandedArchives] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!targetUrl.startsWith('local-archive://')) {
            setPublicUrl(targetUrl);
            setPrivateUrl(targetUrl);
        }
    }, [targetUrl]);

    const handleTemporalSearch = () => {
        if (!searchTerm) return;
        setIsSearching(true);
        setSearchResults(null);
        setTimeout(() => {
            setSearchResults([
                `<strong>2024-03-10:</strong> "...found the <strong>${searchTerm}</strong> in a public gist..."`,
                `<strong>2023-11-05:</strong> "...leaked <strong>${searchTerm}</strong> was revoked..."`,
                `<strong>2023-10-01:</strong> "...new <strong>${searchTerm}</strong> generation process..."`
            ]);
            setIsSearching(false);
        }, 2500);
    };
    
    const handleVisualDiff = () => {
        setIsDiffing(true);
        setDiffResult(null);
        setTimeout(() => {
            setDiffResult(`
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                        <h4 class="font-bold text-cyan-400 border-b border-gray-700 pb-1 mb-2">Snapshot A: ${diffDateA}</h4>
                        <pre class="bg-gray-800/50 p-3 rounded whitespace-pre-wrap font-mono text-gray-300"><code>&lt;p&gt;The primary endpoint is api.example.com. <span class="bg-red-900/60 text-red-200 px-1 py-0.5 rounded">Use API key v1 for access.</span>&lt;/p&gt;</code></pre>
                    </div>
                    <div>
                        <h4 class="font-bold text-cyan-400 border-b border-gray-700 pb-1 mb-2">Snapshot B: ${diffDateB}</h4>
                         <pre class="bg-gray-800/50 p-3 rounded whitespace-pre-wrap font-mono text-gray-300"><code>&lt;p&gt;The primary endpoint is api.example.com. <span class="bg-green-900/60 text-green-200 px-1 py-0.5 rounded">Authentication is now handled via OAuth2.</span>&lt;/p&gt;</code></pre>
                    </div>
                </div>
            `);
            setIsDiffing(false);
        }, 1500);
    }
    
    const getStatusColor = (status: PrivateArchive['status']) => {
        switch (status) {
            case 'Completed': return 'text-green-400';
            case 'Crawling...': return 'text-yellow-400 animate-pulse';
            case 'Failed': return 'text-red-400';
            default: return 'text-gray-400';
        }
    }

    const filteredArchives = useMemo(() => {
        return privateArchives.filter(a => a.domain.toLowerCase().includes(archiveSearch.toLowerCase()));
    }, [privateArchives, archiveSearch]);

    const handlePlayMedia = (asset: MediaAsset, archive: PrivateArchive) => {
        if (asset.type === 'document' && asset.url === '#') {
            alert(`In a real application, a preview for the document "${asset.name}" would be shown here.`);
            return;
        }
        
        if (isTorModeActive) {
            onDecontaminateMedia(asset, archive);
        } else {
            setSelectedAsset(asset);
        }
    };

    const toggleArchiveExpansion = (id: string) => {
        setExpandedArchives(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };


  return (
    <>
    <Panel title="snufulufugusarchive" subtitle="archival systems">
       <PanelSection title="Mode 1: Public Archive Explorer">
            <p className="text-sm text-gray-400 mb-4">Analysis of public archives like the Wayback Machine.</p>
            <div className="space-y-4">
                 <div>
                    <label htmlFor="public-archive-url" className="block text-sm font-medium text-[#00BFFF] mb-2">Target URL</label>
                    <input type="url" id="public-archive-url" value={publicUrl} onChange={(e) => setPublicUrl(e.target.value)}
                        className="w-full snufulufugus-input text-sm"/>
                </div>

                <div className="bg-[#1A1A1A]/50 p-3 rounded-md border border-[rgba(0,255,255,0.15)]">
                    <h4 className="text-sm font-semibold text-cyan-300 mb-2">Temporal Search</h4>
                    <p className="text-xs text-gray-400 mb-2">Search for terms within public snapshots.</p>
                    <div className="flex space-x-2">
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search term (e.g., 'API_KEY')" className="flex-grow snufulufugus-input text-xs" />
                        <button onClick={handleTemporalSearch} className="snufulufugus-button primary p-2" disabled={isSearching}>
                            <SearchIcon className="w-4 h-4" />
                        </button>
                    </div>
                    {isSearching && <p className="text-xs text-yellow-400 mt-2">Searching public temporal records...</p>}
                    {searchResults && (
                        <div className="mt-3 text-xs space-y-2">
                            {searchResults.map((res, i) => <div key={i} className="p-2 bg-black/30 rounded" dangerouslySetInnerHTML={{ __html: res }} />)}
                        </div>
                    )}
                </div>
                
                <div className="bg-[#1A1A1A]/50 p-3 rounded-md border border-[rgba(0,255,255,0.15)]">
                    <h4 className="text-sm font-semibold text-cyan-300 mb-2">Visual Diff</h4>
                    <p className="text-xs text-gray-400 mb-2">Compare two snapshots of the target URL.</p>
                    <div className="flex space-x-2 items-center">
                        <input type="date" value={diffDateA} onChange={(e) => setDiffDateA(e.target.value)} className="flex-grow snufulufugus-input text-xs" />
                        <span>vs</span>
                        <input type="date" value={diffDateB} onChange={(e) => setDiffDateB(e.target.value)} className="flex-grow snufulufugus-input text-xs" />
                        <button onClick={handleVisualDiff} className="snufulufugus-button primary p-2" disabled={isDiffing}>
                            <ColumnsIcon className="w-4 h-4" />
                        </button>
                    </div>
                    {isDiffing && <p className="text-xs text-yellow-400 mt-2">Generating diff...</p>}
                    {diffResult && <div className="mt-3" dangerouslySetInnerHTML={{ __html: diffResult }} />}
                </div>
            </div>
       </PanelSection>
       <PanelSection title="Mode 2: Private Offline Archives">
            <p className="text-sm text-gray-400 mb-4">Create and manage private, offline archives of targets.</p>

            <div className="bg-[#1A1A1A]/50 p-3 rounded-md border border-[rgba(0,255,255,0.15)] mb-4">
                <label htmlFor="private-archive-url" className="block text-sm font-medium text-[#00BFFF] mb-2">Target URL to Archive</label>
                <div className="flex space-x-2">
                    <input type="url" id="private-archive-url" value={privateUrl} onChange={(e) => setPrivateUrl(e.target.value)} className="flex-grow snufulufugus-input text-sm" />
                    <button onClick={() => onCreateArchive(privateUrl)} className="snufulufugus-button primary">Create Archive</button>
                </div>
            </div>

            <div className="mt-4">
                <input type="text" value={archiveSearch} onChange={(e) => setArchiveSearch(e.target.value)} placeholder="Search archives by domain..." className="w-full snufulufugus-input text-sm mb-3"/>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {filteredArchives.map(archive => (
                        <div key={archive.id} className="bg-[#1A1A1A] p-3 rounded-lg border border-transparent hover:border-[#00BFFF]/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-[#00FFFF] cursor-pointer" onClick={() => toggleArchiveExpansion(archive.id)}>{archive.domain}</p>
                                    <p className="text-xs text-gray-400 font-mono">Captured: {archive.capturedAt}</p>
                                    <p className="text-xs font-mono">Size: {archive.size}</p>
                                    <p className={`text-xs font-mono ${getStatusColor(archive.status)}`}>Status: {archive.status}</p>
                                </div>
                                <div className="flex space-x-2">
                                     <button onClick={() => onScrapeArchive(archive)} title="Load archive for scraping" className="snufulufugus-button text-xs py-1 px-2"><DatabaseIcon className="w-4 h-4"/></button>
                                     <button onClick={() => onDeleteArchive(archive.id)} title="Delete archive" className="snufulufugus-button text-xs py-1 px-2 danger"><Trash2Icon className="w-4 h-4"/></button>
                                </div>
                            </div>
                            {expandedArchives.has(archive.id) && archive.mediaAssets && (
                                <div className="mt-3 pt-3 border-t border-[rgba(0,255,255,0.1)]">
                                    <h5 className="text-sm text-cyan-300 mb-2">Extracted Media Assets</h5>
                                    <div className="space-y-1">
                                        {archive.mediaAssets.map(asset => (
                                            <div key={asset.name} className="flex items-center justify-between bg-black/30 p-2 rounded text-xs">
                                                <div className="flex items-center truncate">
                                                    {asset.type === 'video' && <PlayCircleIcon className="w-4 h-4 mr-2 text-red-400 flex-shrink-0" />}
                                                    {asset.type === 'audio' && <MusicIcon className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />}
                                                    {asset.type === 'document' && <FileTextIcon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />}
                                                    <span className="truncate" title={asset.name}>{asset.name}</span>
                                                </div>
                                                <button onClick={() => handlePlayMedia(asset, archive)} className="snufulufugus-button text-xs py-0.5 px-2">Preview</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
       </PanelSection>
    </Panel>
    <MediaViewerModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
    </>
  );
};

export default ChroniclerPanel;