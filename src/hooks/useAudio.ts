import { useCallback, useRef } from 'react';

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playBeep = useCallback((frequency: number, duration: number, volume: number = 0.3) => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio not available');
    }
  }, [getAudioContext]);

  const playDownSound = useCallback(() => {
    playBeep(220, 0.15, 0.4); // Low beep
  }, [playBeep]);

  const playStretchSound = useCallback(() => {
    playBeep(440, 0.15, 0.4); // Medium beep
  }, [playBeep]);

  const playUpSound = useCallback(() => {
    playBeep(660, 0.15, 0.4); // High beep
  }, [playBeep]);

  const playRestSound = useCallback(() => {
    playBeep(330, 0.5, 0.3); // Long beep
  }, [playBeep]);

  const playCompleteSound = useCallback(() => {
    // Victory sound - ascending notes
    playBeep(440, 0.15, 0.3);
    setTimeout(() => playBeep(550, 0.15, 0.3), 150);
    setTimeout(() => playBeep(660, 0.15, 0.3), 300);
    setTimeout(() => playBeep(880, 0.3, 0.4), 450);
  }, [playBeep]);

  return {
    playDownSound,
    playStretchSound,
    playUpSound,
    playRestSound,
    playCompleteSound,
  };
};
