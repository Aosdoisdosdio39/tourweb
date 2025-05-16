import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import ViewerPage from './pages/ViewerPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/view/:id" element={<ViewerPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;