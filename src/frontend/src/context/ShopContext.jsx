import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [articles, setArticles] = useState([]);
    const [slide, setSlide] = useState([]);
    const [clinic, setClinic] = useState([]);
    const [info, setInfo] = useState([])
    const [doctorList, setDoctorList] = useState([])
    const [token, setToken] = useState('');
    const [role, setRole] = useState()
    const navigate = useNavigate();

    const getClinicInfo = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/clinic/getclinic')
            setClinic(response.data.info[0])
        } catch (error) {
            console.log(error)
        }
    }

    const getUserInfo = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/user/getuser', {}, { headers: { token } })
            const response2 = await axios.post(backendUrl + '/api/user/getdoctor', {}, { headers: { token } })
            if (response.data.success) {
                setInfo(response.data.info)
            }

            if (response2.data.success) {
                setInfo(response2.data.info)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getDoctorInfo = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/user/getdoctor', {}, { headers: { token } })
            setInfo(response.data.info)
        } catch (error) {
            console.log(error)
        }
    }

    const getRole = () => {
        try {
            if (info) {
                setRole(info.role)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const getDoctorList = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/doctor/doctorlist')

            if (response.data.success) {
                setDoctorList(response.data.doctor)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchAllArticle = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/article/all')

            if (response.data.success) {
                setArticles(response.data.article)
            }
        } catch (error) {
            console.error("Error fetching articles:", error);
        }
    }

    const getSlideBanner = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/slide/list')
            if (response.data.success) {
                setSlide(response.data.slide)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getClinicInfo()
    }, [])

    useEffect(() => {
        getUserInfo()
    }, [token])

    useEffect(() => {
        getRole()
    }, [info])

    useEffect(() => {
        getDoctorList()
    }, [])

    useEffect(() => {
        fetchAllArticle()
    }, [])

    useEffect(() => {
        getSlideBanner()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
        }
    }, [])

    const value = {
        slide, articles,
        search, setSearch, showSearch, setShowSearch,
        clinic, info, doctorList, role,
        navigate, backendUrl,
        setToken, token
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;