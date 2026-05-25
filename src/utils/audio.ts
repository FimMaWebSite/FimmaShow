// Web Audio API Synthesizer for game sound effects to avoid external assets

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Simple helper to play a sine wave tone
const playTone = (freq: number, type: OscillatorType, duration: number, gainStart: number, delay = 0) => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    gainNode.gain.setValueAtTime(gainStart, ctx.currentTime + delay);
    // Exponential decay
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};

export const playClick = () => {
  playTone(800, 'sine', 0.08, 0.1);
};

export const playCorrect = () => {
  // Ascending major chord (C4, E4, G4, C5)
  const notes = [261.63, 329.63, 392.00, 523.25];
  notes.forEach((freq, index) => {
    playTone(freq, 'triangle', 0.3, 0.15, index * 0.08);
  });
};

export const playWrong = () => {
  // Low descending buzz
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.4);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};

export const playTick = () => {
  // High clicky tick sound
  playTone(1200, 'sine', 0.03, 0.05);
};

export const playBuzzer = () => {
  // A pleasant warm major-chord retro synth chime (G3, C4, E4 arpeggio)
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const playChimeTone = (freq: number, delay: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + delay);

      gainNode.gain.setValueAtTime(0.12, now + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + duration);
    };

    // Soft game show end round arpeggio chord
    playChimeTone(196.00, 0, 0.6);    // G3
    playChimeTone(261.63, 0.08, 0.6); // C4
    playChimeTone(329.63, 0.16, 0.5); // E4
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};
