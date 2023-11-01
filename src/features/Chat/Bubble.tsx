export type Message = {
  sender: string;
  sentAt: Date;
  message: string;
  inbound: boolean;
};

interface BubbleProps {
  message: Message;
}

export const Bubble = ({ message }: BubbleProps) => {
  const { inbound } = message;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: inbound ? "flex-start" : "flex-end",
      }}
    >
      <div
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 8,
          paddingBottom: 8,
          margin: 12,
          backgroundColor: inbound ? "#585858" : "#2196f3",
          color: "white",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          borderTopLeftRadius: inbound ? 0 : 8,
          borderTopRightRadius: inbound ? 8 : 0,
          textAlign: inbound ? "left" : "right",
          maxWidth: "80%",
        }}
      >
        {message.message.split("\n").map((m) => (
          <>
            {m}
            <br />
          </>
        ))}
      </div>
    </div>
  );
};
