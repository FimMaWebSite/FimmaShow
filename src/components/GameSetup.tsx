import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Settings, Plus, Minus, Check } from 'lucide-react';
import { playClick, playWrong } from '../utils/audio';
import { GameMode } from '../App';

import {
  DEFAULT_WORDS,
  DEFAULT_NINE_SECONDS,
  DEFAULT_REVERSE_CHARADES,
  DEFAULT_P_GAME,
  DEFAULT_LIPS_WORDS,
  DEFAULT_BOMB_WORDS,
  DEFAULT_REVOLVER_WORDS,
  DEFAULT_WAVELENGTH_WORDS
} from '../data/defaultDataMulti';
import { Language, getTranslation } from '../data/translations';

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
  tournamentGames?: GameMode[];
}

interface GameSetupProps {
  onBack: () => void;
  onStart: (teams: Team[], settings: GameSettings) => void;
  gameMode: GameMode;
  language: Language;
}

const PRESET_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow/Gold
  '#06b6d4', // Cyan
  '#10b981', // Emerald Green
  '#8b5cf6', // Violet
];

const getCategoryEmoji = (cat: string): string => {
  const c = cat.toLowerCase();
  if (c.includes('fikcyjn')) return '🧙‍♂️';
  if (c.includes('ludzie') && c.includes('relac')) return '🤝';
  if (c.includes('ludzie') && c.includes('zawod')) return '👨‍⚕️';
  if (c.includes('ludzie')) return '👥';
  if (c.includes('polska') && c.includes('świat')) return '🌍';
  if (c.includes('polska')) return '🇵🇱';
  if (c.includes('popkultur') && c.includes('zwariowan')) return '🤪';
  if (c.includes('popkultur') && c.includes('medi')) return '🎬';
  if (c.includes('popkultur') || c.includes('postaci')) return '🌟';
  if (c.includes('życie codzienne') || c.includes('codzienn')) return '🏠';
  if (c.includes('gry & technologi')) return '🎮';
  if (c.includes('czynności')) return '💼';
  if (c.includes('zwierzęta') || c.includes('natur')) return '🦁';
  if (c.includes('sport') || c.includes('hobby')) return '⚽';
  if (c.includes('przedmiot') && c.includes('codzien')) return '🎒';
  if (c.includes('przedmiot')) return '🔑';
  if (c.includes('miejsca') && c.includes('sytuac')) return '📍';
  if (c.includes('miejsca') && c.includes('zawod')) return '🏢';
  if (c.includes('miejsca') || c.includes('pojęc')) return '🗺️';
  if (c.includes('absurdaln') || c.includes('głupi')) return '🤡';
  if (c.includes('łamacz')) return '👅';
  if (c.includes('imprezow')) return '🥳';
  if (c.includes('fonetyczn')) return '🗣️';
  if (c.includes('rzecz') || c.includes('obiekt')) return '📦';
  if (c.includes('pojęci')) return '🔮';
  return '🏷️';
};

const getGameModeDescription = (mode: GameMode, lang: Language): string => {
  switch (mode) {
    case 'MARYLIN_MONROE': return getTranslation('marilynDesc', lang);
    case 'NINE_SECONDS': return getTranslation('nineSecDesc', lang);
    case 'REVERSE_CHARADES': return getTranslation('reverseCharadesDesc', lang);
    case 'P_GAME': return getTranslation('pGameDesc', lang);
    case 'SPY': return getTranslation('spyDesc', lang);
    case 'LIPS': return getTranslation('lipsDesc', lang);
    case 'REVOLVER': return getTranslation('revolverDesc', lang);
    case 'WAVELENGTH': return getTranslation('wavelengthDesc', lang);
    default: return '';
  }
};

