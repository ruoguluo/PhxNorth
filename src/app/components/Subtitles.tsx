import { useEffect, useState } from "react";

interface SubtitlesProps {
  messages: { speaker: string; text: string; timestamp: number }[];
  visible: boolean;
}

export function Subtitles({ messages, visible }: SubtitlesProps) {
  const [faded, setFaded] = useState(false);

  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  // Auto-fade after 3 seconds of no new messages
  useEffect(() => {
    if (!lastMessage) return;
    setFaded(false);

    const timer = setTimeout(() => {
      setFaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [lastMessage?.timestamp, lastMessage?.text]);

  if (!visible || !lastMessage) return null;

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-full px-4 transition-opacity duration-500 ${
        faded ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="bg-black/70 backdrop-blur-sm rounded-lg px-5 py-3 text-center">
        <span className="text-white text-sm">
          <span className="font-bold">{lastMessage.speaker}: </span>
          {lastMessage.text}
        </span>
      </div>
    </div>
  );
}
