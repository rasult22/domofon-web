import { PhoneOff, ArrowLeft } from 'lucide-react';

type CallEndedProps = {
  onBack: () => void; // функция для возврата к списку квартир
  duration?: number; // длительность звонка в секундах (опционально)
};

export const CallEnded = ({ onBack, duration }: CallEndedProps) => {
  // Форматирование времени в формат MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 mx-auto">
              <PhoneOff className="w-12 h-12 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Звонок завершен</h1>
            {duration !== undefined && (
              <p className="text-gray-600 mt-2">Длительность: {formatTime(duration)}</p>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
            <p className="text-gray-600">
              Соединение с квартирой было завершено.
            </p>
          </div>
          
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
  );
};