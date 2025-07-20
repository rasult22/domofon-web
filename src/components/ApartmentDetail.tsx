import { Phone, ArrowLeft } from 'lucide-react';
import type { Apartment } from '../types/apartment';

type ApartmentDetailProps = {
  apartment: Apartment;
  onBack: () => void;
  onCall: (apartment: Apartment) => void;
};

export const ApartmentDetail = ({ apartment, onBack, onCall }: ApartmentDetailProps) => {
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