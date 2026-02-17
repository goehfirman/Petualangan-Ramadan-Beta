import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { LoginScreen } from './components/LoginScreen';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';

// Inner component to handle conditional rendering based on context
const AppContent: React.FC = () => {
  const { user } = useGame();

  if (!user) {
    return <LoginScreen />;
  }

  if (user.role === 'teacher') {
    return <TeacherDashboard />;
  }

  return <StudentDashboard />;
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;