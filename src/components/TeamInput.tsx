import React, { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Match, Team } from '../types';

interface TeamInputProps {
  matches: Match[];
  onUpdateMatches: (matches: Match[]) => void;
}

const TeamInput: React.FC<TeamInputProps> = ({ matches, onUpdateMatches }) => {
  const [teamsList, setTeamsList] = useState<Team[]>([
    { id: uuidv4(), name: '' },
    { id: uuidv4(), name: '' }
  ]);
  
  const handleAddTeam = () => {
    setTeamsList([...teamsList, { id: uuidv4(), name: '' }]);
  };
  
  const handleTeamNameChange = (index: number, name: string) => {
    const updatedTeams = [...teamsList];
    updatedTeams[index].name = name;
    setTeamsList(updatedTeams);
  };
  
  const handleSetupBracket = () => {
    // Filter out empty team names
    const validTeams = teamsList.filter(team => team.name.trim() !== '');
    
    if (validTeams.length < 2) {
      alert('You need at least 2 teams to create a bracket');
      return;
    }
    
    // Get only the first round matches
    const firstRoundMatches = matches.filter(match => match.round === 1);
    
    // Update the first round matches with the teams
    const updatedMatches = [...matches];
    
    let teamIndex = 0;
    for (let i = 0; i < firstRoundMatches.length; i++) {
      const matchIndex = updatedMatches.findIndex(m => m.id === firstRoundMatches[i].id);
      
      if (matchIndex !== -1) {
        // Add team1
        if (teamIndex < validTeams.length) {
          updatedMatches[matchIndex].team1 = validTeams[teamIndex];
          teamIndex++;
        }
        
        // Add team2
        if (teamIndex < validTeams.length) {
          updatedMatches[matchIndex].team2 = validTeams[teamIndex];
          teamIndex++;
        }
      }
    }
    
    onUpdateMatches(updatedMatches);
  };
  
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Add Teams
      </h2>
      
      <div className="space-y-3 mb-6">
        {teamsList.map((team, index) => (
          <div key={team.id} className="flex items-center">
            <input 
              type="text"
              value={team.name}
              onChange={(e) => handleTeamNameChange(index, e.target.value)}
              placeholder={`Team ${index + 1}`}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <button 
          onClick={handleAddTeam}
          className="flex items-center px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Team
        </button>
        
        <button 
          onClick={handleSetupBracket}
          className="flex items-center px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          <Save className="w-4 h-4 mr-1" />
          Setup Bracket
        </button>
      </div>
    </div>
  );
};

export default TeamInput;