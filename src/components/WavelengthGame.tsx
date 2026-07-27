import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Eye, ArrowRight } from 'lucide-react';
import { playClick } from '../utils/audio';
import { Team } from './GameSetup';
import { Language, getTranslation } from '../data/translations';
import { DEFAULT_WAVELENGTH_WORDS } from '../data/defaultDataMulti';

interface WavelengthGameProps {
  language: Language;
  teams: Team[];
  currentTeamIndex: number;
  onNextTurn: (pointsEarned: number) => void;
}

export const WavelengthGame: React.FC<WavelengthGameProps> = ({
  language,
  teams,
  currentTeamIndex,
  onNextTurn
}) => {
  const [opposites, setOpposites] = useState<[string, string]>(['Cold', 'Hot']);
  const [targetAngle, setTargetAngle] = useState<number>(90); // 15 to 165
  const [guessAngle, setGuessAngle] = useState<number>(90);
  const [clue, setClue] = useState<string>('');
  const [phase, setPhase] = useState<'PSYCHIC' | 'GUESSING' | 'REVEAL'>('PSYCHIC');
  const [pointsScored, setPointsScored] = useState<number>(0);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef<boolean>(false);
  
  const activeTeam = teams[currentTeamIndex];

  // Load new opposites card and randomize target position on start
  useEffect(() => {
    const list = DEFAULT_WAVELENGTH_WORDS[language] || DEFAULT_WAVELENGTH_WORDS['PL'];
    if (list.length > 0) {
      const randomCard = list[Math.floor(Math.random() * list.length)];
      setOpposites(randomCard.opposites);
    }
    // Random target angle between 20 and 160 degrees
    const randomAngle = Math.floor(Math.random() * 140) + 20;
    setTargetAngle(randomAngle);
    setGuessAngle(90);
    setClue('');
    setPhase('PSYCHIC');
    setPointsScored(0);
  }, [currentTeamIndex, language]);

  const getWedgePath = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    // 0 deg is Far Left, 90 deg is Top Center, 180 deg is Far Right
    const rad1 = (180 - startAngle) * Math.PI / 180;
    const rad2 = (180 - endAngle) * Math.PI / 180;
    const x1 = cx + r * Math.cos(rad1);
    const y1 = cy - r * Math.sin(rad1);
    const x2 = cx + r * Math.cos(rad2);
    const y2 = cy - r * Math.sin(rad2);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (phase !== 'GUESSING') return;
    isDragging.current = true;
    updateAngleFromEvent(e);
    if (svgRef.current) {
      svgRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging.current || phase !== 'GUESSING') return;
    updateAngleFromEvent(e);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    isDragging.current = false;
    if (svgRef.current) {
      svgRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const updateAngleFromEvent = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.bottom; // Dial center is at the bottom center of SVG
    
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    
    // Angle in radians from left (180 deg Cartesian is 0 deg our dial, 0 deg Cartesian is 180 deg our dial)
    const angleRad = Math.atan2(-dy, dx);
    let angleDeg = angleRad * (180 / Math.PI);
    
    // Standardize to 0 to 180 range
    if (angleDeg < 0) {
      // If cursor is below center, force to closest edge
      angleDeg = dx < 0 ? 0 : 180;
    } else {
      angleDeg = 180 - angleDeg; // invert because 0 is left, 180 is right
    }
    
    // Clamp to [15, 165] to prevent going off-screen
    const clampedAngle = Math.max(15, Math.min(165, angleDeg));
    setGuessAngle(clampedAngle);
  };

  const calculatePoints = (guess: number, target: number): number => {
    const diff = Math.abs(guess - target);
    if (diff <= 2.2) return 4;  // Center bullseye
    if (diff <= 6.5) return 3;  // Inner zone
    if (diff <= 12.0) return 2; // Outer zone
    return 0;
  };

  const handleConfirmPsychic = () => {
    playClick();
    setPhase('GUESSING');
  };

  const handleConfirmGuess = () => {
    playClick();
    const score = calculatePoints(guessAngle, targetAngle);
    setPointsScored(score);
    setPhase('REVEAL');
  };

  const handleFinishTurn = () => {
    playClick();
    onNextTurn(pointsScored);
  };

  // SVG Coordinates for Guess Needle
  const cx = 200;
  const cy = 200;
  const r = 160;
  
  const radGuess = (180 - guessAngle) * Math.PI / 180;
  const xGuess = cx + r * Math.cos(radGuess);
  const yGuess = cy - r * Math.sin(radGuess);

  return (
    <div className="flex-container max-w-xl mx-auto fade-in" style={{ padding: '24px 12px', minHeight: '80vh', justifyContent: 'flex-start' }}>
      {/* Header Info */}
      <div className="text-center w-full" style={{ marginBottom: '20px' }}>
        <span className="badge-active" style={{ background: activeTeam.color, color: 'white', fontWeight: 900, padding: '6px 16px', fontSize: '12px' }}>
          {activeTeam.name}
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'white', marginTop: '12px', textTransform: 'uppercase' }}>
          {phase === 'PSYCHIC' && getTranslation('wavelengthPsychicPhase', language)}
          {phase === 'GUESSING' && getTranslation('wavelengthGuessingPhase', language)}
          {phase === 'REVEAL' && getTranslation('wavelengthRevealPhase', language)}
        </h2>
      </div>

      {/* Opposites Card */}
      <div className="glass w-full" style={{ padding: '20px', borderRadius: '20px', textAlign: 'center', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontSize: '11px', fontWeight: 900, color: 'hsl(var(--secondary))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {getTranslation('wavelengthOpposites', language)}
        </span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '18px', fontWeight: 900, color: '#ef4444' }}>{opposites[0]}</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>VS</span>
          <span style={{ fontSize: '18px', fontWeight: 900, color: '#06b6d4' }}>{opposites[1]}</span>
        </div>

        {/* Clue section */}
        {phase === 'PSYCHIC' && (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              {getTranslation('wavelengthGiveClue', language)}
            </span>
            <input
              type="text"
              value={clue}
              onChange={(e) => setClue(e.target.value)}
              placeholder={getTranslation('wavelengthTargetCluePlaceholder', language)}
              className="input-field"
              style={{ padding: '10px 14px', fontSize: '14px', borderRadius: '10px', textAlign: 'center' }}
            />
          </div>
        )}

        {(phase === 'GUESSING' || phase === 'REVEAL') && clue.trim() !== '' && (
          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'hsl(var(--secondary))', display: 'block', textTransform: 'uppercase' }}>
              {getTranslation('wavelengthClueLabel', language)}
            </span>
            <span style={{ fontSize: '18px', fontWeight: 900, color: 'white', marginTop: '4px', display: 'block' }}>
              "{clue}"
            </span>
          </div>
        )}
      </div>

      {/* SVG Interactive Dial */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '380px', height: '220px', margin: '0 auto 24px auto', overflow: 'hidden' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 400 220"
          style={{ width: '100%', height: '100%', cursor: phase === 'GUESSING' ? 'grab' : 'default', touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Dial Background Arc */}
          <path
            d="M 40 200 A 160 160 0 0 1 360 200"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="32"
            strokeLinecap="round"
          />
          <path
            d="M 40 200 A 160 160 0 0 1 360 200"
            fill="none"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="30"
            strokeLinecap="round"
          />

          {/* Left/Right Color Indicators */}
          <path d="M 40 200 A 160 160 0 0 1 200 40" fill="none" stroke="rgba(239, 68, 68, 0.05)" strokeWidth="8" />
          <path d="M 200 40 A 160 160 0 0 1 360 200" fill="none" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="8" />

          {/* Target Slice (Visible in PSYCHIC and REVEAL phases) */}
          {(phase === 'PSYCHIC' || phase === 'REVEAL') && (
            <g>
              {/* Outer 2 points left */}
              <path
                d={getWedgePath(cx, cy, r, targetAngle - 12, targetAngle - 6.5)}
                fill="#ef4444"
                opacity="0.8"
              />
              {/* Inner 3 points left */}
              <path
                d={getWedgePath(cx, cy, r, targetAngle - 6.5, targetAngle - 2.2)}
                fill="#ff8c00"
                opacity="0.9"
              />
              {/* Bullseye 4 points center */}
              <path
                d={getWedgePath(cx, cy, r, targetAngle - 2.2, targetAngle + 2.2)}
                fill="#ffd700"
              />
              {/* Inner 3 points right */}
              <path
                d={getWedgePath(cx, cy, r, targetAngle + 2.2, targetAngle + 6.5)}
                fill="#ff8c00"
                opacity="0.9"
              />
              {/* Outer 2 points right */}
              <path
                d={getWedgePath(cx, cy, r, targetAngle + 6.5, targetAngle + 12)}
                fill="#ef4444"
                opacity="0.8"
              />
            </g>
          )}

          {/* Center Hub */}
          <circle cx={cx} cy={cy} r="16" fill="#1e1e24" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />

          {/* Draggable Guess Needle (Only in GUESSING and REVEAL phases) */}
          {(phase === 'GUESSING' || phase === 'REVEAL') && (
            <g>
              {/* Glow filter under needle */}
              <line
                x1={cx}
                y1={cy}
                x2={xGuess}
                y2={yGuess}
                stroke="#ff3c00"
                strokeWidth="8"
                opacity="0.3"
                strokeLinecap="round"
              />
              {/* Needle Line */}
              <line
                x1={cx}
                y1={cy}
                x2={xGuess}
                y2={yGuess}
                stroke="#ff3c00"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Needle Handle Circle */}
              <circle
                cx={xGuess}
                cy={yGuess}
                r="10"
                fill="#ff3c00"
                stroke="#ffffff"
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
              />
            </g>
          )}
        </svg>
      </div>

      {/* Control Buttons */}
      <div className="w-full text-center" style={{ marginTop: '12px' }}>
        {phase === 'PSYCHIC' && (
          <button
            onClick={handleConfirmPsychic}
            className="btn btn-primary w-full"
            style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '9999px' }}
          >
            <Eye size={18} />
            {getTranslation('wavelengthHideTarget', language)}
          </button>
        )}

        {phase === 'GUESSING' && (
          <button
            onClick={handleConfirmGuess}
            className="btn btn-primary w-full"
            style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '9999px' }}
          >
            <Sparkles size={16} />
            {getTranslation('wavelengthConfirmGuess', language)}
          </button>
        )}

        {phase === 'REVEAL' && (
          <div className="flex-col items-center gap-md">
            <div className="glass pulse" style={{ padding: '16px 32px', borderRadius: '16px', background: pointsScored > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: pointsScored > 0 ? '1px solid #10b981' : '1px solid #ef4444', display: 'inline-block', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 900, color: 'white', display: 'block', textTransform: 'uppercase' }}>
                {getTranslation('wavelengthPoints', language)}
              </span>
              <span style={{ fontSize: '32px', fontWeight: 900, color: pointsScored > 0 ? '#10b981' : '#ef4444', display: 'block', marginTop: '4px' }}>
                +{pointsScored}
              </span>
            </div>
            <button
              onClick={handleFinishTurn}
              className="btn btn-primary w-full"
              style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '9999px' }}
            >
              {getTranslation('nextTurnBtn', language)}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
