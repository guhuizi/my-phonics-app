const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const playTone = (frequency, duration, type = 'sine', volume = 0.3) => {
  if (!audioContext) return;

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

const playCorrectSound = () => {
  playTone(523.25, 0.1, 'sine', 0.3);
  setTimeout(() => playTone(659.25, 0.1, 'sine', 0.3), 100);
  setTimeout(() => playTone(783.99, 0.2, 'sine', 0.3), 200);
};

const playWrongSound = () => {
  playTone(200, 0.3, 'sawtooth', 0.2);
};

const playClickSound = () => {
  playTone(440, 0.05, 'sine', 0.15);
};

const playSuccessSound = () => {
  playTone(523.25, 0.15, 'sine', 0.3);
  setTimeout(() => playTone(659.25, 0.15, 'sine', 0.3), 150);
  setTimeout(() => playTone(783.99, 0.15, 'sine', 0.3), 300);
  setTimeout(() => playTone(1046.50, 0.3, 'sine', 0.3), 450);
};

const playGameOverSound = () => {
  playTone(392, 0.2, 'sine', 0.25);
  setTimeout(() => playTone(349.23, 0.2, 'sine', 0.25), 200);
  setTimeout(() => playTone(329.63, 0.3, 'sine', 0.25), 400);
};

export { playCorrectSound, playWrongSound, playClickSound, playSuccessSound, playGameOverSound };