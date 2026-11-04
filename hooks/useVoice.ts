import { useCallback, useEffect, useState } from 'react';
import * as Speech from 'expo-speech';

export function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(true);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Speech.getAvailableVoicesAsync()
      .then((voices) => {
        if (!voices || voices.length === 0) setTtsAvailable(false);
      })
      .catch(() => setTtsAvailable(false));
  }, []);

  const speak = useCallback(async (text: string, lang: 'mr' | 'en') => {
    try {
      setIsSpeaking(true);
      Speech.speak(text, {
        language: lang === 'mr' ? 'mr-IN' : 'en-US',
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => {
          setIsSpeaking(false);
          setTtsAvailable(false);
        },
      });
    } catch {
      setIsSpeaking(false);
      setTtsAvailable(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    Speech.stop();
    setIsSpeaking(false);
  }, []);

  // STT not integrated in v1 — never fabricate a transcription.
  const startListening = useCallback(() => {
    setIsListening(true);
    setTimeout(() => setIsListening(false), 800);
  }, []);

  const stopListening = useCallback(() => setIsListening(false), []);

  return {
    speak,
    stopSpeaking,
    isSpeaking,
    startListening,
    stopListening,
    isListening,
    ttsAvailable,
    sttAvailable: false,
  };
}
