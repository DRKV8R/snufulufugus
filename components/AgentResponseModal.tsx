

import React from 'react';
import { XIcon } from './Icons';

interface AgentResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: string;
  isLoading: boolean;
}

const AgentResponseModal: React.FC<AgentResponseModalProps> = ({ isOpen, onClose, report, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#141414] border border-[rgba(0,255,255,0.15)] rounded-lg shadow-2xl shadow-cyan-500/10 w-full max-w-3xl m-4 relative flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-[rgba(0,255,255,0.15)] flex-shrink-0">
          <h3 className="font-bold text-xl text-[#00FFFF] font-mono">Agent Analysis Report</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white hover:bg-[#262626] rounded-full">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-sm text-gray-300 font-mono whitespace-pre-wrap">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              <p className="mt-4 text-cyan-400">Agent is analyzing...</p>
            </div>
          )}
          {report && (
            <div
              className="prose prose-sm prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: report.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-black/50 p-3 rounded-md my-2"><code>$2</code></pre>').replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded">$1</code>') }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentResponseModal;