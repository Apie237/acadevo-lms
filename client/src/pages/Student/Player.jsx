import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import Rating from '../../components/Student/Rating';
import { toast } from 'react-toastify';
import Loading from './Loading';
import axios from 'axios';

const Player = () => {
  const { enrolledCourses, calculateChapterTime, backendUrl, getToken, fetchUserEnrolledCourses } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const getCourseData = () => {
    if (Array.isArray(enrolledCourses)) {
      const foundCourse = enrolledCourses.find(course => course._id === courseId);
      if (foundCourse) {
        setCourseData(foundCourse);
      }
    }
  };

  useEffect(() => {
    getCourseData();
  }, [enrolledCourses, courseId]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return courseData ? (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
        {/* Left side */}
        <div className='text-gray-800'>
          <h2 className='text-xl font-semibold mb-5'>Course Structure</h2>
          <div className='space-y-3'>
            {courseData && courseData.courseContent.map((chapter, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md hover:bg-[radial-gradient(circle_at_center,_rgba(72,173,183,0.15),_transparent_60%)]'
              >
                <div
                  className='flex items-center justify-between p-4 cursor-pointer transition-all duration-300'
                  onClick={() => toggleSection(index)}
                >
                  <div className='flex items-center gap-2'>
                    <img
                      src={assets.down_arrow_icon}
                      alt='arrow icon'
                      className={`w-4 transition-transform duration-300 ${openSections[index] ? 'rotate-180' : ''}`}
                    />
                    <p className='font-medium text-sm md:text-base'>{chapter.chapterTitle}</p>
                  </div>
                  <p className='text-xs sm:text-sm text-gray-600'>
                    {chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}
                  </p>
                </div>

                {openSections[index] && (
                  <ul className='border-t border-gray-200 bg-gray-50 transition-all duration-300'>
                    {chapter.chapterContent.map((lecture, i) => (
                      <li
                        key={i}
                        className='flex items-start gap-2 py-2 px-5 text-gray-700 cursor-pointer transition-all duration-300 hover:bg-[radial-gradient(circle_at_left,_rgba(186,208,204,0.4),_transparent_70%)]'
                      >
                        <img
                          src={
                            progressData && progressData.lectureCompleted.includes(lecture.lectureId)
                              ? assets.blue_tick_icon
                              : assets.play_icon
                          }
                          alt='icon'
                          className='w-4 h-4 mt-1 flex-shrink-0'
                        />
                        <div className='flex items-center justify-between w-full text-xs sm:text-sm'>
                          <p>{lecture.lectureTitle}</p>
                          <div className='flex gap-3 items-center'>
                            {lecture.lectureUrl && (
                              <p
                                className='text-blue-500 hover:underline'
                                onClick={() =>
                                  setPlayerData({
                                    ...lecture,
                                    chapter: index + 1,
                                    lecture: i + 1,
                                  })
                                }
                              >
                                Watch
                              </p>
                            )}
                            <p className='text-gray-500'>
                              {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className='flex items-center gap-2 py-3 mt-10'>
            <h1 className='text-xl font-bold'>Rate this Course:</h1>
            <Rating initialRating={initialRating} />
          </div>
        </div>

        {/* Right side */}
        <div className='md:mt-10'>
          {playerData ? (
            <div>
              <YouTube
                videoId={playerData.lectureUrl.split('/').pop()}
                iframeClassName='w-full aspect-video rounded-lg'
              />
              <div className='flex justify-between items-center mt-2 text-sm'>
                <p>
                  {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                </p>
                <button
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  className='text-blue-600 hover:underline'
                >
                  {progressData && progressData.lectureCompleted.includes(playerData.lectureId)
                    ? 'Completed'
                    : 'Mark complete'}
                </button>
              </div>
            </div>
          ) : (
            <img
              src={courseData ? courseData.courseThumbnail : ''}
              alt=''
              className='w-full rounded-lg shadow-md'
            />
          )}
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Player;
