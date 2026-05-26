import React from 'react';
import { Play, Database, Lock, Sparkles, Tv, Timer, Users } from 'lucide-react';
import { playClick } from '../utils/audio';
import { GameMode } from '../App';

interface DashboardProps {
  onStartGame: (game: GameMode) => void;
  onOpenDatabase: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartGame, onOpenDatabase }) => {
  const handleStartMarilyn = () => {
    playClick();
    onStartGame('MARYLIN_MONROE');
  };

  const handleStartNineSeconds = () => {
    playClick();
    onStartGame('NINE_SECONDS');
  };

  const handleStartReverseCharades = () => {
    playClick();
    onStartGame('REVERSE_CHARADES');
  };

  const handleStartPGame = () => {
    playClick();
    onStartGame('P_GAME');
  };

  const handleStartSpy = () => {
    playClick();
    onStartGame('SPY');
  };

  const handleDbClick = () => {
    playClick();
    onOpenDatabase();
  };

  const lockedGames = [
    { title: 'Koło Fortuny', desc: 'Kręć kołem, odgaduj hasła i zdobywaj nagrody.' },
    { title: 'Familiada', desc: 'Dwie drużyny odpowiadają na pytania zadane ankietowanym.' },
    { title: 'Awantura o Kasę', desc: 'Licytuj pytania i walcz o skrzynie z nagrodami.' }
  ];

  return (
    <div className="flex-container max-w-xl mx-auto fade-in" style={{ padding: '36px 12px', minHeight: '85vh', justifyContent: 'center' }}>
      {/* Hero Header */}
      <div className="flex-container" style={{ textAlign: 'center', marginBottom: '48px', position: 'relative' }}>
        <div className="floating" style={{ position: 'absolute', top: '-40px', color: 'rgba(249, 115, 22, 0.1)', zIndex: 0 }}>
          <Tv size={120} />
        </div>
        <div className="flex-row gap-xs items-center" style={{ marginBottom: '12px', position: 'relative', zIndex: 1 }}>
          <Sparkles className="text-gold" style={{ color: 'hsl(var(--secondary))', animation: 'pulse 2s infinite' }} size={20} />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', color: 'hsl(var(--secondary))', textTransform: 'uppercase' }}>
            Najlepsze Teleturnieje YT
          </span>
          <Sparkles className="text-gold" style={{ color: 'hsl(var(--secondary))', animation: 'pulse 2s infinite' }} size={20} />
        </div>
        <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.05, background: 'linear-gradient(135deg, #ff3c00 0%, #ff8c00 50%, #ffd700 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em', position: 'relative', zIndex: 1 }}>
          Fimma Show
        </h1>
        <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)', color: 'hsl(var(--text-secondary))', marginTop: '16px', maxWidth: '500px', fontWeight: 500, position: 'relative', zIndex: 1 }}>
          Zagraj ze znajomymi w gry inspirowane kultowym programem <span style={{ color: 'hsl(var(--primary))', fontWeight: 700 }}>Zero Presji</span>!
        </p>
      </div>

      {/* Tournament Banner / Card */}
      <div className="glass glass-interactive portal-card w-full" style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255, 60, 0, 0.08) 0%, rgba(255, 215, 0, 0.08) 100%)',
        border: '2px solid hsl(var(--primary))',
        boxShadow: '0 0 25px rgba(255, 60, 0, 0.2)',
        marginBottom: '32px',
        padding: '28px',
        minHeight: 'auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="badge-active" style={{
            background: 'linear-gradient(90deg, #ff3c00, #ffd700)',
            color: 'white',
            fontWeight: 900,
            letterSpacing: '0.1em',
            boxShadow: '0 4px 10px rgba(255, 60, 0, 0.3)'
          }}>
            TRYB TELETURNIEJU (POLECANY)
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'white', textTransform: 'uppercase', marginTop: '8px' }}>
            WIELKI SHOW: FIMMA SHOW
          </h2>
          <p style={{ fontSize: '13.5px', color: 'hsl(var(--text-secondary))', lineHeight: '1.6', maxWidth: '600px' }}>
            Rozegraj pełny turniej składający się z 3 rund eliminacyjnych (Marylin Monroe, 9,5 Sekundy, Odwrócone Kalambury) i weź udział w ekscytującym finale z wybuchową Bombą!
          </p>
        </div>
        <button
          onClick={() => {
            playClick();
            onStartGame('TOURNAMENT');
          }}
          className="btn btn-primary"
          style={{
            alignSelf: 'flex-start',
            marginTop: '20px',
            padding: '12px 28px',
            fontSize: '15px',
            background: 'linear-gradient(135deg, #ff3c00 0%, #ff8c00 50%, #ffd700 100%)',
            border: 'none',
            boxShadow: '0 6px 18px rgba(255, 60, 0, 0.3)',
          }}
        >
          <Play size={16} fill="currentColor" />
          ROZPOCZNIJ TELETURNIEJ
        </button>
      </div>

      {/* Game Selection Grid */}
      <div className="grid-layout grid-2 gap-lg w-full" style={{ marginBottom: '48px' }}>
        {/* Active Game: Marylin Monroe */}
        <div className="glass glass-interactive portal-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div>
            <div className="badge-active" style={{ marginBottom: '16px' }}>
              AKTYWNA GRA
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              Marylin Monroe
            </h3>
            <p style={{ fontSize: '13.5px', color: 'hsl(var(--text-secondary))', lineHeight: '1.6' }}>
              Kultowa gra w tabu. Opisuj postacie swojej drużynie unikając 3 słów zakazanych. Szybkość i spryt są kluczem do zwycięstwa!
            </p>
          </div>
          <button
            onClick={handleStartMarilyn}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '24px' }}
          >
            <Play size={16} fill="currentColor" />
            GRAJ TERAZ
          </button>
        </div>

        {/* Active Game: 9,5 Sekundy */}
        <div className="glass glass-interactive portal-card" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%)', border: '1px solid rgba(249, 115, 22, 0.15)' }}>
          <div>
            <div className="badge-active" style={{ marginBottom: '16px', background: 'linear-gradient(90deg, #ff3c00, #ff8c00)', color: 'white' }}>
              NOWA GRA
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              9,5 Sekundy
            </h3>
            <p style={{ fontSize: '13.5px', color: 'hsl(var(--text-secondary))', lineHeight: '1.6' }}>
              Masz tylko 9.5 sekundy, aby udzielić jak najwięcej poprawnych odpowiedzi na wylosowane pytanie. Presja czasu gwarantowana!
            </p>
          </div>
          <button
            onClick={handleStartNineSeconds}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '24px', background: 'linear-gradient(135deg, #ff3c00 0%, #ff8c00 100%)', border: 'none' }}
          >
            <Timer size={16} />
            GRAJ TERAZ
          </button>
        </div>

        {/* Active Game: Odwrócone Kalambury */}
        <div className="glass glass-interactive portal-card" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
          <div>
            <div className="badge-active" style={{ marginBottom: '16px', background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', color: 'white' }}>
              NOWA GRA
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              Odwrócone Kalambury
            </h3>
            <p style={{ fontSize: '13.5px', color: 'hsl(var(--text-secondary))', lineHeight: '1.6' }}>
              Pokazuj hasła-czynności partnerowi, nakazując mu wykonywanie pantomimy! Masz na to dwie minuty.
            </p>
          </div>
          <button
            onClick={handleStartReverseCharades}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '24px', background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', border: 'none' }}
          >
            <Users size={16} />
            GRAJ TERAZ
          </button>
        </div>

        {/* Active Game: Gra na P */}
        <div className="glass glass-interactive portal-card" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(234, 179, 8, 0.05) 100%)', border: '1px solid rgba(234, 179, 8, 0.15)' }}>
          <div>
            <div className="badge-active" style={{ marginBottom: '16px', background: 'linear-gradient(90deg, #ff3c00, #eab308)', color: 'white' }}>
              NOWA GRA
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              Gra na P
            </h3>
            <p style={{ fontSize: '13.5px', color: 'hsl(var(--text-secondary))', lineHeight: '1.6' }}>
              Odgadnij jak najwięcej haseł. Twój partner podpowiada Ci, używając wyłącznie słów zaczynających się na literę „P”!
            </p>
          </div>
          <button
            onClick={handleStartPGame}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '24px', background: 'linear-gradient(135deg, #ff3c00 0%, #eab308 100%)', border: 'none' }}
          >
            <Play size={16} fill="currentColor" />
            GRAJ TERAZ
          </button>
        </div>

        {/* Active Game: Szpieg */}
        <div className="glass glass-interactive portal-card" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(30, 30, 35, 0.5) 0%, rgba(10, 10, 10, 0.7) 100%)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div>
            <div className="badge-active" style={{ marginBottom: '16px', background: 'linear-gradient(90deg, #111111, #333333)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              NOWA GRA
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              Szpieg
            </h3>
            <p style={{ fontSize: '13.5px', color: 'hsl(var(--text-secondary))', lineHeight: '1.6' }}>
              Wszyscy gracze znają tę samą lokalizację, z wyjątkiem jednej osoby – Szpiega. Odpowiadajcie na pytania i zdemaskujcie szpiega!
            </p>
          </div>
          <button
            onClick={handleStartSpy}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '24px', background: 'linear-gradient(135deg, #222 0%, #000 100%)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Play size={16} fill="currentColor" />
            GRAJ TERAZ
          </button>
        </div>

        {/* Locked Games */}
        {lockedGames.map((game, index) => (
          <div 
            key={index} 
            className="glass portal-card"
            style={{ opacity: 0.5, border: '1px solid rgba(255, 255, 255, 0.03)' }}
          >
            <div>
              <div className="badge-locked" style={{ marginBottom: '16px' }}>
                <Lock size={12} /> WKRÓTCE
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'hsl(var(--text-secondary))', marginBottom: '8px' }}>
                {game.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'hsl(var(--text-muted))', lineHeight: '1.6' }}>
                {game.desc}
              </p>
            </div>
            <button
              disabled
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '24px', cursor: 'not-allowed' }}
            >
              ZABLOKOWANE
            </button>
          </div>
        ))}
      </div>

      {/* Database Admin Button */}
      <button
        onClick={handleDbClick}
        className="btn btn-secondary"
        style={{ padding: '12px 24px', borderRadius: '14px' }}
      >
        <Database size={16} style={{ color: 'hsl(var(--secondary))' }} />
        Zarządzaj Bazą Haseł
      </button>
    </div>
  );
};
