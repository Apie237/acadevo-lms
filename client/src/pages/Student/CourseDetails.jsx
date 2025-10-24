import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/Student/Footer";
import YouTube from "react-youtube";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Clock,
  Users,
  Globe,
  Award,
  Download,
  Smartphone,
  Tv,
  Infinity,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const {
    allCourses,
    calculateRatings,
    currency,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
  } = useContext(AppContext);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const fetchCourseData = async () => {
    try {
      const {data} = await axios.get(backendUrl + '/api/course/' + id)
      if(data.success){
        setCourseData(data.courseData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const enrollCourse = async () => {
      try {
        if(!userData){
          return toast.warn('Login to enroll')
        }
        if(isAlreadyEnrolled){
          return toast.warn('Already enrolled')
        }
        const token = await getToken();

        const {data} = await axios.post(backendUrl + '/api/user/purchase', {courseId: courseData._id}, {headers: {Authorization: `Bearer ${token}`}})
        if(data.success) {
          const {session_url} = data
          window.location.replace(session_url)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
  }

  useEffect(() => {
    fetchCourseData();
  }, [allCourses, id]);

  useEffect(() => {
    if(userData && courseData){
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }
  }, [userData, courseData])

  if (!courseData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-acadevo-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const ratingValue = calculateRatings(courseData);
  const discountedPrice = (
    courseData.coursePrice -
    (courseData.discount * courseData.coursePrice) / 100
  ).toFixed(2);

  return (
    <>
      {/* HERO SECTION */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/70 to-gray-900/90" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Breadcrumb */}
          <div className="text-sm text-acadevo-cyan mb-4">
            <span className="hover:underline cursor-pointer">Development</span>
            <span className="mx-2">›</span>
            <span className="hover:underline cursor-pointer">
              {courseData.category || "Programming"}
            </span>
          </div>

          {/* Title & Description */}
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            {courseData.courseTitle}
          </h1>
          <p
            className="text-gray-300 text-lg max-w-3xl mb-5"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription?.slice(0, 200) + "...",
            }}
          />

          {/* Ratings + Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
            <span className="flex items-center gap-2">
              <span className="font-bold text-yellow-400 text-lg">
                {ratingValue}
              </span>
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={i < Math.floor(ratingValue) ? assets.star : assets.star_blank}
                  alt="star"
                  className="w-4 h-4"
                />
              ))}
              <span className="text-acadevo-cyan underline cursor-pointer">
                ({courseData.courseRatings?.length || 0} ratings)
              </span>
            </span>
            <span className="text-gray-400">•</span>
            <span>{courseData.enrolledStudents?.length || 0} students</span>
          </div>

          <p className="text-sm text-gray-300 mb-2">
            Taught by{" "}
            <span className="text-acadevo-cyan underline cursor-pointer">
              {courseData.educator?.name || "Expert Instructor"}
            </span>
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Globe size={16} />
              <span>English</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Updated Dec 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY COURSE CARD */}
      <div className="bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What you’ll learn
              </h2>
              <ul className="grid md:grid-cols-2 gap-3 text-gray-700 text-sm">
                <li>✓ Hands-on project guidance</li>
                <li>✓ Downloadable resources</li>
                <li>✓ Community support</li>
                <li>✓ Lifetime access with updates</li>
              </ul>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Course content
                </h2>
                <p className="text-sm text-gray-500">
                  {courseData.courseContent?.length || 0} sections •{" "}
                  {calculateNoOfLectures(courseData)} lectures •{" "}
                  {calculateCourseDuration(courseData)}
                </p>
              </div>

              <div>
                {courseData.courseContent?.map((chapter, index) => (
                  <div key={index} className="border-b last:border-none">
                    <button
                      onClick={() => toggleSection(index)}
                      className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-2">
                        {openSections[index] ? (
                          <ChevronUp size={18} className="text-gray-600" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-600" />
                        )}
                        <span className="font-medium text-gray-900">
                          {chapter.chapterTitle}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {chapter.chapterContent?.length || 0} lectures •{" "}
                        {calculateChapterTime(chapter)}
                      </span>
                    </button>

                    {openSections[index] && (
                      <div className="bg-gray-50 px-6 pb-3 animate-fadeIn">
                        {chapter.chapterContent?.map((lecture, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-2 hover:bg-white rounded px-2 transition"
                          >
                            <div className="flex items-center gap-2 text-sm">
                              <PlayCircle size={16} className="text-gray-600" />
                              <span>{lecture.lectureTitle}</span>
                              {lecture.isPreviewFree && (
                                <button
                                  onClick={() =>
                                    setPlayerData({
                                      videoId: lecture.lectureUrl.split("/").pop(),
                                    })
                                  }
                                  className="text-xs text-acadevo-teal font-semibold hover:underline ml-2"
                                >
                                  Preview
                                </button>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {humanizeDuration(lecture.lectureDuration * 60000, {
                                units: ["h", "m"],
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Instructor
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-acadevo-teal to-acadevo-cyan flex items-center justify-center text-2xl font-bold text-white">
                  {courseData.educator?.name?.charAt(0) || "E"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {courseData.educator?.name || "Expert Instructor"}  button
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Professional Educator
                  </p>
                  <div className="flex items-center gap-5 text-xs text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Users size={14} />{" "}
                      {courseData.enrolledStudents?.length || 0} students
                    </span>
                    <span className="flex items-center gap-1">
                      <PlayCircle size={14} /> 1 course
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {courseData.educator?.bio ||
                      "An experienced instructor passionate about helping learners achieve success."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Card */}
          <div className="relative">
            <div className="lg:sticky top-6 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {playerData ? (
                <YouTube
                  videoId={playerData.videoId}
                  opts={{ playerVars: { autoplay: 1 } }}
                  iframeClassName="w-full aspect-video"
                />
              ) : (
                <div className="relative">
                  <img
                    src={courseData.courseThumbnail}
                    alt={courseData.courseTitle}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <PlayCircle size={60} className="text-white" />
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {currency}
                    {discountedPrice}
                  </span>
                  <span className="text-gray-400 line-through text-lg">
                    {currency}
                    {courseData.coursePrice}
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    {courseData.discount}% off
                  </span>
                </div>

                <button onClick={enrollCourse} className="w-full bg-acadevo-teal hover:bg-acadevo-cyan text-white py-3 rounded-lg font-semibold transition">
                  {isAlreadyEnrolled ? "Go to Course" : "Buy Now"}
                </button>

                <button className="w-full mt-3 border border-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                  Add to Cart
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  30-Day Money-Back Guarantee
                </p>

                <div className="mt-6 pt-4 border-t text-sm text-gray-700">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    This course includes:
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Tv size={16} /> {calculateCourseDuration(courseData)} video
                    </li>
                    <li className="flex items-center gap-2">
                      <Smartphone size={16} /> Access on mobile & TV
                    </li>
                    <li className="flex items-center gap-2">
                      <Award size={16} /> Certificate of completion
                    </li>
                    <li className="flex items-center gap-2">
                      <Infinity size={16} /> Lifetime access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CourseDetails;
