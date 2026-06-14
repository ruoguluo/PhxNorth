import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Hand, Users, Clock, Mic, MicOff, Maximize2, Minimize2 } from "lucide-react";
import { videoAPI, type RoomInfo } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import {
  useDaily,
  useParticipants,
  useRecording,
  useTranscription,
} from "../../lib/daily";
import { ParticipantGrid } from "../components/ParticipantGrid";
import { VideoControls } from "../components/VideoControls";
import { Subtitles } from "../components/Subtitles";

// ---------------------------------------------------------------------------
// Duration timer hook
// ---------------------------------------------------------------------------

function useDurationTimer(started: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;
    startRef.current = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - (startRef.current ?? Date.now())) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [started]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  const display =
    hours > 0
      ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return display;
}

// ---------------------------------------------------------------------------
// WorkshopCall page
// ---------------------------------------------------------------------------

export function WorkshopCall() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const workshopId = parseInt(id ?? "0", 10);
  const isMentor = user?.role === "mentor";

  // Room state
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Local device toggles
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);

  // Hand raise tracking
  const [handRaises, setHandRaises] = useState<Set<string>>(new Set());

  // Daily hooks
  const { callObject, joinState } = useDaily(
    roomInfo?.room_url ?? null,
    roomInfo?.token ?? null,
  );
  const { participants, localParticipant } = useParticipants(callObject);
  const { isRecording, startRecording, stopRecording } = useRecording(callObject);
  const { messages, startTranscription } = useTranscription(callObject);

  const duration = useDurationTimer(joinState === "joined");

  // --------------------------------------------------
  // Create / join room on mount
  // --------------------------------------------------
  useEffect(() => {
    if (!workshopId) return;

    const initRoom = async () => {
      try {
        setLoading(true);
        const info = isMentor
          ? await videoAPI.createWorkshopRoom(workshopId)
          : await videoAPI.joinWorkshopRoom(workshopId);
        setRoomInfo(info);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to join workshop call");
      } finally {
        setLoading(false);
      }
    };

    initRoom();
  }, [workshopId, isMentor]);

  // Start transcription once joined
  useEffect(() => {
    if (joinState === "joined") {
      startTranscription();
    }
  }, [joinState, startTranscription]);

  // --------------------------------------------------
  // Hand raise via app messages
  // --------------------------------------------------
  useEffect(() => {
    if (!callObject) return;

    const handleAppMessage = (evt: any) => {
      if (!evt?.data) return;
      const { type, sessionId } = evt.data;
      if (type === "hand-raise") {
        setHandRaises((prev) => {
          const next = new Set(prev);
          next.add(sessionId ?? evt.fromId);
          return next;
        });
      } else if (type === "hand-lower") {
        setHandRaises((prev) => {
          const next = new Set(prev);
          next.delete(sessionId ?? evt.fromId);
          return next;
        });
      }
    };

    callObject.on("app-message", handleAppMessage);
    return () => {
      callObject.off("app-message", handleAppMessage);
    };
  }, [callObject]);

  // --------------------------------------------------
  // Control handlers
  // --------------------------------------------------
  const toggleMic = useCallback(() => {
    callObject?.setLocalAudio(!isMicOn);
    setIsMicOn((v) => !v);
  }, [callObject, isMicOn]);

  const toggleCamera = useCallback(() => {
    callObject?.setLocalVideo(!isCameraOn);
    setIsCameraOn((v) => !v);
  }, [callObject, isCameraOn]);

  const toggleScreenShare = useCallback(() => {
    if (isScreenSharing) {
      callObject?.stopScreenShare();
    } else {
      callObject?.startScreenShare();
    }
    setIsScreenSharing((v) => !v);
  }, [callObject, isScreenSharing]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const handleHandRaise = useCallback(() => {
    if (!callObject || !localParticipant) return;
    const localId = localParticipant.session_id;
    const isRaised = handRaises.has(localId);

    callObject.sendAppMessage({
      type: isRaised ? "hand-lower" : "hand-raise",
      sessionId: localId,
    });

    setHandRaises((prev) => {
      const next = new Set(prev);
      if (isRaised) {
        next.delete(localId);
      } else {
        next.add(localId);
      }
      return next;
    });
  }, [callObject, localParticipant, handRaises]);

  const endCall = useCallback(async () => {
    if (isMentor) {
      try {
        await videoAPI.endWorkshopCall(workshopId);
      } catch {
        // ignore – best effort
      }
      navigate("/app/mentor/workshops");
    } else {
      callObject?.leave().catch(() => {});
      navigate("/app/courses");
    }
  }, [isMentor, workshopId, callObject, navigate]);

  // --------------------------------------------------
  // Derived values
  // --------------------------------------------------
  const participantCount = participants.size;
  const localId = localParticipant?.session_id ?? "";
  const isLocalHandRaised = handRaises.has(localId);

  // Build participant list for sidebar
  const participantList = Array.from(participants.values()).map((p: any) => ({
    id: p.session_id,
    name: p.user_name ?? p.name ?? p.identity ?? "Participant",
    isLocal: p.local,
    isMuted: !p.audio,
    hasHandRaised: handRaises.has(p.session_id),
  }));

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  if (loading) {
    return (
      <div className={`flex items-center justify-center ${isFullscreen ? "fixed inset-0 z-50 h-screen" : "h-[calc(100vh-73px)] w-full"} bg-gray-950`}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Joining workshop call…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center ${isFullscreen ? "fixed inset-0 z-50 h-screen" : "h-[calc(100vh-73px)] w-full"} bg-gray-950`}>
        <div className="text-center max-w-md">
          <p className="text-red-400 text-lg font-medium mb-2">Unable to join call</p>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 h-screen" : "relative w-full h-[calc(100vh-73px)]"} flex bg-gray-950 text-white overflow-hidden`}>
      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold truncate">Workshop Call</h1>
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              {participantCount}/25 participants
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Fullscreen Toggle Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="text-xs font-semibold">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
            </button>

            <span className="flex items-center gap-1 text-sm text-gray-400 font-mono">
              <Clock className="w-4 h-4" />
              {duration}
            </span>
            {isRecording && (
              <span className="flex items-center gap-1 text-xs text-red-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                REC
              </span>
            )}
          </div>
        </div>

        {/* Video grid */}
        <div className="flex-1 relative">
          <ParticipantGrid
            participants={participants}
            localParticipant={localParticipant}
            mode="gallery"
          />

          {/* Subtitles overlay */}
          <Subtitles messages={messages} visible={showSubtitles} />
        </div>

        {/* Controls bar */}
        <div className="flex items-center justify-center gap-3 py-4 bg-gray-950">
          <VideoControls
            isMicOn={isMicOn}
            isCameraOn={isCameraOn}
            isScreenSharing={isScreenSharing}
            isRecording={isRecording}
            isOwner={isMentor}
            onToggleMic={toggleMic}
            onToggleCamera={toggleCamera}
            onToggleScreenShare={toggleScreenShare}
            onToggleRecording={toggleRecording}
            onEndCall={endCall}
          />

          {/* Hand raise button (mentees + mentors) */}
          <button
            onClick={handleHandRaise}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isLocalHandRaised
                ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            }`}
            title={isLocalHandRaised ? "Lower hand" : "Raise hand"}
          >
            <Hand className="w-5 h-5" />
          </button>

          {/* Subtitles toggle */}
          <button
            onClick={() => setShowSubtitles((v) => !v)}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
              showSubtitles
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            }`}
            title={showSubtitles ? "Hide subtitles" : "Show subtitles"}
          >
            CC
          </button>
        </div>
      </div>

      {/* Right sidebar – participant list */}
      <div className="w-64 border-l border-gray-800 bg-gray-900/50 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-gray-300">
            Participants ({participantCount})
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {participantList.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800/50"
            >
              {/* Hand raise indicator */}
              {p.hasHandRaised && (
                <Hand className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              )}

              <span className="flex-1 text-sm text-gray-300 truncate">
                {p.name}
                {p.isLocal && (
                  <span className="text-gray-500 ml-1">(You)</span>
                )}
              </span>

              {/* Mute status */}
              {p.isMuted ? (
                <MicOff className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              ) : (
                <Mic className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
