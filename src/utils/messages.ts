import { Message } from "../features/Chat/Bubble";

// Format a message which will be displayed in the chat (to be distinguished from
// messages sent or received from the LLM)
export const formatMessage = (content: string, sender: string) => {
  return {
    sender,
    message: content,
    sentAt: new Date(),
    inbound: sender === "You",
  };
};

export const START_MESSAGE = "I'm listening.";
export const STOP_MESSAGE = "I've stopped listening.";
export const LONG_ANSWER_MESSAGE =
  "I've got quite a long answer for you; you may want to read it.";
export const INVALID_COMMAND_MESSAGE = "Sorry, can you repeat that?";
export const THINKING_MESSAGE = "One moment.";
export const CANNOT_REPEAT_MESSAGE = "I've not yet said anything.";
export const BUILT_IN_COMMANDS: Record<string, string> = {
  repeat: "I'll repeat the last thing I said.",
  read: "I'll read the long answer",
  ingredients: "Great, I will list the recipe ingredients.",
  help: "Sure, to give me a command, simply say, 'Tony...' followed by whatever you'd like me to do. Otherwise, you may use one of my built in commands: 'Ingredients', 'Repeat', or 'Help'.",
};
