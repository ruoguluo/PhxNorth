import { useState, useEffect, useCallback, useRef } from "react";
import Daily, {
  DailyCall,
  DailyParticipant,
  DailyEventObjectParticipant,
  DailyEventObjectParticipantLeft,
  DailyEventObjectTranscriptionMessage,
} from "@daily-co/daily-js";

// ---------------------------------------------------------------------------
// 1. useDaily – create & join a Daily call
// ---------------------------------------------------------------------------

type JoinState = "idle" | "joining" | "joined" | "error";

let globalCallObject: DailyCall | null = null;
let destroyTimeout: ReturnType<typeof setTimeout> | null = null;

export function useDaily(
  roomUrl: string | null,
  token: string | null
) {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [joinState, setJoinState] = useState<JoinState>("idle");
  const callObjectRef = useRef<DailyCall | null>(null);

  // Create or reuse call object on mount
  useEffect(() => {
    if (destroyTimeout) {
      clearTimeout(destroyTimeout);
      destroyTimeout = null;
    }

    let co = globalCallObject;
    if (!co) {
      co = Daily.getCallInstance() ?? Daily.createCallObject();
      globalCallObject = co;
    }

    callObjectRef.current = co;
    setCallObject(co);

    return () => {
      destroyTimeout = setTimeout(() => {
        if (globalCallObject) {
          globalCallObject.leave().catch(() => {});
          globalCallObject.destroy();
          globalCallObject = null;
        }
        destroyTimeout = null;
      }, 150);
    };
  }, []);

  // Join / leave when roomUrl + token change
  useEffect(() => {
    if (!callObject || !roomUrl || !token) return;

    // Avoid joining if already joined or joining
    const state = callObject.meetingState();
    if (state === "joined-meeting" || state === "joining-meeting") {
      setJoinState(state === "joined-meeting" ? "joined" : "joining");
      return;
    }

    setJoinState("joining");
    callObject
      .join({ url: roomUrl, token })
      .catch(() => setJoinState("error"));
  }, [callObject, roomUrl, token]);

  // Track join state via events
  useEffect(() => {
    if (!callObject) return;

    const handleJoined = () => setJoinState("joined");
    const handleLeft = () => setJoinState("idle");
    const handleError = () => setJoinState("error");

    callObject.on("joined-meeting", handleJoined);
    callObject.on("left-meeting", handleLeft);
    callObject.on("error", handleError);

    return () => {
      callObject.off("joined-meeting", handleJoined);
      callObject.off("left-meeting", handleLeft);
      callObject.off("error", handleError);
    };
  }, [callObject]);

  return { callObject, joinState };
}

// ---------------------------------------------------------------------------
// 2. useParticipants – reactive participant list
// ---------------------------------------------------------------------------

export function useParticipants(callObject: DailyCall | null) {
  const [participants, setParticipants] = useState<
    Map<string, DailyParticipant>
  >(new Map());

  useEffect(() => {
    if (!callObject) return;

    // Seed from current state
    const initial = callObject.participants();
    const map = new Map<string, DailyParticipant>();
    for (const [id, p] of Object.entries(initial)) {
      map.set(id, p);
    }
    setParticipants(map);

    const handleJoinedOrUpdated = (
      evt: DailyEventObjectParticipant | undefined
    ) => {
      if (!evt) return;
      setParticipants((prev) => {
        const next = new Map(prev);
        next.set(evt.participant.session_id, evt.participant);
        return next;
      });
    };

    const handleLeft = (evt: DailyEventObjectParticipantLeft | undefined) => {
      if (!evt) return;
      setParticipants((prev) => {
        const next = new Map(prev);
        next.delete(evt.participant.session_id);
        return next;
      });
    };

    callObject.on("participant-joined", handleJoinedOrUpdated);
    callObject.on("participant-updated", handleJoinedOrUpdated);
    callObject.on("participant-left", handleLeft);

    return () => {
      callObject.off("participant-joined", handleJoinedOrUpdated);
      callObject.off("participant-updated", handleJoinedOrUpdated);
      callObject.off("participant-left", handleLeft);
    };
  }, [callObject]);

  const localParticipant = participants.get("local") ?? null;

  return { participants, localParticipant };
}

// ---------------------------------------------------------------------------
// 3. useDevices – enumerate & switch devices
// ---------------------------------------------------------------------------

