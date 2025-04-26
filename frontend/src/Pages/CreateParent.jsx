import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateParent() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/add-parent', { name, studentId })
      .then(() => {
        alert('Parent added successfully');
        navigate('/parents'); // Redirect to the parents list page
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to add parent. Please try again.');
      });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Parent</h1>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter parent's name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Student ID</label>
          <input
            type="number"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter associated student ID"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md"
        >
          Add Parent
        </button>
      </form>
    </div>
  );
}

export default CreateParent;