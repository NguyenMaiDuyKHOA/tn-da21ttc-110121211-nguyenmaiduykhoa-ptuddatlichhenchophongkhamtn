import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { backendUrl } from '../App'
import moment from 'moment'
import axios from 'axios'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import Title from '../components/Title';


const ListBooking = ({ token }) => {
    const { setBookingCount } = useContext(ShopContext)
    const [booking, setBooking] = useState([])
    const [filteredBooking, setFilteredBooking] = useState([])
    const [selectedStatus, setSelectedStatus] = useState('All')

    const fetchAllBooking = async () => {
        if (!token) {
            return null
        }

        try {
            const response = await axios.post(backendUrl + '/api/booking/bookinglist', {}, { headers: { token } })
            if (response.data.success) {
                setBooking(response.data.booking)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const getBookingCount = async () => {
        let bookingCount = 0

        try {
            if (booking) {
                // Đếm số booking chưa Accept
                bookingCount = booking.filter(item => item.status === false || item.status === "false").length;
                setBookingCount(bookingCount)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const statusHandler = async (event, bookingId) => {
        try {
            const response = await axios.post(backendUrl + '/api/booking/update', { bookingId, status: event.target.value }, { headers: { token } })

            if (response.data.success) {
                await fetchAllBooking()
            }
        } catch (error) {
            console.log(error)
            toast.error(response.data.message)
        }
    }

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    }

    useEffect(() => {
        switch (selectedStatus) {
            case "All":
                setFilteredBooking(booking);
                break;
            case "true":
                setFilteredBooking(booking.filter(item => item.status === "true" || item.status === true));
                break;
            case "false":
                setFilteredBooking(booking.filter(item => item.status === "false" || item.status === false));
                break;
            default:
                setFilteredBooking(booking);
        }
    }, [booking, selectedStatus]);

    useEffect(() => {
        fetchAllBooking()
    }, [token])

    useEffect(() => {
        getBookingCount()
    }, [booking])

    return (
        <div>
            <div className='flex justify-between'>
                <Title text1={"List"} text2={"Booking"} />

                {/* Select box for status */}
                <select
                    onChange={handleStatusChange}
                    className="flex-none basis-1/5 p-2 border border-gray-300 rounded"
                >
                    <option value="All">All</option>
                    <option value="true">Accept</option>
                    <option value="false">Not Accept</option>
                </select>
            </div>

            <div>
                {
                    filteredBooking.map((item, index) => (
                        <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_2fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'>
                            <img src={assets.checklist} alt="" />
                            <div>
                                <p className='mt-3 mb-2 font-medium'>Customer: {item.name}</p>
                                <p>Phone: {item.phone}</p>
                                <p className='mt-3 mb-2 font-medium'>Note: {item.note}</p>
                            </div>
                            <div>
                                <p className='text-sm sm:text-[15px]'>Doctor: {item.doc.name}</p>
                                <p className='text-sm sm:text-[15px] mt-2'>User: {item.doc.username}</p>
                                <p className='mt-2'>Date : {moment(item.date).format("DD/MM/YYYY")}</p>
                                <p className='mt-2'>Session: {item.session}</p>
                            </div>
                            <select onChange={(event) => statusHandler(event, item._id)} value={item.status} className='p-2 font-semibold'>
                                <option value="true">Accept</option>
                                <option value="false">Not Accept</option>
                            </select>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ListBooking