interface DeviceList {
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
  speakers: MediaDeviceInfo[];
}

export function useDevices(callObject: DailyCall | null) {
  const [devices, setDevices] = useState<DeviceList>({
    cameras: [],
    microphones: [],
    speakers: [],
  });

  useEffect(() => {
    if (!callObject) return;

    let cancelled = false;

    callObject.enumerateDevices().then(({ devices: deviceList }) => {
      if (cancelled) return;

      const cameras: MediaDeviceInfo[] = [];
      const microphones: MediaDeviceInfo[] = [];
      const speakers: MediaDeviceInfo[] = [];

      for (const d of deviceList) {
        if (d.kind === "videoinput") cameras.push(d);
        else if (d.kind === "audioinput") microphones.push(d);
        else if (d.kind === "audiooutput") speakers.push(d);
      }

      setDevices({ cameras, microphones, speakers });
    });

    return () => {
      cancelled = true;
    };
  }, [callObject]);

  const setCamera = useCallback(
    (deviceId: string) => {
      callObject?.setInputDevicesAsync({ videoDeviceId: deviceId });
    },
    [callObject]
  );

  const setMicrophone = useCallback(
    (deviceId: string) => {
      callObject?.setInputDevicesAsync({ audioDeviceId: deviceId });
    },
    [callObject]
  );

  const setSpeaker = useCallback(
    (deviceId: string) => {
      callObject?.setOutputDeviceAsync({ outputDeviceId: deviceId });
    },
    [callObject]
  );

  return {
    cameras: devices.cameras,
    microphones: devices.microphones,
    speakers: devices.speakers,
    setCamera,
    setMicrophone,
    setSpeaker,
  };
}

// ---------------------------------------------------------------------------
// 4. useRecording – cloud recording toggle
// ---------------------------------------------------------------------------

export function useRecording(callObject: DailyCall | null) {
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!callObject) return;

    const handleStarted = () => setIsRecording(true);
    const handleStopped = () => setIsRecording(false);

    callObject.on("recording-started", handleStarted);
    callObject.on("recording-stopped", handleStopped);

    return () => {
      callObject.off("recording-started", handleStarted);
      callObject.off("recording-stopped", handleStopped);
    };
  }, [callObject]);

  const startRecording = useCallback(() => {
    callObject?.startRecording();
  }, [callObject]);

  const stopRecording = useCallback(() => {
    callObject?.stopRecording();
  }, [callObject]);

  return { isRecording, startRecording, stopRecording };
}

// ---------------------------------------------------------------------------
// 5. useTranscription – live transcription messages
// ---------------------------------------------------------------------------

interface TranscriptionMessage {
  speaker: string;
  text: string;
  timestamp: number;
}

const MAX_MESSAGES = 5;
const MESSAGE_TTL_MS = 5_000;

export function useTranscription(callObject: DailyCall | null) {
  const [messages, setMessages] = useState<TranscriptionMessage[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Periodically prune stale messages
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const cutoff = Date.now() - MESSAGE_TTL_MS;
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.timestamp >= cutoff);
        return filtered.length === prev.length ? prev : filtered;
      });
    }, 1_000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!callObject) return;

    const handleTranscriptionMessage = (
      evt: DailyEventObjectTranscriptionMessage | undefined
    ) => {
      if (!evt) return;
      const msg: TranscriptionMessage = {
        speaker: evt.participantId,
        text: evt.text,
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const next = [...prev, msg];
        // Keep only the last MAX_MESSAGES
        return next.length > MAX_MESSAGES
          ? next.slice(next.length - MAX_MESSAGES)
          : next;
      });
    };

    const handleStarted = () => setIsTranscribing(true);
    const handleStopped = () => setIsTranscribing(false);

    callObject.on("transcription-message", handleTranscriptionMessage);
    callObject.on("transcription-started", handleStarted);
    callObject.on("transcription-stopped", handleStopped);

    return () => {
      callObject.off("transcription-message", handleTranscriptionMessage);
      callObject.off("transcription-started", handleStarted);
      callObject.off("transcription-stopped", handleStopped);
    };
  }, [callObject]);

  const startTranscription = useCallback(() => {
    callObject?.startTranscription();
  }, [callObject]);

  return { messages, isTranscribing, startTranscription };
}
