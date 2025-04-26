import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditStudent() {
  const { studentId } = useParams(); // Get the student ID from the URL
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [progress, setProgress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the student details by ID
    axios.get(`http://localhost:3000/students/${studentId}`)
      .then((res) => {
        console.log(res.data);
        const student = res.data.student[0];
        setName(student.Name);
        setAge(student.Age);
        setGrade(student.Grade);
        setProgress(student.Progress);
      })
      .catch((err) => console.error(err));
  }, [studentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the student details
    axios.put(`http://localhost:3000/students/${studentId}`, { name, age, grade, progress }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in Authorization header
      },
    })
      .then(() => {
        alert('Student updated successfully');
        navigate('/students'); // Redirect to the students list page
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to update student. Please try again.');
      });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Student</h1>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Grade</label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Progress</label>
          <textarea
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Update Student
        </button>
      </form>
    </div>
  );
}

export default EditStudent;