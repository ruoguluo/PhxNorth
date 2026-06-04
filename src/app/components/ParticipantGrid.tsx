import { useEffect, useRef } from "react";

interface ParticipantGridProps {
  participants: Map<string, any>;
  localParticipant: any;
  mode: "1v1" | "gallery";
}

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function ParticipantTile({
  participant,
  className,
}: {
  participant: any;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTrack = participant?.videoTrack ?? participant?.video;
  const hasVideo = !!videoTrack;
  const name: string = participant?.name ?? participant?.identity ?? "Participant";

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoTrack) return;

    // Attach the track to the video element
    if (typeof videoTrack.attach === "function") {
      videoTrack.attach(el);
    } else if (videoTrack.srcObject) {
      el.srcObject = videoTrack.srcObject;
    } else if (videoTrack instanceof MediaStreamTrack) {
      el.srcObject = new MediaStream([videoTrack]);
    }

    return () => {
      if (typeof videoTrack.detach === "function") {
        videoTrack.detach(el);
      }
      el.srcObject = null;
    };
  }, [videoTrack]);

  return (
    <div
      className={`relative bg-gray-800 rounded-lg overflow-hidden ${className ?? ""}`}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={!!participant?.isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(name)}
          </div>
        </div>
      )}

      {/* Name overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-gradient-to-t from-black/60 to-transparent">
        <span className="text-white text-sm font-medium truncate block">
          {name}
        </span>
      </div>
    </div>
  );
}

export function ParticipantGrid({
  participants,
  localParticipant,
  mode,
}: ParticipantGridProps) {
  const remoteParticipants = Array.from(participants.values()).filter(
    (p) => p !== localParticipant && !p?.isLocal,
  );

  if (mode === "1v1") {
    const remote = remoteParticipants[0];
    return (
      <div className="relative w-full h-full min-h-[400px]">
        {/* Remote participant fills the screen */}
        {remote ? (
          <ParticipantTile participant={remote} className="w-full h-full" />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <p className="text-gray-400 text-lg">Waiting for participant to join…</p>
          </div>
        )}

        {/* Local participant PiP */}
        {localParticipant && (
          <div className="absolute bottom-4 right-4 z-10" style={{ width: 200, height: 150 }}>
            <ParticipantTile
              participant={{ ...localParticipant, isLocal: true }}
              className="w-full h-full border-2 border-white/20 shadow-lg"
            />
          </div>
        )}
      </div>
    );
  }

  // Gallery mode
  const allParticipants = localParticipant
    ? [{ ...localParticipant, isLocal: true }, ...remoteParticipants]
    : remoteParticipants;

  return (
    <div
      className="w-full h-full grid gap-2 p-2"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      }}
    >
      {allParticipants.map((p, i) => (
        <ParticipantTile
          key={p?.identity ?? p?.sid ?? i}
          participant={p}
          className="aspect-video"
        />
      ))}
    </div>
  );
}
