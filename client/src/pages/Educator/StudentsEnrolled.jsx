import React, { useContext, useEffect, useState } from 'react';
import Loading from '../Student/Loading';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { dummyStudentEnrolled } from '../../assets/assets';

const StudentsEnrolled = () => {
  const {backendUrl, getToken, isEducator} = useContext(AppContext)
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrolledUserCourses = async () => {
    setEnrolledStudents(dummyStudentEnrolled)
  }

 useEffect(() => {
     fetchEnrolledUserCourses()
 }, [])
  

  if (enrolledStudents.length === 0) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center p-4'>
        <div className='max-w-md w-full text-center p-8 bg-white rounded-lg border border-gray-500/20'>
          <div className='text-gray-400 mb-4'>
            <svg className='w-16 h-16 mx-auto' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>No Students Enrolled Yet</h3>
          <p className='text-gray-500'>When students enroll in your courses, they'll appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-between p-4 md:pb-0 pt-8 pb-0 md:p-8'>
      <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
        <table className='table-fixed md:table-auto w-full overflow-hidden pb-4'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
            <tr>
              <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
              <th className='px-4 py-3 font-semibold'>Student Name</th>
              <th className='px-4 py-3 font-semibold'>Course Title</th>
              <th className='px-4 py-3 font-semibold'>Date</th>
            </tr>
          </thead>
          <tbody className='text-sm text-gray-500'>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='px-4 py-3 text-center hidden sm:table-cell'>{index + 1}</td>
                <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                  <img src={item.student.imageUrl} alt="" className='size-9 rounded-full' />
                  <span className='truncate'>{item.student.name}</span>
                </td>
                <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                <td className='px-4 py-3 hidden sm:table-cell'>{new Date(item.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentsEnrolled;