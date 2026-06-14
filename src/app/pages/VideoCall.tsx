import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Loader2, Clock, Maximize2, Minimize2 } from "lucide-react";
import { videoAPI, walletAPI } from "../../lib/api";
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
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Billing state
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [billingWarning, setBillingWarning] = useState<"low" | "depleted" | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [topUpAmount, setTopUpAmount] = useState(10);
  const [toppingUp, setToppingUp] = useState(false);
  const [topUpError, setTopUpError] = useState<string | null>(null);
  const billingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
  // Billing loop – mentee debits every 60s
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (joinState !== "joined" || !sessionId || user?.role !== "mentee") return;
    walletAPI
      .get()
      .then((w) => setWalletBalance(w.balance))
      .catch(() => {});

    billingIntervalRef.current = setInterval(async () => {
      try {
        const result = await walletAPI.debitTick(sessionId);
        setWalletBalance(result.balance);
        if (result.warning && result.warning !== billingWarning) {
          setBillingWarning(result.warning);
          setShowWarningModal(true);
          if (callObject) {
            callObject.sendAppMessage({
              type: "credit-warning",
              level: result.warning,
            });
          }
          if (result.warning === "depleted" && countdown === null) {
            setCountdown(180);
          }
        } else if (!result.warning && billingWarning) {
          setBillingWarning(null);
          setShowWarningModal(false);
          setCountdown(null);
          if (callObject) {
            callObject.sendAppMessage({
              type: "credit-warning",
              level: "resolved",
            });
          }
        }
      } catch {
        /* retry next tick */
      }
    }, 60_000);

    return () => {
      if (billingIntervalRef.current) clearInterval(billingIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinState, sessionId, user?.role, callObject]);

  // -----------------------------------------------------------------------
  // Countdown timer – force-ends call when credits depleted
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      callObject?.leave().catch(() => {});
      if (sessionId) videoAPI.endSessionCall(sessionId).catch(() => {});
      navigate(`/app/session/${id}`);
      return;
    }
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown === null ? "inactive" : countdown > 0 ? "active" : "done"]);

  // -----------------------------------------------------------------------
  // Mentor app-message listener for credit warnings
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!callObject || user?.role !== "mentor") return;
    const handleAppMessage = (evt: any) => {
      if (evt?.data?.type === "credit-warning") {
        const level = evt.data.level;
        if (level === "resolved") {
          setBillingWarning(null);
          setShowWarningModal(false);
          setCountdown(null);
        } else {
          setBillingWarning(level);
          setShowWarningModal(true);
          if (level === "depleted") setCountdown(180);
        }
      }
    };
    callObject.on("app-message", handleAppMessage);
    return () => {
      callObject.off("app-message", handleAppMessage);
    };
  }, [callObject, user?.role]);

  // -----------------------------------------------------------------------
  // Mid-call top-up handler
  // -----------------------------------------------------------------------
  async function handleMidCallTopUp() {
    setToppingUp(true);
    setTopUpError(null);
    try {
      await walletAPI.topUp(topUpAmount);
      const w = await walletAPI.get();
      setWalletBalance(w.balance);
      setBillingWarning(null);
      setShowWarningModal(false);
      setCountdown(null);
      if (callObject) {
        callObject.sendAppMessage({ type: "credit-warning", level: "resolved" });
      }
    } catch (e) {
      setTopUpError(e instanceof Error ? e.message : "Top-up failed");
    } finally {
      setToppingUp(false);
    }
  }

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
      <div className={`${isFullscreen ? "fixed inset-0 z-50" : "relative w-full h-[calc(100vh-73px)]"} bg-gray-900 flex items-center justify-center`}>
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
      <div className={`${isFullscreen ? "fixed inset-0 z-50" : "relative w-full h-[calc(100vh-73px)]"} bg-gray-900 flex items-center justify-center`}>
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
      <div className={`${isFullscreen ? "fixed inset-0 z-50" : "relative w-full h-[calc(100vh-73px)]"} bg-gray-900 flex items-center justify-center`}>
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
    <div className={`${isFullscreen ? "fixed inset-0 z-50" : "relative w-full h-[calc(100vh-73px)]"} bg-gray-900 flex flex-col overflow-hidden`}>
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

        <div className="flex items-center gap-3 text-gray-400 text-sm">
          {isRecording && (
            <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium mr-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              REC
            </span>
          )}
          {user?.role === "mentee" && walletBalance !== null && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium mr-1 ${
                walletBalance <= 1
                  ? "bg-red-100 text-red-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              Credit: ${walletBalance.toFixed(2)}
            </span>
          )}

          {/* Fullscreen Toggle Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="text-xs font-semibold">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </button>

          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(callDuration)}</span>
          </span>
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

      {/* Credit warning / depleted modal */}
      {showWarningModal && billingWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full mx-4 overflow-hidden">
            {/* Header */}
            <div
              className={`px-6 py-4 ${
                billingWarning === "depleted"
                  ? "bg-red-600"
                  : "bg-amber-500"
              }`}
            >
              <h2 className="text-white text-lg font-semibold">
                {billingWarning === "depleted"
                  ? "Credits Depleted"
                  : "Low Credit Balance"}
              </h2>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Mentor view */}
              {user?.role === "mentor" && (
                <p className="text-gray-300 text-sm">
                  {billingWarning === "depleted"
                    ? "The mentee's credits have been depleted. The call will end automatically unless they add more credits."
                    : "The mentee's credit balance is running low."}
                </p>
              )}

              {/* Mentee view */}
              {user?.role !== "mentor" && (
                <>
                  <p className="text-gray-300 text-sm">
                    {billingWarning === "depleted" ? (
                      <>
                        Your credits have been depleted. Add more credits to
                        continue this session.
                      </>
                    ) : (
                      <>
                        Your credit balance is low
                        {walletBalance !== null && (
                          <> &mdash; approximately{" "}
                            <strong className="text-white">
                              {Math.max(1, Math.floor(walletBalance / 0.50))}{" "}
                              minutes
                            </strong>{" "}
                            remaining</>
                        )}
                        . Add credits to avoid interruption.
                      </>
                    )}
                  </p>

                  {walletBalance !== null && (
                    <p className="text-gray-400 text-xs">
                      Current balance:{" "}
                      <span className="text-white font-medium">
                        ${walletBalance.toFixed(2)}
                      </span>
                    </p>
                  )}

                  {/* Top-up presets */}
                  <div className="flex gap-2">
                    {[5, 10, 20].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setTopUpAmount(amt)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          topUpAmount === amt
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleMidCallTopUp}
                    disabled={toppingUp}
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                  >
                    {toppingUp ? "Processing…" : `Add $${topUpAmount} Credit`}
                  </button>

                  {topUpError && (
                    <p className="text-red-400 text-xs text-center">
                      {topUpError}
                    </p>
                  )}
                </>
              )}

              {/* Countdown timer (both roles) */}
              {billingWarning === "depleted" && countdown !== null && (
                <div className="text-center pt-2 border-t border-gray-700">
                  <p className="text-gray-400 text-xs mb-1">
                    Call ends in
                  </p>
                  <span className="text-2xl font-mono text-red-400 font-bold">
                    {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                    {String(countdown % 60).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>

            {/* Footer – dismiss only for low balance or mentor */}
            {(billingWarning === "low" || user?.role === "mentor") && (
              <div className="px-6 pb-5">
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium transition-colors"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
