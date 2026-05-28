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
export type GameMode = 'MARYLIN_MONROE' | 'NINE_SECONDS' | 'REVERSE_CHARADES' | 'TOURNAMENT' | 'BOMB' | 'P_GAME' | 'SPY' | 'LIPS' | 'REVOLVER';

const ADMIN_HASH = '1ec3e7600872b0de2ac7d720cb588b63f1979dce3e19eb0eda2c3698dd773b77';

// Hash a string using SHA-256 (Web Crypto API)
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const App: React.FC = () => {
  const [view, setView] = useState<GameView>('DASHBOARD');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminInput, setAdminInput] = useState('');
  const [adminError, setAdminError] = useState(false);
  const [adminShake, setAdminShake] = useState(false);
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
      const customGames = settings.tournamentGames || ['MARYLIN_MONROE', 'NINE_SECONDS', 'REVERSE_CHARADES'];
      if (tournamentRound <= customGames.length) {
        return customGames[tournamentRound - 1];
      }
      return 'BOMB';
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
  const loadGameData = (game: GameMode) => {
    initLocalDb();
    let localKey = 'fimma_words';
    let defaultBackup: any[] = DEFAULT_WORDS;

    if (game === 'NINE_SECONDS') {
      localKey = 'fimma_nine_seconds';
      defaultBackup = DEFAULT_NINE_SECONDS;
    } else if (game === 'REVERSE_CHARADES') {
      localKey = 'fimma_reverse_charades';
      defaultBackup = DEFAULT_REVERSE_CHARADES;
    } else if (game === 'BOMB') {
      localKey = 'fimma_bomb_words';
      defaultBackup = DEFAULT_BOMB_WORDS;
    } else if (game === 'P_GAME') {
      localKey = 'fimma_p_game';
      defaultBackup = DEFAULT_P_GAME;
    } else if (game === 'SPY') {
      localKey = 'fimma_spy_locations';
      defaultBackup = DEFAULT_SPY_LOCATIONS;
    } else if (game === 'LIPS') {
      localKey = 'fimma_lips_words';
      defaultBackup = DEFAULT_LIPS_WORDS;
    } else if (game === 'REVOLVER') {
      localKey = 'fimma_words';
      defaultBackup = DEFAULT_WORDS;
    }

    // Load from local storage
    const localData = localStorage.getItem(localKey);
    if (localData) {
      try {
        setAvailableWords(JSON.parse(localData));
      } catch {
        setAvailableWords(defaultBackup);
      }
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
      const customGames = gameSettings.tournamentGames || ['MARYLIN_MONROE', 'NINE_SECONDS', 'REVERSE_CHARADES'];
      const firstGame = customGames[0] || 'MARYLIN_MONROE';
      let firstRoundTime = 60;
      if (firstGame === 'NINE_SECONDS') firstRoundTime = 9.5;
      else if (firstGame === 'REVERSE_CHARADES') firstRoundTime = 120;

      setSettings({
        roundTime: firstRoundTime,
        pointsToWin: 9999, // Tournament continues till the end
        selectedCategories: [],
        tournamentGames: customGames
      });
      setTournamentRound(1);
      setTournamentTurnsPlayedInRound(0);
      loadGameData(firstGame);
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
    const customGames = settings.tournamentGames || ['MARYLIN_MONROE', 'NINE_SECONDS', 'REVERSE_CHARADES'];
    if (selectedGame === 'TOURNAMENT' && tournamentTurnsPlayedInRound === teams.length * 2) {
      // Advance to the next round of the tournament
      const nextRound = tournamentRound + 1;
      setTournamentRound(nextRound);
      setTournamentTurnsPlayedInRound(0);
      setCurrentTeamIndex(0);

      let nextMode: GameMode = 'BOMB';
      if (nextRound <= customGames.length) {
        nextMode = customGames[nextRound - 1];
      }

      let nextRoundTime = 60;
      if (nextMode === 'NINE_SECONDS') {
        nextRoundTime = 9.5;
      } else if (nextMode === 'REVERSE_CHARADES') {
        nextRoundTime = 120;
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
      <main className="main-content" style={view === 'DATABASE' ? { maxWidth: '1600px', width: '95%' } : undefined}>
        {view === 'DASHBOARD' && (
          <Dashboard 
            onStartGame={handleStartSetup} 
            onOpenDatabase={() => {
              setAdminInput('');
              setAdminError(false);
              setShowAdminModal(true);
            }} 
          />
        )}
        {/* Admin Password Modal */}
        {showAdminModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px'
          }}>
            <div
              className="glass"
              style={{
                padding: '40px 36px', maxWidth: '400px', width: '100%',
                textAlign: 'center', borderRadius: '28px',
                border: adminError ? '2px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)',
                animation: adminShake ? 'shake 0.4s ease' : 'none',
                transition: 'border 0.2s'
              }}
            >
              <style>{`
                @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  20% { transform: translateX(-10px); }
                  40% { transform: translateX(10px); }
                  60% { transform: translateX(-8px); }
                  80% { transform: translateX(8px); }
                }
              `}</style>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'white', marginBottom: '8px' }}>
                Panel Administratora
              </h3>
              <p style={{ fontSize: '13px', color: 'hsl(var(--text-secondary))', marginBottom: '24px', lineHeight: 1.6 }}>
                Tylko dla autoryzowanych użytkowników.
              </p>
              <input
                type="password"
                value={adminInput}
                onChange={e => { setAdminInput(e.target.value); setAdminError(false); }}
                onKeyDown={async e => {
                  if (e.key === 'Enter') {
                    const hash = await sha256(adminInput);
                    if (hash === ADMIN_HASH) {
                      setShowAdminModal(false);
                      setAdminInput('');
                      setView('DATABASE');
                    } else {
                      setAdminError(true);
                      setAdminShake(true);
                      setTimeout(() => setAdminShake(false), 400);
                      setAdminInput('');
                    }
                  }
                }}
                placeholder="Hasło..."
                className="input-field"
                autoFocus
                style={{
                  width: '100%',
                  marginBottom: '16px',
                  textAlign: 'center',
                  fontSize: '18px',
                  letterSpacing: '0.2em',
                  border: adminError ? '2px solid #ef4444' : undefined
                }}
              />
              {adminError && (
                <div style={{ color: '#ef4444', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
                  ❌ Błędne hasło. Spróbuj ponownie.
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={async () => {
                    const hash = await sha256(adminInput);
                    if (hash === ADMIN_HASH) {
                      setShowAdminModal(false);
                      setAdminInput('');
                      setView('DATABASE');
                    } else {
                      setAdminError(true);
                      setAdminShake(true);
                      setTimeout(() => setAdminShake(false), 400);
                      setAdminInput('');
                    }
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  Wejdź
                </button>
                <button
                  onClick={() => { setShowAdminModal(false); setAdminInput(''); setAdminError(false); }}
                  className="btn btn-secondary"
                  style={{ padding: '12px 16px' }}
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
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
