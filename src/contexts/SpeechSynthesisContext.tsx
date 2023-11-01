import { createContext, useContext, useEffect, useState } from "react";
import { initializeVoices } from "../utils/initializeVoices";

const DEFAULT_VOICE = "Google UK English Male";

export type SpeechSynthesisContextType = {
  speak: (transcript: string) => void; // Speak an utterance
  setVoice: (voice: SpeechSynthesisVoice) => void;
  getVoices: () => SpeechSynthesisVoice[];
};

export const SpeechSynthesisContext = createContext<SpeechSynthesisContextType>(
  {
    speak: () => {},
    setVoice: () => {},
    getVoices: () => [],
  }
);

export const SpeechSynthesisContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice>();

  useEffect(() => {
    initializeVoices().then((voices) => {
      setVoice(voices.find((v) => v.name === DEFAULT_VOICE));
    });
  }, []);

  const speak = (transcript: string) => {
    let utterance = new SpeechSynthesisUtterance(transcript);
    if (voice) {
      utterance.voice = voice;
    }
    speechSynthesis.speak(utterance);
  };

  const getVoices = () => {
    const voices = speechSynthesis.getVoices();
    return voices;
  };

  return (
    <SpeechSynthesisContext.Provider value={{ speak, setVoice, getVoices }}>
      {children}
    </SpeechSynthesisContext.Provider>
  );
};

export const useSpeechSynthesisContext = () => {
  const context = useContext(SpeechSynthesisContext);

  if (!context) {
    throw new Error(
      "SpeechSynthesisContext must be used within a SpeechSynthesisContextProvider"
    );
  }
  return context;
};
