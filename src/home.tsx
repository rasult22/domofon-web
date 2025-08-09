import { useRef, useState } from 'react';
import { call } from './webrtc/client';
import { ApartmentInput } from './components/ApartmentInput';
import { CallEnded } from './components/CallEnded';
import { CallDeclined } from './components/CallDeclined';
import { pb } from './queries/client';
import { useCallsSubscription } from './queries/webrtc';
import { VideoCalling } from './components/VideoCalling';
import { useNavigate } from 'react-router-dom';
import { useResComplex } from './queries/res_complex';

type CallOverlayStatus = 'CALLING' | 'ENDED' | 'DECLINED' | 'NONE' 

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
  const navigate = useNavigate()
  const { data: resComplex, isLoading } = useResComplex()

  if (isLoading) {
    return <div className='flex justify-center items-center h-screen'>
      <div className='w-16 h-16 border-4 border-dashed rounded-full animate-spin'></div>
    </div>
  }
  if (!resComplex) {
    navigate('/random-shit')
    return
  }

  const handleCall = async (apartmentNumber: string) => {
    setCallingApartment(apartmentNumber);
    console.log('calling apartment:', callingApartment)
    setCallOverlayStatus('CALLING')
    const { call: callData, pc: incomingPC, localStream, remoteStream} = await call(audioRef, apartmentNumber, resComplex.id)

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
      pb.collection('calls').update(callId, {
        status: 'ENDED'
      })
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
      <div className='absolute w-full top-0 right-0'>
        {callOverlayStatus === 'CALLING' && <VideoCalling localStream={localStream} remoteStream={remoteStream} onEndCall={handleEndCall} />}
        {callOverlayStatus === 'ENDED' && <CallEnded onBack={() => {
          setCallOverlayStatus('NONE')
        }} />}
        {callOverlayStatus === 'DECLINED' && <CallDeclined onBack={() => {
          setCallOverlayStatus('NONE')
        }} />}
      </div>
      <ApartmentInput resComplexName={resComplex.name} onCall={handleCall} />
    </div>
  );
};

export default HomeScreen;