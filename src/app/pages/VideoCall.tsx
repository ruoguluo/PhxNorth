import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Loader2, Clock } from "lucide-react";
import { videoAPI } from "../../lib/api";
import {
  useDaily,
  useParticipants,
  useRecording,
  useTranscription,
} from "../../lib/daily";
import { VideoControls } from "../../app/components/VideoControls";
import { ParticipantGrid } from "../../app/components/ParticipantGrid";
import { Subtitles } from "../../app/components/Subtitles";
import { useAuth } from "../../lib/auth-context";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

// ---------------------------------------------------------------------------
// VideoCall page
// ---------------------------------------------------------------------------

export function VideoCall() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const sessionId = parseInt(id ?? "0", 10);

  // Room creation state
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local toggle states
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Call duration timer
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Daily hooks
  const { callObject, joinState } = useDaily(roomUrl, token);
  const { participants, localParticipant } = useParticipants(callObject);
  const { isRecording, startRecording, stopRecording } =
    useRecording(callObject);
  const { messages: transcriptionMessages } = useTranscription(callObject);

  // -----------------------------------------------------------------------
  // Create room on mount
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!sessionId) {
      setError("Invalid session ID");
      setIsConnecting(false);
      return;
    }

    let cancelled = false;

    async function createRoom() {
      try {
        const data = await videoAPI.createSessionRoom(sessionId);
        if (cancelled) return;
        setRoomUrl(data.room_url);
        setToken(data.token);
        setRoomName(data.room_name);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to create video room"
        );
      } finally {
        if (!cancelled) setIsConnecting(false);
      }
    }

    createRoom();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // -----------------------------------------------------------------------
  // Start duration timer when call joins
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (joinState === "joined") {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [joinState]);

  // -----------------------------------------------------------------------
  // Track screen share state from Daily events
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!callObject) return;

    const handleLocalScreenShareStarted = () => setIsScreenSharing(true);
    const handleLocalScreenShareStopped = () => setIsScreenSharing(false);

    callObject.on("local-screen-share-started", handleLocalScreenShareStarted);
    callObject.on("local-screen-share-stopped", handleLocalScreenShareStopped);

    return () => {
      callObject.off(
        "local-screen-share-started",
        handleLocalScreenShareStarted
      );
      callObject.off(
        "local-screen-share-stopped",
        handleLocalScreenShareStopped
      );
    };
  }, [callObject]);

  // -----------------------------------------------------------------------
  // Control handlers
  // -----------------------------------------------------------------------
  const handleToggleMic = useCallback(() => {
    if (!callObject) return;
    const newState = !isMicOn;
    callObject.setLocalAudio(newState);
    setIsMicOn(newState);
  }, [callObject, isMicOn]);

  const handleToggleCamera = useCallback(() => {
    if (!callObject) return;
    const newState = !isCameraOn;
    callObject.setLocalVideo(newState);
    setIsCameraOn(newState);
  }, [callObject, isCameraOn]);

  const handleToggleScreenShare = useCallback(() => {
    if (!callObject) return;
    if (isScreenSharing) {
      callObject.stopScreenShare();
    } else {
      callObject.startScreenShare();
    }
  }, [callObject, isScreenSharing]);

  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const handleEndCall = useCallback(async () => {
    if (callObject) {
      await callObject.leave();
    }
    try {
      await videoAPI.endSessionCall(sessionId);
    } catch {
      // Swallow – we're leaving regardless
    }
    navigate("/app/session/" + id);
  }, [callObject, sessionId, id, navigate]);

  const handleBack = useCallback(() => {
    navigate("/app/session/" + id);
  }, [id, navigate]);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsConnecting(true);
    videoAPI
      .createSessionRoom(sessionId)
      .then((data) => {
        setRoomUrl(data.room_url);
        setToken(data.token);
        setRoomName(data.room_name);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to create video room"
        );
      })
      .finally(() => setIsConnecting(false));
  }, [sessionId]);

  // Determine if this user is the owner/mentor (can control recording)
  const isOwner = user?.role === "mentor" || user?.role === "admin";

  // -----------------------------------------------------------------------
  // Error state
  // -----------------------------------------------------------------------
  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-red-400 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Unable to join call
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
            >
              Back to Session
            </button>
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Connecting / joining state
  // -----------------------------------------------------------------------
  if (isConnecting || joinState === "joining") {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">
            {isConnecting ? "Setting up your call…" : "Joining the call…"}
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Join error state
  // -----------------------------------------------------------------------
  if (joinState === "error") {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-red-400 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Failed to join call
          </h2>
          <p className="text-gray-400 mb-6">
            There was an error connecting to the video call. Please try again.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
            >
              Back to Session
            </button>
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Active call layout
  // -----------------------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900/80 backdrop-blur border-b border-gray-800 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Back to session"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white text-sm font-semibold truncate max-w-xs">
              {roomName ?? `Session #${sessionId}`}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          {isRecording && (
            <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium mr-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              REC
            </span>
          )}
          <Clock className="w-4 h-4" />
          <span className="font-mono">{formatDuration(callDuration)}</span>
        </div>
      </div>

      {/* Main video area */}
      <div className="flex-1 relative min-h-0">
        <ParticipantGrid
          participants={participants}
          localParticipant={localParticipant}
          mode="1v1"
        />

        {/* Subtitles overlay */}
        <Subtitles messages={transcriptionMessages} visible={true} />
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-center py-4 bg-gray-900/80 backdrop-blur border-t border-gray-800 z-20">
        <VideoControls
          isMicOn={isMicOn}
          isCameraOn={isCameraOn}
          isScreenSharing={isScreenSharing}
          isRecording={isRecording}
          isOwner={isOwner}
          onToggleMic={handleToggleMic}
          onToggleCamera={handleToggleCamera}
          onToggleScreenShare={handleToggleScreenShare}
          onToggleRecording={handleToggleRecording}
          onEndCall={handleEndCall}
        />
      </div>
    </div>
  );
}
