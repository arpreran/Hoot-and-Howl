import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigateToDashboard from '../components/NavigateToDashboard';

function Results() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/results')
      .then((res) => setResults(res.data.results))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (resultId) => {
    axios.delete(`http://localhost:3000/results/${resultId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in Authorization header
      },
    })
      .then(() => setResults(results.filter((result) => result.ResultID !== resultId)))
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <NavigateToDashboard />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Results</h1>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 bg-white">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">Student ID</th>
              <th scope="col" className="px-6 py-3">Quiz ID</th>
              <th scope="col" className="px-6 py-3">Score</th>
              <th scope="col" className="px-6 py-3">Taken On</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.ResultID} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{result.StudentID}</td>
                <td className="px-6 py-4">{result.QuizID}</td>
                <td className="px-6 py-4">{result.Score}</td>
                <td className="px-6 py-4">{result.TakenOn}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <button
                    onClick={() => navigate(`/results/edit/${result.ResultID}`)}
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(result.ResultID)}
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
      <button
        onClick={() => navigate('/results/create')}
        className="mt-6 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-md"
      >
        Add Result
      </button>
    </div>
  );
}

export default Results;