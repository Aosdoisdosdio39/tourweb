import React, { useState } from 'react';
import { Match, Team } from '../types';
import { MessageSquare } from 'lucide-react';

interface BracketMatchProps {
  match: Match;
  isEditor: boolean;
  onUpdateMatch?: (matchId: string, data: Partial<Match>) => void;
}

const BracketMatch: React.FC<BracketMatchProps> = ({ 
  match, 
  isEditor,
  onUpdateMatch
}) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState(match.comments || '');

  const handleTeamClick = (team: Team | null) => {
    if (!isEditor || !team || match.winner) return;
    
    onUpdateMatch?.(match.id, { winner: team });
  };

  const handleSaveComment = () => {
    onUpdateMatch?.(match.id, { comments: comment });
    setIsCommenting(false);
  };

  const isTeam1Winner = match.winner?.id === match.team1?.id;
  const isTeam2Winner = match.winner?.id === match.team2?.id;

  return (
    <div className="flex flex-col w-56 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex-1 flex flex-col">
        <div 
          className={`p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${
            isTeam1Winner ? 'bg-green-50 dark:bg-green-900/20' : ''
          } ${isEditor && match.team1 ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''}`}
          onClick={() => handleTeamClick(match.team1)}
        >
          <p className={`font-medium ${isTeam1Winner ? 'text-green-600 dark:text-green-400' : ''}`}>
            {match.team1?.name || 'TBD'}
          </p>
        </div>
        <div 
          className={`p-3 cursor-pointer ${
            isTeam2Winner ? 'bg-green-50 dark:bg-green-900/20' : ''
          } ${isEditor && match.team2 ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''}`}
          onClick={() => handleTeamClick(match.team2)}
        >
          <p className={`font-medium ${isTeam2Winner ? 'text-green-600 dark:text-green-400' : ''}`}>
            {match.team2?.name || 'TBD'}
          </p>
        </div>
      </div>
      
      {match.comments && !isCommenting && (
        <div className="p-2 bg-gray-50 dark:bg-gray-900/20 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          <p>{match.comments}</p>
        </div>
      )}
      
      {isEditor && (
        <div className="p-2 bg-gray-100 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          {isCommenting ? (
            <div className="flex flex-col space-y-2">
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="text-sm w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                rows={2}
                placeholder="Add match commentary..."
              />
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setIsCommenting(false)}
                  className="px-2 py-1 text-xs rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Отменить
                </button>
                <button 
                  onClick={handleSaveComment}
                  className="px-2 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Сохранить
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsCommenting(true)}
              className="flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              {match.comments ? 'Edit comment' : 'Add comment'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BracketMatch;