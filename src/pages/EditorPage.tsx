import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { 
  PlusCircle, 
  Trophy, 
  Play, 
  Link as LinkIcon,
  Copy,
  Check
} from 'lucide-react';
import Header from '../components/Header';
import BracketViewer from '../components/BracketViewer';
import TeamInput from '../components/TeamInput';
import { Tournament, Match } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  createTournament, 
  createBracket, 
  updateMatch, 
  startTournament,
  subscribeTournament
} from '../services/tournamentService';
import { signIn } from '../services/authService';

const EditorPage: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [showBracketSetup, setShowBracketSetup] = useState(false);
  const [tournamentName, setTournamentName] = useState('');
  const [numTeams, setNumTeams] = useState(8);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

console.log(currentUser);
  
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!currentUser) {
          // For demo purposes, auto-login with test credentials
          await signIn('test@example.com', 'password123');
        }
        setLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/');
      }
    };

    initAuth();
  }, [currentUser, navigate]); 

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Загрузка...</span>
        </div>
      </div>
    );
  }

  const handleCreateTournament = async () => {
   /* if (!currentUser) {
      alert('You must be logged in to create a tournament');
      navigate('/');
      return;
    } */

    if (!tournamentName.trim()) {
      alert('Please enter a tournament name');
      return;
    }

    try {
      const tournamentId = await createTournament(tournamentName, currentUser?.uid  || 'anonymous' );
      console.log("🔥 Запускаем createBracket с", numTeams);
      await createBracket(tournamentId, numTeams);
      

      
      const unsubscribe = subscribeTournament(tournamentId, (updatedTournament) => {
        setTournament(updatedTournament);
      });
      
      setShowBracketSetup(false);
      
      return () => unsubscribe();
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Failed to create tournament');
    }
  };

  const handleUpdateMatch = async (matchId: string, data: Partial<Match>) => {
    if (!tournament) return;
    
    try {
      await updateMatch(tournament.id, matchId, data);
      
      const match = tournament.matches.find(m => m.id === matchId);
      
      if (data.winner && match && match.nextMatchId) {
        const nextMatch = tournament.matches.find(m => m.id === match.nextMatchId);
        
        if (nextMatch) {
          // Determine if this match is left or right child by position
          // Odd position -> team1, Even position -> team2
          if (match.position % 2 === 1) {
            await updateMatch(tournament.id, nextMatch.id, { team1: data.winner });
          } else {
            await updateMatch(tournament.id, nextMatch.id, { team2: data.winner });
          }
        }
      }
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };
  
  const handleStartTournament = async () => {
     console.log("🔥 Нажали Create Tournament");
    if (!tournament) return;
    
    try {
      await startTournament(tournament.id);
      alert(`Tournament started! Share the room ID: ${tournament.id}`);
    } catch (error) {
      console.error('Error starting tournament:', error);
    }
  };
  
  const handleUpdateMatches = async (updatedMatches: Match[]) => {
    if (!tournament) return;
    
    try {
      setTournament({
        ...tournament,
        matches: updatedMatches
      });
      
      for (const match of updatedMatches) {
        await updateMatch(tournament.id, match.id, match);
      }
    } catch (error) {
      console.error('Error updating matches:', error);
    }
  };
  
  const copyRoomLink = () => {
    if (!tournament) return;
    
    navigator.clipboard.writeText(tournament.id);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Редактор турнира
          </h1>
          
          {!tournament && (
            <button
              onClick={() => { console.log("📌 Нажали Новый турнир"); setShowBracketSetup(true)}}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Новый турнир
            </button>
          )}
        </div>
        
        {tournament ? (
          <div>
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                    {tournament.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Создано: {new Date(tournament.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {!tournament.isActive && (
                    <button
                      onClick={handleStartTournament}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Начать турнир
                    </button>
                  )}
                  
                  <div className="relative flex items-center">
                    <div className="flex-1 flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-l-md border border-gray-300 dark:border-gray-600">
                      <LinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm truncate max-w-[150px] md:max-w-[200px]">
                        {tournament.id}
                      </span>
                    </div>
                    <button
                      onClick={copyRoomLink}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-r-md border border-gray-300 dark:border-gray-600 border-l-0 transition-colors"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-green-600 dark:text-green-500" />
                      ) : (
                        <Copy className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {!tournament.isActive && (
              <TeamInput 
                matches={tournament.matches}
                onUpdateMatches={handleUpdateMatches}
              />
            )}
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-4 sm:p-6">
                <BracketViewer 
                  tournament={tournament}
                  isEditor={true}
                  onUpdateMatch={handleUpdateMatch}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500">
              {showBracketSetup 
                ? 'Создание нового турнира...' 
                : 'Турнир не выбран. Создайте новый турнир, чтобы начать.'}
            </p>
          </div>
        )}
        
        {showBracketSetup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Создать новый турнир
              </h2>
              
              <div className="mb-4">
                <label 
                  htmlFor="tournament-name" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Название турнира
                </label>
                <input
                  id="tournament-name"
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="например, Летний чемпионат 2025"
                />
              </div>
              
              <div className="mb-6">
                <label 
                  htmlFor="num-teams" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Количество команд
                </label>
                <select
                  id="num-teams"
                  value={numTeams}
                  onChange={(e) => setNumTeams(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value={4}>4 команды</option>
                  <option value={8}>8 команд</option>
                  <option value={16}>16 команд</option>
                  <option value={32}>32 команды</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBracketSetup(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                >
                  Отменить
                </button>
                <button
                  onClick={handleCreateTournament}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none"
                >
                  Создать
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditorPage;