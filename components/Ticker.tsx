import React from 'react';
import { SpoofedEvent } from '../types';
import { RISK_SCORES } from '../constants';

interface TickerProps {
  events: SpoofedEvent[];
}

const getRiskColor = (risk: SpoofedEvent['risk']) => {
    switch (risk) {
        case 'high': return 'text-red-400';
        case 'medium': return 'text-yellow-400';
        default: return 'text-cyan-400';
    }
};

const Ticker: React.FC<TickerProps> = ({ events }) => {
  if (events.length === 0) {
    return (
        <div className="w-full h-full flex items-center px-4 text-xs text-gray-500 font-mono">
            Awaiting spoofing activity...
        </div>
    );
  }

  // Duplicate events to ensure smooth looping
  const tickerContent = [...events, ...events];

  return (
    <div className="w-full h-full flex items-center overflow-hidden relative">
      <div className="flex animate-scroll-left whitespace-nowrap">
        {tickerContent.map((event, index) => (
          <span key={`${event.id}-${index}`} className="text-xs font-mono text-gray-400 mx-3 flex items-center">
            <span className={event.risk === 'high' ? 'text-red-500 font-bold' : ''}>
              {event.origin}
            </span>
            <span className="text-gray-500 mx-1">queried</span>
            <span className={getRiskColor(event.risk)}>
              {event.query}
            </span>
             <span className={`ml-1 font-bold ${getRiskColor(event.risk)}`}>
              (-{RISK_SCORES[event.risk]})
            </span>
            <span className="text-cyan-700 mx-3">◆</span>
          </span>
        ))}
      </div>
       <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-[#0d0d0d] to-transparent pointer-events-none"></div>
       <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-[#0d0d0d] to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Ticker;