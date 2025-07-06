import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

const Clinic = ({ token }) => {
    const [clinicCode, setClinicCode] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [openHours, setOpenHours] = useState('')
    const [closeHours, setCloseHours] = useState('')
    const [infoClinic, setInfoClinic] = useState([])
    const [address, setAddress] = useState('')

    const fetchInfoClinic = async (req, res) => {
        try {
            const response = await axios.get(backendUrl + '/api/clinic/getclinic')
            setInfoClinic(response.data.info[0])
        } catch (error) {
            console.error(error)
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData()

            formData.append("clinicCode", clinicCode)
            formData.append("name", name)
            formData.append("phone", phone)
            formData.append("email", email)
            formData.append("address", address)
            formData.append("openHours", openHours)
            formData.append("closeHours", closeHours)

            const response = await axios.post(backendUrl + '/api/clinic/setclinic', { clinicCode, name, phone, email, address, openHours, closeHours }, { headers: { token } })

            if (response.data.success) {
                toast.success(response.data.message)
                setClinicCode('')
                setName('')
                setPhone('')
                setOpenHours('')
                setCloseHours('')
                setAddress('')
                fetchInfoClinic()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            fetchInfoClinic()
        }
    }, [token])

    return (
        <div className='grid grid-cols-[2fr_2fr] space-x-5'>
            <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
                <div className='w-full'>
                    <p className=''>Clinic code</p>
                    <input onChange={(e) => setClinicCode(e.target.value)} value={clinicCode} type="text" placeholder='Enter clinic code' className='w-full max-w-[200px] px-3 py-2' required />
                </div>
                <div className='w-full'>
                    <p className=''>Clinic name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Enter name of clinic' className='w-full max-w-[500px] px-3 py-2' required />
                </div>
                <div className='w-full'>
                    <p className=''>Clinic phone</p>
                    <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" placeholder='Enter phone of clinic' className='w-full max-w-[500px] px-3 py-2' required />
                </div>
                <div className='w-full'>
                    <p className=''>Clinic email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Enter email of clinic' className='w-full max-w-[500px] px-3 py-2' required />
                </div>
                <div className='w-full'>
                    <p className=''>Clinic address</p>
                    <input onChange={(e) => setAddress(e.target.value)} value={address} type="text" placeholder='Enter address of clinic' className='w-full max-w-[500px] px-3 py-2' required />
                </div>
                <div className='w-full'>
                    <p className=''>Opening hours</p>
                    <div className='flex my-2 ml-10'>
                        <div className='flex'>
                            <p className='mr-2'>Open:</p>
                            <input onChange={(e) => setOpenHours(e.target.value)} value={openHours} type="text" placeholder='00:00' className='w-full max-w-[100px] text-right px-2' required />
                        </div>

                        <div className='mx-4'>--</div>

                        <div className='flex'>
                            <p className='mr-2'>Close:</p>
                            <input onChange={(e) => setCloseHours(e.target.value)} value={closeHours} type="text" placeholder='00:00' className='w-full max-w-[100px] text-right px-2' required />
                        </div>
                    </div>
                </div>

                <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>SAVE</button>
            </form>

            <div className='flex flex-col gap-12 mt-10'>
                <p>Clinic code: {infoClinic ? infoClinic.code : "VD: ABC"}</p>
                <p>Clinic name: {infoClinic ? infoClinic.name : "VD: Phòng khám đa khoa ABC"}</p>
                <p>Phone: {infoClinic ? infoClinic.phone : "VD: 0849 030 xxx"}</p>
                <p>Email: {infoClinic ? infoClinic.email : "VD: example@moh.gov.vn"}</p>
                <p>Address: {infoClinic ? infoClinic.address : "VD: 123 xxx, xxx, xxx"}</p>
                <p>Open: {infoClinic ? infoClinic.open : "VD: 08:00"} -- Close: {infoClinic ? infoClinic.close : "VD: 22:00"}</p>
            </div>
        </div>
    )
}

export default Clinic