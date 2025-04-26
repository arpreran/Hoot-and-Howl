import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Students from './Pages/Students';
import CreateStudent from './Pages/CreateStudent';
import Quizzes from './Pages/Quizzes';
import CreateQuiz from './Pages/CreateQuiz';
import Courses from './Pages/Courses';
import CreateCourse from './Pages/CreateCourse';
import Parents from './Pages/Parents';
import CreateParent from './Pages/CreateParent';
import Results from './Pages/Results';
import CreateResult from './Pages/CreateResult';
import EditStudent from './Pages/EditStudent';
import EditQuiz from './Pages/EditQuiz'; 
import EditCourse from './Pages/EditCourse';
import EditParent from './Pages/EditParent';
import EditResult from './Pages/EditResult';
import MainPage from './Pages/MainPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students/edit/:studentId" element={<EditStudent />} />
      <Route path="/students" element={<Students />} />
      <Route path="/students/create" element={<CreateStudent />} />
      <Route path="/quizzes" element={<Quizzes />} />
      <Route path="/quizzes/create" element={<CreateQuiz />} />
      <Route path="/quizzes/edit/:quizId" element={<EditQuiz />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/create" element={<CreateCourse />} />
      <Route path="/courses/edit/:courseId" element={<EditCourse />} />
      <Route path="/parents" element={<Parents />} />
      <Route path="/parents/create" element={<CreateParent />} />
      <Route path="/parents/edit/:parentId" element={<EditParent />} />
      <Route path="/results" element={<Results />} />
      <Route path="/results/create" element={<CreateResult />} />
      <Route path="/results/edit/:resultId" element={<EditResult />} />
    </Routes>
  );
}

export default App;
