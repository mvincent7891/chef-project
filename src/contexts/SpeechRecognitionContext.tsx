import { createContext, useContext, useState } from "react";

const CHEF_NAME = "tony"; // Name of the chat chef
const CONFIDENCE_THRESHOLD = 0.85; // Confidence beyond which we consider the transcribed text a valid command

const isCommand = (commandParts: string[], commands: string[]): boolean => {
  return commandParts.length === 1 && commands.includes(commandParts[0]);
};

declare var window: any;
const SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = false;

export type StartSpeechRecognitionProps = {
  handleValidCommandCallback: (command: string) => void; // Handle a valid voice command
  builtInCommands: string[];
  handleInvalidCommandCallback?: () => void; // Handle what we believe was a command (e.g. started with the correct word), but falls below the threshold
  executeBuiltInCommand?: (command: string) => void; // Handle the build in command
  handleEnd?: () => void; // Called when listening has stopped
};

export type SpeechRecognitionContextType = {
  startSpeechRecognition: (props: StartSpeechRecognitionProps) => void;
  stopSpeechRecognition: () => void;
  listening: boolean;
};

export const SpeechRecognitionContext =
  createContext<SpeechRecognitionContextType>({
    startSpeechRecognition: () => {},
    stopSpeechRecognition: () => {},
    listening: false,
  });

export const SpeechRecognitionContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [listening, setListening] = useState(false);

  const stopSpeechRecognition = () => {
    recognition.stop();
    setListening(false);
  };

  const startSpeechRecognition = ({
    handleValidCommandCallback,
    handleInvalidCommandCallback,
    executeBuiltInCommand,
    handleEnd,
    builtInCommands,
  }: StartSpeechRecognitionProps) => {
    recognition.start();
    setListening(true);

    recognition.onend = () => {
      handleEnd?.();
      setListening(false);
    };

    recognition.onresult = (event: any) => {
      console.debug("[SR] Message result", event);

      try {
        const { resultIndex } = event;
        const { confidence, transcript } = event.results[resultIndex][0];

        const transcribedWords = transcript?.trim()?.split(" ");
        const isBuiltInCommand = isCommand(transcribedWords, builtInCommands);
        const initialWord = transcribedWords[0]?.trim()?.toLowerCase();

        if (confidence > CONFIDENCE_THRESHOLD && isBuiltInCommand) {
          const command = transcribedWords[0];
          executeBuiltInCommand?.(command);
        } else if (
          confidence > CONFIDENCE_THRESHOLD &&
          initialWord === CHEF_NAME
        ) {
          const [_, ...rest] = transcribedWords;
          handleValidCommandCallback(rest.join(" "));
        } else if (isBuiltInCommand || initialWord === CHEF_NAME) {
          handleInvalidCommandCallback?.();
        }
      } catch (err) {
        console.error(err);
      }
    };
  };

  return (
    <SpeechRecognitionContext.Provider
      value={{ startSpeechRecognition, stopSpeechRecognition, listening }}
    >
      {children}
    </SpeechRecognitionContext.Provider>
  );
};

export const useSpeechRecognitionContext = () => {
  const context = useContext(SpeechRecognitionContext);

  if (!context) {
    throw new Error(
      "SpeechRecognitionContext must be used within a SpeechRecognitionContextProvider"
    );
  }
  return context;
};
