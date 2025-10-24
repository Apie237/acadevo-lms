import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useClerk, UserButton, useUser } from "@clerk/clerk-react"
import { AppContext } from '../../context/AppContext'
import axios from "axios"
import { toast } from "react-toastify"

const Navbar = () => {

  const { navigate, isEducator, backendUrl, setIsEducator, getToken  } = useContext(AppContext)

  const { openSignIn } = useClerk()
  const { user } = useUser()

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator')
        return;
      }
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setIsEducator(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(data.message)
    }
  }

  return (
    <div className='flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4'>
      <img onClick={() => navigate('/')} src={assets.logo2} alt="Logo" className='w-28 lg-w-32 cursor-pointer' />
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        {user && (
          <div className='flex items-center gap-5'>
            <button
              onClick={becomeEducator}
              className='hover:text-acadevo-teal'
            >
              {isEducator ? 'Educator Dashboard' : 'Become Educator'}
            </button>
            <Link to='/my-enrollments' className='hover:text-acadevo-teal'>
              My Enrollments
            </Link>
          </div>
        )}
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className='bg-acadevo-teal hover:bg-acadevo-cyan text-white px-5 py-2 rounded-full'
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-600">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && <>
            <button onClick={becomeEducator} className="text-sm hover:text-acadevo-teal">{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
            <Link to="/my-enrollments" className="text-sm hover:text-acadevo-teal">My Enrollments</Link>
          </>
          }
        </div>
        {user ? <UserButton /> :
          <button>
            <img src={assets.user_icon} alt="User" className="w-7 h-7" />
          </button>
        }
      </div>
    </div>

  )
}

export default Navbar