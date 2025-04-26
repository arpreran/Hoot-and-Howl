import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditParent() {
  const { parentId } = useParams(); // Get the parent ID from the URL
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the parent details by ID
    axios.get(`http://localhost:3000/parents/${parentId}`)
      .then((res) => {
        const parent = res.data.parent;
        setName(parent.Name);
        setStudentId(parent.StudentID);
      })
      .catch((err) => console.error(err));
  }, [parentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the parent details
    axios.put(`http://localhost:3000/parents/${parentId}`, { name, studentId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in Authorization header
      },
    })
      .then(() => {
        alert('Parent updated successfully');
        navigate('/parents'); // Redirect to the parents list page
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to update parent. Please try again.');
      });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Parent</h1>
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
          <label className="block text-gray-700 font-medium mb-2">Student ID</label>
          <input
            type="number"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Update Parent
        </button>
      </form>
    </div>
  );
}

export default EditParent;