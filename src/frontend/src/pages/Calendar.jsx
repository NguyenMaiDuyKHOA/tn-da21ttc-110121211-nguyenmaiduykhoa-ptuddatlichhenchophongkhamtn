import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import moment from 'moment'

const Calendar = () => {
    const { doctorList } = useContext(ShopContext)
    const [currentMonth, setCurrentMonth] = useState(moment())
    const [popupDoctor, setPopupDoctor] = useState(null) // {doctor, x, y}

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
        <div className='flex flex-col gap-4 my-5'>

            {/* Select month, year bar */}
            <div className="flex justify-between items-center mb-2">
                <button onClick={() => changeMonth(-1)} className="px-2 py-1 border rounded">Tháng trước</button>
                <div className="flex items-center gap-2">
                    <select
                        value={currentMonth.month()}
                        onChange={e => setCurrentMonth(currentMonth.clone().month(Number(e.target.value)))}
                        className="border rounded px-2 py-1"
                    >
                        {Array.from({ length: 12 }).map((_, i) => (
                            <option key={i} value={i}>{`Tháng ${i + 1}`}</option>
                        ))}
                    </select>
                    <select
                        value={currentMonth.year()}
                        onChange={e => setCurrentMonth(currentMonth.clone().year(Number(e.target.value)))}
                        className="border rounded px-2 py-1"
                    >
                        {Array.from({ length: 11 }).map((_, i) => {
                            const year = moment().year() + i;
                            return <option key={year} value={year}>{year}</option>
                        })}
                    </select>
                </div>
                <button onClick={() => changeMonth(1)} className="px-2 py-1 border rounded">Tháng sau</button>
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
                                    <td key={di} className="border border-gray-500 px-4 py-2 min-w-[160px] align-top">
                                        <div className={date.month() === currentMonth.month() ? "" : "text-gray-400"}>
                                            {date.date()}
                                            <hr className="border-t-1 border-gray-300 my-1" />
                                            <div className="flex flex-col gap-1 mt-1">
                                                {doctorList
                                                    .filter(doctor => doctor.workDay?.includes(date.format('YYYY-MM-DD')))
                                                    .map((doctor, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="text-xs bg-blue-100 rounded px-1 py-0.5 mt-1 cursor-pointer relative"
                                                            onMouseEnter={e => {
                                                                const rect = e.target.getBoundingClientRect();
                                                                setPopupDoctor({
                                                                    doctor,
                                                                    x: rect.right + window.scrollX,
                                                                    y: rect.top + window.scrollY
                                                                });
                                                            }}
                                                            onMouseLeave={() => setPopupDoctor(null)}
                                                        >
                                                            {doctor.name}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Popup for view info doctor */}
                {popupDoctor && (() => {
                    // responsive positioning for popup
                    const popupWidth = 600;
                    const popupHeight = 300;

                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;

                    let left = popupDoctor.x + 10;
                    let top = popupDoctor.y + 10;


                    if (left + popupWidth > windowWidth) {
                        left = popupDoctor.x - popupWidth - 160;
                    }
                    if (top + popupHeight > windowHeight) {
                        top = windowHeight - popupHeight - 20;
                        if (top < 0) top = 0;
                    }

                    return (
                        <div style={{ top, left }} className="absolute z-50 min-w-[180px] max-w-[600px] bg-white border border-gray-300 rounded shadow-lg p-3">
                            <div className="font-bold mb-1">Bs. {popupDoctor.doctor.name}</div>
                            <div className='flex gap-3 items-start'>
                                <img src={popupDoctor.doctor.image} alt="" className='w-44 h-48 object-cover' />
                                <div>
                                    <p className='text-sm font-bold'>Số điện thoại: <span className='text-base font-normal'>{popupDoctor.doctor.phone}</span></p>
                                    <p className='text-sm font-bold mt-2'>Email: <span className='text-base font-normal'>{popupDoctor.doctor.email}</span></p>
                                    <p className='text-sm font-bold mt-2'>Giới thiệu: <span className='text-base font-normal'>{popupDoctor.doctor.description}</span></p>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    )
}

export default Calendar