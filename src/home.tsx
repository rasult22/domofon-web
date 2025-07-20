import { useEffect, useRef, useState } from 'react';
import { call } from './webrtc/client';
import { ApartmentDetail } from './components/ApartmentDetail';
import { ApartmentList } from './components/ApartmentList';
import type { Apartment } from './types/apartment';
import { CallingStatus } from './components/CallingStatus';
import { CallEnded } from './components/CallEnded';
import { CallInProgress } from './components/CallInProgress';
import { CallDeclined } from './components/CallDeclined';
import { pb } from './queries/client';
import { useCalls, useCallsSubscription } from './queries/webrtc';

type CallOverlayStatus = 'CALLING' | 'ENDED' | 'DECLINED' | 'CALL_IN_PROGRESS' | 'NONE' 
// Главный компонент приложения
const HomeScreen = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const {data: calls} = useCalls()
  useCallsSubscription()
  const [pc, setPC] = useState<RTCPeerConnection>()
  const [callId, setCallId] =useState<string>()
  const [localStream, setLocalStream] = useState<MediaStream>()
  const [callOverlayStatus, setCallOverlayStatus] = useState<CallOverlayStatus>('CALL_IN_PROGRESS')
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);

  // Данные о квартирах в доме
  const apartments = [
    { id: 1, number: "1", floor: 1 },
    { id: 2, number: "2", floor: 1 },
    { id: 3, number: "3", floor: 1 },
    { id: 4, number: "4", floor: 2 },
    { id: 5, number: "5", floor: 2 },
    { id: 6, number: "6", floor: 2 },
    { id: 7, number: "7", floor: 3 },
    { id: 8, number: "8", floor: 3 },
    { id: 9, number: "9", floor: 3 },
    { id: 10, number: "10", floor: 4 },
    { id: 11, number: "11", floor: 4 },
    { id: 12, number: "12", floor: 4 }
  ];

  const handleSelectApartment = (apartment: Apartment) => {
    setSelectedApartment(apartment);
  };

  const handleBack = () => {
    setSelectedApartment(null);
  };

  const handleCall = async () => {
    setCallOverlayStatus('CALLING')
    const { call: callData, pc: incomingPC, localStream} = await call(audioRef)
    if (callData) {
      setCallId(callData.id)
    }
    if (incomingPC) {
      setPC(incomingPC)
    }
    if (localStream) {
      setLocalStream(localStream)
    }
    // when call status changes show talking screen
  };
  const handleEndCall = (status: CallOverlayStatus = 'ENDED') => {
    setSelectedApartment(null);
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

  useEffect(() => {
    if (calls && calls.length < 1 && pc && localStream && callId && callOverlayStatus === 'CALLING') {
      handleEndCall('DECLINED')
    }
  }, [calls])

  return (
    <div className='flex w-full flex-1 justify-center'>
      <audio ref={audioRef} autoPlay></audio>
      <div className='absolute w-full top-0 right-0'>
        {callOverlayStatus === 'CALLING' && <CallingStatus onEndCall={handleEndCall} />}
        {callOverlayStatus === 'CALL_IN_PROGRESS' && <CallInProgress onEndCall={handleEndCall} />}
        {callOverlayStatus === 'ENDED' && <CallEnded onBack={() => {
          setCallOverlayStatus('NONE')
        }} />}
        {callOverlayStatus === 'DECLINED' && <CallDeclined onBack={() => {
          setCallOverlayStatus('NONE')
        }} />}
      </div>
      {selectedApartment ? (
        <ApartmentDetail 
          apartment={selectedApartment}
          onBack={handleBack}
          onCall={handleCall}
        />
      ) : (
        <ApartmentList 
          apartments={apartments}
          onSelectApartment={handleSelectApartment}
        />
      )}
    </div>
  );
};

export default HomeScreen;