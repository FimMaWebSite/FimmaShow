import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { DatabaseEditor } from './components/DatabaseEditor';
import { GameSetup, Team, GameSettings } from './components/GameSetup';
import { GameBoard } from './components/GameBoard';
import { Scoreboard } from './components/Scoreboard';
import { WinnerScreen } from './components/WinnerScreen';
import { Tv, Sparkles } from 'lucide-react';

import { DEFAULT_WORDS, DEFAULT_NINE_SECONDS, DEFAULT_REVERSE_CHARADES, DEFAULT_BOMB_WORDS, DEFAULT_P_GAME, DEFAULT_SPY_LOCATIONS, DEFAULT_SPY_QUESTIONS, DEFAULT_LIPS_WORDS } from './data/defaultData';

type GameView = 'DASHBOARD' | 'DATABASE' | 'SETUP' | 'GAMEPLAY' | 'SCOREBOARD' | 'WINNER';
export type GameMode = 'MARYLIN_MONROE' | 'NINE_SECONDS' | 'REVERSE_CHARADES' | 'TOURNAMENT' | 'BOMB' | 'P_GAME' | 'SPY' | 'LIPS';

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

  // Tournament specific states
  const [tournamentRound, setTournamentRound] = useState(1);
  const [tournamentTurnsPlayedInRound, setTournamentTurnsPlayedInRound] = useState(0);

  // Helper to get active game mode inside tournament
  const getActiveGameMode = (): GameMode => {
    if (selectedGame === 'TOURNAMENT') {
      if (tournamentRound === 1) return 'MARYLIN_MONROE';
      if (tournamentRound === 2) return 'NINE_SECONDS';
      if (tournamentRound === 3) return 'REVERSE_CHARADES';
      if (tournamentRound === 4) return 'BOMB';
    }
    return selectedGame;
  };

  // Initialize localStorage if empty
  const initLocalDb = () => {
    const oldNineSec = localStorage.getItem('fimma_nine_seconds');
    if (oldNineSec && oldNineSec.includes('Wymień 3')) {
      localStorage.removeItem('fimma_nine_seconds');
    }
    const oldCharades = localStorage.getItem('fimma_reverse_charades');
    if (oldCharades && oldCharades.includes('Picie gorącej kawy')) {
      localStorage.removeItem('fimma_reverse_charades');
    }

    if (!localStorage.getItem('fimma_words')) {
      localStorage.setItem('fimma_words', JSON.stringify(DEFAULT_WORDS));
    }
    if (!localStorage.getItem('fimma_nine_seconds')) {
      localStorage.setItem('fimma_nine_seconds', JSON.stringify(DEFAULT_NINE_SECONDS));
    }
    if (!localStorage.getItem('fimma_reverse_charades')) {
      localStorage.setItem('fimma_reverse_charades', JSON.stringify(DEFAULT_REVERSE_CHARADES));
    }
    if (!localStorage.getItem('fimma_bomb_words')) {
      localStorage.setItem('fimma_bomb_words', JSON.stringify(DEFAULT_BOMB_WORDS));
    }
    if (!localStorage.getItem('fimma_p_game')) {
      localStorage.setItem('fimma_p_game', JSON.stringify(DEFAULT_P_GAME));
    }
    if (!localStorage.getItem('fimma_spy_locations')) {
      localStorage.setItem('fimma_spy_locations', JSON.stringify(DEFAULT_SPY_LOCATIONS));
    }
    if (!localStorage.getItem('fimma_spy_questions')) {
      localStorage.setItem('fimma_spy_questions', JSON.stringify(DEFAULT_SPY_QUESTIONS));
    }
    if (!localStorage.getItem('fimma_lips_words')) {
      localStorage.setItem('fimma_lips_words', JSON.stringify(DEFAULT_LIPS_WORDS));
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
    } else if (game === 'BOMB') {
      endpoint = '/api/bomb-words';
      localKey = 'fimma_bomb_words';
      defaultBackup = DEFAULT_BOMB_WORDS;
    } else if (game === 'P_GAME') {
      endpoint = '/api/p-game';
      localKey = 'fimma_p_game';
      defaultBackup = DEFAULT_P_GAME;
    } else if (game === 'SPY') {
      endpoint = '/api/spy-locations';
      localKey = 'fimma_spy_locations';
      defaultBackup = DEFAULT_SPY_LOCATIONS;
    } else if (game === 'LIPS') {
      endpoint = '/api/lips-words';
      localKey = 'fimma_lips_words';
      defaultBackup = DEFAULT_LIPS_WORDS;
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
    if (selectedGame !== 'TOURNAMENT') {
      loadGameData(selectedGame);
    }
  }, [selectedGame]);

  const handleStartSetup = (game: GameMode) => {
    setSelectedGame(game);
    if (game === 'TOURNAMENT') {
      setTournamentRound(1);
      setTournamentTurnsPlayedInRound(0);
      loadGameData('MARYLIN_MONROE');
    } else {
      loadGameData(game);
    }
    setView('SETUP');
  };

  const handleStartGame = (teamsSetup: Team[], gameSettings: GameSettings) => {
    setTeams(teamsSetup);
    if (selectedGame === 'TOURNAMENT') {
      setSettings({
        roundTime: 60, // Runda 1 (Marilyn Monroe) is 60s
        pointsToWin: 9999, // Tournament continues till the end
        selectedCategories: []
      });
      setTournamentRound(1);
      setTournamentTurnsPlayedInRound(0);
    } else {
      setSettings(gameSettings);
    }
    setCurrentTeamIndex(0);
    setView('GAMEPLAY');
  };

  const handleRoundEnd = (pointsEarned: number, loserTeamId?: number, opponentPointsEarned?: number) => {
    setLastPointsEarned(pointsEarned);
    setLastTeamIndex(currentTeamIndex);

    let updatedTeams = [...teams];

    if (selectedGame === 'SPY') {
      updatedTeams = teams.map((team, idx) => {
        let pts = team.points;
        if (idx === currentTeamIndex) {
          pts = Math.max(0, pts + pointsEarned);
        } else if (opponentPointsEarned !== undefined) {
          pts = Math.max(0, pts + opponentPointsEarned);
        }
        return { ...team, points: pts };
      });
      setTeams(updatedTeams);

      const currentTeamScore = updatedTeams[currentTeamIndex].points;
      const opponentIdx = (currentTeamIndex + 1) % teams.length;
      const opponentTeamScore = updatedTeams[opponentIdx].points;
      const isWinnerFound = currentTeamScore >= settings.pointsToWin || opponentTeamScore >= settings.pointsToWin;

      const nextIdx = (currentTeamIndex + 1) % teams.length;
      setCurrentTeamIndex(nextIdx);

      if (isWinnerFound) {
        setView('WINNER');
      } else {
        setView('SCOREBOARD');
      }
      return;
    }

    if (selectedGame === 'TOURNAMENT') {
      if (loserTeamId !== undefined) {
        // Bomb exploded - deduct points from holding team
        updatedTeams = teams.map((team) => {
          if (team.id === loserTeamId) {
            return { ...team, points: Math.max(0, team.points - 3) };
          }
          return team;
        });
        setTeams(updatedTeams);
        // Show winner screen (final round ends the game)
        setView('WINNER');
        return;
      } else {
        // Normal tournament round (Rounds 1-3)
        updatedTeams = teams.map((team, idx) => {
          if (idx === currentTeamIndex) {
            return { ...team, points: Math.max(0, team.points + pointsEarned) };
          }
          return team;
        });
        setTeams(updatedTeams);

        const nextTurnsPlayed = tournamentTurnsPlayedInRound + 1;
        setTournamentTurnsPlayedInRound(nextTurnsPlayed);

        const nextIdx = (currentTeamIndex + 1) % teams.length;
        setCurrentTeamIndex(nextIdx);
        setView('SCOREBOARD');
      }
    } else {
      // Normal single game mode
      updatedTeams = teams.map((team, idx) => {
        if (idx === currentTeamIndex) {
          const newScore = Math.max(0, team.points + pointsEarned);
          return { ...team, points: newScore };
        }
        return team;
      });

      setTeams(updatedTeams);

      const currentTeamScore = updatedTeams[currentTeamIndex].points;
      const isWinnerFound = currentTeamScore >= settings.pointsToWin;

      const nextIdx = (currentTeamIndex + 1) % teams.length;
      setCurrentTeamIndex(nextIdx);

      if (isWinnerFound) {
        setView('WINNER');
      } else {
        setView('SCOREBOARD');
      }
    }
  };

  const handleNextRound = () => {
    if (selectedGame === 'TOURNAMENT' && tournamentTurnsPlayedInRound === teams.length * 2) {
      // Advance to the next round of the tournament
      const nextRound = tournamentRound + 1;
      setTournamentRound(nextRound);
      setTournamentTurnsPlayedInRound(0);
      setCurrentTeamIndex(0);

      let nextRoundTime = 60;
      let nextMode: GameMode = 'MARYLIN_MONROE';
      if (nextRound === 2) {
        nextRoundTime = 9.5;
        nextMode = 'NINE_SECONDS';
      } else if (nextRound === 3) {
        nextRoundTime = 120;
        nextMode = 'REVERSE_CHARADES';
      } else if (nextRound === 4) {
        nextRoundTime = 60;
        nextMode = 'BOMB';
      }

      setSettings(prev => ({
        ...prev,
        roundTime: nextRoundTime
      }));

      loadGameData(nextMode);
    }
    setView('GAMEPLAY');
  };

  const handleRestart = () => {
    const resetTeams = teams.map(t => ({ ...t, points: 0 }));
    setTeams(resetTeams);
    setCurrentTeamIndex(0);
    if (selectedGame === 'TOURNAMENT') {
      setTournamentRound(1);
      setTournamentTurnsPlayedInRound(0);
      setSettings({
        roundTime: 60,
        pointsToWin: 9999,
        selectedCategories: []
      });
      loadGameData('MARYLIN_MONROE');
    }
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
            gameMode={getActiveGameMode()}
            teams={teams}
          />
        )}
        {view === 'SCOREBOARD' && (
          <Scoreboard
            teams={teams}
            currentTeamIndex={currentTeamIndex}
            lastTeamIndex={lastTeamIndex}
            pointsEarned={lastPointsEarned}
            onNextRound={handleNextRound}
            isTournament={selectedGame === 'TOURNAMENT'}
            tournamentRound={tournamentRound}
            isRoundOver={tournamentTurnsPlayedInRound === teams.length * 2}
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
