import { useEffect, useRef, useState } from "react";
import { Bubble, Message } from "./Bubble";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

interface ChatProps {
  messages: Message[];
  sendMessage: (message: string) => void;
}

const Chat = ({ messages, sendMessage }: ChatProps) => {
  const [text, setText] = useState("");
  const mainRef = useRef(null);

  useEffect(() => {
    (mainRef.current as any).scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 500,
          height: 400,
          backgroundColor: "#313131",
          marginTop: 8,
          marginBottom: 8,
          borderRadius: 12,
          overflowY: "scroll",
        }}
      >
        {messages.map((m, i) => (
          <Bubble key={`chat-bubble-${i}`} message={m} />
        ))}
        <div ref={mainRef} />
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <InputTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          cols={30}
        />
        <Button
          style={{ width: 120, height: 60, marginLeft: 8 }}
          label="Send"
          icon="pi pi-send"
          onClick={() => {
            sendMessage(text);
            setText("");
          }}
        />
      </div>
    </>
  );
};

export default Chat;
