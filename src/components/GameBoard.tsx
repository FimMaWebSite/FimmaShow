import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Check, X, RotateCcw, AlertTriangle, HelpCircle } from 'lucide-react';

import { Team, GameSettings } from './GameSetup';
import { playClick, playCorrect, playWrong, playTick, playBuzzer, playExplosion } from '../utils/audio';
import { GameMode } from '../App';

interface GameBoardProps {
  currentTeam: Team;
  settings: GameSettings;
  availableWords: any[];
  onRoundEnd: (teamPointsThisRound: number, loserTeamId?: number) => void;
  onExitGame: () => void;
  gameMode: GameMode;
  teams?: Team[];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  currentTeam,
  settings,
  availableWords,
  onRoundEnd,
  onExitGame,
  gameMode,
  teams,
}) => {
  const [shuffledWords, setShuffledWords] = useState<any[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReadyPhase, setIsReadyPhase] = useState(true);
  const [timeLeft, setTimeLeft] = useState(settings.roundTime);
  const [pointsThisRound, setPointsThisRound] = useState(0);

  // Bomb state variables
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [bombTimeLeft, setBombTimeLeft] = useState(60);
  const [isExploded, setIsExploded] = useState(false);
  const tickAccumulatorRef = useRef(0);
  const hasExplodedRef = useRef(false);
  
  // Point popups animation tracking
  const [popups, setPopups] = useState<{ id: number; value: string; type: 'plus' | 'minus' }[]>([]);
  const popupIdCounter = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter and shuffle items on mount
  useEffect(() => {
    let filtered = availableWords;
    if (gameMode !== 'BOMB' && settings.selectedCategories && settings.selectedCategories.length > 0) {
      filtered = availableWords.filter(w => settings.selectedCategories.includes(w.category));
    }
    // Fisher-Yates Shuffle
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledWords(shuffled);
  }, [availableWords, settings.selectedCategories, gameMode]);

  // Normal Timer logic (runs at 100ms interval for non-Bomb modes)
  useEffect(() => {
    if (gameMode === 'BOMB') return;

    if (isPlaying && !isReadyPhase) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0.1) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            playBuzzer();
            // Automatically complete the round after a short delay
            setTimeout(() => {
              onRoundEnd(pointsThisRound);
            }, 1500);
            return 0;
          }

          const nextVal = Math.round((prev - 0.1) * 10) / 10;

          // Sound triggers on whole seconds
          if (gameMode === 'NINE_SECONDS') {
            // Tick every full second
            if (nextVal % 1 === 0 && nextVal > 0) {
              playTick();
            }
          } else {
            // Marylin Monroe: Tick sound in the final 10 seconds
            if (nextVal <= 10 && nextVal % 1 === 0 && nextVal > 0) {
              playTick();
            }
          }

          return nextVal;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isReadyPhase, pointsThisRound, onRoundEnd, gameMode]);

  // Bomb Timer logic
  useEffect(() => {
    if (gameMode !== 'BOMB') return;

    if (isPlaying && !isReadyPhase && !isExploded) {
      timerRef.current = setInterval(() => {
        setBombTimeLeft(prev => {
          if (prev <= 0.1) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            if (!hasExplodedRef.current) {
              hasExplodedRef.current = true;
              setIsExploded(true);
              playExplosion();
              setTimeout(() => {
                onRoundEnd(0, teams ? teams[activeTeamIdx].id : undefined);
              }, 4000);
            }
            return 0;
          }

          const nextVal = Math.round((prev - 0.1) * 10) / 10;

          // Accelerated ticking interval
          const interval = nextVal > 25 ? 1.0 : nextVal > 15 ? 0.6 : nextVal > 8 ? 0.3 : 0.15;
          tickAccumulatorRef.current += 0.1;
          
          if (tickAccumulatorRef.current >= interval) {
            playTick();
            tickAccumulatorRef.current = 0;
          }

          return nextVal;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isReadyPhase, isExploded, gameMode, activeTeamIdx, teams, onRoundEnd]);

  const handleStartRound = () => {
    playClick();
    if (gameMode === 'BOMB') {
      const initialIdx = teams ? teams.findIndex(t => t.id === currentTeam.id) : 0;
      setActiveTeamIdx(initialIdx >= 0 ? initialIdx : 0);
      const randomTime = Math.floor(Math.random() * (70 - 40 + 1) + 40); // 40 to 70 seconds
      setBombTimeLeft(randomTime);
      setIsExploded(false);
      hasExplodedRef.current = false;
      tickAccumulatorRef.current = 0;
    }
    setIsReadyPhase(false);
    setIsPlaying(true);
  };

  const handlePauseToggle = () => {
    playClick();
    setIsPlaying(!isPlaying);
  };

  const handleCorrect = () => {
    if (!isPlaying) return;
    playCorrect();
    setPointsThisRound(prev => prev + 1);
    triggerPopup('+1', 'plus');
    
    // Move to next word/question
    nextWord();
  };

  const handleWrong = () => {
    if (!isPlaying) return;
    playWrong();
    if (gameMode === 'NINE_SECONDS' || gameMode === 'REVERSE_CHARADES') {
      triggerPopup('+0', 'minus');
    } else {
      setPointsThisRound(prev => prev - 1);
      triggerPopup('-1', 'minus');
    }
    
    // Move to next word/question
    nextWord();
  };

  const nextWord = () => {
    setCurrentWordIndex(prev => {
      // Loop if we reach the end of the list
      if (prev >= shuffledWords.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  };

  const triggerPopup = (value: string, type: 'plus' | 'minus') => {
    const id = popupIdCounter.current++;
    setPopups(prev => [...prev, { id, value, type }]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, 800); // match CSS transition duration
  };

  const handleBombPass = () => {
    if (!isPlaying || isExploded) return;
    playCorrect();
    setActiveTeamIdx(prev => (prev + 1) % (teams ? teams.length : 2));
    nextWord();
  };

  const handleExitClick = () => {
    if (window.confirm('Czy na pewno chcesz zakończyć grę i wrócić do menu?')) {
      playClick();
      onExitGame();
    }
  };

  const currentWord = shuffledWords[currentWordIndex];

  // Helper to format remaining time nicely (with one decimal place if 9.5s)
  const formatTime = (time: number) => {
    if (gameMode === 'NINE_SECONDS' || time % 1 !== 0) {
      return time.toFixed(1);
    }
    return Math.floor(time).toString();
  };

  if (gameMode === 'BOMB') {
    const activeTeam = teams ? teams[activeTeamIdx] : currentTeam;

    return (
      <div className="flex-container max-w-xl mx-auto fade-in" style={{ padding: '12px', minHeight: '85vh', justifyContent: 'space-between', position: 'relative' }}>
        <style>{`
          @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(0px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(2px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(2px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
          }
          
          @keyframes spark {
            0%, 100% { transform: scale(1); filter: brightness(1.2); }
            50% { transform: scale(1.3); filter: brightness(1.6); }
          }

          .bomb-shaking-active {
            animation: shake ${bombTimeLeft > 25 ? '0.8s' : bombTimeLeft > 12 ? '0.4s' : '0.15s'} infinite;
          }

          .fuse-sparking {
            animation: spark 0.2s infinite;
          }
        `}</style>

        {/* Explosion Overlay */}
        {isExploded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, #ff2a00 0%, #0a0a0c 80%)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '24px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ fontSize: '100px', filter: 'drop-shadow(0 0 20px rgba(255, 60, 0, 0.8))', animation: 'bounce 0.5s infinite' }}>💥</div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: 'white', textTransform: 'uppercase', textShadow: '0 0 15px rgba(255, 0, 0, 0.8)', textAlign: 'center', margin: '20px 0' }}>
              BOMBA WYBUCHŁA!
            </h1>
            <div style={{ fontSize: '20px', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>
              W rękach drużyny:
            </div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: activeTeam.color, textShadow: '0 0 8px rgba(255,255,255,0.2)', margin: '10px 0' }}>
              {activeTeam.name}
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '2.5px solid #ef4444', borderRadius: '16px', padding: '10px 30px', marginTop: '24px', color: 'white', fontWeight: 900, fontSize: '22px', letterSpacing: '0.05em' }}>
              -3 PUNKTY 📉
            </div>
          </div>
        )}

        {/* Header bar */}
        <div className="game-header-bar" style={{ borderColor: 'rgba(255, 60, 0, 0.2)', background: 'rgba(255, 60, 0, 0.03)' }}>
          <div className="game-header-team">
            <span style={{ fontSize: '12px', fontWeight: 900, color: 'hsl(var(--secondary))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              RUNDA FINAŁOWA: BOMBA! 💣
            </span>
          </div>
          <div className="game-header-stats">
            {teams && teams.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="team-indicator-dot" style={{ color: t.color, backgroundColor: t.color, width: '8px', height: '8px' }} />
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: t.id === activeTeam.id ? 'white' : 'hsl(var(--text-muted))' }}>
                  {t.points} pkt
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Game/Ready Screen Area */}
        <div className="flex-container" style={{ flexGrow: 1, justifyContent: 'center', margin: '20px 0', width: '100%' }}>
          {isReadyPhase ? (
            /* Pass device / start round screen */
            <div className="glass flex-col items-center" style={{ padding: '36px', textAlign: 'center', maxWidth: '500px', width: '100%', gap: '24px', border: '1.5px dashed hsl(var(--primary))' }}>
              <div className="floating" style={{ width: '90px', height: '90px', background: 'rgba(255, 60, 0, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--primary))' }}>
                <span style={{ fontSize: '48px' }}>💣</span>
              </div>
              <div className="flex-col gap-xs">
                <h3 style={{ fontSize: '26px', fontWeight: 900, color: 'white' }}>WIELKI FINAŁ</h3>
                <p style={{ fontSize: '13.5px', color: 'hsl(var(--text-secondary))', lineHeight: 1.5 }}>
                  Zaczyna drużyna: <span style={{ color: activeTeam.color, fontWeight: 800 }}>{activeTeam.name}</span>.<br/><br/>
                  Opisujcie hasła bez używania słów pokrewnych. Gdy Wasza drużyna zgadnie hasło, kliknijcie przycisk, aby przekazać bombę kolejnej drużynie. Bomba wybuchnie w losowym momencie!
                </p>
              </div>
              <button
                onClick={handleStartRound}
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '16px', background: 'linear-gradient(135deg, #ff3c00 0%, #ff8c00 100%)', border: 'none' }}
              >
                ODPAL KNOT BOMBY 🧨
              </button>
            </div>
          ) : (
            /* Active bomb card play screen */
            <div className="flex-container w-full" style={{ gap: '20px' }}>
              {/* Active Team Indicator banner */}
              <div style={{
                background: `linear-gradient(90deg, transparent, ${activeTeam.color}33, transparent)`,
                borderLeft: `4px solid ${activeTeam.color}`,
                borderRight: `4px solid ${activeTeam.color}`,
                padding: '12px 24px',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: 900,
                fontSize: '20px',
                color: 'white',
                textTransform: 'uppercase',
                boxShadow: `0 0 15px ${activeTeam.color}1a`
              }}>
                Bomba jest u: <span style={{ color: activeTeam.color }}>{activeTeam.name}</span>
              </div>

              {/* Zero Presji Card for Bomb round */}
              {currentWord ? (
                <div className="zero-presji-card-container" style={{ background: 'linear-gradient(135deg, #1e1b18 0%, #2f2a24 100%)', border: '4px solid #111', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                  <div className="zero-presji-card-inner" style={{ background: 'radial-gradient(circle, #2d2925 0%, #1e1b19 100%)', borderColor: '#111' }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '11px',
                      fontWeight: 900,
                      color: 'hsl(var(--primary))',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      marginBottom: '16px'
                    }}>
                      HASŁO DO OPISANIA (BEZ ZAKAZANYCH SŁÓW)
                    </div>

                    <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <h2 style={{
                        fontSize: 'clamp(2rem, 5vw, 4.2rem)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: '#ffffff',
                        textShadow: '0 4px 10px rgba(0,0,0,0.5)',
                        lineHeight: 1.1
                      }}>
                        {currentWord.word}
                      </h2>
                    </div>

                    {/* Zero Presji Show badge */}
                    <div className="zero-presji-logo-badge" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                      <span>Zero</span>
                      <span className="accent">Presji</span>
                      <span>Show</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass flex-col items-center" style={{ padding: '32px', textAlign: 'center', color: '#ff5c75' }}>
                  <span>Brak haseł w bazie!</span>
                </div>
              )}

              {/* Giant Bomb SVG and Burn status indicator */}
              <div className="flex-row items-center justify-center gap-md" style={{ marginTop: '10px' }}>
                <div className={`bomb-shaking-active`} style={{ position: 'relative', width: '90px', height: '90px' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                    {/* Fuse curve */}
                    <path d="M 65 35 C 75 25, 80 30, 85 20" fill="transparent" stroke="#a08060" strokeWidth="4" strokeLinecap="round" />
                    
                    {/* Spark glow */}
                    {isPlaying && (
                      <circle cx="85" cy="20" r="8" fill="#ffd700" className="fuse-sparking" style={{ filter: 'drop-shadow(0 0 8px #ff4500)' }} />
                    )}
                    
                    {/* Bomb body */}
                    <circle cx="50" cy="55" r="32" fill="#141416" stroke="#2c2c30" strokeWidth="2.5" />
                    <circle cx="42" cy="47" r="28" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="3" strokeDasharray="30 150" />
                    
                    {/* Bomb top collar */}
                    <rect x="42" y="19" width="16" height="8" rx="2" fill="#202024" />
                  </svg>
                </div>

                <div className="flex-col" style={{ alignItems: 'flex-start' }}>
                  <span className="stat-label" style={{ color: 'hsl(var(--primary))' }}>KNOT PŁONIE! 🧨</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>
                    {bombTimeLeft > 25 ? 'Bomba tyka powoli...' : bombTimeLeft > 12 ? 'Tyk-tak! Przyspiesza!' : 'Zaraz wybuchnie!!!'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls for Bomb */}
        {!isReadyPhase && (
          <div className="gameplay-controls-panel" style={{ background: 'rgba(255, 60, 0, 0.02)', borderColor: 'rgba(255, 60, 0, 0.15)', padding: '20px' }}>
            <button
              onClick={handleBombPass}
              disabled={!isPlaying || isExploded}
              className="btn btn-primary w-full"
              style={{
                padding: '20px',
                fontSize: '18px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #ff3c00 0%, #ff8c00 100%)',
                border: 'none',
                boxShadow: '0 8px 24px rgba(255, 60, 0, 0.35)',
                fontWeight: 900,
                letterSpacing: '0.02em',
                flexGrow: 1
              }}
            >
              <Check size={22} />
              ZGADNIĘTE (PRZEKAŻ BOMBĘ!) 💣
            </button>

            {/* Exit button */}
            <button
              onClick={handleExitClick}
              className="btn btn-secondary"
              style={{ padding: '18px', color: '#ff5c75', borderRadius: '20px' }}
              title="Przerwij grę"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-container max-w-xl mx-auto fade-in" style={{ padding: '12px', minHeight: '85vh', justifyContent: 'space-between', position: 'relative' }}>
      {/* Floating points animation container */}
      {popups.map(p => (
        <div key={p.id} className={`points-popup ${p.type}`} style={{ left: '50%', top: '35%', transform: 'translate(-50%, -50%)' }}>
          {p.value}
        </div>
      ))}

      {/* Header bar */}
      <div className="game-header-bar">
        <div className="game-header-team">
          <span className="team-indicator-dot" style={{ color: currentTeam.color, backgroundColor: currentTeam.color }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>
            Tura: <span style={{ color: currentTeam.color }}>{currentTeam.name}</span>
          </h3>
        </div>
        <div className="game-header-stats">
          <div className="stat-box">
            <span className="stat-label">Wynik ogólny</span>
            <span className="stat-value">{currentTeam.points} pkt</span>
          </div>
          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)', alignSelf: 'stretch' }} />
          <div className="stat-box">
            <span className="stat-label">Ta runda</span>
            <span className="stat-value" style={{ color: 'hsl(var(--secondary))' }}>{pointsThisRound} pkt</span>
          </div>
        </div>
      </div>

      {/* Main Game Card Area */}
      <div className="flex-container" style={{ flexGrow: 1, justifyContent: 'center', margin: '24px 0', width: '100%' }}>
        {isReadyPhase ? (
          /* Pass the device Screen */
          <div className="glass flex-col items-center" style={{ padding: '36px', textAlign: 'center', maxWidth: '480px', width: '100%', gap: '20px' }}>
            <div className="floating" style={{ width: '80px', height: '80px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--primary))' }}>
              <HelpCircle size={40} />
            </div>
            <div className="flex-col gap-xs">
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>Kolej na {currentTeam.name}</h3>
              <p style={{ fontSize: '14px', color: 'hsl(var(--text-secondary))', lineHeight: 1.5 }}>
                {gameMode === 'MARYLIN_MONROE' 
                  ? 'Oddaj telefon/urządzenie osobie, która będzie opisywać hasło. Inni członkowie drużyny nie mogą patrzeć na ekran!'
                  : gameMode === 'NINE_SECONDS'
                  ? 'Wylosowane pytanie przeczyta Wam Mistrz Gry! Oddaj telefon osobie pełniącej rolę prowadzącego. Inni członkowie drużyny nie patrzą na ekran!'
                  : 'Pokazujesz hasła-czynności partnerowi, nakazując mu wykonywanie pantomimy! Oddaj telefon osobie pokazującej. Współgracz zgadujący nie patrzy na ekran!'}
              </p>
            </div>
            <button
              onClick={handleStartRound}
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '16px' }}
            >
              ROZPOCZNIJ RUNDĘ
            </button>
          </div>
        ) : (
          /* Active Card Screen */
          <div className="flex-container w-full">
            {currentWord ? (
              /* Zero Presji Styled Card */
              <div className="zero-presji-card-container" style={gameMode === 'REVERSE_CHARADES' ? { background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f43f5e 100%)', boxShadow: '0 20px 50px rgba(139, 92, 246, 0.3)' } : undefined}>
                <div className="zero-presji-card-inner" style={gameMode === 'REVERSE_CHARADES' ? { background: 'radial-gradient(circle, #fbf7ff 0%, #f3e8ff 60%, #e9d5ff 100%)', borderColor: '#4c1d95' } : undefined}>
                  {gameMode === 'MARYLIN_MONROE' ? (
                    <>
                      {/* Word title */}
                      <h2 className="zero-presji-card-title">{currentWord.word}</h2>
                      
                      {/* Forbidden words container */}
                      <div className="taboo-container">
                        <span className="taboo-header">
                          Słowa Zakazane
                        </span>
                        <div className="taboo-words-list">
                          {currentWord.forbidden.map((fw: string, idx: number) => (
                            <div
                              key={idx}
                              className="taboo-word-item"
                            >
                              {fw}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : gameMode === 'NINE_SECONDS' ? (
                    <>
                      {/* 9,5 Sekundy Title styling */}
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.4rem, 3.2vw, 2.5rem)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: '#d31010',
                        marginBottom: '16px',
                        letterSpacing: '0.05em',
                        borderBottom: '3px dashed rgba(26, 10, 3, 0.2)',
                        paddingBottom: '8px',
                        width: '100%',
                        maxWidth: '450px'
                      }}>
                        9,5 Sekundy
                      </div>

                      {/* Question */}
                      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
                        <p style={{
                          fontSize: 'clamp(1.3rem, 2.8vw, 2rem)',
                          fontWeight: 900,
                          color: '#1a0a03',
                          lineHeight: 1.35,
                          maxWidth: '520px',
                          textShadow: '0.5px 0.5px 0px rgba(255,255,255,0.8)'
                        }}>
                          {currentWord.question}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Odwrócone Kalambury Title styling */}
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.2rem, 3.2vw, 2.2rem)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: '#8b5cf6',
                        marginBottom: '16px',
                        letterSpacing: '0.05em',
                        borderBottom: '3px dashed rgba(139, 92, 246, 0.2)',
                        paddingBottom: '8px',
                        width: '100%',
                        maxWidth: '450px'
                      }}>
                        Odwrócone Kalambury
                      </div>

                      {/* Action */}
                      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
                        <p style={{
                          fontSize: 'clamp(1.3rem, 2.8vw, 2.2rem)',
                          fontWeight: 900,
                          color: '#1d0b3a',
                          lineHeight: 1.35,
                          maxWidth: '520px',
                          textShadow: '0.5px 0.5px 0px rgba(255,255,255,0.8)'
                        }}>
                          {currentWord.question}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Tiny logo badge resembling Zero Presji logo */}
                  <div className="zero-presji-logo-badge">
                    <span>Zero</span>
                    <span className="accent">Presji</span>
                    <span>Show</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass flex-col items-center" style={{ padding: '32px', textAlign: 'center', color: '#ff5c75', gap: '8px' }}>
                <AlertTriangle size={32} />
                <span>
                  {gameMode === 'MARYLIN_MONROE' ? 'Brak haseł' : gameMode === 'NINE_SECONDS' ? 'Brak pytań' : 'Brak czynności'} w wybranej kategorii!
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom control bar (Timer + Buttons) */}
      {!isReadyPhase && (
        <div className="gameplay-controls-panel">
          {/* Circular Timer Display */}
          <div className="timer-area">
            <div className="timer-circle-wrapper">
              <svg className="timer-circle-svg">
                {/* Background circle */}
                <circle
                  cx="38"
                  cy="38"
                  r="34"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="5"
                  fill="transparent"
                />
                {/* Countdown circle */}
                <circle
                  cx="38"
                  cy="38"
                  r="34"
                  strokeDasharray="213"
                  strokeDashoffset={213 - (213 * timeLeft) / settings.roundTime}
                  stroke={timeLeft <= (gameMode === 'NINE_SECONDS' ? 3 : 10) ? '#ef4444' : gameMode === 'REVERSE_CHARADES' ? '#8b5cf6' : '#f97316'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="transparent"
                  style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.2s' }}
                />
              </svg>
              <div className={`timer-text-overlay ${timeLeft <= (gameMode === 'NINE_SECONDS' ? 3 : 10) ? 'text-danger timer-danger' : 'text-light'}`} style={{ color: timeLeft <= (gameMode === 'NINE_SECONDS' ? 3 : 10) ? '#ef4444' : 'white', fontSize: gameMode === 'NINE_SECONDS' ? '18px' : '22px' }}>
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="flex-col">
              <span className="stat-label">Pozostały Czas</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>
                {!isPlaying ? 'Gra wstrzymana' : timeLeft <= (gameMode === 'NINE_SECONDS' ? 3 : 10) ? 'Ostatnie sekundy!' : 'Czas ucieka!'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="gameplay-buttons-group">
            <button
              onClick={handleWrong}
              disabled={!isPlaying}
              className="btn btn-danger"
              style={{ flexGrow: 1, padding: '16px', fontSize: '15px' }}
            >
              <X size={18} />
              {gameMode === 'NINE_SECONDS' ? 'NIEUDANE (0)' : 'BŁĄD (-1)'}
            </button>
            <button
              onClick={handleCorrect}
              disabled={!isPlaying}
              className="btn btn-success"
              style={{ flexGrow: 1, padding: '16px', fontSize: '15px' }}
            >
              <Check size={18} />
              ZGADNIĘTE (+1)
            </button>
          </div>

          {/* Pause / Exit button */}
          <div className="gameplay-aux-actions">
            <button
              onClick={handlePauseToggle}
              className="btn btn-secondary"
              style={{ padding: '12px' }}
              title={isPlaying ? 'Wstrzymaj grę' : 'Wznów grę'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
            </button>
            <button
              onClick={handleExitClick}
              className="btn btn-secondary"
              style={{ padding: '12px', color: '#ff5c75' }}
              title="Wyjdź z gry"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
