import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Settings, Plus, Minus, Check } from 'lucide-react';
import { playClick, playWrong } from '../utils/audio';
import { GameMode } from '../App';

import { DEFAULT_WORDS, DEFAULT_NINE_SECONDS, DEFAULT_REVERSE_CHARADES } from '../data/defaultData';

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
    if (selectedCategories.length === 0) {
      playWrong();
      alert('Wybierz przynajmniej jedną kategorię haseł.');
      return;
    }
    playClick();
    onStart(teams, { roundTime, pointsToWin, selectedCategories });
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

        {/* Right Card: Game Settings */}
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
