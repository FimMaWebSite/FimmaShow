import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Check, X, RotateCcw, AlertTriangle, HelpCircle } from 'lucide-react';

import { Team, GameSettings } from './GameSetup';
import { playClick, playCorrect, playWrong, playTick, playBuzzer, playExplosion } from '../utils/audio';
import { GameMode } from '../App';

interface GameBoardProps {
  currentTeam: Team;
  settings: GameSettings;
  availableWords: any[];
  onRoundEnd: (teamPointsThisRound: number, loserTeamId?: number, opponentPointsEarned?: number) => void;
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

  // Spy game state
  const [spyPlayerCount, setSpyPlayerCount] = useState(4);
  const [spyPhase, setSpyPhase] = useState<'SETUP' | 'REVEAL' | 'QUESTIONS' | 'VOTING' | 'RESULT'>('SETUP');
  const [revealPlayerIdx, setRevealPlayerIdx] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [spyIndex, setSpyIndex] = useState(-1);
  const [spyQuestions, setSpyQuestions] = useState<{ round1: string[]; round2: string[] }>({ round1: [], round2: [] });
  const [questionPlayerIdx, setQuestionPlayerIdx] = useState(0);
  const [spyRound, setSpyRound] = useState(1);
  const [votedPlayerIdx, setVotedPlayerIdx] = useState(-1);
  const [selectedLocation, setSelectedLocation] = useState('');

