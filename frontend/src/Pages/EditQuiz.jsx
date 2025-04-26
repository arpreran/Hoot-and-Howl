import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditQuiz() {
  const { quizId } = useParams(); // Get the quiz ID from the URL
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [totalQuestions, setTotalQuestions] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the quiz details by ID
    axios.get(`http://localhost:3000/quizzes/${quizId}`)
      .then((res) => {
        const quiz = res.data.quiz;
        setTitle(quiz.Title);
        setCourseId(quiz.CourseID);
        setTotalQuestions(quiz.TotalQuestions);
      })
      .catch((err) => console.error(err));
  }, [quizId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the quiz details
    axios.put(`http://localhost:3000/quizzes/${quizId}`, { 
      title, 
      courseId: parseInt(courseId, 10), // Ensure CourseID is sent as an integer
      totalQuestions: parseInt(totalQuestions, 10), // Ensure TotalQuestions is sent as an integer
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in Authorization header
      },
    })
      .then(() => {
        alert('Quiz updated successfully');
        navigate('/quizzes'); // Redirect to the quizzes list page
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to update quiz. Please try again.');
      });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Quiz</h1>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the quiz title"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Course ID</label>
          <input
            type="number"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the Course ID"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Total Questions</label>
          <input
            type="number"
            value={totalQuestions}
            onChange={(e) => setTotalQuestions(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the total number of questions"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Update Quiz
        </button>
      </form>
    </div>
  );
}

export default EditQuiz;