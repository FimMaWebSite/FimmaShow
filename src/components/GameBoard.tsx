import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Check, X, RotateCcw, AlertTriangle, HelpCircle } from 'lucide-react';
import { WordData } from './DatabaseEditor';
import { Team, GameSettings } from './GameSetup';
import { playClick, playCorrect, playWrong, playTick, playBuzzer } from '../utils/audio';

interface GameBoardProps {
  currentTeam: Team;
  settings: GameSettings;
  availableWords: WordData[];
  onRoundEnd: (teamPointsThisRound: number) => void;
  onExitGame: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  currentTeam,
  settings,
  availableWords,
  onRoundEnd,
  onExitGame,
}) => {
  const [shuffledWords, setShuffledWords] = useState<WordData[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReadyPhase, setIsReadyPhase] = useState(true);
  const [timeLeft, setTimeLeft] = useState(settings.roundTime);
  const [pointsThisRound, setPointsThisRound] = useState(0);
  
  // Point popups animation tracking
  const [popups, setPopups] = useState<{ id: number; value: string; type: 'plus' | 'minus' }[]>([]);
  const popupIdCounter = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter and shuffle words on mount
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

  // Timer logic
  useEffect(() => {
    if (isPlaying && !isReadyPhase) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            playBuzzer();
            // Automatically complete the round after a short delay
            setTimeout(() => {
              onRoundEnd(pointsThisRound);
            }, 1500);
            return 0;
          }
          // Tick sound in the final 10 seconds
          if (prev <= 10) {
            playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isReadyPhase, pointsThisRound, onRoundEnd]);

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
    
    // Move to next word
    nextWord();
  };

  const handleWrong = () => {
    if (!isPlaying) return;
    playWrong();
    setPointsThisRound(prev => prev - 1);
    triggerPopup('-1', 'minus');
    
    // Move to next word
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
                Oddaj telefon/urządzenie osobie, która będzie opisywać hasło. Inni członkowie drużyny nie mogą patrzeć na ekran!
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
              <div className="zero-presji-card-container">
                <div className="zero-presji-card-inner">
                  {/* Word title */}
                  <h2 className="zero-presji-card-title">{currentWord.word}</h2>
                  
                  {/* Forbidden words container */}
                  <div className="taboo-container">
                    <span className="taboo-header">
                      Słowa Zakazane
                    </span>
                    <div className="taboo-words-list">
                      {currentWord.forbidden.map((fw, idx) => (
                        <div
                          key={idx}
                          className="taboo-word-item"
                        >
                          {fw}
                        </div>
                      ))}
                    </div>
                  </div>

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
                <span>Brak haseł w wybranej kategorii!</span>
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
                  stroke={timeLeft <= 10 ? '#ef4444' : '#f97316'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="transparent"
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.2s' }}
                />
              </svg>
              <div className={`timer-text-overlay ${timeLeft <= 10 ? 'text-danger timer-danger' : 'text-light'}`} style={{ color: timeLeft <= 10 ? '#ef4444' : 'white' }}>
                {timeLeft}
              </div>
            </div>
            <div className="flex-col">
              <span className="stat-label">Pozostały Czas</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>
                {!isPlaying ? 'Gra wstrzymana' : timeLeft <= 10 ? 'Ostatnie sekundy!' : 'Czas ucieka!'}
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
              BŁĄD (-1)
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
