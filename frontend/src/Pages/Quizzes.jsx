import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigateToDashboard from '../components/NavigateToDashboard';

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/quizzes')
      .then((res) => {console.log(res.data.quizzes); // Log the quizzes data to the console
        let quizData = res.data.quizzes || [];
        if (!Array.isArray(quizData)){
          quizData=[quizData];
        }
        setQuizzes(quizData)})
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (quizId) => {
    axios.delete(`http://localhost:3000/quizzes/${quizId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in Authorization header
      },
    })
      .then(() => setQuizzes(quizzes.filter((quiz) => quiz.QuizID !== quizId)))
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <NavigateToDashboard />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quizzes</h1>
      {Array.isArray(quizzes) && quizzes.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No quizzes found.</p>
          <button
            onClick={() => navigate('/quizzes/create')}
            className="mt-4 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-md"
          >
            Add Quiz
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 bg-white">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.QuizID} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{quiz.Title}</td>
                  <td className="px-6 py-4">{quiz.Description}</td>
                  <td className="px-6 py-4">{quiz.Type}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => navigate(`/quizzes/edit/${quiz.QuizID}`)}
                      className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.QuizID)}
                      className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {quizzes.length > 0 && (
        <button
          onClick={() => navigate('/quizzes/create')}
          className="mt-6 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-md"
        >
          Add Quiz
        </button>
      )}
    </div>
  );
}

export default Quizzes;