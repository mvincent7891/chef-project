import { useEffect, useState } from "react";
import "./App.css";
import { useSpeechRecognitionContext } from "./contexts/SpeechRecognitionContext";
import { useSpeechSynthesisContext } from "./contexts/SpeechSynthesisContext";
import Settings from "./features/Settings/Settings";
import Chat from "./features/Chat/Chat";
import { Message } from "./features/Chat/Bubble";
import { useLLMContext } from "./contexts/LLMContext";
import {
  BUILT_IN_COMMANDS,
  CANNOT_REPEAT_MESSAGE,
  INVALID_COMMAND_MESSAGE,
  LONG_ANSWER_MESSAGE,
  START_MESSAGE,
  STOP_MESSAGE,
  THINKING_MESSAGE,
  formatMessage,
} from "./utils/messages";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { startSpeechRecognition } = useSpeechRecognitionContext();
  const { speak } = useSpeechSynthesisContext();
  const [lastMessage, setLastMessage] = useState("");
  const [repeat, setRepeat] = useState(false);
  const { sendMessage } = useLLMContext();

  const handleSpeak = (message: string | null, repeat?: boolean) => {
    if (!message) return;

    // Look into why SpeechSynthesis sometimes stops with longer messages that
    // are apparently well under the maximum character count (which is ~32K)
    if (repeat || message.length < 240) {
      speak(message);
    } else {
      speak(LONG_ANSWER_MESSAGE);
    }

    if (!repeat) {
      setMessages((m) => [...m, formatMessage(message, "Tony")]);
      setLastMessage(message);
    }
  };

  // TODO: Move this to the SpeechSynthesisContext
  useEffect(() => {
    if (repeat) {
      setRepeat(false);
      handleSpeak(lastMessage || CANNOT_REPEAT_MESSAGE, true);
    }
  }, [repeat, lastMessage, handleSpeak]);

  const handleStart = () => {
    speak(START_MESSAGE);
    startSpeechRecognition({
      handleValidCommandCallback: (transcript) => {
        sendMessage(transcript, handleSpeak);
        setMessages((m) => [...m, formatMessage(transcript, "You")]);
        setTimeout(() => handleSpeak(THINKING_MESSAGE), 50);
      },
      builtInCommands: Object.keys(BUILT_IN_COMMANDS),
      handleInvalidCommandCallback: () => {
        const response = INVALID_COMMAND_MESSAGE;
        // Deliberately not using handleSpeak to avoid setting last message
        speak(response);
      },
      executeBuiltInCommand: (command: string) => {
        if (["read", "repeat"].includes(command)) {
          setRepeat(true);
        } else {
          handleSpeak(BUILT_IN_COMMANDS[command]);
        }
      },
      handleEnd: () => {
        // Deliberately not using handleSpeak to avoid setting last message
        speak(STOP_MESSAGE);
        // TODO - perhaps just restart?
      },
    });
  };

  return (
    <>
      <Settings handleStart={handleStart} />
      <div>Conversation</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Chat
          messages={messages}
          sendMessage={(message) => {
            sendMessage(message, handleSpeak);
            setMessages((m) => [...m, formatMessage(message, "Tony")]);
          }}
        />
      </div>
    </>
  );
}

export default App;
