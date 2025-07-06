import React from 'react'
import { assets } from '../assets/assets'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const Profile = () => {
  return (
    <div className='flex w-full'>
      <Sidebar />
      <div className='bg-gray-100 w-full'>
        <div className='w-[90%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Profile