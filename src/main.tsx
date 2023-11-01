import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SpeechRecognitionContextProvider } from "./contexts/SpeechRecognitionContext.tsx";
import { SpeechSynthesisContextProvider } from "./contexts/SpeechSynthesisContext.tsx";
import { LLMContextProvider } from "./contexts/LLMContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SpeechRecognitionContextProvider>
      <SpeechSynthesisContextProvider>
        <LLMContextProvider>
          <App />
        </LLMContextProvider>
      </SpeechSynthesisContextProvider>
    </SpeechRecognitionContextProvider>
  </React.StrictMode>
);
