import React from 'react';
import { Trophy, Home, RefreshCw, Star } from 'lucide-react';
import { Team } from './GameSetup';
import { playClick } from '../utils/audio';

interface WinnerScreenProps {
  teams: Team[];
  onRestart: () => void;
  onHome: () => void;
}

export const WinnerScreen: React.FC<WinnerScreenProps> = ({ teams, onRestart, onHome }) => {
  const handleRestartClick = () => {
    playClick();
    onRestart();
  };

  const handleHomeClick = () => {
    playClick();
    onHome();
  };

  // Find winner (highest points)
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  const winner = sortedTeams[0];

  return (
    <div className="flex-container max-w-md mx-auto fade-in" style={{ padding: '36px 12px', minHeight: '85vh', justifyContent: 'center', position: 'relative' }}>
      {/* CSS Confetti Overlay */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const colors = ['#ff3c00', '#ffd700', '#06b6d4', '#10b981', '#8b5cf6'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const style = {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * -20}%`,
            backgroundColor: randomColor,
            width: `${Math.random() * 8 + 6}px`,
            height: `${Math.random() * 14 + 8}px`,
            animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            position: 'absolute' as const,
            borderRadius: '2px',
            opacity: 0.8,
          };
          return <div key={i} style={style} />;
        })}
      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Winner Banner */}
      <div className="flex-container" style={{ position: 'relative', zIndex: 1, gap: '24px' }}>
        <div className="trophy-glow-wrapper">
          <div className="trophy-badge">
            <Trophy size={50} fill="currentColor" />
          </div>
        </div>

        <div className="flex-container" style={{ gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'hsl(var(--secondary))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Zwycięzca Teleturnieju!
          </span>
          <h2 
            className="winner-banner"
            style={{ color: winner.color }}
          >
            {winner.name}
          </h2>
          <div className="flex-row gap-xs items-center" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '6px 14px', borderRadius: '12px', marginTop: '4px' }}>
            <Star size={14} style={{ color: 'hsl(var(--secondary))' }} fill="currentColor" />
            <span style={{ fontWeight: 800, fontSize: '15px', color: 'white' }}>
              Wynik końcowy: {winner.points} pkt
            </span>
          </div>
        </div>

        {/* Final Rankings */}
        <div className="glass w-full flex-col" style={{ padding: '24px', minWidth: '320px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px', marginBottom: '16px' }}>
            Klasyfikacja Końcowa
          </h4>
          <div className="leaderboard-list">
            {sortedTeams.map((team, index) => {
              const isWinner = index === 0;
              return (
                <div
                  key={team.id}
                  className="leaderboard-row"
                  style={{ 
                    padding: '12px 16px', 
                    background: isWinner ? 'rgba(255, 215, 0, 0.04)' : 'rgba(255, 255, 255, 0.01)',
                    borderColor: isWinner ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <div className="flex-row gap-sm">
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'hsl(var(--text-muted))', width: '20px' }}>
                      #{index + 1}
                    </span>
                    <span className="team-indicator-dot" style={{ color: team.color, backgroundColor: team.color, width: '10px', height: '10px' }}></span>
                    <span style={{ fontWeight: 700, color: isWinner ? 'white' : 'hsl(var(--text-secondary))', fontSize: '14px' }}>
                      {team.name}
                    </span>
                  </div>
                  <span style={{ fontWeight: 900, color: 'white', fontSize: '14px' }}>{team.points} pkt</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex-row gap-sm w-full" style={{ width: '100%' }}>
          <button
            onClick={handleRestartClick}
            className="btn btn-primary"
            style={{ flexGrow: 1, padding: '14px', fontSize: '13px' }}
          >
            <RefreshCw size={14} />
            ZAGRAJ PONOWNIE
          </button>
          <button
            onClick={handleHomeClick}
            className="btn btn-secondary"
            style={{ flexGrow: 1, padding: '14px', fontSize: '13px' }}
          >
            <Home size={14} />
            STRONA GŁÓWNA
          </button>
        </div>
      </div>
    </div>
  );
};
