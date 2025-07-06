import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { backendUrl } from '../App';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const [token, setToken] = useState('');
    const [booking, setBooking] = useState([])
    const [bookingCount, setBookingCount] = useState(0)

    const fetchAllBooking = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/booking/bookinglist', {}, { headers: { token } })
            if (response.data.success) {
                setBooking(response.data.booking)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
        }
    }, [])

    useEffect(() => {
        fetchAllBooking()
    }, [token])

    const capitalizeWords = (str) => {
        return str.toLowerCase().replace(/\b\w/g, (char, idx) => (idx === 0 || str[idx - 1] === ' ') ? char.toUpperCase() : char);
    }

    const value = {
        setToken, token,
        capitalizeWords,
        booking, bookingCount, setBookingCount
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;