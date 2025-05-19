import React from 'react';
import BracketMatch from './BracketMatch';
import { Match } from '../types';

interface BracketRoundProps {
  matches: Match[];
  roundNumber: number;
  isEditor: boolean;
  onUpdateMatch?: (matchId: string, data: Partial<Match>) => void;
  matchRefs?: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

const BracketRound: React.FC<BracketRoundProps> = ({ 
  matches, 
  roundNumber,
  isEditor,
  onUpdateMatch,
  matchRefs
}) => {
  // Calculate the height of spacers between matches for this round
  const getSpacerHeight = (roundNum: number) => {
    // The higher the round number, the larger the spacer needs to be
    const baseHeight = 16; // in pixels
    const multiplier = Math.pow(2, roundNum - 1);
    return baseHeight * multiplier;
  };
  
  const roundMatches = matches.filter(match => match.round === roundNumber);
  const spacerHeight = getSpacerHeight(roundNumber);
  
  return (
    <div className="flex flex-col items-center justify-around h-full">
      {roundMatches.map((match, index) => (
        <React.Fragment key={match.id}>
          {index > 0 && <div style={{ height: `${spacerHeight}px` }} />}
          <div
            ref={el => {
              if (matchRefs) matchRefs.current[match.id] = el;
            }}
          >
            <BracketMatch 
              match={match} 
              isEditor={isEditor}
              onUpdateMatch={onUpdateMatch}
            />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default BracketRound;