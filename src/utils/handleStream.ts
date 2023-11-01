import OpenAI from "openai";
import { Stream } from "openai/streaming.mjs";

export const handleStream = async (
  stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>,
  handleChunk: (message: string) => void
) => {
  let buffer = "";
  for await (const part of stream) {
    const token = part.choices[0]?.delta?.content || "";
    buffer += token;

    // Check if the buffer contains a complete sentence
    if (isCompleteThought(buffer)) {
      // Flush the buffer
      handleChunk(buffer);
      buffer = "";
    }
  }
  // Handle any remaining text in the buffer
  if (buffer) {
    handleChunk(buffer);
  }
};

const isCompleteThought = (text: string) => {
  if (text.length > 220) return true;

  const isSecondToLastCharNumber = /^[0-9]$/.test(text.at(-2) || "");
  const isLastCharPunctuation = /[.!?]\n$/.test(text);
  const containsRecentNewLine =
    text.length > 48 && /\n/.test(text.slice(-2, -1));

  return (
    containsRecentNewLine ||
    (!isSecondToLastCharNumber && isLastCharPunctuation)
  );
};
