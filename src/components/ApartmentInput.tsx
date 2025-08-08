import { useState } from 'react';
import { Phone, Home, Delete } from 'lucide-react';

type ApartmentInputProps = {
  resComplexName: string
  onCall: (apartmentNumber: string) => void;
};

export const ApartmentInput = ({ onCall, resComplexName }: ApartmentInputProps) => {
  const [apartmentNumber, setApartmentNumber] = useState('');

  const handleNumberClick = (number: string) => {
    if (apartmentNumber.length < 4) { // Ограничиваем до 4 цифр
      setApartmentNumber(prev => prev + number);
    }
  };

  const handleDelete = () => {
    setApartmentNumber(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setApartmentNumber('');
  };

  const handleCall = () => {
    if (apartmentNumber.trim()) {
      onCall(apartmentNumber);
    }
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <Home className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-gray-800">{resComplexName}</h1>
            <p className="text-gray-600">Введите номер квартиры</p>
          </div>
          
          {/* Дисплей для номера квартиры */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
            <div className="text-3xl font-mono font-bold text-gray-800 min-h-[3rem] flex items-center justify-center">
              {apartmentNumber || '___'}
            </div>
          </div>

          {/* Цифровая клавиатура */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {numbers.map((number) => (
              <button
                key={number}
                onClick={() => handleNumberClick(number)}
                className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg p-4 text-center transition-colors duration-200 text-2xl font-bold text-blue-800"
                disabled={apartmentNumber.length >= 4 && number !== '*' && number !== '#'}
              >
                {number}
              </button>
            ))}
          </div>

          {/* Кнопки управления */}
          <div className="space-y-3">
            <button
              onClick={() => {
                handleCall()
                setApartmentNumber('')
              }}
              disabled={!apartmentNumber.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors text-lg"
            >
              <Phone className="w-6 h-6" />
              Позвонить
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={!apartmentNumber}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Delete className="w-5 h-5" />
                Удалить
              </button>
              
              <button
                onClick={handleClear}
                disabled={!apartmentNumber}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Очистить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};