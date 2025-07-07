import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import moment from 'moment'

const ProfileElement = () => {
    const { info } = useContext(ShopContext)
    const [currentMonth, setCurrentMonth] = useState(moment())

    // Create array for day, month, week
    const startOfMonth = currentMonth.clone().startOf('month').startOf('week')
    const endOfMonth = currentMonth.clone().endOf('month').endOf('week')
    const day = startOfMonth.clone()
    const calendar = []

    while (day.isBefore(endOfMonth, 'day')) {
        const week = []
        for (let i = 0; i < 7; i++) {
            week.push(day.clone())
            day.add(1, 'day')
        }
        calendar.push(week)
    }

    // Funtion for change month
    const changeMonth = (amount) => {
        setCurrentMonth(currentMonth.clone().add(amount, 'month'))
    }

    return (
        <div className='grid grid-cols-[1fr_2fr]'>
            <div className='flex justify-center'>
                <img src={info.image ? info.image : assets.user} alt="" className='w-44 h-56 mt-5 border border-gray-500 rounded object-cover object-top' />
            </div>
            <div className='flex flex-col gap-3'>
                <p className='flex justify-center font-bold text-lg'>THÔNG TIN CÁ NHÂN</p>
                <p className='flex gap-3'><span className='font-bold'>{info.role === 0 ? 'Bs.' : 'Trợ tá.'}</span> {info.name}</p>
                <p className='font-bold'>Liên hệ:</p>
                <div className='flex gap-3'>
                    <p className='flex gap-2 text-sm ml-10'><span className='font-bold'>SĐT:</span> {info.phone}</p>
                    <p className='flex gap-2 text-sm ml-10'><span className='font-bold'>Email:</span> {info.email}</p>
                </div>
                <p className='font-bold'>Lịch làm việc:</p>
                {/* Select month, year bar */}
                <div className="flex justify-between items-center mb-2">
                    <button onClick={() => changeMonth(-1)} className="px-2 py-1 border border-gray-800 rounded bg-white">Tháng trước</button>
                    <div className="flex items-center gap-2">
                        <select
                            value={currentMonth.month()}
                            onChange={e => setCurrentMonth(currentMonth.clone().month(Number(e.target.value)))}
                            className="border border-gray-800 rounded px-2 py-1"
                        >
                            {Array.from({ length: 12 }).map((_, i) => (
                                <option key={i} value={i}>{`Tháng ${i + 1}`}</option>
                            ))}
                        </select>
                        <select
                            value={currentMonth.year()}
                            onChange={e => setCurrentMonth(currentMonth.clone().year(Number(e.target.value)))}
                            className="border border-gray-800 rounded px-2 py-1"
                        >
                            {Array.from({ length: 11 }).map((_, i) => {
                                const year = moment().year() + i;
                                return <option key={year} value={year}>{year}</option>
                            })}
                        </select>
                    </div>
                    <button onClick={() => changeMonth(1)} className="px-2 py-1 border border-gray-800 rounded bg-white">Tháng sau</button>
                </div>

                {/* Calendar table */}
                <div className="overflow-x-auto">
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr>
                                {['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'].map((d, i) => (
                                    <th key={i} className="border border-gray-500 px-4 py-2 bg-blue-300">{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {calendar.map((week, wi) => (
                                <tr key={wi}>
                                    {week.map((date, di) => (
                                        <td key={di} className="border border-gray-500 px-4 py-2 min-w-[50px] align-top">
                                            <div className={date.month() === currentMonth.month() ? "" : "text-gray-400"}>
                                                {date.date()}
                                                <hr className="border-t-1 border-gray-300 my-1" />
                                                <div className="flex flex-col gap-1 mt-1">
                                                    {info.workDay?.includes(date.format('YYYY-MM-DD')) && (
                                                        <div
                                                            className="text-xs bg-yellow-100 rounded px-1 py-0.5 mt-1 cursor-default relative text-center"
                                                        >
                                                            x
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='flex flex-col gap-2 mt-5'>
                    <p className='font-bold'>Giới thiệu</p>
                    <p className='text-sm ml-5'>{info.description}</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileElement