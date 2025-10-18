import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    const currency = import.meta.env.CURRENCY;
    const navigate = useNavigate()

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState(null)

    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses)
    } 

    const fetchEnrolledCourses = async () => {
        setEnrolledCourses(dummyCourses)
    }

    useEffect(() => {
        fetchAllCourses()
        fetchEnrolledCourses()
    },[])


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



    const value = {
         currency, calculateRatings, allCourses, navigate, isEducator,setIsEducator, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures,
         enrolledCourses, setEnrolledCourses, fetchEnrolledCourses
    }

    return <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
}