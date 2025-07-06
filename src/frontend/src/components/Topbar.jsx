import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const Topbar = () => {
    const { clinic } = useContext(ShopContext)

    return (
        <div className='flex space-x-10 items-center font-medium text-white bg-blue-500 pl-10 min-h-10'>
            <p>{clinic ? clinic.name : "Tên phòng khám"}</p>
            <p>{clinic ? clinic.phone : "Số điện thoại"}</p>
            <p>{clinic ? clinic.email : "Email"}</p>
            <p>{clinic ? clinic.address : "Địa chỉ phòng khám"}</p>
            <p>{clinic ? clinic.open : "08:00"} -- {clinic ? clinic.close : "22:00"}</p>
        </div>
    )
}

export default Topbar