import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {

    const [visible, setVisible] = useState(false);
    const [isFixed, setIsFixed] = useState(false);

    const { clinic, navigate, token, setToken, role } = useContext(ShopContext);

    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        navigate('/login')
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsFixed(window.scrollY > 50); // 50px, bạn có thể chỉnh lại
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`${isFixed ? 'fixed top-0 left-0 w-full z-50 bg-white shadow' : 'w-full'} transition-all duration-300`}>
            <div className='flex items-center px-10 py-2 font-medium'>
                {/* Logo */}
                <div className='flex flex-[4] items-center'>
                    <Link to='/'><img src={assets.logo} className='w-20' alt="" /></Link>
                    <Link to='/' className='font-bold text-blue-600 text-2xl'>BOOKING MEDICAL</Link>
                </div>


                {/* Home, Collection, About, Contact */}
                <ul className='hidden flex-[7] sm:flex gap-5 text-sm text-gray-700 font-bold'>

                    <NavLink to='/' className='flex flex-col items-center gap-1'>
                        <p>TRANG CHỦ</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-gray-700' hidden />
                    </NavLink>
                    <NavLink to='/calendar' className='flex flex-col items-center gap-1'>
                        <p>LỊCH TRÌNH KHÁM</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-gray-700' hidden />
                    </NavLink>
                    <div onClick={() => token ? null : navigate('login')}>
                        <NavLink to='/booking' className='flex flex-col items-center gap-1'>
                            <p>ĐẶT LỊCH KHÁM</p>
                            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700' hidden />
                        </NavLink>
                    </div>
                    <NavLink to='/about' className='flex flex-col items-center gap-1'>
                        <p>GIỚI THIỆU</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-gray-700' hidden />
                    </NavLink>
                    <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                        <p>LIÊN HỆ</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-gray-700' hidden />
                    </NavLink>
                </ul>

                {/* Search */}
                <div className='flex flex-[2] justify-end items-center gap-6'>
                    {/* <Link to='/collection'><img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" /></Link> */}

                    {/* Profile */}
                    <div className='group relative'>
                        <img onClick={() => token ? null : navigate('login')} src={assets.profile_icon} className='w-5 cursor-pointer' alt="" />
                        {/* Dropdown Menu */}
                        {token ?
                            role === 0 || role === 1
                                ?
                                <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
                                    <div className='flex flex-col gap-2 w-48 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                                        <p onClick={() => navigate('/profile')} className="cursor-pointer hover:text-black">Trang cá nhân</p>
                                        <p onClick={() => navigate('/checked')} className="cursor-pointer hover:text-black">Kiểm tra lịch hẹn</p>
                                        <p onClick={logout} className="cursor-pointer hover:text-black">Đăng xuất</p>
                                    </div>
                                </div>
                                :
                                <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
                                    <div className='flex flex-col gap-2 w-48 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                                        <p onClick={() => navigate('/checked')} className="cursor-pointer hover:text-black">Kiểm tra lịch hẹn</p>
                                        <p onClick={logout} className="cursor-pointer hover:text-black">Đăng xuất</p>
                                    </div>
                                </div>
                            : null
                        }
                    </div>

                    <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
                </div>

                {/* Slidebar menu for small screens */}
                <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                    <div className='flex flex-col text-gray-600'>
                        <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                            <p>Back</p>
                        </div>
                        <NavLink onClick={() => setVisible(false)} to='/'>Trang chủ</NavLink>
                        <NavLink onClick={() => setVisible(false)} to='/collection'>Lịch khám</NavLink>
                        <NavLink onClick={() => setVisible(false)} to='/about'>Giới thiệu</NavLink>
                        <NavLink onClick={() => setVisible(false)} to='/contact'>Liên hệ</NavLink>
                    </div>
                </div>
            </div>
            <hr />
        </div >
    )
}

export default Navbar