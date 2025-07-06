import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'

const BookingElement = () => {
    const { backendUrl, token } = useContext(ShopContext)
    const [booking, setBooking] = useState([])
    const [currentMonth, setCurrentMonth] = useState(moment())

    const fecthBookingList = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/booking/booklistdoc', {}, { headers: { token } })

            if (response.data.success) {
                setBooking(response.data.booking.filter(item => item.status === true))
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Funtion for change month
    const changeDay = (amount) => {
        setCurrentMonth(currentMonth.clone().add(amount, 'day'))
    }

    useEffect(() => {
        fecthBookingList()
    }, [token])

    return (
        <div>
            {/* Select month, year bar */}
            <div className="flex justify-between items-center mb-2">
                <button onClick={() => changeDay(-1)} className="px-2 py-1 border border-gray-800 rounded bg-blue-300 text-gray-800">Ngày trước</button>
                <div className="flex items-center gap-2">
                    <select
                        value={currentMonth.date()}
                        onChange={e => setCurrentMonth(currentMonth.clone().date(Number(e.target.value)))}
                        className="border border-gray-800 rounded px-2 py-1 bg-white"
                    >
                        {Array.from({ length: currentMonth.daysInMonth() }).map((_, i) => (
                            <option key={i + 1} value={i + 1}>{`Ngày ${i + 1}`}</option>
                        ))}
                    </select>
                    <select
                        value={currentMonth.month()}
                        onChange={e => setCurrentMonth(currentMonth.clone().month(Number(e.target.value)))}
                        className="border border-gray-800 rounded px-2 py-1 bg-white"
                    >
                        {Array.from({ length: 12 }).map((_, i) => (
                            <option key={i} value={i}>{`Tháng ${i + 1}`}</option>
                        ))}
                    </select>
                    <select
                        value={currentMonth.year()}
                        onChange={e => setCurrentMonth(currentMonth.clone().year(Number(e.target.value)))}
                        className="border border-gray-800 rounded px-2 py-1 bg-white"
                    >
                        {Array.from({ length: 11 }).map((_, i) => {
                            const year = moment().year() + i;
                            return <option key={year} value={year}>{year}</option>
                        })}
                    </select>
                </div>
                <button onClick={() => changeDay(1)} className="px-2 py-1 border border-gray-800 rounded bg-blue-300 text-gray-800">Ngày sau</button>
            </div>

            {/* List booking for day */}
            {
                booking
                    .filter(item => moment(item.date).isSame(currentMonth, 'day'))
                    .map((item, index) => (
                        <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 bg-white'>
                            <img src={assets.checklist} alt="" className='w-20' />
                            <div>
                                <p className='mt-1 mb-2 font-medium'>Khách hàng: {item.name}</p>
                                <p className='mt-1 mb-2 font-medium'>Ghi chú: {item.note}</p>
                            </div>
                            <p>Số điện thoại: {item.phone}</p>
                            <p>Buổi: {item.session === 'morning' ? "Sáng" : "Chiều"}</p>
                        </div>
                    ))
            }
        </div >
    )
}

export default BookingElement