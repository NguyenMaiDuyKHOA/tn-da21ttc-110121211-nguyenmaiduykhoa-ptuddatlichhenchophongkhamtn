import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'

const Sidebar = () => {
    const { getBookingCount, bookingCount } = useContext(ShopContext)

    return (
        <div className='w-[18%] min-h-screen border-r-2'>
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
                <NavLink to="/" className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1'>
                    <img src={assets.home} alt="" className='w-5 h-5' />
                    <p className='hidden md:block'>Clinic</p>
                </NavLink>

                <NavLink to="/articlemanage" className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1'>
                    <img src={assets.pen} alt="" className='w-5 h-5' />
                    <p className='hidden md:block'>Article</p>
                </NavLink>

                <NavLink to="/slide" className='flex items-center gap-3 border border-gray-300 border-r-0 pl-2 py-2 rounded-1'>
                    <img src={assets.banner_icon} alt="" className='w-7 h-7' />
                    <p className='hidden md:block'>Banner</p>
                </NavLink>

                <NavLink to="/doctormanage" className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1'>
                    <img src={assets.user} alt="" className='w-5 h-5' />
                    <p className='hidden md:block'>Manage doctor</p>
                </NavLink>

                <NavLink to="/listbooking" className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1 relative'>
                    {/* Nút đỏ nhỏ hiển thị số */}
                    <span className="absolute -top-2 -left-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                        {bookingCount}
                    </span>
                    <img src={assets.checklist} alt="" className='w-5 h-5' />
                    <p className='hidden md:block'>List Booking</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar