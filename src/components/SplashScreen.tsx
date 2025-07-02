import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 animate-fadeIn">
      <div className="bg-white rounded-full shadow-lg p-6 mb-6 animate-bounce">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L4.21 7 12 3.5 19.79 7 12 9.5zm0 2.5l10-5v6c0 5.25-4.5 9.5-10 9.5S2 20.25 2 15V9l10 5z" fill="#2563eb"/>
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-blue-800 mb-2 animate-fadeIn">Student Management System</h1>
      <p className="text-lg text-blue-700 mb-8 animate-fadeIn delay-200">Empowering Education, Simplifying Administration</p>
      <div className="w-48 h-2 bg-blue-200 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-blue-600 animate-loadingBar" style={{ width: '60%' }}></div>
      </div>
      <span className="text-blue-600 animate-pulse">Loading...</span>
    </div>
  );
};

export default SplashScreen;

// Add the following to your index.css or tailwind config for animations:
// .animate-fadeIn { animation: fadeIn 1s ease-in; }
// .animate-loadingBar { animation: loadingBar 2s infinite linear; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes loadingBar { 0% { width: 0; } 100% { width: 100%; } } 