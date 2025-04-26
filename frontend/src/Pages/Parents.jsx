import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigateToDashboard from '../components/NavigateToDashboard';

function Parents() {
  const [parents, setParents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/parents')
      .then((res) => setParents(res.data.parents))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (parentId) => {
    axios.delete(`http://localhost:3000/parents/${parentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in Authorization header
      },
    })
      .then(() => setParents(parents.filter((parent) => parent.ParentID !== parentId)))
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <NavigateToDashboard />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Parents</h1>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 bg-white">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Student ID</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parents.map((parent) => (
              <tr key={parent.ParentID} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{parent.Name}</td>
                <td className="px-6 py-4">{parent.StudentID}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <button
                    onClick={() => navigate(`/parents/edit/${parent.ParentID}`)}
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(parent.ParentID)}
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
        onClick={() => navigate('/parents/create')}
        className="mt-6 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-md"
      >
        Add Parent
      </button>
    </div>
  );
}

export default Parents;