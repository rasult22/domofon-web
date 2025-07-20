import { useRef, useState } from 'react';
import { call } from './webrtc/client';
import { ApartmentDetail } from './components/ApartmentDetail';
import { ApartmentList } from './components/ApartmentList';
import type { Apartment } from './types/apartment';
import { CallingStatus } from './components/CallingStatus';
import { CallEnded } from './components/CallEnded';
import { CallDeclined } from './components/CallDeclined';

type CallOverlayStatus = 'CALLING' | 'ENDED' | 'DECLINED' | 'NONE'
// Главный компонент приложения
const HomeScreen = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [callId, setCallId] =useState<string>()
  const [callOverlayStatus, setCallOverlayStatus] = useState<CallOverlayStatus>('CALLING')
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
  const { call: callData } = await call(audioRef)
  if (callData) {
    setCallId(callData.id)
  }  
    // when call status changes show talking screen
  };
  const handleEndCall = () => {
    setSelectedApartment(null);
    setCallOverlayStatus('ENDED')
  }

  return (
    <div className='flex w-full flex-1 justify-center'>
      <audio ref={audioRef} autoPlay></audio>
      <div className='absolute w-full top-0 right-0'>
        {callOverlayStatus === 'CALLING' && <CallingStatus onEndCall={handleEndCall} />}
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