const speak = (text, lang = 'en-US') => {
  if (!window.speechSynthesis) {
    console.warn('Speech synthesis not supported');
    return null;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.8;
  utterance.pitch = 1.1;

  let voiceSet = false;

  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      selectedVoice = englishVoice;
    } else if (voices.length > 0) {
      selectedVoice = voices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      voiceSet = true;
    }

    utterance.onend = () => {};
    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
    };

    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    setVoice();
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      setVoice();
    }, { once: true });

    setTimeout(() => {
      if (!voiceSet) {
        const voicesNow = window.speechSynthesis.getVoices();
        if (voicesNow.length > 0) {
          setVoice();
        } else {
          window.speechSynthesis.speak(utterance);
        }
      }
    }, 100);
  }

  return utterance;
};

const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

const isSpeechSupported = () => {
  return !!(window.speechSynthesis);
};

export { speak, stopSpeaking, isSpeechSupported };
