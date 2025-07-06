import React, { useContext } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { ShopContext } from '../context/ShopContext'

const Contact = () => {
    const { clinic } = useContext(ShopContext);

    return clinic ? (
        <div className=''>
            <div className='text-center text-2xl pt-10 border-t'>
                <Title text1={'CONTACT'} text2={'US'} />
            </div>

            <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
                <img src={assets.contact_img} alt="" className='w-full md:max-w-[480px]' />
                <div className='flex flex-col justify-center items-start gap-6'>
                    <p className='font-semibold text-xl text-gray-600'>Our Clinic</p>
                    <p className='text-gray-500'>{clinic.address}</p>
                    <p className='text-gray-500'>{clinic.phone && <a href={`tel:${clinic.phone.replace(/[^+\d]/g, '')}`} className="underline">Tel: {clinic.phone}</a>} <br /> <br /> Email: {clinic.email}</p>
                    <p className='font-semibold text-xl text-gray-600'>Careers at Clinic</p>
                    <p className='text-gray-500'>Learn more about our team and job openings.</p>
                    <button className='border border-black px-8 py-4 text-sm bg-gray-200 hover:bg-black hover:text-white transition-all duration-500'>Contact us</button>
                </div>
            </div>
        </div>
    )
        : <div className='text-center text-2xl pt-10 border-t'>
            <Title text1={'CONTACT'} text2={'US'} />
        </div>
}

export default Contact