import React, { useState } from 'react';

const CreateTournamentPage = () => {
  const [numTeams, setNumTeams] = useState<number>(4); 
  const [teams, setTeams] = useState<string[]>(Array(numTeams).fill(''));

  React.useEffect(() => {
    setTeams(prev =>
      Array(numTeams)
        .fill('')
        .map((_, i) => prev[i] || '')
    );
  }, [numTeams]);

  return (
    <div>
      <label>
        Количество команд:
        <select value={numTeams} onChange={e => setNumTeams(Number(e.target.value))}>
          <option value={4}>4 команды</option>
          <option value={8}>8 команд</option>
          <option value={16}>16 команд</option>
          <option value={32}>32 команды</option>
        </select>
      </label>
      <div>
        {teams.map((team, idx) => (
          <input
            key={idx}
            type="text"
            value={team}
            placeholder={`Название команды ${idx + 1}`}
            onChange={e => {
              const newTeams = [...teams];
              newTeams[idx] = e.target.value;
              setTeams(newTeams);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CreateTournamentPage;