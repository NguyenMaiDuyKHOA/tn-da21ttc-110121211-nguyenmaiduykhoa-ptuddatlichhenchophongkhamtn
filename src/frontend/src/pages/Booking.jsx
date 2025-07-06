import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import moment from 'moment'

const Booking = () => {
    const { info, doctorList, backendUrl, token } = useContext(ShopContext)

    // Hàm lấy ngày hiện tại và định dạng theo yyyy-mm-dd
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Thêm số 0 nếu tháng < 10
        const day = String(today.getDate()).padStart(2, '0'); // Thêm số 0 nếu ngày < 10
        return `${year}-${month}-${day}`;
    };

    const getDayOfWeek = (dateString) => {
        const date = new Date(dateString); // Chuyển chuỗi ngày thành đối tượng Date
        return date.getDay(); // Lấy thứ trong tuần
    };

    const [name, setName] = useState('')
    const [doctorId, setDoctorId] = useState('')
    const [session, setSession] = useState('moning')
    const [note, setNote] = useState('')
    const [calendar, setCalendar] = useState(getCurrentDate())
    const [phone, setPhone] = useState(info.phone)
    const [doctorData, setDoctorData] = useState([])
    const [weekDay, setWeekDay] = useState(getDayOfWeek(calendar))

    const selectedDoctor = doctorData.find(item => item._id === doctorId);

    const loadDoctorList = async () => {
        try {
            let allDoctor = []
            doctorList.map((item) => {
                item['name'] = item.name
                item['phone'] = item.phone
                item['email'] = item.email
                item['description'] = item.description
                item['image'] = item.image
                allDoctor.push(item)
            })
            setDoctorData(allDoctor.reverse())
        } catch (error) {
            console.error(error)
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(backendUrl + '/api/booking/add', { name, phone, date: calendar, session, doc: doctorId, note }, { headers: { token } })

            if (response.data.success) {
                toast.success(response.data.message)
                await axios.post(backendUrl + '/api/booking/addcart', { bookingId: response.data.booking._id }, { headers: { token } })
                setDoctorId('')
                setNote('')
                setSession('moning')
                setName('')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        loadDoctorList()
    }, [doctorList])

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row space-x-40 gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* ---------- Left Side ---------- */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'PHIẾU'} text2={'ĐĂNG KÝ'} />
                </div>
                <input required onChange={(e) => setName(e.target.value)} name='name' type="text" value={name} placeholder='Họ và tên khách hàng' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
                <input required onChange={(e) => setPhone(e.target.value)} name='phone' type="text" defaultValue={phone} placeholder='Số điện thoại' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
                <div className='flex gap-3'>
                    <input required onChange={(e) => { setCalendar(e.target.value), setWeekDay(getDayOfWeek(calendar)), setDoctorId('') }} name='calendar' value={calendar} type="date" min={getCurrentDate()} placeholder='dd/mm/yyyy' className='border border-gray-300 rounded py-1.5 px-3.5 w-2/3' />
                    <select onChange={(e) => setSession(e.target.value)} value={session} className="w-1/3 border border-gray-300 rounded px-3 py-2">
                        <option value="moning">Sáng</option>
                        <option value="afternoon">Chiều</option>
                    </select>
                </div>
                <div className='w-full'>
                    <select required onChange={(e) => setDoctorId(e.target.value)} name='doctor' value={doctorId} placeholder='Chọn bác sĩ' className='border border-gray-300 rounded py-1.5 px-3.5 w-full'>
                        <option value="" disabled>Chọn bác sĩ</option> {/* Tùy chọn mặc định */}
                        {doctorData
                            .filter(item =>
                                !item.visible &&
                                Array.isArray(item.workDay) &&
                                item.workDay.includes(calendar)
                            )
                            .map((item, index) => (
                                <option key={index} value={item._id}>{item.name}</option>
                            ))
                        }
                    </select>
                </div>
                <textarea onChange={(e) => setNote(e.target.value)} name='note' type="text" value={note} placeholder='Ghi chú' className='border border-gray-300 rounded py-1.5 px-3.5 w-full min-h-20' />

                <div className='w-full text-end mt-8'>
                    <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>ĐẶT HẸN</button>
                </div>
            </div>

            {/* ---------- Right Side ---------- */}
            <div className='w-[800px]'>
                <div className='mt-1 min-w-80'>
                </div>
                {/* ========== Payment Method Selection ========== */}
                <div className='mt-5'>
                    <Title text1={'THÔNG TIN'} text2={'BÁC SĨ'} />
                    {
                        doctorId === ''
                            ? <img src={assets.logo} alt="" className='w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 object-cover border border-gray-300 rounded' />
                            : <div className='flex gap-3 flex-col lg:flex-row'>
                                <img src={selectedDoctor.image} alt="" className='w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 object-cover border border-gray-300 rounded' />
                                <div className='ml-3'>
                                    <p className='font-bold text-lg mb-5'>Bs. {selectedDoctor.name}</p>
                                    <p className='font-bold text-base'>Giới thiệu về bác sĩ: </p>
                                    <p className='ml-10'>{selectedDoctor.description}</p>
                                </div>
                            </div>
                    }
                </div>
                <hr className='mt-10' />
                <div className="w-full max-w-[800px] bg-white rounded-lg shadow-lg p-8 mt-3">
                    <h3 className="text-xl font-bold mb-4 text-green-700">Lưu ý khi đặt lịch</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Vui lòng nhập đầy đủ và chính xác thông tin.</li>
                        <li>Chọn đúng ngày, bác sĩ phù hợp với nhu cầu.</li>
                        <li>Nhân viên sẽ liên hệ xác nhận sau khi đặt lịch.</li>
                        <li>Đến trước giờ hẹn 10 phút để làm thủ tục.</li>
                    </ul>
                </div>
            </div>
        </form>
    )
}

export default Booking