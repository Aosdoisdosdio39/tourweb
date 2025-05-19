import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Match, Team } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TeamInputProps {
  matches: Match[];
  onUpdateMatches: (matches: Match[]) => void;
}

const TeamInput: React.FC<TeamInputProps> = ({ matches, onUpdateMatches }) => {
  const firstRoundMatches = matches.filter(match => match.round === 1);
  const totalTeamsNeeded = firstRoundMatches.length * 2;

  // Teams are autofixed to the template, no add/remove functionality
  const [teamsList, setTeamsList] = useState<Team[]>(
    Array.from({ length: totalTeamsNeeded }, (_, i) => ({
      id: uuidv4(),
      name: ''
    }))
  );

  useEffect(() => {
    // Always keep teamsList length in sync with template
    setTeamsList(prev =>
      Array.from({ length: totalTeamsNeeded }, (_, i) => ({
        id: prev[i]?.id || uuidv4(),
        name: prev[i]?.name || ''
      }))
    );
  }, [totalTeamsNeeded]);

  const handleTeamNameChange = (index: number, name: string) => {
    const updated = [...teamsList];
    updated[index].name = name;
    setTeamsList(updated);
  };

  const handleSetupBracket = () => {
    const validTeams = teamsList.filter(team => team.name.trim() !== '');

    if (validTeams.length < totalTeamsNeeded) {
      alert(`Please enter all ${totalTeamsNeeded} team names`);
      return;
    }

    const updatedMatches = [...matches];

    let teamIndex = 0;
    for (const match of firstRoundMatches) {
      const matchIndex = updatedMatches.findIndex(m => m.id === match.id);

      updatedMatches[matchIndex].team1 = validTeams[teamIndex++] || null;
      updatedMatches[matchIndex].team2 = validTeams[teamIndex++] || null;
    }

    onUpdateMatches(updatedMatches);
  };

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Команды ({totalTeamsNeeded} всего)
      </h2>
      <div className="space-y-3 mb-6">
        {teamsList.map((team, index) => (
          <div key={team.id} className="flex items-center">
            <input
              type="text"
              value={team.name}
              onChange={(e) => handleTeamNameChange(index, e.target.value)}
              placeholder={`Команда ${index + 1}`}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSetupBracket}
          className="flex items-center px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          <Save className="w-4 h-4 mr-1" />
          Сохранить и заполнить сетку
        </button>
      </div>
    </div>
  );
};

export default TeamInput;