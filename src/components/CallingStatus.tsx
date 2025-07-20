import { Phone } from 'lucide-react';

type CallingStatusProps = {
  duration?: number; // длительность звонка в секундах (опционально)
  onEndCall: () => void
};

export const CallingStatus = ({ duration, onEndCall }: CallingStatusProps) => {
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
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
              <Phone className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Звонок</h1>
            {duration !== undefined && (
              <p className="text-gray-600 mt-2">{formatTime(duration)}</p>
            )}
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-green-600 text-sm">Соединение...</span>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
            <p className="text-gray-600">
              Пожалуйста, подождите. Идет соединение с квартирой.
            </p>
          </div>
          
          <button
            onClick={onEndCall}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Завершить звонок
          </button>
        </div>
      </div>
    </div>
  );
};