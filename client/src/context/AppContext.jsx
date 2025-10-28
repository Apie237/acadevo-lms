import { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  // Helper function to call API with token
  const callApi = useCallback(
    async (method, url, data = null) => {
      try {
        const token = await getToken();
        const response = await axios({
          method,
          url: backendUrl + url,
          data,
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (error) {
        console.error(`API Error [${method} ${url}]:`, error);
        toast.error(
          error.response?.data?.message || error.message || "API call failed"
        );
        return null;
      }
    },
    [backendUrl, getToken]
  );

  // Fetch all courses
  const fetchAllCourses = useCallback(async () => {
    const data = await callApi("get", "/api/course/all");
    if (data?.success) setAllCourses(data.courses);
  }, [callApi]);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (!user) return;

    if (user?.publicMetadata?.role === "educator") setIsEducator(true);

    const data = await callApi("get", "/api/user/data");
    if (data?.success) setUserData(data.user);
  }, [callApi, user]);

  // Fetch enrolled courses
  const fetchUserEnrolledCourses = useCallback(async () => {
    const data = await callApi("get", "/api/user/enrolled-courses");
    if (data?.success) setEnrolledCourses([...data.enrolledCourses].reverse());
  }, [callApi]);

  // Calculate course ratings
  const calculateRatings = (course) => {
    if (!course?.courseRatings?.length) return 0;
    const total = course.courseRatings.reduce((acc, r) => acc + r.rating, 0);
    return Math.floor(total / course.courseRatings.length);
  };

  // Calculate chapter duration
  const calculateChapterTime = (chapter) => {
    const time = chapter.chapterContent.reduce(
      (acc, lecture) => acc + lecture.lectureDuration,
      0
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Calculate course duration
  const calculateCourseDuration = (course) => {
    const time = course.courseContent.reduce((acc, chapter) => {
      return (
        acc +
        chapter.chapterContent.reduce(
          (subAcc, lecture) => subAcc + lecture.lectureDuration,
          0
        )
      );
    }, 0);
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Total lectures
  const calculateNoOfLectures = (course) => {
    return course.courseContent.reduce(
      (total, chapter) =>
        total + (Array.isArray(chapter.chapterContent) ? chapter.chapterContent.length : 0),
      0
    );
  };

  // Fetch everything on user login
  useEffect(() => {
    if (user) {
      fetchAllCourses();
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user, fetchAllCourses, fetchUserData, fetchUserEnrolledCourses]);

  return (
    <AppContext.Provider
      value={{
        currency,
        allCourses,
        enrolledCourses,
        userData,
        isEducator,
        setIsEducator,
        setEnrolledCourses,
        setUserData,
        fetchAllCourses,
        fetchUserData,
        fetchUserEnrolledCourses,
        calculateRatings,
        calculateChapterTime,
        calculateCourseDuration,
        calculateNoOfLectures,
        navigate,
        getToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
