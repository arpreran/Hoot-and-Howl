import React , {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import bgg from './../assets/student-management-system-bgg.png'

function Dashboard() {
  const navigate = useNavigate();
  

  return (
    <div className="p-8 bg-gray-100 min-h-screen" style={{backgroundImage: `url(${bgg})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/students')}
          className="w-full px-6 py-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md"
        >
          Manage Students
        </button>
        <button
          onClick={() => navigate('/quizzes')}
          className="w-full px-6 py-4 text-white bg-green-600 hover:bg-green-700 rounded-md shadow-md"
        >
          Manage Quizzes
        </button>
        <button
          onClick={() => navigate('/courses')}
          className="w-full px-6 py-4 text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow-md"
        >
          Manage Courses
        </button>
        <button
          onClick={() => navigate('/parents')}
          className="w-full px-6 py-4 text-white bg-yellow-600 hover:bg-yellow-700 rounded-md shadow-md"
        >
          Manage Parents
        </button>
        <button
          onClick={() => navigate('/results')}
          className="w-full px-6 py-4 text-white bg-red-600 hover:bg-red-700 rounded-md shadow-md"
        >
          Manage Results
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full px-6 py-4 text-white bg-gray-600 hover:bg-gray-700 rounded-md shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;