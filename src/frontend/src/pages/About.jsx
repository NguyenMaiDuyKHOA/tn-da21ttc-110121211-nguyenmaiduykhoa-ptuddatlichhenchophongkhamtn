import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import DOMPurify from 'dompurify';

const About = () => {
    const { articles } = useContext(ShopContext);
    const [infoAbout, setInfoAbout] = useState(null);

    const fetchAboutInfo = async () => {
        articles.map((item) => {
            if (item.isAbout === true) {
                setInfoAbout(item);
                return null;
            }
        })
    }

    useEffect(() => {
        fetchAboutInfo();
    }, [articles])

    return infoAbout ? (
        <div className='w-full min-h-screen bg-gray-100'>
            <div className='text-2xl text-center pt-8 border-t'>
                <Title text1={'ABOUT'} text2={'US'} />
            </div>

            <div className="flex flex-col justify-center items-center max-w-4xl w-full mx-auto px-4 py-5">
                <img src={infoAbout.thumbnail} alt="" className="w-[650px] h-auto max-h-[450px] justify-center items-center object-cover rounded" />
                <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(infoAbout.excerpt) }}></p>
                <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(infoAbout.content) }}></p>
            </div>
        </div>
    ) : null
}

export default About