import { Home } from 'lucide-react';
import type { Apartment } from '../types/apartment';

type ApartmentListProps = {
  apartments: Apartment[];
  onSelectApartment: (apartment: Apartment) => void;
};

export const ApartmentList = ({ apartments, onSelectApartment }: ApartmentListProps) => {
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