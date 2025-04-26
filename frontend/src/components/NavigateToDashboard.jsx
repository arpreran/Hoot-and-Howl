import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavigateToDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-gray-100 flex justify-center items-center">
      <button
        onClick={() => navigate('/dashboard')}
        className="px-6 py-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md"
      >
        Go to Dashboard
      </button>
    </div>
  );
}

export default NavigateToDashboard;