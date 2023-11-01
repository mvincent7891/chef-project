import { createContext, useContext, useState } from "react";
const OPENAI_API_KEY = import.meta.env.VITE_APP_OPEN_AI_KEY;

import OpenAI from "openai";
import { handleStream } from "../utils/handleStream";
import { MessageType, getInitialMessage } from "../utils/prompts";
import { availableFunctions, functionDefinitions } from "../utils/LLMFunctions";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export type LLMContextType = {
  sendMessage: (
    message: string,
    callback: (message: string) => void
  ) => Promise<void>;
  extractRecipe: (recipe: string) => Promise<void>;
};

export const LLMContext = createContext<LLMContextType>({
  sendMessage: () => Promise.resolve(),
  extractRecipe: () => Promise.resolve(),
});

export const LLMContextProvider = ({ children }: { children: JSX.Element }) => {
  // Need to rethink coupling in this context - is it meant to handle any LLM calls, or just to manage
  // the state of the primary conversation?
  const [conversation, setConversation] = useState<MessageType[]>([
    getInitialMessage(),
  ]);

  const sendMessage = async (
    content: string,
    callback: (message: string) => void
  ) => {
    const message: MessageType = { role: "user", content };
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [...conversation, message],
      stream: true,
    });
    setConversation((m) => [...m, message]);

    const streamCallback = (content: string) => {
      callback(content);
      const message: MessageType = {
        role: "assistant",
        content,
      };
      setConversation((m) => [...m, message]);
    };

    await handleStream(stream, streamCallback);
  };

  const extractRecipe = async (content: string) => {
    const message: MessageType = { role: "user", content };
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [message],
      functions: functionDefinitions,
    });
    const responseMessage = res.choices[0].message;

    if (responseMessage.function_call) {
      // Note: the JSON response may not always be valid; be sure to handle errors
      const functionName = responseMessage.function_call.name;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = JSON.parse(responseMessage.function_call.arguments);
      functionToCall(functionArgs);
    }
  };

  return (
    <LLMContext.Provider
      value={{
        sendMessage,
        extractRecipe,
      }}
    >
      {children}
    </LLMContext.Provider>
  );
};

export const useLLMContext = () => {
  const context = useContext(LLMContext);

  if (!context) {
    throw new Error("LLMContext must be used within a LLMContextProvider");
  }
  return context;
};
