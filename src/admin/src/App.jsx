import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import DoctorMange from './pages/DoctorManage'
import { useState } from 'react'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react'
import Orders from './pages/Orders'
import Slide from './pages/Slide'
import Change from './pages/Change'
import ArticleManage from './pages/ArticleManage'
import Clinic from './pages/Clinic'
import ListBooking from './pages/ListBooking'

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = 'VND'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])
  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>

              <Routes>
                <Route path='/' element={<Clinic token={token} />} />
                <Route path='/articlemanage' element={<ArticleManage token={token} />} />
                <Route path='/doctormanage' element={<DoctorMange token={token} />} />
                <Route path='/listbooking' element={<ListBooking token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/slide' element={<Slide token={token} />} />
                <Route path='/change/:doctorId' element={<Change token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App