import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App';
import { useParams, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment'

const Change = ({ token }) => {
    const secretKey = import.meta.env.VITE_SECRET_KEY
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [doctorData, setDoctorData] = useState(null);
    const [calendarOpen, setCalendarOpen] = useState(false)

    // Giải mã
    const decryptPassword = (encryptedPassword, secretKey) => {
        const [iv, encrypted] = encryptedPassword.split(':');
        const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, '0').slice(0, 32));
        const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: CryptoJS.enc.Hex.parse(iv) });
        return decrypted.toString(CryptoJS.enc.Utf8);
    };

    // State for form fields
    const [image, setImage] = useState(false)
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [description, setDescription] = useState('')
    const [workDay, setWorkDay] = useState([])
    const [role, setRole] = useState(0)
    const [admin, setAdmin] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    // const [doctorData, setDoctorData] = useState([])

    // Fetch product data from API
    const getDoctor = async () => {
        try {
            const response = await axios.post(`${backendUrl}/api/doctor/single`, { doctorId }, { headers: { token } });
            if (response.data.success) {
                const doctor = response.data.doctor;
                setDoctorData(doctor);
            } else {
                toast.error('Doctor not found');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch Doctor data');
        }
    };

    useEffect(() => {
        getDoctor();
    }, [doctorId]);

    // Set form fields when productData changes
    useEffect(() => {
        if (doctorData) {
            setUserName(doctorData.username || '');
            setPassword(decryptPassword(doctorData.password, secretKey) || '');
            setName(doctorData.name || '');
            setRole(doctorData.role || 0);
            setPhone(doctorData.phone || '');
            setEmail(doctorData.email || '');
            setDescription(doctorData.description || '');
            setWorkDay(doctorData.workDay || []);
            setAdmin(doctorData.admin || false);
            setImage(doctorData.image || false);
        }
    }, [doctorData]);


    // Handle form submission
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData()

        formData.append('id', doctorId)
        formData.append('userName', userName)
        formData.append('password', password)
        formData.append("name", name)
        formData.append('phone', phone)
        formData.append('email', email)
        formData.append('description', description)
        formData.append('role', role)
        formData.append('admin', admin)
        formData.append('workDay', JSON.stringify(workDay))
        image && formData.append("image", image)

        try {
            const response = await axios.put(`${backendUrl}/api/doctor/change`, formData, { headers: { token } });

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/doctormanage'); // Redirect after successful update
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className={'w-full mb-10'}>
            <div className='flex'>
                <div className='flex flex-col w-2/3 items-start gap-3'>
                    <div className='w-full'>
                        <p className=''>Username</p>
                        <input onChange={(e) => setUserName(e.target.value)} value={userName} type="text" placeholder='Enter username' className='w-full max-w-[500px] px-3 py-2' required />
                    </div>
                    <div className='w-full'>
                        <p className=''>Password</p>
                        <div className='relative w-full max-w-[500px]'>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} type={showPassword ? 'text' : 'password'} placeholder='Enter password' className='w-full px-3 py-2 pr-10' required />
                            <span className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer' onClick={() => setShowPassword((prev) => !prev)}>
                                <img src={showPassword ? assets.hidden : assets.eye} alt={showPassword ? 'Hide' : 'Show'} className='w-5 h-5' />
                            </span>
                        </div>
                    </div>
                    <div className='grid grid-cols-[3fr_1fr] gap-3'>
                        <div className='w-full'>
                            <p className=''>Name doctor</p>
                            <input onChange={(e) => setName(e.target.value.toUpperCase())} value={name} type="text" placeholder={`${role === 0 ? 'Enter Name doctor' : 'Enter Name assistant'}`} className='w-full max-w-[500px] px-3 py-2' required />
                        </div>

                        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                            <div className=''>
                                <p className='mb-2'>Role</p>
                                <select onChange={(e) => setRole(Number(e.target.value))} className='w-full px-3 py-2'>
                                    <option value="0">Doctor</option>
                                    <option value="1">Assistant</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-[1fr_2fr] gap-2 max-w-[500px]'>
                        <div className='w-full'>
                            <p className=''>Phone number</p>
                            <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" placeholder='Enter phone number' className='w-full max-w-[500px] px-3 py-2' required />
                        </div>
                        <div className='w-full'>
                            <p className=''>Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Enter email' className='w-full max-w-[500px] px-3 py-2' />
                        </div>
                    </div>
                    <div className='w-full'>
                        <p className=''>Description of doctor</p>
                        <textarea onChange={(e) => setDescription(e.target.value)} value={description} type="text" placeholder='Write description' className='w-full max-w-[500px] px-3 py-2 min-h-[150px]' />
                    </div>

                    <div className='w-full'>
                        <button
                            type="button"
                            className="px-3 py-2 bg-blue-500 text-white rounded"
                            onClick={() => setCalendarOpen(true)}
                        >
                            Select Workday
                        </button>
                        {/* Show Workday */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {workDay.map((d, i) => (
                                <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                    {moment(d).format('DD/MM/YYYY')}
                                </span>
                            ))}
                        </div>
                        {calendarOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                                <div className="p-4 rounded shadow-lg">
                                    <ReactCalendar
                                        onChange={() => { }} //Do not used OnChange
                                        selectRange={false}
                                        tileClassName={({ date }) =>
                                            workDay.includes(moment(date).format('YYYY-MM-DD')) ? 'bg-blue-200' : ''
                                        }
                                        locale="vi-VN"
                                        minDetail="month"
                                        maxDetail="month"
                                        showNeighboringMonth={false}
                                        allowPartialRange={true}
                                        // Chọn hoặc bỏ chọn ngày
                                        onClickDay={date => {
                                            const dayStr = moment(date).format('YYYY-MM-DD');
                                            setWorkDay(prev =>
                                                prev.includes(dayStr)
                                                    ? prev.filter(d => d !== dayStr)
                                                    : [...prev, dayStr]
                                            );
                                        }}
                                    />
                                    <button
                                        className="mt-2 px-4 py-2 bg-gray-300 rounded"
                                        onClick={() => setCalendarOpen(false)}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='flex gap-2 mt-2'>
                        <input onChange={() => setAdmin(prev => !prev)} checked={admin} type="checkbox" id='admin' />
                        <label className='cursor-pointer' htmlFor="admin">Admin</label>
                    </div>
                </div>

                <div className='w-1/3'>
                    <p className='mb-2'>Upload Image</p>
                    <div className='flex gap-2'>
                        <div>
                            <img src={image instanceof File ? URL.createObjectURL(image) : image} alt="" className='w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 object-cover border border-gray-300 rounded' />
                            <div className='flex justify-center mt-2 border border-gray-300 rounded bg-gray-300'>
                                <label htmlFor="image">
                                    <img src={assets.addphoto} alt="" className='w-7 h-7 cursor-pointer' />
                                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>SAVE</button>
        </form>
    );
};

export default Change;