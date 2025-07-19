import { useRef, useState } from 'react';
import { Phone, ArrowLeft, Home } from 'lucide-react';
import { call } from './webrtc/client';

// Компонент списка квартир
const ApartmentList = ({ apartments, onSelectApartment }: {
  apartments: Apartment[];
  onSelectApartment: (apartment: Apartment) => void;
}) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <Home className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-gray-800">ЖК Солнечный</h1>
            <p className="text-gray-600">Выберите квартиру для звонка</p>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {apartments.map((apartment) => (
              <button
                key={apartment.id}
                onClick={() => onSelectApartment(apartment)}
                className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg p-6 text-center transition-colors duration-200"
              >
                <div className="text-3xl font-bold text-blue-800">
                  {apartment.number}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент информации о квартире с возможностью звонка
const ApartmentDetail = ({ apartment, onBack, onCall }: {
  apartment: Apartment;
  onBack: () => void;
  onCall: (apartment: Apartment) => void;
}) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-blue-600 mb-4">
              {apartment.number}
            </div>
            <p className="text-lg text-gray-600">
              {apartment.floor} этаж
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600">
                Нажмите кнопку "Позвонить" чтобы связаться с жильцом
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onCall(apartment)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors text-lg"
            >
              <Phone className="w-6 h-6" />
              Позвонить
            </button>
            
            <button
              onClick={onBack}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Вернуться к списку
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
type Apartment = {
  id: number;
  number: string;
  floor: number;
};

// Главный компонент приложения
const HomeScreen = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
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
  await call(audioRef)

    // when call status changes show talking screen
  };

  return (
    <div className='flex w-full flex-1 justify-center'>
      <audio ref={audioRef} autoPlay></audio>
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