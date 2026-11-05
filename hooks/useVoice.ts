import { useCallback, useEffect, useState } from 'react';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { transcribeAudio } from '../lib/api';

export function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  useEffect(() => {
    Speech.getAvailableVoicesAsync()
      .then((v) => { if (!v || v.length === 0) setTtsAvailable(false); })
      .catch(() => setTtsAvailable(false));
  }, []);

  const speak = useCallback(async (text: string, lang: 'mr' | 'en') => {
    try {
      setIsSpeaking(true);
      Speech.speak(text, {
        language: lang === 'mr' ? 'mr-IN' : 'en-US',
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => { setIsSpeaking(false); setTtsAvailable(false); },
      });
    } catch {
      setIsSpeaking(false);
      setTtsAvailable(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => { Speech.stop(); setIsSpeaking(false); }, []);

  const startListening = useCallback(async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) { setIsListening(false); return; }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(async (): Promise<string | null> => {
    if (!recording) return null;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsListening(false);
      if (!uri) return null;
      const { text } = await transcribeAudio(uri);
      return text || null;
    } catch {
      setIsListening(false);
      setRecording(null);
      return null;
    }
  }, [recording]);

  return {
    speak, stopSpeaking, isSpeaking,
    startListening, stopListening, isListening,
    ttsAvailable,
    sttAvailable: true,
  };
}
