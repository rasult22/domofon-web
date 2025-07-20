import { PhoneOff, ArrowLeft } from 'lucide-react';

type CallDeclinedProps = {
  onBack: () => void; // функция для возврата к списку квартир
};

export const CallDeclined = ({ onBack }: CallDeclinedProps) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <PhoneOff className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Звонок отклонен</h1>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
            <p className="text-gray-600">
              Житель квартиры отклонил ваш звонок.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={onBack}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
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