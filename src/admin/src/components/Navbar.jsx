import React from 'react'
import { assets } from '../assets/assets.js'

const Navbar = ({ setToken }) => {
    return (
        <div className='flex items-center py-2 px-[4%] justify-between bg-gray-200'>
            <div className='flex items-center'>
                <img src={assets.logo} alt="" className='w-[max(5%,80px)]' />
                <p className='font-bold text-blue-600 text-2xl'>BOOKING MEDICAL</p>
            </div>

            <button onClick={() => setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:-px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
        </div>
    )
}

export default Navbar