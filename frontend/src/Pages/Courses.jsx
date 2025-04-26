import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigateToDashboard from '../components/NavigateToDashboard';

function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/courses')
      .then((res) => setCourses(res.data.courses))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (courseId) => {
    axios.delete(`http://localhost:3000/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in Authorization header
      },
    })
      .then(() => setCourses(courses.filter((course) => course.CourseID !== courseId)))
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <NavigateToDashboard />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Courses</h1>
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
            {courses.map((course) => (
              <tr key={course.CourseID} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{course.Title}</td>
                <td className="px-6 py-4">{course.Description}</td>
                <td className="px-6 py-4">{course.Type}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <button
                    onClick={() => navigate(`/courses/edit/${course.CourseID}`)}
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.CourseID)}
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
        onClick={() => navigate('/courses/create')}
        className="mt-6 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-md"
      >
        Add Course
      </button>
    </div>
  );
}

export default Courses;