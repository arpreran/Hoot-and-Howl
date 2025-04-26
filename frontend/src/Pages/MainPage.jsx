import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to Hoot and Howl</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/sign-up')}
          className="px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-md shadow-md"
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default MainPage;