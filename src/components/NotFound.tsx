import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 flex items-center justify-center">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icon and Error Code */}
          <div className="mb-3">
            <div className="text-[48px] font-bold text-blue-600 mb-2">404</div>
            <Home className="w-10 h-10 text-gray-400 mx-auto mb-4" />
          </div>
          
          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-[24px] font-bold text-gray-800 mb-2">
              Страница не найдена
            </h1>
            <p className="text-gray-600 text-[16px] leading-[100%]">
              К сожалению, запрашиваемая страница не существует или была перемещена.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-md"
            >
              <Home className="w-6 h-6" />
              На главную
            </button>
            
            <button
              onClick={handleGoBack}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-md"

            >
              <ArrowLeft className="w-5 h-5" />
              Назад
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};