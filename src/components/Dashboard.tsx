import React, { useState } from 'react';
import { Play, Database, Sparkles, Tv } from 'lucide-react';
import { playClick } from '../utils/audio';
import { GameMode } from '../App';
import { Language, getTranslation } from '../data/translations';

import logoMarilyn from '../assets/logo_marilyn.png';
import logoNinesec from '../assets/logo_ninesec.png';
import logoReverse from '../assets/logo_reverse.png';
import logoPgame from '../assets/logo_pgame.png';
import logoSpy from '../assets/logo_spy.png';
import logoLips from '../assets/logo_lips.png';
import logoRevolver from '../assets/logo_revolver.png';
import logoWavelength from '../assets/logo_wavelength.png';

interface DashboardProps {
  onStartGame: (game: GameMode) => void;
  onOpenDatabase: () => void;
  language: Language;
  onSetLanguage: (lang: Language) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartGame, onOpenDatabase, language, onSetLanguage }) => {
  const [showRoadmap, setShowRoadmap] = useState(false);

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

  const handleStartLips = () => {
    playClick();
    onStartGame('LIPS');
  };

  const handleStartRevolver = () => {
    playClick();
    onStartGame('REVOLVER');
  };

  const handleStartWavelength = () => {
    playClick();
    onStartGame('WAVELENGTH');
  };

  const handleDbClick = () => {
    playClick();
    onOpenDatabase();
  };

  return (
    <div className="flex-container max-w-xl mx-auto fade-in" style={{ padding: '36px 12px', minHeight: '85vh', justifyContent: 'center' }}>
      {/* Hero Header */}
      <div className="flex-container" style={{ textAlign: 'center', marginBottom: '32px', position: 'relative' }}>
        <div className="floating" style={{ position: 'absolute', top: '-40px', color: 'rgba(249, 115, 22, 0.1)', zIndex: 0 }}>
          <Tv size={120} />
        </div>
        <div className="flex-row gap-xs items-center" style={{ marginBottom: '12px', position: 'relative', zIndex: 1 }}>
          <Sparkles className="text-gold" style={{ color: 'hsl(var(--secondary))', animation: 'pulse 2s infinite' }} size={20} />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', color: 'hsl(var(--secondary))', textTransform: 'uppercase' }}>
            {getTranslation('heroBadge', language)}
          </span>
          <Sparkles className="text-gold" style={{ color: 'hsl(var(--secondary))', animation: 'pulse 2s infinite' }} size={20} />
        </div>
        <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.05, background: 'linear-gradient(135deg, #ff3c00 0%, #ff8c00 50%, #ffd700 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em', position: 'relative', zIndex: 1 }}>
          FimmaShow
        </h1>
        <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginTop: '6px', zIndex: 1 }}>
          {getTranslation('partyGame', language)}
        </div>
        <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)', color: 'hsl(var(--text-secondary))', marginTop: '16px', maxWidth: '500px', fontWeight: 500, position: 'relative', zIndex: 1 }}>
          {getTranslation('heroDesc', language)}
        </p>
      </div>

      {/* Dashboard Language Bar */}
      <div className="dashboard-lang-bar fade-in" style={{ marginBottom: '40px', zIndex: 1 }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {getTranslation('selectLanguage', language)}
        </span>
        <div className="lang-switcher-container" style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => { playClick(); onSetLanguage('PL'); }}
            className={`lang-btn ${language === 'PL' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <span className="flag" style={{ fontSize: '14px', marginRight: '4px' }}>🇵🇱</span>
            <span>PL</span>
          </button>
          <button
            onClick={() => { playClick(); onSetLanguage('EN'); }}
            className={`lang-btn ${language === 'EN' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <span className="flag" style={{ fontSize: '14px', marginRight: '4px' }}>🇬🇧</span>
            <span>EN</span>
          </button>
          <button
            onClick={() => { playClick(); onSetLanguage('DE'); }}
            className={`lang-btn ${language === 'DE' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <span className="flag" style={{ fontSize: '14px', marginRight: '4px' }}>🇩🇪</span>
            <span>DE</span>
          </button>
          <button
            onClick={() => { playClick(); onSetLanguage('ES'); }}
            className={`lang-btn ${language === 'ES' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <span className="flag" style={{ fontSize: '14px', marginRight: '4px' }}>🇪🇸</span>
            <span>ES</span>
          </button>
          <button
            onClick={() => { playClick(); onSetLanguage('FR'); }}
            className={`lang-btn ${language === 'FR' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <span className="flag" style={{ fontSize: '14px', marginRight: '4px' }}>🇫🇷</span>
            <span>FR</span>
          </button>
          <button
            onClick={() => { playClick(); onSetLanguage('IT'); }}
            className={`lang-btn ${language === 'IT' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <span className="flag" style={{ fontSize: '14px', marginRight: '4px' }}>🇮🇹</span>
            <span>IT</span>
          </button>
        </div>
      </div>

      {/* Tournament Banner / Card */}
      <div className="portal-card card-tournament w-full" style={{
        padding: '28px',
        minHeight: 'auto',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="badge-active" style={{
            background: 'linear-gradient(90deg, #ff3c00, #ffd700)',
            color: 'white',
            fontWeight: 900,
            letterSpacing: '0.1em',
            boxShadow: '0 4px 10px rgba(255, 60, 0, 0.3)'
          }}>
            {getTranslation('tournamentBadge', language)}
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'white', textTransform: 'uppercase', marginTop: '8px' }}>
            {getTranslation('tournamentTitle', language)}
          </h2>
          <p style={{ fontSize: '13.5px', color: 'hsl(var(--text-secondary))', lineHeight: '1.6', maxWidth: '600px' }}>
            {getTranslation('tournamentDesc', language)}
          </p>
        </div>
        <button
          onClick={() => {
            playClick();
            onStartGame('TOURNAMENT');
          }}
          className="btn-tournament"
          style={{
            alignSelf: 'flex-start',
            marginTop: '20px'
          }}
        >
          <Play size={16} fill="currentColor" />
          {getTranslation('startTournament', language)}
        </button>
      </div>

      {/* Game Selection Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '12px', 
          width: '100%',
          marginBottom: '48px' 
        }}
      >
        {/* Tile: Marylin Monroe */}
        <div 
          onClick={handleStartMarilyn} 
          className="game-tile tile-marilyn" 
          style={{ padding: 0, position: 'relative', overflow: 'hidden' }}
        >
          <img 
            src={logoMarilyn} 
            alt="Marilyn" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} 
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
            zIndex: 1
          }} />
          <span className="tile-badge" style={{ zIndex: 2, top: '10px', right: '10px' }}>{getTranslation('activeGame', language)}</span>
          <span className="tile-title" style={{ zIndex: 2, position: 'absolute', bottom: '12px', left: '8px', right: '8px', textAlign: 'center', fontSize: '13.5px', fontWeight: 800 }}>
            {getTranslation('marilynTitle', language)}
          </span>
        </div>

        {/* Tile: 9,5 Sekundy */}
        <div 
          onClick={handleStartNineSeconds} 
          className="game-tile tile-nine-sec" 
          style={{ padding: 0, position: 'relative', overflow: 'hidden' }}
        >
          <img 
            src={logoNinesec} 
            alt="9.5s" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} 
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
            zIndex: 1
          }} />
          <span className="tile-badge" style={{ zIndex: 2, top: '10px', right: '10px' }}>{getTranslation('newGame', language)}</span>
          <span className="tile-title" style={{ zIndex: 2, position: 'absolute', bottom: '12px', left: '8px', right: '8px', textAlign: 'center', fontSize: '13.5px', fontWeight: 800 }}>
            {getTranslation('nineSecTitle', language)}
          </span>
        </div>

        {/* Tile: Odwrócone Kalambury */}
        <div 
          onClick={handleStartReverseCharades} 
          className="game-tile tile-reverse" 
          style={{ padding: 0, position: 'relative', overflow: 'hidden' }}
        >
          <img 
            src={logoReverse} 
            alt="Reverse" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} 
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
            zIndex: 1
          }} />
          <span className="tile-badge" style={{ zIndex: 2, top: '10px', right: '10px' }}>{getTranslation('newGame', language)}</span>
          <span className="tile-title" style={{ zIndex: 2, position: 'absolute', bottom: '12px', left: '8px', right: '8px', textAlign: 'center', fontSize: '13.5px', fontWeight: 800 }}>
            {getTranslation('reverseCharadesTitle', language)}
          </span>
        </div>

        {/* Tile: Gra na P */}
        <div 
          onClick={handleStartPGame} 
          className="game-tile tile-pgame" 
          style={{ padding: 0, position: 'relative', overflow: 'hidden' }}
        >
          <img 
            src={logoPgame} 
            alt="P Game" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} 
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
            zIndex: 1
          }} />
          <span className="tile-badge" style={{ zIndex: 2, top: '10px', right: '10px' }}>{getTranslation('newGame', language)}</span>
          <span className="tile-title" style={{ zIndex: 2, position: 'absolute', bottom: '12px', left: '8px', right: '8px', textAlign: 'center', fontSize: '13.5px', fontWeight: 800 }}>
            {getTranslation('pGameTitle', language)}
          </span>
        </div>

        {/* Tile: Szpieg */}
        <div 
          onClick={handleStartSpy} 
          className="game-tile tile-spy" 
          style={{ padding: 0, position: 'relative', overflow: 'hidden' }}
        >
          <img 
            src={logoSpy} 
            alt="Spy" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} 
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
            zIndex: 1
          }} />
          <span className="tile-badge" style={{ zIndex: 2, top: '10px', right: '10px' }}>{getTranslation('newGame', language)}</span>
          <span className="tile-title" style={{ zIndex: 2, position: 'absolute', bottom: '12px', left: '8px', right: '8px', textAlign: 'center', fontSize: '13.5px', fontWeight: 800 }}>
            {getTranslation('spyTitle', language)}
          </span>
        </div>

        {/* Tile: Usta Usta */}
        <div 
          onClick={handleStartLips} 
          className="game-tile tile-lips" 
          style={{ padding: 0, position: 'relative', overflow: 'hidden' }}
        >
          <img 
            src={logoLips} 
            alt="Lips" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} 
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
            zIndex: 1
          }} />
          <span className="tile-badge" style={{ zIndex: 2, top: '10px', right: '10px' }}>{getTranslation('newGame', language)}</span>
          <span className="tile-title" style={{ zIndex: 2, position: 'absolute', bottom: '12px', left: '8px', right: '8px', textAlign: 'center', fontSize: '13.5px', fontWeight: 800 }}>
            {getTranslation('lipsTitle', language)}
          </span>
        </div>

        {/* Tile: Rewolwer */}
        <div 
          onClick={handleStartRevolver} 
          className="game-tile tile-revolver" 
          style={{ padding: 0, position: 'relative', overflow: 'hidden' }}
        >
          <img 
            src={logoRevolver} 
            alt="Revolver" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} 
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
            zIndex: 1
          }} />
          <span className="tile-badge" style={{ zIndex: 2, top: '10px', right: '10px' }}>{getTranslation('newGame', language)}</span>
          <span className="tile-title" style={{ zIndex: 2, position: 'absolute', bottom: '12px', left: '8px', right: '8px', textAlign: 'center', fontSize: '13.5px', fontWeight: 800 }}>
            {getTranslation('revolverTitle', language)}
          </span>
        </div>

        {/* Tile: Wavelength */}
        <div 
          onClick={handleStartWavelength} 
          className="game-tile tile-wavelength" 
          style={{ padding: 0, position: 'relative', overflow: 'hidden' }}
        >
          <img 
            src={logoWavelength} 
            alt="Wavelength" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} 
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
            zIndex: 1
          }} />
          <span className="tile-badge" style={{ zIndex: 2, top: '10px', right: '10px' }}>{getTranslation('newGame', language)}</span>
          <span className="tile-title" style={{ zIndex: 2, position: 'absolute', bottom: '12px', left: '8px', right: '8px', textAlign: 'center', fontSize: '13.5px', fontWeight: 800 }}>
            {getTranslation('wavelengthTitle', language)}
          </span>
        </div>
      </div>

      {/* Roadmap Collapsible Card */}
      <div 
        className="glass" 
        style={{ 
          width: '100%', 
          borderRadius: '20px', 
          padding: '16px 20px', 
          marginBottom: '20px', 
          border: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'left'
        }}
      >
        <div 
          onClick={() => { playClick(); setShowRoadmap(!showRoadmap); }}
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer',
            fontWeight: 800,
            color: 'white',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} style={{ color: 'hsl(var(--secondary))' }} />
            {language === 'PL' ? 'Plan na wersję 1.5 🚀' : 'Plan for version 1.5 🚀'}
          </span>
          <span style={{ fontSize: '11px', opacity: 0.6 }}>{showRoadmap ? '▲' : '▼'}</span>
        </div>

        {showRoadmap && (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
            {language === 'PL' ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'hsl(var(--secondary))' }}>🔊 Dźwięk i wibracje (Audio & Haptics)</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
                    Dodanie haptycznych wibracji podczas fizycznego kręcenia pokrętłem w Wavelength oraz głośniejszych efektów dźwiękowych przy wybuchu Bomby i poprawnych odpowiedziach. Opcjonalna, klimatyczna muzyka w tle podczas tury.
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'hsl(var(--secondary))' }}>🎮 Nowe tryby gier</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
                    <strong>Mind Meld (Złączenie umysłów):</strong> Bardzo popularna, kooperacyjna gra imprezowa, w której para graczy na "trzy-cztery" wypowiada słowo i próbuje zbliżyć swoje skojarzenia, aż wypowiedzą dokładnie to samo słowo.<br />
                    <strong>Kto to powiedział? (Cytaty / Fakty):</strong> Quiz z zabawnymi historiami i cytatami wprowadzonymi przez graczy o sobie nawzajem.
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'hsl(var(--secondary))' }}>📊 Statystyki i Tytuły</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
                    Zapisywanie wyników poprzednich gier w pamięci urządzenia. Przyznawanie humorystycznych nagród i tytułów na ekranie podsumowania (np. "Najszybszy rewolwerowiec", "Sprytny Szpieg").
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'hsl(var(--secondary))' }}>☁️ Własne hasła w chmurze (Cloud Decks)</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
                    Tworzenie własnych talii haseł przez graczy i pobieranie ich na inne telefony za pomocą prostego kodu PIN (np. hasła urodzinowe).
                  </span>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'hsl(var(--secondary))' }}>🔊 Audio & Haptics</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
                    Adding haptic vibrations during Wavelength dial turning, louder sound effects for Bomb explosions and correct answers, and optional ambient background music during turns.
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'hsl(var(--secondary))' }}>🎮 New Game Modes</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
                    <strong>Mind Meld:</strong> Cooperative game where two players say a word on 3-2-1 and try to match skojarzenia until they say the exact same word.<br />
                    <strong>Who Said That? (Quotes / Facts):</strong> Quiz with funny stories and quotes entered by players about each other.
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'hsl(var(--secondary))' }}>📊 Stats & Titles</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
                    Saving history of previous games in device memory and awarding funny titles on the summary screen (e.g., "Fastest Gun", "Sly Spy").
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'hsl(var(--secondary))' }}>☁️ Custom Cloud Decks</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
                    Allowing players to create custom word decks and share/download them on other phones via a simple PIN code (e.g. birthday words).
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Database Admin Button */}
      <button
        onClick={handleDbClick}
        className="btn btn-secondary"
        style={{ padding: '12px 24px', borderRadius: '14px' }}
      >
        <Database size={16} style={{ color: 'hsl(var(--secondary))' }} />
        {getTranslation('dbEditor', language)}
      </button>
    </div>
  );
};
