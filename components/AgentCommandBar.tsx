
import React, { useState } from 'react';
import { TerminalIcon } from './Icons';

interface AgentCommandBarProps {
  onQuerySubmit: (query: string) => void;
  isLoading: boolean;
}

const AgentCommandBar: React.FC<AgentCommandBarProps> = ({ onQuerySubmit, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onQuerySubmit(inputValue);
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="flex-shrink-0 flex items-center space-x-2">
        <TerminalIcon className="w-5 h-5 text-[#00FFFF]" />
        <span className="text-sm font-mono font-bold text-[#00FFFF]">AGENT&gt;</span>
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Run analysis on target, query public records, check for vulnerabilities..."
        className="flex-grow text-sm snufulufugus-input !bg-[#0D0D0D] h-9"
        disabled={isLoading}
      />
      <button 
        type="submit" 
        className="snufulufugus-button primary h-9 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading || !inputValue.trim()}
      >
        {isLoading ? 'Running...' : 'Execute'}
      </button>
    </form>
  );
};

export default AgentCommandBar;
