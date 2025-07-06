import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

    const [currentState, setCurrentState] = useState('Customer');
    const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [otpId, setOtpId] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const receidOtpHandler = async () => {
        try {
            if (!phone) {
                toast.warn("Vui lòng nhập số điện thoại!")
                return;
            }

            const response = await axios.post(backendUrl + '/api/user/sendotp', { phone })
            // const response = await axios.post(backendUrl + '/api/user/sendsms', { phone })

            if (response.data.success) {
                setOtpId(response.data.otpId)
                toast.success("Đã gửi OTP")
            } else {
                toast.error("Gửi OTP thất bại")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            if (currentState === 'Customer') {
                if (!otp) {
                    toast.warn("Vui lòng nhập OTP!")
                    return;
                }
                const response = await axios.post(backendUrl + '/api/user/login', { phone, otp, otpId })
                if (response.data.success) {
                    setToken(response.data.token)
                    localStorage.setItem('token', response.data.token)
                } else {
                    toast.error(response.data.message)
                }
            } else {
                const response = await axios.post(backendUrl + '/api/user/doctor', { username, password })
                if (response.data.success) {
                    setToken(response.data.token)
                    localStorage.setItem('token', response.data.token)
                } else {
                    toast.error(response.data.message)
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token])

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>{currentState} Login</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            {
                currentState === 'Customer'
                    ?
                    <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto gap-4 text-gray-800'>
                        <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Số điện thoại' required />
                        <div className='flex w-full space-x-1'>
                            <input onChange={(e) => setOtp(e.target.value)} value={otp} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Mã OTP' />
                            <p onClick={() => receidOtpHandler()} className='flex items-center justify-center w-full border border-gray-800 bg-blue-300 hover:bg-blue-500 cursor-pointer'>Nhận OTP</p>
                        </div>
                    </div>

                    :
                    <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto gap-4 text-gray-800'>
                        <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Tên đăng nhập' required />
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Mật khẩu' required />
                    </div>
            }
            <div className='w-full flex justify-between text-sm ml-9 mt-[-8px]'>
                {
                    currentState === 'Customer'
                        ? <p onClick={() => setCurrentState('Doctor')} className='cursor-pointer'>Bác sĩ đăng nhập</p>
                        : <p onClick={() => setCurrentState('Customer')} className='cursor-pointer'>Khách hàng đăng nhập</p>
                }
            </div>
            <button className='bg-black text-white font-light px-8 py-2 mt-4'>Đăng nhập</button>
        </form>
    )
}

export default Login