import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='px-10 bg-gray-800'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 pt-10 text-sm'>
                <div>
                    {/* Logo */}
                    <div className='flex flex-[4] items-center'>
                        <Link to='/'><img src={assets.logo} className='w-20' alt="" /></Link>
                        <Link to='/' className='font-bold text-blue-600 text-2xl'>BOOKING MEDICAL</Link>
                    </div>
                    <p className='w-full md:w-2/3 text-gray-400'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, tempora.
                    </p>
                </div>

                <div>
                    <p className='text-xl text-gray-300 font-medium mb-5'>CLINIC</p>
                    <ul className='flex flex-col gap-1 text-gray-400 cursor-pointer'>
                        <Link to='/'><li>Home</li></Link>
                        <Link to='/about'><li>About</li></Link>
                        <Link to='/contact'><li>Contact</li></Link>
                    </ul>
                </div>

                <div>
                    <p className='text-xl text-gray-300 font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-400'>
                        <li>+84 842-088-945</li>
                        <li>bookingmedical@gmail.com</li>
                    </ul>
                </div>
            </div>

            <div>
                <hr />
                <p className='py-5 text-sm text-center text-gray-400'>
                    Copyright 2024@ bookingmedical.com - All Right Reserved.
                </p>
            </div>
        </div>
    )
}

export default Footer