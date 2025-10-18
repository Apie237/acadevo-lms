import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CourseCard from './CourseCard';
import { AppContext } from '../../context/AppContext';

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Career',
    'Creative Tech',
    'Cyber Security',
    'Data',
    'Entrepreneurship',
    'Tech'
  ];

  // Filter courses based on selected category
  const filteredCourses = selectedCategory === 'All' 
    ? allCourses 
    : allCourses.filter(course => course.category === selectedCategory);

  return (
    <div className='py-16 md:px-40 px-8 bg-gray-800'>
      {/* Header */}
      <div className='text-center mb-4'>
        <p className='text-acadevo-teal text-sm font-semibold tracking-wide uppercase mb-2'>
          ALX Programs
        </p>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800'>
          Most Popular Programs
        </h2>
      </div>

      {/* Category Filter Pills */}
      <div className='flex flex-wrap justify-center gap-3 my-10'>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-acadevo-teal text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-acadevo-teal hover:text-acadevo-teal'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-12'>
        {filteredCourses.slice(0, 8).map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {/* View All Button */}
      <div className='flex justify-center mt-12'>
        <Link 
          to={'/course-list'} 
          onClick={() => scrollTo(0, 0)} 
          className='group flex items-center gap-2 text-acadevo-teal border-2 border-acadevo-teal px-8 py-3.5 rounded-full font-semibold hover:bg-acadevo-teal hover:text-white transition-all duration-300'
        >
          View All Programs
          <ArrowRight 
            size={20} 
            className='group-hover:translate-x-1 transition-transform duration-300' 
          />
        </Link>
      </div>
    </div>
  );
};

export default CoursesSection;