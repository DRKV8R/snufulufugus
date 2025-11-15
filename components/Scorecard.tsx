import React, { useMemo } from 'react';
import { SpoofedEvent } from '../types';
import { ClipboardCheckIcon } from './Icons';
import { RISK_SCORES } from '../constants';

interface ScorecardProps {
  events: SpoofedEvent[];
}

const Scorecard: React.FC<ScorecardProps> = ({ events }) => {
  const { score, highRiskCount, scoreColor } = useMemo(() => {
    let currentScore = 100;
    let highRisk = 0;
    
    // We only calculate based on the last 20 events to keep the score relevant
    const recentEvents = events.slice(0, 20);

    recentEvents.forEach(e => {
      currentScore -= RISK_SCORES[e.risk];
      if (e.risk === 'high') {
        highRisk++;
      }
    });

    currentScore = Math.max(0, currentScore);
    
    let color = 'text-green-400';
    if (currentScore < 80) color = 'text-yellow-400';
    if (currentScore < 50) color = 'text-red-500';

    return { score: currentScore, highRiskCount: highRisk, scoreColor: color };
  }, [events]);

  const title = `Privacy Score: ${score}/100\nBased on recent site activity.\n${highRiskCount} high-risk queries detected.`;

  return (
    <div className="flex items-center space-x-1.5" title={title}>
      <ClipboardCheckIcon className={`w-4 h-4 ${scoreColor}`} />
      <span className={scoreColor}>{score}</span>
    </div>
  );
};

export default Scorecard;