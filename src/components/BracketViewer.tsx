import React, { useEffect, useState } from 'react';
import BracketRound from './BracketRound';
import { Tournament, Match } from '../types';

interface BracketViewerProps {
  tournament: Tournament;
  isEditor: boolean;
  onUpdateMatch?: (matchId: string, data: Partial<Match>) => void;
}

const BracketViewer: React.FC<BracketViewerProps> = ({ 
  tournament, 
  isEditor,
  onUpdateMatch
}) => {
  const [totalRounds, setTotalRounds] = useState(0);
  const [rounds, setRounds] = useState<number[]>([]);
  
  useEffect(() => {
    if (tournament && tournament.matches.length > 0) {
      const maxRound = Math.max(...tournament.matches.map(match => match.round));
      setTotalRounds(maxRound);
      setRounds(Array.from({ length: maxRound }, (_, i) => i + 1));
    }
  }, [tournament]);
  
  if (!tournament || tournament.matches.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No bracket data available
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex py-10" style={{ minWidth: `${totalRounds * 260}px` }}>
        {rounds.map(roundNum => (
          <div key={roundNum} className="flex-1 mx-4">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {roundNum === totalRounds ? 'Final' : roundNum === totalRounds - 1 ? 'Semifinals' : `Round ${roundNum}`}
              </h3>
            </div>
            <BracketRound 
              matches={tournament.matches} 
              roundNumber={roundNum}
              isEditor={isEditor}
              onUpdateMatch={onUpdateMatch}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BracketViewer;