import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigateToDashboard from '../components/NavigateToDashboard';

function Students() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/students')
      .then((res) => {let studentsData = res.data.students;
        if (!Array.isArray(studentsData)) {
          studentsData = [studentsData];
        }
        setStudents(studentsData || []);})
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (studentId) => {
    axios.delete(`http://localhost:3000/students/${studentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in Authorization header
      },
    })
      .then(() => setStudents(students.filter((student) => student.StudentID !== studentId)))
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <NavigateToDashboard />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Students</h1>
      {Array.isArray(students) && students.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No students found.</p>
          <button
            onClick={() => navigate('/students/create')}
            className="mt-4 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-md"
          >
            Add Student
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 bg-white">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Age</th>
                <th scope="col" className="px-6 py-3">Grade</th>
                <th scope="col" className="px-6 py-3">Progress</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.StudentID} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{student.Name}</td>
                  <td className="px-6 py-4">{student.Age}</td>
                  <td className="px-6 py-4">{student.Grade}</td>
                  <td className="px-6 py-4">{student.Progress}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => navigate(`/students/edit/${student.StudentID}`)}
                      className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.StudentID)}
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
      {students.length > 0 && (
        <button
          onClick={() => navigate('/students/create')}
          className="mt-6 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-md"
        >
          Add Student
        </button>
      )}
    </div>
  );
}

export default Students;