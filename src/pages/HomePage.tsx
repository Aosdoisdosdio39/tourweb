import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowRight } from 'lucide-react';
import Header from '../components/Header';

const HomePage: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/view/${roomId}`);
    }
  };

  const handleEditorMode = () => {
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
              <Trophy className="h-12 w-12 text-amber-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Турнирная сетка
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Создавайте, делитесь и следите за турнирными сетками в режиме реального времени
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.01]">
            <div className="p-6">
              <form onSubmit={handleRoomSubmit} className="mb-6">
                <label 
                  htmlFor="room-id" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Турнир:
                </label>
                <div className="flex">
                  <input
                    id="room-id"
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Введите идентификатор турнира"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r-md transition-colors"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
              
              <div className="flex items-center justify-center">
                <button
                  onClick={handleEditorMode}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-md transition-colors shadow-md"
                >
                  Режим редактора
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Создайте собственную турнирную сетку в режиме редактора или присоединитесь к существующему турниру, введя идентификатор комнаты.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;