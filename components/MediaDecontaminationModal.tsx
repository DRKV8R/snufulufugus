import React from 'react';
import { DecontaminationAsset } from '../types';
import { XIcon, ShieldIcon } from './Icons';

interface MediaDecontaminationModalProps {
  asset: DecontaminationAsset | null;
  onClose: () => void;
  analysisReport: string;
  isAnalyzing: boolean;
}

const MediaDecontaminationModal: React.FC<MediaDecontaminationModalProps> = ({ asset, onClose, analysisReport, isAnalyzing }) => {
  if (!asset) return null;
  
  const handlePlayback = (player: string) => {
    alert(`Initiating playback for "${asset.name}" in ${player}. All traffic will be sandboxed.`);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#141414] border border-[rgba(0,255,255,0.15)] rounded-lg shadow-2xl shadow-cyan-500/10 w-full max-w-2xl m-4 relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-yellow-500/30 bg-yellow-900/20 flex-shrink-0">
          <div className="flex items-center space-x-3">
             <ShieldIcon className="w-6 h-6 text-yellow-400" />
            <h3 className="font-bold text-xl text-yellow-400 font-mono">Media Security Scan</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white hover:bg-[#262626] rounded-full">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
            <div className="bg-black/40 p-3 rounded-md border border-white/10 mb-4">
                <p className="text-xs text-gray-400">Asset for Analysis:</p>
                <p className="text-md text-white font-semibold truncate">{asset.name}</p>
                <p className="text-xs font-mono text-gray-500">Origin: {asset.originArchive}</p>
            </div>

            <h4 className="text-lg font-semibold text-cyan-300 mb-2">AI-Powered Threat Analysis</h4>
            
            {isAnalyzing && (
                 <div className="flex flex-col items-center justify-center h-40 bg-black/30 rounded-md border border-dashed border-cyan-500/30">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
                    <p className="mt-4 text-cyan-400 font-mono">Agent is analyzing for threats...</p>
                </div>
            )}
            
            {!isAnalyzing && analysisReport && (
                <div className="text-sm text-gray-300 font-mono whitespace-pre-wrap p-4 bg-black/30 rounded-md max-h-60 overflow-y-auto border border-white/10">
                    <div
                        className="prose prose-sm prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: analysisReport.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-black/50 p-3 rounded-md my-2"><code>$2</code></pre>').replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded">$1</code>') }}
                    />
                </div>
            )}
        </div>
        
        {!isAnalyzing && (
            <div className="p-4 border-t border-[rgba(0,255,255,0.15)] flex-shrink-0">
                <h4 className="text-sm font-semibold text-gray-200 mb-2">Secure Playback Options</h4>
                <div className="flex space-x-4">
                     <button 
                        onClick={() => handlePlayback('Secure Local Player')}
                        className="flex-1 snufulufugus-button primary"
                     >
                        Use Secure Local Player
                    </button>
                     <button 
                        onClick={() => handlePlayback('Sandboxed Web Player')}
                        className="flex-1 snufulufugus-button"
                    >
                        Use Sandboxed Web Player
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MediaDecontaminationModal;