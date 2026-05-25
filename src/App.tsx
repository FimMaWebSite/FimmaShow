import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { DatabaseEditor } from './components/DatabaseEditor';
import { GameSetup, Team, GameSettings } from './components/GameSetup';
import { GameBoard } from './components/GameBoard';
import { Scoreboard } from './components/Scoreboard';
import { WinnerScreen } from './components/WinnerScreen';
import { Tv, Sparkles } from 'lucide-react';

import { DEFAULT_WORDS, DEFAULT_NINE_SECONDS, DEFAULT_REVERSE_CHARADES } from './data/defaultData';

type GameView = 'DASHBOARD' | 'DATABASE' | 'SETUP' | 'GAMEPLAY' | 'SCOREBOARD' | 'WINNER';
export type GameMode = 'MARYLIN_MONROE' | 'NINE_SECONDS' | 'REVERSE_CHARADES';

const App: React.FC = () => {
  const [view, setView] = useState<GameView>('DASHBOARD');
  const [selectedGame, setSelectedGame] = useState<GameMode>('MARYLIN_MONROE');
  const [availableWords, setAvailableWords] = useState<any[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [settings, setSettings] = useState<GameSettings>({
    roundTime: 60,
    pointsToWin: 15,
    selectedCategories: []
  });

  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [lastTeamIndex, setLastTeamIndex] = useState(0);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);

  // Initialize localStorage if empty
  const initLocalDb = () => {
    if (!localStorage.getItem('fimma_words')) {
      localStorage.setItem('fimma_words', JSON.stringify(DEFAULT_WORDS));
    }
    if (!localStorage.getItem('fimma_nine_seconds')) {
      localStorage.setItem('fimma_nine_seconds', JSON.stringify(DEFAULT_NINE_SECONDS));
    }
    if (!localStorage.getItem('fimma_reverse_charades')) {
      localStorage.setItem('fimma_reverse_charades', JSON.stringify(DEFAULT_REVERSE_CHARADES));
    }
  };

  useEffect(() => {
    initLocalDb();
  }, []);

  // Fetch database items based on selected game
  const loadGameData = async (game: GameMode) => {
    initLocalDb();
    let endpoint = '/api/words';
    let localKey = 'fimma_words';
    let defaultBackup: any[] = DEFAULT_WORDS;

    if (game === 'NINE_SECONDS') {
      endpoint = '/api/nine-seconds';
      localKey = 'fimma_nine_seconds';
      defaultBackup = DEFAULT_NINE_SECONDS;
    } else if (game === 'REVERSE_CHARADES') {
      endpoint = '/api/reverse-charades';
      localKey = 'fimma_reverse_charades';
      defaultBackup = DEFAULT_REVERSE_CHARADES;
    }

    try {
      const res = await fetch(endpoint);
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setAvailableWords(data);
        localStorage.setItem(localKey, JSON.stringify(data));
        return;
      }
    } catch (err) {
      console.warn('API error, falling back to localStorage:', err);
    }

    // Fallback to local storage
    const localData = localStorage.getItem(localKey);
    if (localData) {
      setAvailableWords(JSON.parse(localData));
    } else {
      setAvailableWords(defaultBackup);
    }
  };

  useEffect(() => {
    loadGameData(selectedGame);
  }, [selectedGame]);

  const handleStartSetup = (game: GameMode) => {
    setSelectedGame(game);
    loadGameData(game);
    setView('SETUP');
  };

  const handleStartGame = (teamsSetup: Team[], gameSettings: GameSettings) => {
    setTeams(teamsSetup);
    setSettings(gameSettings);
    setCurrentTeamIndex(0);
    setView('GAMEPLAY');
  };

  const handleRoundEnd = (pointsEarned: number) => {
    setLastPointsEarned(pointsEarned);
    setLastTeamIndex(currentTeamIndex);

    // Update team score
    const updatedTeams = teams.map((team, idx) => {
      if (idx === currentTeamIndex) {
        const newScore = Math.max(0, team.points + pointsEarned); // score can't go below 0
        return { ...team, points: newScore };
      }
      return team;
    });

    setTeams(updatedTeams);

    // Check if team reached the winning condition
    const currentTeamScore = updatedTeams[currentTeamIndex].points;
    const isWinnerFound = currentTeamScore >= settings.pointsToWin;

    // Determine who plays next (round-robin)
    const nextIdx = (currentTeamIndex + 1) % teams.length;
    setCurrentTeamIndex(nextIdx);

    if (isWinnerFound) {
      setView('WINNER');
    } else {
      setView('SCOREBOARD');
    }
  };

  const handleNextRound = () => {
    setView('GAMEPLAY');
  };

  const handleRestart = () => {
    // Reset points
    const resetTeams = teams.map(t => ({ ...t, points: 0 }));
    setTeams(resetTeams);
    setCurrentTeamIndex(0);
    setView('GAMEPLAY');
  };

  const handleHome = () => {
    setView('DASHBOARD');
  };

  return (
    <div className="app-wrapper">
      {/* Top Navbar */}
      {view !== 'GAMEPLAY' && (
        <header className="nav-header">
          <div className="nav-container">
            <div onClick={handleHome} className="nav-logo-group">
              <div className="nav-logo-icon">
                <Tv size={18} />
              </div>
              <span className="nav-logo-text">
                Fimma Show
              </span>
            </div>

            <div className="nav-badge">
              <Sparkles size={11} style={{ color: '#ffd700' }} fill="currentColor" />
              <span>Wersja 1.0</span>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="main-content">
        {view === 'DASHBOARD' && (
          <Dashboard 
            onStartGame={handleStartSetup} 
            onOpenDatabase={() => setView('DATABASE')} 
          />
        )}
        {view === 'DATABASE' && (
          <DatabaseEditor 
            onBack={() => setView('DASHBOARD')} 
          />
        )}
        {view === 'SETUP' && (
          <GameSetup 
            onBack={() => setView('DASHBOARD')} 
            onStart={handleStartGame} 
            gameMode={selectedGame}
          />
        )}
        {view === 'GAMEPLAY' && (
          <GameBoard
            currentTeam={teams[currentTeamIndex]}
            settings={settings}
            availableWords={availableWords}
            onRoundEnd={handleRoundEnd}
            onExitGame={handleHome}
            gameMode={selectedGame}
          />
        )}
        {view === 'SCOREBOARD' && (
          <Scoreboard
            teams={teams}
            currentTeamIndex={currentTeamIndex}
            lastTeamIndex={lastTeamIndex}
            pointsEarned={lastPointsEarned}
            onNextRound={handleNextRound}
          />
        )}
        {view === 'WINNER' && (
          <WinnerScreen
            teams={teams}
            onRestart={handleRestart}
            onHome={handleHome}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer-bar">
        <p>© 2026 Fimma Show. Zainspirowane kanałem YT "Zero Presji Show". Wszystkie prawa zastrzeżone.</p>
      </footer>
    </div>
  );
};

export default App;
