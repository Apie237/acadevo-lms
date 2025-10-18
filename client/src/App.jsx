import React from 'react';
import { Routes, Route, useMatch } from 'react-router-dom'
import CoursesList from './pages/Student/CourseList'
import CourseDetails from './pages/Student/CourseDetails'
import Home from './pages/Student/Home'
import MyEnrollments from './pages/Student/MyEnrollments'
import Player from './pages/Student/Player';
import Loading from './pages/Student/Loading';
import Dashboard from './pages/Educator/Dashboard';
import AddCourse from './pages/Educator/AddCourse';
import MyCourses from './pages/Educator/MyCourses';
import StudentsEnrolled from './pages/Educator/StudentsEnrolled';
import Educator from './pages/Educator/Educator';
import Navbar from './components/Student/Navbar';
import 'quill/dist/quill.snow.css';
import {ToastContainer} from 'react-toastify'

const App = () => {

  const isEducatorRoute = useMatch('/educator/*')

  return (
    <div className='text-default min-h-screen bg-slate-50'>
      <ToastContainer/>
      {!isEducatorRoute && <Navbar />}
         
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course-list' element={<CoursesList />} />
        <Route path='/course-list/:input' element={<CoursesList />} />
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/my-enrollments' element={<MyEnrollments />} />
        <Route path='/player/:courseId' element={<Player />} />
        <Route path='/loading' element={<Loading />} />
        <Route path='/educator' element={<Educator />}>
          <Route path='/educator' element={<Dashboard />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='students-enrolled' element={<StudentsEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;