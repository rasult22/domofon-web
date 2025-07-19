import React, { useState, useEffect, useRef } from 'react';
import { Home, Phone, PhoneOff, Mic, MicOff, Unlock } from 'lucide-react';
import { useCalls, useCallsSubscription } from './queries/webrtc';
import { acceptCall } from './webrtc/accept_call';

// GettingCall Component
function GettingCall({ handleAccept, handleDecline }: {
  handleAccept: () => void;
  handleDecline: () => void;
}) {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Status bar */}
      <div className="pt-12 pb-4 px-6 z-10">
        <div className="flex justify-between items-center">
          <span className="text-white text-sm opacity-75">Входящий звонок</span>
          <span className="text-white text-sm opacity-75">Домофон</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <div className="flex flex-col items-center mb-12">
          {/* Pulsing intercom icon */}
          <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
            <Home size={64} color="white" />
          </div>
          
          <h1 className="text-white text-3xl font-bold mb-2">Домофон</h1>
          <p className="text-gray-400 mt-2 text-base text-center">
            Кто-то звонит в домофон
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center mb-8">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-green-400 text-sm">Входящий звонок...</span>
        </div>
      </div>

      {/* Controls */}
      <div className="pb-12 px-8">
        {/* Hint card */}
        <div className="pb-8 px-8">
          <div className="bg-gray-800 bg-opacity-80 rounded-2xl p-4">
            <p className="text-gray-300 text-sm text-center">
              Примите звонок, чтобы поговорить с посетителем
            </p>
          </div>
        </div>

        {/* Call buttons */}
        <div className="flex justify-center items-center gap-20">
          {/* Decline button */}
          <button
            onClick={handleDecline}
            className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
          >
            <PhoneOff size={32} color="white" />
          </button>

          {/* Accept button */}
          <button
            onClick={handleAccept}
            className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
          >
            <Phone size={32} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// CallDeclined Component
function CallDeclined({ startNewCall }: {startNewCall: () => void}) {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 px-8">
      <div className="bg-gray-800 rounded-3xl p-8 flex flex-col items-center w-full max-w-sm">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
          <PhoneOff size={32} color="white" />
        </div>
        <h2 className="text-white text-xl font-semibold mb-2">Звонок завершен</h2>
        <p className="text-gray-400 text-center mb-6">
          Домофон отключен
        </p>
        <button
          onClick={startNewCall}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full text-white font-semibold transition-colors"
        >
          Новый звонок
        </button>
      </div>
    </div>
  );
}

// Main IntercomCallScreen Component
export default function IntercomCallScreen() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [callStatus, setCallStatus] = useState('declined'); // incoming, accepted, declined
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isDoorOpened, setIsDoorOpened] = useState(false);
  const [call, setCall] = useState<{
      id: string;
      user_id: string;
      offer: any;
      answer: any;
      receiver_id: string;
      status: string;
  }>()
  const {data} = useCalls()
  useCallsSubscription()

  // Simulate incoming call after component mounts
  useEffect(() => {
    console.log(data, 'calls')
    if (callStatus === 'declined' && data?.length) {
      const call = data.find(c => c.status === 'pending')
      console.log('got i new call here it is:', call)
      if (call) {
        setCallStatus('incoming')
        setCall(call)
      }
    }
  }, [data]);

  // Call duration timer
  useEffect(() => {
    let timer: number;
    if (callStatus === 'accepted') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccept = () => {
    setCallStatus('accepted');
    setCallDuration(0);
    if (call) {
      acceptCall(call.id, audioRef)
    }
  };

  const handleDecline = () => {
    setCallStatus('declined');
  };

  const handleEndCall = () => {
    setCallStatus('declined');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleOpenDoor = () => {
    if (isDoorOpened) return;
    
    setIsDoorOpened(true);
    setTimeout(() => {
      setIsDoorOpened(false);
    }, 3000);
  };

  const startNewCall = () => {
    setCallStatus('incoming');
    setIsDoorOpened(false);
    setIsMuted(false);
  };

  // Incoming call screen
  if (callStatus === 'incoming') {
    return (
      <GettingCall 
        handleAccept={handleAccept} 
        handleDecline={handleDecline} 
      />
    );
  }

  // Call declined screen
  if (callStatus === 'declined') {
    return (
      <CallDeclined startNewCall={startNewCall} />
    );
  }

  // Active call screen
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <audio ref={audioRef}  autoPlay/>
      {/* Status bar */}
      <div className="pt-12 pb-4 px-6 z-10">
        <div className="flex justify-between items-center">
          <span className="text-white text-sm opacity-75">Разговор</span>
          <span className="text-white text-sm opacity-75">
            {formatTime(callDuration)}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <div className="flex flex-col items-center mb-12">
          {/* Intercom icon */}
          <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <Home size={64} color="white" />
          </div>
          
          <h1 className="text-white text-3xl font-bold mb-2">Домофон</h1>
          <p className="text-gray-400 mt-2 text-base text-center">
            Кто-то звонит в домофон
          </p>
        </div>

        {/* Connected status */}
        <div className="flex items-center mb-8">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-green-400 text-sm">Соединен</span>
        </div>

        {/* Door status */}
        {isDoorOpened && (
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-orange-400 text-sm">Дверь открыта</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="pb-12 px-8">
        {/* Mute button */}
        <div className="flex justify-center items-center pb-8">
          <button
            onClick={toggleMute}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
              isMuted ? 'bg-red-600' : 'bg-gray-700'
            }`}
          >
            {isMuted ? (
              <MicOff size={32} color="white" />
            ) : (
              <Mic size={32} color="white" />
            )}
          </button>
        </div>

        {/* Door and end call buttons */}
        <div className="flex justify-between items-center px-8">
          {/* Door button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleOpenDoor}
              disabled={isDoorOpened}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95 ${
                isDoorOpened ? 'bg-orange-600' : 'bg-blue-600'
              } ${isDoorOpened ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <Unlock size={32} color="white" />
            </button>
            <span className={`text-sm font-medium ${
              isDoorOpened ? 'text-orange-400' : 'text-blue-400'
            }`}>
              {isDoorOpened ? 'Дверь открыта' : 'Открыть дверь'}
            </span>
          </div>

          {/* End call button */}
          <button
            onClick={handleEndCall}
            className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
          >
            <PhoneOff size={32} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}