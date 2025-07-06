import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';

const Hero = () => {
    const { slide } = useContext(ShopContext)
    const [banner, setBanner] = useState([])

    useEffect(() => {
        setBanner(slide)
    }, [slide])

    return (
        <div className="mt-3 flex justify-center items-center border border-gray-400 bg-blue-200 h-[500px]">
            {banner.length === 0
                ? <img src={assets.banner} alt="" className="max-w-full max-h-full mx-auto" />
                : <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={50}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000 }}
                    className="w-full h-full"
                >
                    {banner.map((item, index) => (
                        <SwiperSlide key={item._id} className="flex justify-center items-center">
                            <img
                                className="max-w-full max-h-full object-contain mx-auto"
                                src={item.image}
                                alt={`Slide ${index + 1}`}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            }
        </div>
    );
};

export default Hero;
