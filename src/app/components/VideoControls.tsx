import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, Circle, PhoneOff } from "lucide-react";

interface VideoControlsProps {
  isMicOn: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  isOwner: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
  onEndCall: () => void;
}

export function VideoControls({
  isMicOn,
  isCameraOn,
  isScreenSharing,
  isRecording,
  isOwner,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleRecording,
  onEndCall,
}: VideoControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3 px-6 py-3 bg-gray-900/90 backdrop-blur rounded-full">
      {/* Mic toggle */}
      <button
        onClick={onToggleMic}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          isMicOn
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
        }`}
        title={isMicOn ? "Mute microphone" : "Unmute microphone"}
      >
        {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </button>

      {/* Camera toggle */}
      <button
        onClick={onToggleCamera}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          isCameraOn
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
        }`}
        title={isCameraOn ? "Turn off camera" : "Turn on camera"}
      >
        {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
      </button>

      {/* Screen share toggle */}
      <button
        onClick={onToggleScreenShare}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          isScreenSharing
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
        }`}
        title={isScreenSharing ? "Stop sharing" : "Share screen"}
      >
        {isScreenSharing ? <Monitor className="w-5 h-5" /> : <MonitorOff className="w-5 h-5" />}
      </button>

      {/* Recording toggle (owner only) */}
      {isOwner && (
        <button
          onClick={onToggleRecording}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isRecording
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
          title={isRecording ? "Stop recording" : "Start recording"}
        >
          <Circle className={`w-5 h-5 ${isRecording ? "fill-current" : ""}`} />
        </button>
      )}

      {/* End call */}
      <button
        onClick={onEndCall}
        className="w-12 h-12 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white transition-colors"
        title="End call"
      >
        <PhoneOff className="w-5 h-5" />
      </button>
    </div>
  );
}
