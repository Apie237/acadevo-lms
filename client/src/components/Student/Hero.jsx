import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react'

const Hero = () => {
  return (
    <div className='bg-background min-h-[90vh] flex items-center'>
      <div className='px-4 sm:px-10 md:px-14 lg:px-36 py-12 md:py-20 w-full'>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          
          {/* Left Side - Content */}
          <div className='space-y-6'>
            <div className='inline-block'>
              <span className='bg-acadevo-sage text-acadevo-teal px-4 py-2 rounded-full text-sm font-medium'>
                Welcome to Acadevo
              </span>
            </div>
            
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight'>
              Transform Your Learning Journey with 
              <span className='text-acadevo-teal'> Acadevo</span>
            </h1>
            
            <p className='text-lg text-gray-600 leading-relaxed'>
              Discover thousands of courses taught by expert instructors. 
              Learn at your own pace, earn certificates, and advance your career 
              with our comprehensive learning management system.
            </p>
            
            {/* Feature Pills */}
            <div className='flex flex-wrap gap-4 pt-4'>
              <div className='flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-acadevo-sage'>
                <BookOpen size={20} className='text-acadevo-teal' />
                <span className='text-gray-700 text-sm font-medium'>10,000+ Courses</span>
              </div>
              <div className='flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-acadevo-sage'>
                <Users size={20} className='text-acadevo-cyan' />
                <span className='text-gray-700 text-sm font-medium'>Expert Instructors</span>
              </div>
              <div className='flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-acadevo-sage'>
                <Award size={20} className='text-acadevo-teal' />
                <span className='text-gray-700 text-sm font-medium'>Certified Learning</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className='flex flex-wrap gap-4 pt-6'>
              <Link to='/courses'>
                <button className='bg-acadevo-teal hover:bg-acadevo-cyan text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1'>
                  Explore Courses
                  <ArrowRight size={20} />
                </button>
              </Link>
              <Link to='/become-educator'>
                <button className='bg-white hover:bg-acadevo-sage text-acadevo-teal border-2 border-acadevo-teal px-8 py-4 rounded-full font-semibold transition-all'>
                  Become an Educator
                </button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className='flex gap-8 pt-8 border-t border-acadevo-sage'>
              <div>
                <p className='text-3xl font-bold text-acadevo-teal'>50K+</p>
                <p className='text-gray-600 text-sm'>Active Learners</p>
              </div>
              <div>
                <p className='text-3xl font-bold text-acadevo-cyan'>98%</p>
                <p className='text-gray-600 text-sm'>Satisfaction Rate</p>
              </div>
              <div>
                <p className='text-3xl font-bold text-acadevo-teal'>500+</p>
                <p className='text-gray-600 text-sm'>Expert Educators</p>
              </div>
            </div>
          </div>
          
          {/* Right Side - Image */}
          <div className='relative'>
            <div className='relative z-10'>
              <img 
                src='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80' 
                alt='Students learning together' 
                className='rounded-3xl shadow-2xl w-full h-auto object-cover'
              />
              
              {/* Floating Card */}
              <div className='absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border-2 border-acadevo-sage max-w-xs hidden md:block'>
                <div className='flex items-center gap-4'>
                  <div className='bg-acadevo-sage rounded-full p-3'>
                    <BookOpen size={24} className='text-acadevo-teal' />
                  </div>
                  <div>
                    <p className='font-bold text-xl text-gray-800'>1000+</p>
                    <p className='text-gray-600 text-sm'>New courses this month</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className='absolute top-8 right-8 w-72 h-72 bg-acadevo-sage rounded-full opacity-20 blur-3xl -z-10'></div>
            <div className='absolute bottom-8 left-8 w-64 h-64 bg-acadevo-cyan rounded-full opacity-20 blur-3xl -z-10'></div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Hero