  // Filter and shuffle items on mount
  useEffect(() => {
    let filtered = availableWords;
    if (gameMode !== 'BOMB' && gameMode !== 'SPY' && settings.selectedCategories && settings.selectedCategories.length > 0) {
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
    
    // Move to next word/question ONLY IF NOT in 9.5 seconds
    if (gameMode !== 'NINE_SECONDS') {
      nextWord();
    }
  };

  const handleWrong = () => {
    if (!isPlaying) return;
    playWrong();
    setPointsThisRound(prev => prev - 1);
    triggerPopup('-1', 'minus');
    
    // Move to next word/question ONLY IF NOT in 9.5 seconds
    if (gameMode !== 'NINE_SECONDS') {
      nextWord();
    }
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

  const startSpyGame = () => {
    // Select location
    const location = shuffledWords.length > 0 ? shuffledWords[0].word : "Samolot";
    setSelectedLocation(location);

    // Select spy index
    const randomSpy = Math.floor(Math.random() * spyPlayerCount);
    setSpyIndex(randomSpy);

    // Select questions
    const localQuestions = localStorage.getItem('fimma_spy_questions');
    // Simple mock database questions if localStorage is not set yet
    const defaultQuestions = [
      { "question": "Jakie dźwięki najczęściej pojawiają się w tym miejscu?" },
      { "question": "Podaj 2 przykłady akcesoriów/przedmiotów w tym miejscu." },
      { "question": "Co ludzie najczęściej tam robią?" },
      { "question": "Jacy profesjonaliści tam pracują?" },
      { "question": "Jak się ubieramy, idąc w to miejsce?" },
      { "question": "Czy wstęp tam jest zazwyczaj płatny?" },
      { "question": "Jaka pogoda lub pora dnia sprzyja wizycie w tym miejscu?" },
      { "question": "Czego absolutnie nie wolno tam robić?" },
      { "question": "Jaki jest główny cel wizyty w tym miejscu?" },
      { "question": "Czy to miejsce jest zazwyczaj głośne czy ciche?" }
    ];
    const questionsDb = localQuestions ? JSON.parse(localQuestions) : defaultQuestions;
    const shuffledQ = [...questionsDb].sort(() => Math.random() - 0.5);
    
    // Assign questions for Round 1 and Round 2
    const round1Q = shuffledQ.slice(0, spyPlayerCount).map(q => q.question);
    const round2Q = shuffledQ.slice(spyPlayerCount, spyPlayerCount * 2).map(q => q.question);
    
    setSpyQuestions({
      round1: round1Q,
      round2: round2Q
    });

    setRevealPlayerIdx(0);
    setCardRevealed(false);
    setSpyPhase('REVEAL');
    setIsReadyPhase(false);
    setIsPlaying(true);
  };

  if (gameMode === 'SPY') {
    return (
      <div className="flex-container max-w-xl mx-auto fade-in" style={{ padding: '12px', minHeight: '85vh', justifyContent: 'space-between', position: 'relative' }}>
        <style>{`
          .spy-card-container {
            aspect-ratio: 16 / 10;
            width: 100%;
            max-width: 680px;
            background: linear-gradient(135deg, #1f1f23 0%, #111113 100%);
            border-radius: 40px;
            padding: 14px;
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border: 2px solid rgba(255,255,255,0.05);
          }

          .spy-card-inner {
            background: radial-gradient(circle, #2d2d35 0%, #151518 100%);
            border-radius: 30px;
            width: 100%;
            height: 100%;
            border: 4px solid #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 24px 32px;
            text-align: center;
            position: relative;
            box-shadow: inset 0 4px 15px rgba(0,0,0,0.4);
          }
          
          .spy-text-gold {
            background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}</style>

        {/* Header bar */}
        <div className="game-header-bar" style={{ borderColor: 'rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div className="game-header-team">
            <span style={{ fontSize: '12px', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              GRA: SZPIEG 🕵️‍♂️
            </span>
          </div>
          <div className="game-header-stats">
            <div className="stat-box">
              <span className="stat-label">Tura drużyny</span>
              <span className="stat-value" style={{ color: currentTeam.color }}>{currentTeam.name}</span>
            </div>
          </div>
        </div>

        {/* Setup Phase */}
        {spyPhase === 'SETUP' && (
          <div className="glass flex-col items-center" style={{ padding: '36px', textAlign: 'center', maxWidth: '500px', width: '100%', gap: '24px' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🕵️‍♂️</div>
            <div className="flex-col gap-xs">
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>LICZBA GRACZY</h3>
              <p style={{ fontSize: '13.5px', color: 'hsl(var(--text-secondary))' }}>
                Podaj liczbę graczy z drużyny <strong>{currentTeam.name}</strong>, którzy wezmą udział w tej rozgrywce.
              </p>
            </div>
            
            <div className="flex-row gap-md items-center" style={{ margin: '10px 0' }}>
              <button
                onClick={() => { playClick(); setSpyPlayerCount(prev => Math.max(3, prev - 1)); }}
                className="btn btn-secondary"
                style={{ padding: '16px', borderRadius: '50%', width: '56px', height: '56px', fontSize: '20px' }}
              >
                -
              </button>
              <span style={{ fontSize: '32px', fontWeight: 900, color: 'white', minWidth: '60px' }}>{spyPlayerCount}</span>
              <button
                onClick={() => { playClick(); setSpyPlayerCount(prev => Math.min(10, prev + 1)); }}
                className="btn btn-secondary"
                style={{ padding: '16px', borderRadius: '50%', width: '56px', height: '56px', fontSize: '20px' }}
              >
                +
              </button>
            </div>

            <button
              onClick={() => { playClick(); startSpyGame(); }}
              className="btn btn-primary w-full"
              style={{ padding: '16px', fontSize: '16px', background: 'linear-gradient(135deg, #333 0%, #111 100%)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              ROZPOCZNIJ ROZDAWANIE RÓL
            </button>
          </div>
        )}

        {/* Reveal Roles Phase */}
        {spyPhase === 'REVEAL' && (
          <div className="flex-container w-full" style={{ flexGrow: 1, justifyContent: 'center', margin: '20px 0' }}>
            <div className="spy-card-container">
              <div className="spy-card-inner">
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  KROK {revealPlayerIdx + 1} Z {spyPlayerCount}
                </span>

                {!cardRevealed ? (
                  <>
                    <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'white', marginBottom: '8px' }}>
                      GRACZ {revealPlayerIdx + 1}
                    </h2>
                    <p style={{ fontSize: '13.5px', color: 'hsl(var(--text-secondary))', marginBottom: '24px', maxWidth: '300px' }}>
                      Weź telefon i kliknij przycisk abaixo, aby potajemnie sprawdzić swoją rolę.
                    </p>
                    <button
                      onClick={() => { playClick(); setCardRevealed(true); }}
                      className="btn btn-primary"
                      style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #555 0%, #222 100%)', border: 'none' }}
                    >
                      POKAŻ MOJĄ KARTĘ
                    </button>
                  </>
                ) : (
                  <>
                    <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'hsl(var(--secondary))', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      TWOJA ROLA TO:
                    </h4>
                    
                    {revealPlayerIdx === spyIndex ? (
                      <h2 className="spy-text-gold" style={{ fontSize: '42px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                        🕵️‍♂️ SZPIEG
                      </h2>
                    ) : (
                      <h2 style={{ fontSize: '42px', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                        {selectedLocation}
                      </h2>
                    )}

                    <p style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', marginBottom: '24px', maxWidth: '360px' }}>
                      {revealPlayerIdx === spyIndex 
                        ? 'Nie znasz lokalizacji. Musisz słuchać innych i udawać, że wiesz o jakie miejsce chodzi!' 
                        : 'Zapamiętaj to miejsce i nie pokazuj go nikomu. Odpowiadaj sprytnie na pytania.'}
                    </p>

                    <button
                      onClick={() => {
                        playClick();
                        if (revealPlayerIdx < spyPlayerCount - 1) {
                          setRevealPlayerIdx(prev => prev + 1);
                          setCardRevealed(false);
                        } else {
                          // All players checked roles, advance to questions
                          setQuestionPlayerIdx(0);
                          setSpyRound(1);
                          setSpyPhase('QUESTIONS');
                        }
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '14px 28px' }}
                    >
                      UKRYJ I PRZEKAŻ GRACZOWI {revealPlayerIdx + 2}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Questions Phase */}
        {spyPhase === 'QUESTIONS' && (
          <div className="flex-container w-full" style={{ flexGrow: 1, justifyContent: 'center', margin: '20px 0', gap: '20px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '10px 24px',
              borderRadius: '12px',
              fontWeight: 800,
              color: 'white',
              fontSize: '15px'
            }}>
              RUNDA PYTAŃ: {spyRound} Z 2
            </div>

            <div className="spy-card-container">
              <div className="spy-card-inner">
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'hsl(var(--secondary))', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  PYTANIE DLA GRACZA {questionPlayerIdx + 1}
                </span>

                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                    fontWeight: 800,
                    color: 'white',
                    lineHeight: 1.4,
                    maxWidth: '520px'
                  }}>
                    {spyRound === 1 
                      ? spyQuestions.round1[questionPlayerIdx] 
                      : spyQuestions.round2[questionPlayerIdx]}
                  </p>
                </div>

                <div style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', marginTop: '16px' }}>
                  Odpowiedz głośno na to pytanie!
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playClick();
                if (questionPlayerIdx < spyPlayerCount - 1) {
                  setQuestionPlayerIdx(prev => prev + 1);
                } else {
                  // All players answered in this round
                  if (spyRound === 1) {
                    setSpyRound(2);
                    setQuestionPlayerIdx(0);
                  } else {
                    // Completed both rounds, go to voting
                    setSpyPhase('VOTING');
                  }
                }
              }}
              className="btn btn-primary"
              style={{ width: '100%', maxWidth: '400px', padding: '16px', background: 'linear-gradient(135deg, #444 0%, #222 100%)', border: 'none' }}
            >
              NASTĘPNE PYTANIE
            </button>
          </div>
        )}

        {/* Voting Phase */}
        {spyPhase === 'VOTING' && (
          <div className="glass flex-col items-center" style={{ padding: '32px', maxWidth: '550px', width: '100%', gap: '20px' }}>
            <div style={{ fontSize: '32px' }}>🕵️‍♂️</div>
            <div className="flex-col gap-xs" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white' }}>TYPOWANIE SZPIEGA</h3>
              <p style={{ fontSize: '13.5px', color: 'hsl(var(--text-secondary))' }}>
                Przedyskutujcie odpowiedzi. Kto Waszym zdaniem jest szpiegiem? Kliknij na wybranego gracza, aby sprawdzić wynik.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', width: '100%', marginTop: '12px' }}>
              {Array.from({ length: spyPlayerCount }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playClick();
                    setVotedPlayerIdx(idx);
                    setSpyPhase('RESULT');
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '16px', fontSize: '14px', borderRadius: '12px' }}
                >
                  Gracz {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Phase */}
        {spyPhase === 'RESULT' && (
          <div className="glass flex-col items-center" style={{ padding: '36px', textAlign: 'center', maxWidth: '500px', width: '100%', gap: '24px' }}>
            {votedPlayerIdx === spyIndex ? (
              <>
                <div style={{ fontSize: '64px', animation: 'bounce 0.5s infinite' }}>🎯</div>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#10b981', textTransform: 'uppercase' }}>
                  TRAFIONY!
                </h2>
                <p style={{ fontSize: '14px', color: 'hsl(var(--text-secondary))' }}>
                  Szpiegiem był rzeczywiście <strong>Gracz {spyIndex + 1}</strong>! Lokalizacja to: <strong>{selectedLocation}</strong>.
                </p>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '2.5px solid #10b981', borderRadius: '16px', padding: '12px 36px', color: 'white', fontWeight: 900, fontSize: '20px' }}>
                  +5 PUNKTÓW DLA {currentTeam.name.toUpperCase()}!
                </div>
                
                <button
                  onClick={() => {
                    playClick();
                    onRoundEnd(5, undefined, 0); // +5 for current team, 0 for opponent
                  }}
                  className="btn btn-primary w-full"
                  style={{ marginTop: '12px', padding: '16px' }}
                >
                  ZAKOŃCZ TURĘ
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '64px' }}>❌</div>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#ef4444', textTransform: 'uppercase' }}>
                  PUDŁO!
                </h2>
                <p style={{ fontSize: '14px', color: 'hsl(var(--text-secondary))' }}>
                  Wytypowaliście Gracza {votedPlayerIdx + 1}. <br/>
                  Prawdziwym szpiegiem był <strong>Gracz {spyIndex + 1}</strong>! Lokalizacja to: <strong>{selectedLocation}</strong>.
                </p>
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '2.5px solid #ef4444', borderRadius: '16px', padding: '12px 36px', color: 'white', fontWeight: 900, fontSize: '16px', lineHeight: 1.4 }}>
                  +5 PUNKTÓW DLA DRUGIEJ DRUŻYNY!
                </div>

                <button
                  onClick={() => {
                    playClick();
                    onRoundEnd(0, undefined, 5); // 0 for current team, +5 for opponent
                  }}
                  className="btn btn-primary w-full"
                  style={{ marginTop: '12px', padding: '16px' }}
                >
                  ZAKOŃCZ TURĘ
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

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
                  : gameMode === 'P_GAME'
                  ? 'Będziesz opisywać hasło swojej drużynie używając WYŁĄCZNIE słów zaczynających się na literę P! Inni członkowie drużyny nie patrzą na ekran!'
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
              <div className="zero-presji-card-container" style={
                gameMode === 'REVERSE_CHARADES' 
                  ? { background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f43f5e 100%)', boxShadow: '0 20px 50px rgba(139, 92, 246, 0.3)' } 
                  : gameMode === 'P_GAME'
                  ? { background: 'linear-gradient(135deg, #ff0000 0%, #ff8c00 50%, #eab308 100%)', boxShadow: '0 20px 50px rgba(255, 60, 0, 0.35)' }
                  : undefined
              }>
                <div className="zero-presji-card-inner" style={
                  gameMode === 'REVERSE_CHARADES' 
                    ? { background: 'radial-gradient(circle, #fbf7ff 0%, #f3e8ff 60%, #e9d5ff 100%)', borderColor: '#4c1d95' } 
                    : gameMode === 'P_GAME'
                    ? { background: 'radial-gradient(circle, #ffe6e6 0%, #fff2e6 60%, #fffce6 100%)', borderColor: '#d31010' }
                    : undefined
                }>
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
                  ) : gameMode === 'P_GAME' ? (
                    <>
                      {/* Gra na P Title styling */}
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.4rem, 3.2vw, 2.5rem)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: '#d31010',
                        marginBottom: '16px',
                        letterSpacing: '0.05em',
                        borderBottom: '3px dashed rgba(211, 16, 16, 0.25)',
                        paddingBottom: '8px',
                        width: '100%',
                        maxWidth: '450px'
                      }}>
                        Gra na P
                      </div>

                      {/* Prompt */}
                      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
                        <h2 className="zero-presji-card-title" style={{ color: '#ffffff', filter: 'drop-shadow(0px 6px 6px rgba(0,0,0,0.2))' }}>
                          {currentWord.word}
                        </h2>
                      </div>
                      
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#d31010',
                        background: 'rgba(211, 16, 16, 0.08)',
                        border: '1px dashed rgba(211, 16, 16, 0.3)',
                        borderRadius: '10px',
                        padding: '6px 12px',
                        marginTop: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Podpowiadaj tylko słowami na literę P!
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
                  {gameMode === 'MARYLIN_MONROE' ? 'Brak haseł' : gameMode === 'NINE_SECONDS' ? 'Brak pytań' : gameMode === 'P_GAME' ? 'Brak haseł' : 'Brak czynności'} w wybranej kategorii!
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
