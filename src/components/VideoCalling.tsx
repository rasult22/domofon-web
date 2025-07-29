import { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, PhoneOff, MicOff, Mic } from 'lucide-react';

type VideoCallingProps = {
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  onEndCall: () => void;
};

export const VideoCalling = ({ localStream, remoteStream, onEndCall }: VideoCallingProps) => {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Set up video streams
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);
  
  // Call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // // Toggle microphone
  const toggleMicrophone = () => {
    const audioTracks = localStream?.getAudioTracks();
    if (audioTracks && audioTracks.length > 0) {
      setIsMicMuted(isMuted => {
        audioTracks.forEach(track => {
          track.enabled = !isMuted;
        });
        return !isMuted;
      });
    }
  };
  
  // Toggle video
  const toggleVideo = () => {
    const videoTracks = localStream?.getVideoTracks();
    if (videoTracks && videoTracks.length > 0) {
      const enabled = !isVideoEnabled;
      videoTracks.forEach(track => {
        track.enabled = enabled;
      });
      setIsVideoEnabled(enabled);
    }
  };
  
  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Видеозвонок</h1>
            <p className="text-gray-600 mt-2">{formatTime(callDuration)}</p>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-green-600 text-sm">Соединение установлено</span>
          </div>
          
          {/* Remote Video (Large) - Портретный формат */}
          <div className="relative mb-4 bg-black rounded-lg overflow-hidden" style={{aspectRatio: '9/16', height: '60vh'}}>
            <video 
              ref={remoteVideoRef} 
              className="w-full h-full object-cover" 
              autoPlay 
              playsInline
            />
            
            {/* Local Video (Small overlay) */}
            <div className="absolute bottom-4 right-4 w-1/4 rounded-lg overflow-hidden border-2 border-white" style={{aspectRatio: '9/16'}}>
              <video 
                ref={localVideoRef} 
                className="w-full h-full object-cover" 
                autoPlay 
                playsInline 
                muted
              />
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={toggleMicrophone}
              className={`p-3 rounded-full ${isMicMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}
            >
              {isMicMuted ? <MicOff key={'mic-off'} className="w-6 h-6" /> : <Mic key={'mic-on'} className="w-6 h-6" />}
            </button>
            
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full ${!isVideoEnabled ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}
            >
              {!isVideoEnabled ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>
            
            <button
              onClick={onEndCall}
              className="p-3 rounded-full bg-red-600 text-white"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
          
          <button
            onClick={onEndCall}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Завершить звонок
          </button>
        </div>
      </div>
    </div>
  );
};