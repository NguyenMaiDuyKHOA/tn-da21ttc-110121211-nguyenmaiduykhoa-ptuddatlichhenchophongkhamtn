import React from 'react'
import { assets } from '../assets/assets.js'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App.jsx'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment'
import Title from '../components/Title';

const DoctorManage = ({ token }) => {

    const secretKey = import.meta.env.VITE_SECRET_KEY
    const morning = { 11: "T2", 12: "T3", 13: "T4", 14: "T5", 15: "T6", 16: "T7", 10: "CN" };
    const afternoon = { 21: "T2", 22: "T3", 23: "T4", 24: "T5", 25: "T6", 26: "T7", 20: "CN" };

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
    const [visible, setVisible] = useState('false')
    const [doctorData, setDoctorData] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [currenDoc, setCurrenDoc] = useState()
    const [calendarOpen, setCalendarOpen] = useState(false)

    const getDoctorData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/doctor/doctorlist')
            if (response.data.success) {
                setDoctorData(response.data.doctor)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleCalendarChange = (dates) => {
        // dates là mảng các ngày được chọn
        // Chuyển sang dạng 'YYYY-MM-DD' để lưu vào workDay
        const days = Array.isArray(dates) ? dates : [dates];
        setWorkDay(days.map(d => moment(d).format('YYYY-MM-DD')));
        setCalendarOpen(false);
    };

    const removeDoctor = async (id) => {
        try {
            confirmAlert({
                title: 'Confirm to remove doctor',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {
                            const response = await axios.post(backendUrl + '/api/doctor/remove', { id }, { headers: { token } })
                            if (response.data.success) {
                                toast.success(response.data.message)
                                await getDoctorData()
                            } else {
                                toast.error(response.data.message)
                            }
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => { return null }
                    }
                ]
            })
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const handleProductClick = (item) => {
        // Khi nhấp vào sản phẩm, nếu sản phẩm đã được chọn thì bỏ chọn, ngược lại chọn sản phẩm đó
        setSelectedProduct(selectedProduct && selectedProduct._id === item._id ? item : item);
    };

    const handleHidenClick = () => {
        setSelectedProduct(null);
    }

    // Giải mã
    const decryptPassword = (encryptedPassword, secretKey) => {
        const [iv, encrypted] = encryptedPassword.split(':');
        const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, '0').slice(0, 32));
        const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: CryptoJS.enc.Hex.parse(iv) });
        return decrypted.toString(CryptoJS.enc.Utf8);
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData()

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

            const response = await axios.post(backendUrl + "/api/doctor/add", formData, { headers: { token } })

            if (response.data.success) {
                toast.success(response.data.message)
                setUserName('')
                setPassword('')
                setName('')
                setPhone('')
                setEmail('')
                setDescription('')
                setRole('0')
                setWorkDay([])
                setImage(false)
                setAdmin(false)
                await getDoctorData()
                setVisible('false')
            } else {
                toast.error('Please fill all fields, image')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getDoctorData()
    }, [])

    return (
        <div>
            <div className=' flex justify-end'>
                <img onClick={(e) => setVisible((prev) => (prev === 'true' ? 'false' : 'true'))} src={assets.add_icon} alt="" />
            </div>

            <form onSubmit={onSubmitHandler} className={`w-full mb-10 ${visible === 'false' ? 'hidden' : ''}`}>
                <div className='flex'>
                    <div className='flex flex-col w-2/3 items-start gap-3'>
                        <div className='w-full'>
                            <p className=''>Username</p>
                            <input onChange={(e) => setUserName(e.target.value)} value={userName} type="text" placeholder='Enter username' className='w-full max-w-[500px] px-3 py-2' required />
                        </div>
                        <div className='w-full'>
                            <p className=''>Password</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Enter password' className='w-full max-w-[500px] px-3 py-2' required />
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
                            <label htmlFor="image">
                                <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" className='w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 object-cover border border-gray-300 rounded cursor-pointer' />
                                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                            </label>
                        </div>
                    </div>
                </div>
                <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
            </form>

            {/* Doctor list here */}
            <Title text1={"All"} text2={"Doctor list"} />
            <div className='flex flex-col gap-2'>
                {/* ========== List Table Title ========== */}
                <div className='hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Username</b>
                    <b>Passwork</b>
                    <b className='text-center'>Action</b>
                </div>

                {/* ========== Product List ========== */}
                {
                    doctorData.map((item, index) => (
                        <div key={index} onClick={() => handleProductClick(item)}>
                            {!item.visible &&
                                <div className='grid grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center gap-2 px-2 border text-sm'>
                                    <img src={item.image} alt="" className='w-12' />
                                    <p>{item.name}</p>
                                    <div className='flex items-center gap-2'>
                                        <p>{item.username}</p>
                                        {item.admin
                                            ? <img src={assets.key} alt="" className='w-3' />
                                            : null
                                        }
                                    </div>

                                    <div className="grid grid-cols-[2fr_1fr] items-center">
                                        <p>{showPassword && index === currenDoc ? decryptPassword(item.password, secretKey) : '••••••••'}</p>
                                        <img onClick={(e) => { e.stopPropagation(); setShowPassword((prev) => !prev), setCurrenDoc(index) }} src={showPassword && index === currenDoc ? assets.hidden : assets.eye} alt="" className="w-5 cursor-pointer" />
                                    </div>
                                    {/* Cột Action */}
                                    <div className='flex justify-center gap-4'>
                                        <Link onClick={(e) => e.stopPropagation()} to={`/change/${item._id}`}>
                                            <img
                                                src={assets.pen}
                                                alt="Edit"
                                                className='w-4 sm:w-5 cursor-pointer hover:text-blue-500'
                                            />
                                        </Link>
                                        <img
                                            onClick={(e) => { e.stopPropagation(); removeDoctor(item._id) }}
                                            src={assets.bin_icon}
                                            alt="Delete"
                                            className='w-4 sm:w-5 cursor-pointer hover:text-red-500'
                                        />
                                    </div>

                                    {/* Hiển thị chi tiết thông tin bên dưới khi được chọn */}
                                    {selectedProduct && selectedProduct._id === item._id && (
                                        <div className="col-span-6 mt-4 mx-2 p-4 border bg-yellow-100">
                                            <div className="grid grid-cols-[1fr_3fr_5fr] gap-2 px-2 mb-2">
                                                <p><strong>Image</strong></p>
                                                <p><strong>Info Doctor</strong></p>
                                                <p><strong>Description</strong></p>
                                            </div>
                                            <hr className="mb-2" />
                                            <div className="grid grid-cols-[1fr_3fr_5fr] gap-2 px-2">
                                                <div className="gap-2 group relative w-20 h-20">
                                                    <img src={item.image} alt='' className="w-20 h-20 object-cover" />

                                                    <div className="group-hover:block hidden absolute z-50 w-96 bg-white border border-gray-300 p-2">
                                                        <img src={item.image} alt='' className='w-96' />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className='py-4'><strong>Name:</strong> {item.name}</p>
                                                    <p className='py-4'><strong>Phone:</strong> {item.phone}</p>
                                                    <p className='py-4'><strong>Email:</strong> {item.email}</p>
                                                    <div className="flex flex-col gap-2">
                                                        <p className='pt-4'><strong>Workday:</strong></p>
                                                        {/* Show Workday */}
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {item.workDay.map((d, i) => (
                                                                <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                                                    {moment(d).format('DD/MM/YYYY')}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <pre className='whitespace-pre-wrap break-words'>{item.description}</pre>
                                                </div>
                                            </div>

                                            <div className='mx-auto w-14 flex justify-center items-center mt-5 cursor-pointer' onClick={(e) => { e.stopPropagation(), handleHidenClick() }}>
                                                <img src={assets.up} alt="" className='w-3 h-3' />
                                                <p className='text-sm mx-2'>Ẩn</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default DoctorManage