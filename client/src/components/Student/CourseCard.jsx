import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const CourseCard = ({ course }) => {
  const { currency, calculateRatings } = useContext(AppContext);

  return (
    <Link 
      to={'/course/' + course._id} 
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
    >
      {/* Thumbnail with Badges */}
      <div className="relative overflow-hidden h-52">
        <img 
          src={course.courseThumbnail} 
          alt={course.courseTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* Coming Soon Badge (if applicable) */}
        {course.comingSoon && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            Coming soon
          </div>
        )}
        
        {/* Discount Badge */}
        {course.discount > 0 && !course.comingSoon && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            {course.discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        
        {/* Course Title */}
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2 min-h-[56px]">
          {course.courseTitle}
        </h3>

        {/* Educator */}
        <p className="text-sm text-gray-600 font-medium">
          {course.educator?.name || 'Expert Educator'}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-800">{calculateRatings(course)}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img 
                key={i} 
                src={i < Math.floor(calculateRatings(course)) ? assets.star : assets.star_blank} 
                alt="" 
                className="w-4 h-4" 
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">({course.courseRatings?.length || 0})</p>
        </div>

        {/* Duration */}
        <p className="text-sm text-gray-500">
          {course.duration || '8 Months'}
        </p>

        {/* Price */}
        <div className="pt-2">
          {course.discount > 0 && (
            <p className="text-sm text-gray-400 line-through">
              {currency}{course.coursePrice.toFixed(2)}
            </p>
          )}
          <p className="text-2xl font-bold text-acadevo-teal">
            {currency}{(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button className="w-full bg-acadevo-teal hover:bg-acadevo-cyan text-white py-3 rounded-full font-semibold transition-colors duration-300">
            Register Interest
          </button>
          <button className="w-full text-acadevo-teal hover:text-acadevo-cyan font-semibold py-2 transition-colors duration-300">
            Learn more
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;