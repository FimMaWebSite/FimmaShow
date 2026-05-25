import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Check, X, RotateCcw, AlertTriangle, HelpCircle } from 'lucide-react';

import { Team, GameSettings } from './GameSetup';
import { playClick, playCorrect, playWrong, playTick, playBuzzer } from '../utils/audio';
import { GameMode } from '../App';

interface GameBoardProps {
  currentTeam: Team;
  settings: GameSettings;
  availableWords: any[];
  onRoundEnd: (teamPointsThisRound: number) => void;
  onExitGame: () => void;
  gameMode: GameMode;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  currentTeam,
  settings,
  availableWords,
  onRoundEnd,
  onExitGame,
  gameMode,
}) => {
  const [shuffledWords, setShuffledWords] = useState<any[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReadyPhase, setIsReadyPhase] = useState(true);
  const [timeLeft, setTimeLeft] = useState(settings.roundTime);
  const [pointsThisRound, setPointsThisRound] = useState(0);
  
  // Point popups animation tracking
  const [popups, setPopups] = useState<{ id: number; value: string; type: 'plus' | 'minus' }[]>([]);
  const popupIdCounter = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter and shuffle items on mount
  useEffect(() => {
    const filtered = availableWords.filter(w => settings.selectedCategories.includes(w.category));
    // Fisher-Yates Shuffle
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledWords(shuffled);
  }, [availableWords, settings.selectedCategories]);

  // Timer logic - runs at 100ms interval for sub-second precision (useful for 9.5s)
  useEffect(() => {
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

  const handleStartRound = () => {
    playClick();
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
