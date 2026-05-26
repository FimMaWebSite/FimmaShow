import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Settings, Plus, Minus, Check } from 'lucide-react';
import { playClick, playWrong } from '../utils/audio';
import { GameMode } from '../App';

import { DEFAULT_WORDS, DEFAULT_NINE_SECONDS, DEFAULT_REVERSE_CHARADES, DEFAULT_P_GAME, DEFAULT_LIPS_WORDS } from '../data/defaultData';

export interface Team {
  id: number;
  name: string;
  color: string;
  points: number;
}

export interface GameSettings {
  roundTime: number;
  pointsToWin: number;
  selectedCategories: string[];
}

interface GameSetupProps {
  onBack: () => void;
  onStart: (teams: Team[], settings: GameSettings) => void;
  gameMode: GameMode;
}

const PRESET_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow/Gold
  '#06b6d4', // Cyan
  '#10b981', // Emerald Green
  '#8b5cf6', // Violet
];

export const GameSetup: React.FC<GameSetupProps> = ({ onBack, onStart, gameMode }) => {
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: 'Drużyna A', color: '#f97316', points: 0 },
    { id: 2, name: 'Drużyna B', color: '#eab308', points: 0 }
  ]);

  const [roundTime, setRoundTime] = useState(
    gameMode === 'NINE_SECONDS' ? 9.5 : gameMode === 'REVERSE_CHARADES' ? 120 : 60
  );
  const [pointsToWin, setPointsToWin] = useState(15);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch available categories from server
  useEffect(() => {
    const fetchCategories = async () => {
      let endpoint = '/api/words';
      let localKey = 'fimma_words';
      let defaultBackup: any[] = DEFAULT_WORDS;

      if (gameMode === 'NINE_SECONDS') {
        endpoint = '/api/nine-seconds';
        localKey = 'fimma_nine_seconds';
        defaultBackup = DEFAULT_NINE_SECONDS;
      } else if (gameMode === 'REVERSE_CHARADES') {
        endpoint = '/api/reverse-charades';
        localKey = 'fimma_reverse_charades';
        defaultBackup = DEFAULT_REVERSE_CHARADES;
      } else if (gameMode === 'P_GAME') {
        endpoint = '/api/p-game';
        localKey = 'fimma_p_game';
        defaultBackup = DEFAULT_P_GAME;
      } else if (gameMode === 'LIPS') {
        endpoint = '/api/lips-words';
        localKey = 'fimma_lips_words';
        defaultBackup = DEFAULT_LIPS_WORDS;
      }

      try {
        const res = await fetch(endpoint);
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          const cats = Array.from(new Set(data.map((w: any) => w.category))) as string[];
          setCategories(cats);
          setSelectedCategories(cats); // Default: Select all
          localStorage.setItem(localKey, JSON.stringify(data));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('API error in setup categories, using localStorage:', err);
      }

      // Fallback to local storage
      const localData = localStorage.getItem(localKey);
      const data = localData ? JSON.parse(localData) : defaultBackup;
      const cats = Array.from(new Set(data.map((w: any) => w.category))) as string[];
      setCategories(cats);
      setSelectedCategories(cats);
      setLoading(false);
    };
    fetchCategories();
  }, [gameMode]);

  const handleBackClick = () => {
    playClick();
    onBack();
  };

  const addTeam = () => {
    if (teams.length >= 6) {
      playWrong();
      return;
    }
    playClick();
    const nextId = teams.length + 1;
    const newTeam: Team = {
      id: nextId,
      name: `Drużyna ${String.fromCharCode(64 + nextId)}`,
      color: PRESET_COLORS[nextId - 1] || PRESET_COLORS[0],
      points: 0
    };
    setTeams([...teams, newTeam]);
  };

  const removeTeam = () => {
    if (teams.length <= 2) {
      playWrong();
      return;
    }
    playClick();
    setTeams(teams.slice(0, -1));
  };

  const updateTeamName = (index: number, name: string) => {
    const updated = [...teams];
    updated[index].name = name;
    setTeams(updated);
  };

  const updateTeamColor = (index: number, color: string) => {
    playClick();
    const updated = [...teams];
    updated[index].color = color;
    setTeams(updated);
  };

  const toggleCategory = (cat: string) => {
    playClick();
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length === 1) {
        playWrong(); // Must select at least one
        return;
      }
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleStartGame = () => {
    if (gameMode !== 'TOURNAMENT' && gameMode !== 'SPY' && gameMode !== 'LIPS' && gameMode !== 'REVOLVER' && selectedCategories.length === 0) {
      playWrong();
      alert('Wybierz przynajmniej jedną kategorię haseł.');
      return;
    }
    playClick();
    onStart(teams, { 
      roundTime: gameMode === 'TOURNAMENT' ? 60 : roundTime, 
      pointsToWin: gameMode === 'TOURNAMENT' ? 9999 : gameMode === 'SPY' ? 15 : pointsToWin, 
      selectedCategories: gameMode === 'TOURNAMENT' || gameMode === 'SPY' || gameMode === 'LIPS' || gameMode === 'REVOLVER' ? [] : selectedCategories 
    });
  };

  return (
    <div className="flex-container max-w-lg mx-auto fade-in" style={{ padding: '16px 0' }}>
      <button
        onClick={handleBackClick}
        className="btn btn-secondary"
        style={{ alignSelf: 'flex-start', marginBottom: '24px', padding: '8px 16px', fontSize: '13px', borderRadius: '12px' }}
      >
        <ArrowLeft size={16} />
        Anuluj
      </button>

      <h2 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', color: 'white', marginBottom: '32px', textAlign: 'center' }}>
        Konfiguracja Gry
      </h2>

      <div className="setup-grid">
        {/* Left Card: Team Configuration */}
        <div className="glass flex-col gap-md">
          <div className="setup-box-header">
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} style={{ color: 'hsl(var(--primary))' }} />
              Drużyny
            </h3>
            <div className="flex-row gap-xs items-center">
              <button
                onClick={removeTeam}
                disabled={teams.length <= 2}
                className="btn btn-icon"
                style={{ padding: '6px', borderRadius: '8px' }}
              >
                <Minus size={14} />
              </button>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'white', padding: '0 8px' }}>{teams.length}</span>
              <button
                onClick={addTeam}
                disabled={teams.length >= 6}
                className="btn btn-icon"
                style={{ padding: '6px', borderRadius: '8px' }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex-col gap-sm">
            {teams.map((team, idx) => (
              <div key={team.id} className="team-editor-row">
                <div className="team-input-wrapper">
                  <span
                    className="team-color-indicator"
                    style={{ color: team.color, backgroundColor: team.color }}
                  ></span>
                  <input
                    type="text"
                    value={team.name}
                    onChange={(e) => updateTeamName(idx, e.target.value)}
                    placeholder={`Drużyna ${idx + 1}`}
                    className="input-field"
                    style={{ padding: '8px 12px' }}
                  />
                </div>
                {/* Color presets chooser */}
                <div className="team-colors-picker">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateTeamColor(idx, color)}
                      className={`color-dot-btn ${team.color === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Game Settings / Tournament Preview */}
        {gameMode === 'REVOLVER' ? (
          <div className="glass flex-col gap-md">
            <h3 className="setup-box-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 0 }}>
              <Settings size={18} style={{ color: 'hsl(var(--primary))' }} />
              Zasady Gry: Rewolwer 🔫
            </h3>
            
            <div className="flex-col gap-sm" style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>Jedno Hasło dla Wszystkich</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Na ekranie pojawia się jedno tajne hasło. Jeden gracz z każdej drużyny je widzi i zostaje podpowiadaczem.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>Jedna Wskazówka, Jedna Szansa</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Drużyna aktywna daje jedną wskazówkę (jedno słowo), jej guesser próbuje odgadnąć. Jeśli nie trafi – kolej przechodzi do następnej drużyny.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>Rotacja Drużyn</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Drużyny grają na zmianę aż do odgadnięcia hasła. Jeśli wszystkie drużyny spróbują i nikt nie odgadnie – hasło przepada.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.15) 0%, rgba(120, 53, 15, 0.2) 100%)', border: '1px solid rgba(180, 83, 9, 0.3)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#fcd34d' }}>Punktacja</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Drużyna, która odgadnie hasło, zdobywa <strong style={{color:'white'}}>+1 punkt</strong>. Gra do ustalonej liczby punktów.</span>
              </div>
            </div>
          </div>
        ) : gameMode === 'LIPS' ? (
          <div className="glass flex-col gap-md">
            <h3 className="setup-box-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 0 }}>
              <Settings size={18} style={{ color: 'hsl(var(--primary))' }} />
              Zasady Gry: Usta Usta 🎧
            </h3>
            
            <div className="flex-col gap-sm" style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#ef4444' }}>⚠️ WYMAGANE SŁUCHAWKI</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Upewnij się, że jeden z graczy ma na uszach słuchawki z puszczoną bardzo głośną muzyką, tak aby nie słyszał podpowiadającego partnera.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>Czytanie z Ruchu Warg</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Drugi gracz stara się podpowiedzieć wyświetlone hasło wyłącznie poprzez wyraźne wypowiadanie słów bez używania głosu lub szeptem.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>Bez krzyczenia</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Podpowiadający nie może krzyczeć ani gestykulować rękami. Gracz w słuchawkach musi odgadnąć jak najwięcej haseł.</span>
              </div>
            </div>
          </div>
        ) : gameMode === 'SPY' ? (
          <div className="glass flex-col gap-md">
            <h3 className="setup-box-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 0 }}>
              <Settings size={18} style={{ color: 'hsl(var(--primary))' }} />
              Zasady Gry: Szpieg
            </h3>
            
            <div className="flex-col gap-sm" style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>Losowanie Ról</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Każdy gracz po kolei sprawdza kartę na telefonie. Wszyscy widzą tę samą lokalizację, z wyjątkiem jednej osoby – Szpiega.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>Pytania od Mistrza Gry</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Na ekranie pojawia się pytanie dla każdego gracza. Odpowiadacie na nie na głos. Szpieg musi improwizować.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>Typowanie Szpiega</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Po rundzie pytań typujecie, kto jest Szpiegiem.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.2) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>Punktacja</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Wskazanie prawdziwego szpiega = **+5 punktów** dla Waszej drużyny. Pomyłka = **+5 punktów** dla rywali.</span>
              </div>
            </div>
          </div>
        ) : gameMode === 'TOURNAMENT' ? (
          <div className="glass flex-col gap-md">
            <h3 className="setup-box-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 0 }}>
              <Settings size={18} style={{ color: 'hsl(var(--primary))' }} />
              Przebieg Teleturnieju
            </h3>
            
            <div className="flex-col gap-sm" style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'hsl(var(--primary))' }}>RUNDA 1</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Marylin Monroe (Tabu)</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Każda drużyna ma 60 sekund na odgadnięcie postaci z tabu.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#f97316' }}>RUNDA 2</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>9,5 Sekundy</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Mistrz Gry czyta pytania, a drużyna ma 9.5 sekundy na szybkie odpowiedzi.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#8b5cf6' }}>RUNDA 3</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Odwrócone Kalambury</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Pokazywanie haseł-czynności w formie pantomimy (czas: 120s).</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'linear-gradient(135deg, rgba(255, 60, 0, 0.1) 0%, rgba(255, 215, 0, 0.1) 100%)', border: '1px solid rgba(255, 60, 0, 0.2)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'hsl(var(--secondary))' }}>RUNDA FINAŁOWA</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Bomba! 💣</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>Opisywanie haseł bez słów zakazanych i przekazywanie tykającej bomby. Kto trzyma bombę podczas wybuchu, ten przegrywa!</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass flex-col gap-md">
            <h3 className="setup-box-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 0 }}>
              <Settings size={18} style={{ color: 'hsl(var(--primary))' }} />
              Zasady Gry
            </h3>

            {/* Round Time */}
            <div className="form-group">
              <label className="form-label">Czas rundy</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {(gameMode === 'NINE_SECONDS' 
                  ? [5, 7.5, 9.5, 12, 15] 
                  : gameMode === 'REVERSE_CHARADES' 
                  ? [60, 90, 120, 150, 180] 
                  : [30, 45, 60, 90, 120]
                ).map((t) => (
                  <button
                    key={t}
                    onClick={() => { playClick(); setRoundTime(t); }}
                    className={`btn ${roundTime === t ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px 4px', fontSize: '11px', borderRadius: '10px' }}
                  >
                    {t}s
                  </button>
                ))}
              </div>
            </div>

            {/* Points to Win */}
            <div className="form-group">
              <label className="form-label">Punkty do wygranej</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {[10, 15, 20, 25, 30].map((pts) => (
                  <button
                    key={pts}
                    onClick={() => { playClick(); setPointsToWin(pts); }}
                    className={`btn ${pointsToWin === pts ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px 4px', fontSize: '11px', borderRadius: '10px' }}
                  >
                    {pts}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Selector */}
            <div className="form-group">
              <label className="form-label">Kategorie haseł</label>
              {loading ? (
                <div style={{ fontSize: '13px', color: 'hsl(var(--text-muted))' }}>Wczytywanie kategorii...</div>
              ) : categories.length === 0 ? (
                <div style={{ fontSize: '13px', color: '#ff5c75', fontWeight: 600 }}>Brak haseł w bazie! Dodaj hasła najpierw.</div>
              ) : (
                <div className="category-tags-group">
                  {categories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`category-tag-btn ${isSelected ? 'active' : ''}`}
                      >
                        {isSelected && <Check size={12} />}
                        {cat}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleStartGame}
        className="btn btn-primary w-full"
        style={{ marginTop: '24px', padding: '16px', fontSize: '16px', borderRadius: '16px' }}
      >
        ROZPOCZNIJ ROZGRYWKĘ
      </button>
    </div>
  );
};
