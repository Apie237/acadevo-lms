import React from 'react'
import Hero from '../../components/Student/Hero';
import CoursesSection from '../../components/Student/CoursesSection';
import TestimonialsSection from '../../components/Student/TestimonialSection';

const Home = () => {
  return (
    <div className=''>
      <Hero/>
      <CoursesSection/>
      <TestimonialsSection/>
    </div>
  )
}

export default Home