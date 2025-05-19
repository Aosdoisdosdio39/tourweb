import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/authService';

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-indigo-900 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-white">
          <Trophy className="h-8 w-8 text-amber-400" />
          <span className="text-2xl font-bold tracking-tight">Турнирная Сетка</span>
        </Link>
        
        {currentUser && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm hidden md:inline-block">
              {currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center p-2 rounded-full hover:bg-indigo-800 text-white"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;