import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';
import Header from '../components/Header';
import BracketViewer from '../components/BracketViewer';
import { Tournament } from '../types';
import { getTournament, subscribeTournament } from '../services/tournamentService';

const ViewerPage: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('No tournament ID provided');
      setLoading(false);
      return;
    }

    const loadTournament = async () => {
      try {
        const tournamentData = await getTournament(id);
        
        if (!tournamentData) {
          setError('Tournament not found');
          setLoading(false);
          return;
        }
        
        setTournament(tournamentData);
        
        // Subscribe to real-time updates
        const unsubscribe = subscribeTournament(id, (updatedTournament) => {
          setTournament(updatedTournament);
        });
        
        setLoading(false);
        
        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading tournament:', error);
        setError('Failed to load tournament');
        setLoading(false);
      }
    };

    loadTournament();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Загрузка турнира...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Ошибка</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Вернуться на главную
          </button>
        </div>
        
        {tournament && (
          <>
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {tournament.name}
                  </h1>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>Режим наблюдения</span>
                  </div>
                </div>
                
                {tournament.isActive ? (
                  <div className="mt-4 md:mt-0 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm font-medium rounded-full">
                    Турнир в процессе
                  </div>
                ) : (
                  <div className="mt-4 md:mt-0 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-sm font-medium rounded-full">
                    Ожидание начала турнира
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-4 sm:p-6">
                <BracketViewer 
                  tournament={tournament}
                  isEditor={false}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ViewerPage;