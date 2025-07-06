import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './pages/Profile'
import Booking from './pages/Booking'
import CheckBooking from './pages/CheckBooking'
import ProfileElement from './pages/ProfileElement'
import Calendar from './pages/Calendar'
import Article from './pages/Article'
import ScrollToTop from './components/ScrollToTop'
import Topbar from './components/Topbar'
import BookingElement from './pages/BookingElement'

const App = () => {
  return (
    <div>
      <Topbar />
      <Navbar />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] min-h-[264px]'>
        <ToastContainer />
        <ScrollToTop />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path='/booking' element={<Booking />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile/*' element={<Profile />}>
            <Route index element={<ProfileElement />} />
            <Route path='booklist' element={<BookingElement />} />
          </Route>
          <Route path='/checked' element={<CheckBooking />} />
          <Route path='/article/:slug' element={<Article />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App