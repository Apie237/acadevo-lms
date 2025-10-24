import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios"
import { toast } from "react-toastify"

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const currency = import.meta.env.CURRENCY;
    const navigate = useNavigate()
    const { getToken } =useAuth()
    const { user } = useUser()

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourses, setEnrolledCourses] = useState(null)
    const [userData, setUserData] = useState(null)

    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/course/all');

            if(data.success){
                setAllCourses(data.courses)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    } 

    const fetchUserData = async () => {
        if (user.publicMetadata.role === 'educator') {
            setIsEducator(true)
        }
        try {
            const token = await getToken();

            const { data } = await axios.get(backendUrl + '/api/user/data', {
                headers:
                    { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setUserData(data.user)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(data.message)
        }
    }

    const fetchUserEnrolledCourses = async () => {
    try {
        const token = await getToken();
        const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses',
            { headers: { Authorization: `Bearer ${token}` } }
        )
        if (data.success) {
            setEnrolledCourses(data.enrolledCourses.reverse())
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        toast.error(error.response?.data?.message || error.message || 'Failed to fetch enrolled courses');
    }
}

    // Function to calculate ratings
    const calculateRatings = (course) => {
        if (course?.courseRatings?.length === 0) return 0;

        let totalRating = 0;
        course?.courseRatings?.forEach((rating) => {
            totalRating += rating.rating;
        });

        return Math.floor(totalRating / course?.courseRatings?.length);
    };

    // Function to calculate course chapter time
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.forEach((lecture) => {
            time += lecture.lectureDuration;
        });

        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    };

    // Function to calculate course duration
    const calculateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.forEach((chapter) => {
            chapter.chapterContent.forEach((lecture) => {
                time += lecture.lectureDuration;
            });
        });

        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    };

    // Function to calculate total number of lectures
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach((chapter) => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });

        return totalLectures;
    };

    useEffect(() => {
        if (user) {
            fetchAllCourses()         
        }
    }, [user])


    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserEnrolledCourses()
        }
    }, [user])

    const value = {
         currency, calculateRatings, allCourses, navigate, isEducator,setIsEducator, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures,
         enrolledCourses, setEnrolledCourses, fetchUserEnrolledCourses, userData, setUserData, fetchUserData, getToken
    }

    return <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
}