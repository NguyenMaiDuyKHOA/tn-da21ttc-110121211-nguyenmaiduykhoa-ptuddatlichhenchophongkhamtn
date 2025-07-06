import React from 'react'
import { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title'
import { assets } from '../assets/assets';
import axios from 'axios';
import moment from 'moment'
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const CheckBooking = () => {
    const { backendUrl, token } = useContext(ShopContext);
    const [bookingData, setBookingData] = useState([])

    const loadBookingData = async () => {
        try {
            if (!token) {
                return null
            }

            const response = await axios.post(backendUrl + '/api/booking/usercart', {}, { headers: { token } })
            if (response.data.success) {
                let allBookingsItem = []
                response.data.booking.map((item) => {
                    item['name'] = item.name
                    item['phone'] = item.phone
                    item['session'] = item.session
                    item['date'] = item.date
                    item['datebook'] = item.datebook
                    item['doc'] = item.doc
                    item['status'] = item.status
                    allBookingsItem.push(item)
                })
                setBookingData(allBookingsItem.reverse())
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handelRemove = async (bookingId) => {
        try {
            confirmAlert({
                title: 'Xác nhận hủy lịch hẹn',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {
                            const response = await axios.post(backendUrl + '/api/booking/remove', { bookingId }, { headers: { token } })
                            if (response.data.success) {
                                toast.success('Đã hủy lịch hẹn')
                                loadBookingData()
                            } else {
                                toast.error('Hủy lịch hẹn thất bại')
                                loadBookingData()
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
            console.error(error)
        }
    }

    useEffect(() => {
        loadBookingData()
    }, [token])

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl'>
                <Title text1={'ON WAIT'} text2={'BOOKING'} />
            </div>
            <div className=''>
                {
                    bookingData.map((item, index) => (
                        item.status === (false) ? (
                            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                {/* Cột bên trái - Chi tiết sản phẩm */}
                                <div className='flex items-start gap-6 text-sm md:w-2/3'>

                                    <img src={assets.logo} alt="" className='w-16 sm:w-20' />
                                    <div className='flex flex-col gap-2'>
                                        <p className='sm:text-base font-medium'>{item.name}</p>
                                        <div className='flex items-center gap-10 mt-1 text-sm text-gray-700'>
                                            <p className='min-w-[250px]'>Số điện thoại: {item.phone}</p>
                                            <p className='mt-1'>Ngày đặt hẹn: <span className='text-gray-400'>{moment(item.datebook).format("DD/MM/YYYY")}</span></p>
                                            <p>Bác sĩ: {item.doc.name}</p>
                                        </div>

                                        <p>Ngày hẹn khám: <span className='text-gray-400'>{moment(item.date).format("DD/MM/YYYY")}</span> <span className='ml-5 text-gray-400'>{item.session === "moning" ? "Sáng" : "Chiều"}</span></p>
                                        <p>Ghi chú: {item.note}</p>
                                    </div>
                                </div>

                                {/* Cột bên phải - Trạng thái và nút Track */}
                                <div className='md:w-1/3 flex space-x-4 items-center gap-4'>
                                    {/* Cột trạng thái xác nhận */}
                                    <div className='flex items-center gap-2' style={{ flexBasis: '150px' }}>
                                        <div className='flex items-center gap-2'>
                                            <p className='min-w-2 h-2 rounded-full bg-yellow-500'></p>
                                            <p className='text-sm md:text-base'>Chờ xác nhận</p>
                                        </div>

                                    </div>

                                    {/* Cột Track Order */}
                                    <div >
                                        <img onClick={() => handelRemove(item._id)} src={assets.bin_icon} alt="" className='w-5 cursor-pointer' />
                                    </div>

                                    <div style={{ flexBasis: '150px', textAlign: 'right' }}>
                                        <button onClick={loadBookingData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Booking</button>
                                    </div>
                                </div>
                            </div>
                        ) : ""
                    ))
                }
            </div>

            <hr className='my-5' />

            {/* HISTORY */}
            <div className='text-2xl'>
                <Title text1={'ACCEPTED'} text2={'BOOKING'} />
            </div>
            <div className=''>
                {
                    bookingData.map((item, index) => (
                        item.status === (true) ? (
                            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                {/* Cột bên trái - Chi tiết sản phẩm */}
                                <div className='flex items-start gap-6 text-sm md:w-2/3'>

                                    <img src={assets.logo} alt="" className='w-16 sm:w-20' />
                                    <div>
                                        <p className='sm:text-base font-medium'>{item.name}</p>
                                        <div className='flex items-center gap-10 mt-1 text-sm text-gray-700'>
                                            <p className='min-w-[250px]'>Số điện thoại: {item.phone}</p>
                                            <p className='mt-1'>Ngày đặt hẹn: <span className='text-gray-400'>{moment(item.datebook).format("DD/MM/YYYY")}</span></p>
                                            <p>Bác sĩ: {item.doc.name}</p>
                                        </div>

                                        <p>Ngày hẹn khám: <span className='text-gray-400'>{moment(item.date).format("DD/MM/YYYY")}</span> <span className='ml-5 text-gray-400'>{item.session === "moning" ? "Sáng" : "Chiều"}</span></p>
                                        <p>Ghi chú: {item.note}</p>
                                    </div>
                                </div>

                                {/* Cột bên phải - Trạng thái và nút Track */}
                                <div className='md:w-1/3 flex space-x-4 items-center gap-4'>
                                    {/* Cột trạng thái xác nhận */}
                                    <div className='flex items-center gap-2' style={{ flexBasis: '150px' }}>
                                        <div className='flex items-center gap-2'>
                                            <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                                            <p className='text-sm md:text-base'>Đã xác nhận</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ""
                    ))
                }
            </div>
        </div>
    )
}

export default CheckBooking