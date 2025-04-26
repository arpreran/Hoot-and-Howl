import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditResult() {
  const { resultId } = useParams(); // Get the result ID from the URL
  const [studentId, setStudentId] = useState('');
  const [quizId, setQuizId] = useState('');
  const [score, setScore] = useState('');
  const [takenOn, setTakenOn] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the result details by ID
    axios.get(`http://localhost:3000/results/${resultId}`)
      .then((res) => {
        const result = res.data.results;
        console.group(res.data)
        setStudentId(result.StudentID);
        setQuizId(result.QuizID);
        setScore(result.Score);
        setTakenOn(result.TakenOn);
      })
      .catch((err) => console.error(err));
  }, [resultId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the result details
    axios.put(`http://localhost:3000/results/${resultId}`, { studentId, quizId, score, takenOn }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in Authorization header
      },
    })
      .then(() => {
        alert('Result updated successfully');
        navigate('/results'); // Redirect to the results list page
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to update result. Please try again.');
      });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Result</h1>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Student ID</label>
          <input
            type="number"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Quiz ID</label>
          <input
            type="number"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Score</label>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Taken On</label>
          <input
            type="date"
            value={takenOn}
            onChange={(e) => setTakenOn(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Update Result
        </button>
      </form>
    </div>
  );
}

export default EditResult;