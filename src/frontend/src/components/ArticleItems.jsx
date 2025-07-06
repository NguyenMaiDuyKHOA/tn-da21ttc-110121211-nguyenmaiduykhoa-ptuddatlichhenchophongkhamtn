import React from 'react'
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import DOMPurify from 'dompurify';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const ArticleItems = ({ slug, thumbnail, title, excerpt, createdAt, likes, isFeatured }) => {
    const { token, navigate } = useContext(ShopContext);

    return (
        <div onClick={() => token ? null : navigate('login')}>
            <div className="relative h-full flex flex-col">
                <Link to={`/article/${slug}`}>
                    <img
                        src={thumbnail}
                        alt={title}
                        className={`w-full ${isFeatured ? 'h-56 md:h-72' : 'h-40'} object-cover`}
                    />
                </Link>
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
                            {/* {source && <span className="font-semibold">{source}</span>}
                        {time && <span>• {time}</span>} */}
                        </div>
                        <Link to={`/article/${slug}`}>
                            <h2 className={`font-bold ${isFeatured ? 'text-xl' : 'text-base'} mb-1 line-clamp-2`}>
                                {title}
                            </h2>
                        </Link>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(excerpt) }}></p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                        <span>{new Date(createdAt).toLocaleDateString()}</span>
                        <div className='flex items-center gap-1'>
                            <img src={assets.like} alt="" className='w-4' />
                            <span>{likes}</span>
                        </div>

                    </div>
                </div>
                {/* Góc trên phải: icon, menu ... nếu cần */}
                {/* <button className="absolute top-2 right-2 bg-white/70 rounded-full p-1">...</button> */}
            </div>
        </div>
    )
}

export default ArticleItems