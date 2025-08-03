import { useRef, useState } from 'react';
import { call } from './webrtc/client';
import { ApartmentInput } from './components/ApartmentInput';
import { CallEnded } from './components/CallEnded';
import { CallInProgress } from './components/CallInProgress';
import { CallDeclined } from './components/CallDeclined';
import { pb } from './queries/client';
import { useCallsSubscription } from './queries/webrtc';
import { VideoCalling } from './components/VideoCalling';

type CallOverlayStatus = 'CALLING' | 'ENDED' | 'DECLINED' | 'CALL_IN_PROGRESS' | 'NONE' 

// Главный компонент приложения
const HomeScreen = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  useCallsSubscription()
  const [pc, setPC] = useState<RTCPeerConnection>()
  const [callId, setCallId] =useState<string>()
  const [localStream, setLocalStream] = useState<MediaStream>()
  const [remoteStream, setRemoteStream] = useState<MediaStream>()
  const [callOverlayStatus, setCallOverlayStatus] = useState<CallOverlayStatus>('NONE')
  const [callingApartment, setCallingApartment] = useState<string | null>(null);

  const handleCall = async (apartmentNumber: string) => {
    setCallingApartment(apartmentNumber);
    console.log('calling apartment:', callingApartment)
    setCallOverlayStatus('CALLING')
    const { call: callData, pc: incomingPC, localStream, remoteStream} = await call(audioRef)
    if (callData) {
      setCallId(callData.id)
    }
    if (incomingPC) {
      setPC(incomingPC)
    }
    if (localStream) {
      setLocalStream(localStream)
    }
    if (remoteStream) {
      setRemoteStream(remoteStream)
    }
  };

  const handleEndCall = (status: CallOverlayStatus = 'ENDED') => {
    setCallingApartment(null);
    setCallOverlayStatus(status)
    if (callId) {
      pb.collection('calls').delete(callId)
    }
    if (pc) {
      pc.close()
    }
    if (localStream) {
      console.log('stopping tracks')
      localStream.getTracks().forEach(track => {
        track.stop();
      })
    }
  }

  return (
    <div className='flex w-full flex-1 justify-center'>
      <audio ref={audioRef} autoPlay></audio>
      <div className='absolute w-full top-0 right-0'>
        {callOverlayStatus === 'CALLING' && <VideoCalling localStream={localStream} remoteStream={remoteStream} onEndCall={handleEndCall} />}
        {callOverlayStatus === 'CALL_IN_PROGRESS' && <CallInProgress onEndCall={handleEndCall} />}
        {callOverlayStatus === 'ENDED' && <CallEnded onBack={() => {
          setCallOverlayStatus('NONE')
        }} />}
        {callOverlayStatus === 'DECLINED' && <CallDeclined onBack={() => {
          setCallOverlayStatus('NONE')
        }} />}
      </div>
      
      <ApartmentInput onCall={handleCall} />
    </div>
  );
};

export default HomeScreen;