export const GameSetup: React.FC<GameSetupProps> = ({ onBack, onStart, gameMode, language }) => {
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: language === 'EN' ? 'Team A' : 'Drużyna A', color: '#f97316', points: 0 },
    { id: 2, name: language === 'EN' ? 'Team B' : 'Drużyna B', color: '#eab308', points: 0 }
  ]);

  const [roundTime, setRoundTime] = useState(
    gameMode === 'NINE_SECONDS' ? 9.5 : gameMode === 'REVERSE_CHARADES' ? 120 : 60
  );
  const [pointsToWin, setPointsToWin] = useState(15);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tournamentGames, setTournamentGames] = useState<GameMode[]>([
    'MARYLIN_MONROE',
    'NINE_SECONDS',
    'REVERSE_CHARADES'
  ]);

  // Fetch available categories and counts
  useEffect(() => {
    const fetchCategories = () => {
      let localKey = `fimma_words_${language}`;
      let defaultBackup: any[] = DEFAULT_WORDS[language] || DEFAULT_WORDS['PL'] || [];

      if (gameMode === 'NINE_SECONDS') {
        localKey = `fimma_nine_seconds_${language}`;
        defaultBackup = DEFAULT_NINE_SECONDS[language] || DEFAULT_NINE_SECONDS['PL'] || [];
      } else if (gameMode === 'REVERSE_CHARADES') {
        localKey = `fimma_reverse_charades_${language}`;
        defaultBackup = DEFAULT_REVERSE_CHARADES[language] || DEFAULT_REVERSE_CHARADES['PL'] || [];
      } else if (gameMode === 'BOMB') {
        localKey = `fimma_bomb_words_${language}`;
        defaultBackup = DEFAULT_BOMB_WORDS[language] || DEFAULT_BOMB_WORDS['PL'] || [];
      } else if (gameMode === 'P_GAME') {
        localKey = `fimma_p_game_${language}`;
        defaultBackup = DEFAULT_P_GAME[language] || DEFAULT_P_GAME['PL'] || [];
      } else if (gameMode === 'LIPS') {
        localKey = `fimma_lips_words_${language}`;
        defaultBackup = DEFAULT_LIPS_WORDS[language] || DEFAULT_LIPS_WORDS['PL'] || [];
      } else if (gameMode === 'REVOLVER') {
        localKey = `fimma_revolver_words_${language}`;
        defaultBackup = DEFAULT_REVOLVER_WORDS[language] || DEFAULT_REVOLVER_WORDS['PL'] || [];
      } else if (gameMode === 'WAVELENGTH') {
        localKey = `fimma_wavelength_words_${language}`;
        defaultBackup = DEFAULT_WAVELENGTH_WORDS[language] || DEFAULT_WAVELENGTH_WORDS['PL'] || [];
      }

      const localData = localStorage.getItem(localKey);
      let data: any[] = defaultBackup;
      if (localData) {
        try {
          data = JSON.parse(localData);
          if (!Array.isArray(data)) data = defaultBackup;
        } catch {
          data = defaultBackup;
        }
      }

      const cats = Array.from(new Set(data.map((w: any) => w.category).filter(Boolean))) as string[];
      
      const counts: { [key: string]: number } = {};
      data.forEach((w: any) => {
        if (w.category) {
          counts[w.category] = (counts[w.category] || 0) + 1;
        }
      });

      setCategories(cats);
      setSelectedCategories(cats);
      setCategoryCounts(counts);
      setLoading(false);
    };

    fetchCategories();
  }, [gameMode, language]);

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
      name: language === 'EN' ? `Team ${String.fromCharCode(64 + nextId)}` : `Drużyna ${String.fromCharCode(64 + nextId)}`,
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
    if (gameMode !== 'TOURNAMENT' && gameMode !== 'SPY' && selectedCategories.length === 0) {
      playWrong();
      alert(language === 'EN' ? 'Please select at least one word category.' : 'Wybierz przynajmniej jedną kategorię haseł.');
      return;
    }
    playClick();
    onStart(teams, { 
      roundTime: gameMode === 'TOURNAMENT' ? 60 : roundTime, 
      pointsToWin: gameMode === 'TOURNAMENT' ? 9999 : gameMode === 'SPY' ? 15 : pointsToWin, 
      selectedCategories: gameMode === 'TOURNAMENT' || gameMode === 'SPY' ? [] : selectedCategories,
      tournamentGames: gameMode === 'TOURNAMENT' ? tournamentGames : undefined
    });
  };

  return (
    <div className="flex-container max-w-5xl mx-auto fade-in" style={{ padding: '24px 12px', minHeight: '85vh', justifyContent: 'flex-start' }}>
      <button
        onClick={handleBackClick}
        className="btn btn-secondary"
        style={{ alignSelf: 'flex-start', marginBottom: '24px', padding: '8px 16px', fontSize: '13px', borderRadius: '12px' }}
      >
        <ArrowLeft size={16} />
        {language === 'EN' ? 'Cancel' : 'Anuluj'}
      </button>

      <h2 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', color: 'white', marginBottom: '24px', textAlign: 'center' }}>
        {getTranslation('gameSetupTitle', language)}
      </h2>

      {/* Quick Play Button */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '450px', margin: '0 auto 24px auto', gap: '8px', zIndex: 5 }}>
        <button
          onClick={() => {
            playClick();
            onStart(teams, {
              roundTime: gameMode === 'TOURNAMENT' ? 60 : gameMode === 'NINE_SECONDS' ? 9.5 : gameMode === 'REVERSE_CHARADES' ? 120 : 60,
              pointsToWin: gameMode === 'TOURNAMENT' ? 9999 : gameMode === 'SPY' ? 15 : 15,
              selectedCategories: categories.length > 0 ? categories : [],
              tournamentGames: gameMode === 'TOURNAMENT' ? tournamentGames : undefined
            });
          }}
          className="btn btn-primary"
          style={{
            padding: '14px 28px',
            fontSize: '15px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)',
            textTransform: 'uppercase',
            fontWeight: 900
          }}
        >
          {getTranslation('quickPlayBtn', language)}
        </button>
      </div>

      <div className="setup-grid">
        {/* Left Card: Team Configuration */}
        <div className="glass flex-col gap-md">
          <div className="setup-box-header">
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} style={{ color: 'hsl(var(--primary))' }} />
              {language === 'EN' ? 'Teams' : 'Drużyny'}
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
                    placeholder={getTranslation('teamNamePlaceholder', language) + ` ${idx + 1}`}
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
        {gameMode === 'SPY' ? (
          <div className="glass flex-col gap-md">
            <h3 className="setup-box-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 0 }}>
              <Settings size={18} style={{ color: 'hsl(var(--primary))' }} />
              {language === 'EN' ? 'Game Rules: Spy' : 'Zasady Gry: Szpieg'}
            </h3>
            
            {/* Game Description Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: 'hsl(var(--secondary))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {language === 'EN' ? 'HOW TO PLAY' : 'JAK GRAĆ'}
              </span>
              <span style={{ fontSize: '12.5px', color: 'hsl(var(--text-secondary))', lineHeight: '1.5' }}>
                {getGameModeDescription(gameMode, language)}
              </span>
            </div>

            <div className="flex-col gap-sm" style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>
                  {language === 'EN' ? 'Role Drawing' : 'Losowanie Ról'}
                </span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>
                  {language === 'EN' 
                    ? 'Each player takes turns checking their card on the phone. Everyone sees the same location except the Spy.' 
                    : 'Każdy gracz po kolei sprawdza kartę na telefonie. Wszyscy widzą tę samą lokalizację, z wyjątkiem jednej osoby – Szpiega.'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>
                  {language === 'EN' ? 'Questions' : 'Pytania od Mistrza Gry'}
                </span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>
                  {language === 'EN' 
                    ? 'A question appears on screen for each player. Answer out loud. The spy must improvise.' 
                    : 'Na ekranie pojawia się pytanie dla każdego gracza. Odpowiadacie na nie na głos. Szpieg musi improwizować.'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>
                  {language === 'EN' ? 'Voting for the Spy' : 'Typowanie Szpiega'}
                </span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>
                  {language === 'EN' 
                    ? 'After the question rounds, vote on who you think the Spy is.' 
                    : 'Po rundzie pytań typujecie, kto jest Szpiegiem.'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.2) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>
                  {language === 'EN' ? 'Scoring' : 'Punktacja'}
                </span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>
                  {language === 'EN' 
                    ? 'Identifying the correct spy = +5 points for your team. Mistake = +5 points for opponents.' 
                    : 'Wskazanie prawdziwego szpiega = +5 punktów dla Waszej drużyny. Pomyłka = +5 punktów dla rywali.'}
                </span>
              </div>
            </div>
          </div>
        ) : gameMode === 'TOURNAMENT' ? (
          <div className="glass flex-col gap-md">
            <div className="setup-box-header" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={18} style={{ color: 'hsl(var(--primary))' }} />
                {language === 'EN' ? 'Tournament Rounds' : 'Rundy Teleturnieju'}
              </h3>
              <div className="flex-row gap-xs items-center">
                <button
                  onClick={() => {
                    playClick();
                    if (tournamentGames.length <= 1) return;
                    setTournamentGames(tournamentGames.slice(0, -1));
                  }}
                  disabled={tournamentGames.length <= 1}
                  className="btn btn-icon"
                  style={{ padding: '6px', borderRadius: '8px' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'white', padding: '0 8px' }}>
                  {tournamentGames.length}
                </span>
                <button
                  onClick={() => {
                    playClick();
                    if (tournamentGames.length >= 5) return;
                    setTournamentGames([...tournamentGames, 'MARYLIN_MONROE']);
                  }}
                  disabled={tournamentGames.length >= 5}
                  className="btn btn-icon"
                  style={{ padding: '6px', borderRadius: '8px' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex-col gap-sm" style={{ marginTop: '8px' }}>
              {tournamentGames.map((game, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'hsl(var(--primary))' }}>
                    {language === 'EN' ? 'ROUND' : 'RUNDA'} {index + 1}
                  </span>
                  <select
                    value={game}
                    onChange={(e) => {
                      playClick();
                      const updated = [...tournamentGames];
                      updated[index] = e.target.value as GameMode;
                      setTournamentGames(updated);
                    }}
                    className="select-field"
                    style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '10px', height: '38px', backgroundPosition: 'right 8px center' }}
                  >
                    <option value="MARYLIN_MONROE">{language === 'EN' ? 'Marilyn Monroe (Taboo)' : 'Marylin Monroe (Tabu)'}</option>
                    <option value="NINE_SECONDS">{language === 'EN' ? '9.5 Seconds (Questions)' : '9,5 Sekundy (Pytania)'}</option>
                    <option value="REVERSE_CHARADES">{language === 'EN' ? 'Reverse Charades (Actions)' : 'Odwrócone Kalambury (Czynności)'}</option>
                    <option value="LIPS">{language === 'EN' ? 'Lips (Lip movements)' : 'Usta Usta (Ruch warg)'}</option>
                    <option value="P_GAME">{language === 'EN' ? 'P Game' : 'Gra na P'}</option>
                  </select>
                </div>
              ))}

              {/* Fixed Final Round */}
              <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'linear-gradient(135deg, rgba(255, 60, 0, 0.1) 0%, rgba(255, 215, 0, 0.1) 100%)', border: '1px solid rgba(255, 60, 0, 0.2)', borderRadius: '14px', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'hsl(var(--secondary))' }}>
                  {language === 'EN' ? 'FINAL ROUND' : 'RUNDA FINAŁOWA'}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{language === 'EN' ? 'Bomb! 💣' : 'Bomba! 💣'}</span>
                <span style={{ fontSize: '11.5px', color: 'hsl(var(--text-secondary))' }}>
                  {language === 'EN' 
                    ? 'Describing words without forbidden words and passing a ticking bomb. The losing team gets a time handicap with card delays!' 
                    : 'Opisywanie haseł bez słów zakazanych i przekazywanie tykającej bomby. Przegrywająca para ma dodatkowe utrudnienie czasowe w postaci opóźnienia kart!'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass flex-col gap-md">
            <h3 className="setup-box-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 0 }}>
              <Settings size={18} style={{ color: 'hsl(var(--primary))' }} />
              {language === 'EN' ? 'Game Rules' : 'Zasady Gry'}
            </h3>

            {/* Game Description Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: 'hsl(var(--secondary))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {language === 'EN' ? 'HOW TO PLAY' : 'JAK GRAĆ'}
              </span>
              <span style={{ fontSize: '12.5px', color: 'hsl(var(--text-secondary))', lineHeight: '1.5' }}>
                {getGameModeDescription(gameMode, language)}
              </span>
            </div>

            {gameMode === 'LIPS' && (
              <div style={{
                marginTop: '-4px',
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#ef4444',
                lineHeight: '1.4'
              }}>
                {getTranslation('lipsInstructions', language)}
              </div>
            )}

            {/* Advanced Settings Toggle Button */}
            {gameMode !== 'WAVELENGTH' && (
              <button
                type="button"
                onClick={() => { playClick(); setShowAdvanced(!showAdvanced); }}
                className="btn btn-secondary"
                style={{
                  padding: '10px 16px',
                  fontSize: '12.5px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  marginTop: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <Settings size={14} style={{ color: 'hsl(var(--secondary))' }} />
                <span>{getTranslation('advancedSettings', language)}</span>
                <span style={{ fontSize: '10px', marginLeft: 'auto', opacity: 0.6 }}>{showAdvanced ? '▲' : '▼'}</span>
              </button>
            )}

            {/* Collapsible Area */}
            {(showAdvanced || gameMode === 'WAVELENGTH') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                {/* Round Time */}
                <div className="form-group">
                  <label className="form-label">{language === 'EN' ? 'Round time' : 'Czas rundy'}</label>
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
                  <label className="form-label">{language === 'EN' ? 'Points to win' : 'Punkty do wygranej'}</label>
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
                {gameMode !== 'WAVELENGTH' && (
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label className="form-label" style={{ marginBottom: 0 }}>
                        {language === 'EN' ? 'Word categories' : 'Kategorie haseł'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          playClick();
                          if (selectedCategories.length === categories.length) {
                            setSelectedCategories([categories[0]]);
                          } else {
                            setSelectedCategories([...categories]);
                          }
                        }}
                        className="btn-link"
                        style={{
                          fontSize: '12.5px',
                          color: 'hsl(var(--primary))',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 700,
                          padding: 0
                        }}
                      >
                        {selectedCategories.length === categories.length 
                          ? getTranslation('deselectAll', language) 
                          : getTranslation('selectAll', language)}
                      </button>
                    </div>

                    {loading ? (
                      <div style={{ fontSize: '13px', color: 'hsl(var(--text-muted))' }}>
                        {language === 'EN' ? 'Loading categories...' : 'Wczytywanie kategorii...'}
                      </div>
                    ) : categories.length === 0 ? (
                      <div style={{ fontSize: '13px', color: '#ff5c75', fontWeight: 600 }}>
                        {language === 'EN' ? 'No words in the database! Please add some first.' : 'Brak haseł w bazie! Dodaj hasła najpierw.'}
                      </div>
                    ) : (
                      <div className="category-grid">
                        {categories.map((cat) => {
                          const isSelected = selectedCategories.includes(cat);
                          const emoji = getCategoryEmoji(cat);
                          const count = categoryCounts[cat] || 0;
                          return (
                            <div
                              key={cat}
                              onClick={() => toggleCategory(cat)}
                              className={`category-item ${isSelected ? 'active' : ''}`}
                            >
                              <div className="category-checkbox">
                                {isSelected && <Check size={12} strokeWidth={3} />}
                              </div>
                              <span style={{ fontSize: '13px' }}>{emoji} {cat}</span>
                              <span className="category-count">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleStartGame}
        className="btn btn-primary"
        style={{
          width: '100%',
          maxWidth: '450px',
          marginTop: '36px',
          padding: '16px 32px',
          fontSize: '16px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #ff3c00 0%, #ff8c00 50%, #ffd700 100%)',
          border: 'none',
          boxShadow: '0 6px 20px rgba(255, 60, 0, 0.3)',
        }}
      >
        {getTranslation('startGameBtn', language)}
      </button>
    </div>
  );
};
