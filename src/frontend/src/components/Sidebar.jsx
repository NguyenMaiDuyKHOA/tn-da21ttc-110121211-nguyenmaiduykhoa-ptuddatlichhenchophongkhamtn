import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
    return (
        <div className='w-[20%] min-h-screen border-r-2'>
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
                <NavLink to="/profile" end className={({ isActive }) =>
                    isActive
                        ? 'flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1 bg-gray-200 text-blue-500'
                        : 'flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1'
                }>
                    <img src={assets.user} alt="" className='w-5 h-5' />
                    <p className='hidden md:block'>Trang cá nhân</p>
                </NavLink>

                <NavLink to="/profile/booklist" className={({ isActive }) =>
                    isActive
                        ? 'flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1 bg-gray-200 text-blue-500'
                        : 'flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1'
                }>
                    <img src={assets.checklist} alt="" className='w-5 h-5' />
                    <p className='hidden md:block'>Danh sách đặt hẹn</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar