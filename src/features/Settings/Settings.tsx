import { Dock } from "primereact/dock";
import "primeicons/primeicons.css";
import { useSpeechRecognitionContext } from "../../contexts/SpeechRecognitionContext";

interface MenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const MenuItem = ({ children, onClick }: MenuItemProps) => {
  return (
    <button
      onClick={onClick}
      style={{
        margin: 5,
        paddingRight: 12,
        paddingLeft: 12,
        color: "white",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
};

interface SettingsProps {
  handleStart: () => void;
}

export default function Settings({ handleStart }: SettingsProps) {
  const { listening, stopSpeechRecognition } = useSpeechRecognitionContext();

  const items = [
    {
      label: "Settings",
      icon: (
        <MenuItem>
          <i className="pi pi-cog" />
        </MenuItem>
      ),
    },
    {
      label: "Voice",
      icon: (
        <MenuItem>
          <i className="pi pi-user" />
        </MenuItem>
      ),
    },
    listening
      ? {
          label: "Stop",
          icon: (
            <MenuItem onClick={stopSpeechRecognition}>
              <i style={{ color: "green" }} className="pi pi-power-off"></i>
            </MenuItem>
          ),
        }
      : {
          label: "Start",
          icon: (
            <MenuItem onClick={handleStart}>
              <i className="pi pi-power-off" />
            </MenuItem>
          ),
        },
  ];

  return (
    <div className="card dock-demo" style={{ cursor: "pointer" }}>
      <Dock model={items} position="top" />
    </div>
  );
}
