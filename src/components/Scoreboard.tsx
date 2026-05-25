import React from 'react';
import { Trophy, ArrowRight, Star } from 'lucide-react';
import { Team } from './GameSetup';
import { playClick } from '../utils/audio';

interface ScoreboardProps {
  teams: Team[];
  currentTeamIndex: number;
  lastTeamIndex: number;
  pointsEarned: number;
  onNextRound: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  teams,
  currentTeamIndex,
  lastTeamIndex,
  pointsEarned,
  onNextRound,
}) => {
  const handleStartNext = () => {
    playClick();
    onNextRound();
  };

  const lastTeam = teams[lastTeamIndex];
  const nextTeam = teams[currentTeamIndex];

  // Sort teams for overall leaderboard
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  return (
    <div className="flex-container max-w-md mx-auto fade-in" style={{ padding: '36px 12px', minHeight: '85vh', justifyContent: 'center' }}>
      {/* Trophy Icon */}
      <div className="trophy-glow-wrapper">
        <div className="trophy-badge" style={{ width: '80px', height: '80px' }}>
          <Trophy size={40} fill="currentColor" />
        </div>
      </div>

      {/* Round Result Title */}
      <div className="flex-container" style={{ textAlign: 'center', marginBottom: '32px', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, color: 'hsl(var(--secondary))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Koniec rundy!
        </span>
        <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'white', textTransform: 'uppercase' }}>
          Wynik drużyny <span style={{ color: lastTeam.color }}>{lastTeam.name}</span>
        </h2>
        <div className="flex-row gap-xs items-center" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '6px 14px', borderRadius: '12px', marginTop: '8px' }}>
          <Star size={14} style={{ color: 'hsl(var(--secondary))' }} fill="currentColor" />
          <span style={{ fontWeight: 800, fontSize: '16px', color: 'white' }}>
            {pointsEarned >= 0 ? `+${pointsEarned}` : pointsEarned} pkt
          </span>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="glass w-full flex-col" style={{ padding: '24px', marginBottom: '32px' }}>
        <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px', marginBottom: '16px' }}>
          Tabela Wyników
        </h4>
        <div className="leaderboard-list">
          {sortedTeams.map((team, index) => {
            const isLeader = index === 0;
            return (
              <div
                key={team.id}
                className={`leaderboard-row ${isLeader ? 'leader' : ''}`}
                style={{ padding: '12px 16px' }}
              >
                <div className="flex-row gap-sm">
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'hsl(var(--text-muted))', width: '20px' }}>
                    #{index + 1}
                  </span>
                  <span className="team-indicator-dot" style={{ color: team.color, backgroundColor: team.color, width: '10px', height: '10px' }}></span>
                  <span style={{ fontWeight: 700, color: isLeader ? 'white' : 'hsl(var(--text-secondary))', fontSize: '14px' }}>
                    {team.name}
                  </span>
                </div>
                <div className="flex-row gap-xs">
                  <span style={{ fontWeight: 900, color: 'white', fontSize: '14px' }}>{team.points} pkt</span>
                  {isLeader && <Trophy size={12} style={{ color: '#ffd700', marginLeft: '4px' }} fill="currentColor" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Player CTA */}
      <div className="flex-container w-full" style={{ gap: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
          Następnie gra: <span style={{ fontWeight: 800, color: nextTeam.color }}>{nextTeam.name}</span>
        </div>
        <button
          onClick={handleStartNext}
          className="btn btn-primary w-full"
          style={{ padding: '16px', fontSize: '15px' }}
        >
          DALEJ DO RUNDY
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
