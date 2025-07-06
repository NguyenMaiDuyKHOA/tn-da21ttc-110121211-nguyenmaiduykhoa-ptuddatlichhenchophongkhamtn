import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import DOMPurify from 'dompurify';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'moment/locale/vi';
moment.locale('vi');

const Article = () => {
    const { slug } = useParams()
    const { articles, token, backendUrl } = useContext(ShopContext)
    const [articleData, setArticleData] = useState(false)
    const [checkLike, setCheckLike] = useState(false)
    const [checkDislike, setCheckDislike] = useState(false)

    const fetchArticleData = async () => {
        // articles.map((item) => {
        //     if (item.slug === slug) {
        //         setArticleData(item);
        //         return null;
        //     }
        // })
        try {
            const response = await axios.post(backendUrl + '/api/article/single', { slug }, { headers: { token } });

            if (response.data.success) {
                setArticleData(response.data.article);
                setCheckLike(response.data.checklike);
                setCheckDislike(response.data.checkDislike);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const likeHandler = async () => {
        const response = await axios.post(backendUrl + '/api/article/like', { slug }, { headers: { token } });
        if (response.data.success) {
            fetchArticleData()
        } else {
            toast.error(response.data.message);
        }
    }

    const disLikeHandler = async () => {
        const response = await axios.post(backendUrl + '/api/article/dislike', { slug }, { headers: { token } });
        if (response.data.success) {
            fetchArticleData()
        } else {
            toast.error(response.data.message);
        }
    }

    useEffect(() => {
        fetchArticleData();
    }, [slug][token])

    return articleData ? (
        <div className="relative flex justify-center">
            {/* Nút like/dislike nổi bên trái */}
            <div className="hidden md:flex flex-col items-center gap-4 fixed left-8 top-1/4 z-40">
                <button onClick={likeHandler} className={`${checkLike ? 'bg-orange-400' : 'bg-white'} shadow rounded-full p-3 hover:bg-blue-100 transition`}>
                    <img src={assets.like} alt="" className='w-6' />
                    <div className="text-xs mt-1">{articleData.likes}</div>
                </button>
                <button onClick={disLikeHandler} className={`${checkDislike ? 'bg-red-500' : 'bg-white'} shadow rounded-full p-3 hover:bg-red-100 transition`}>
                    <img src={assets.dislike} alt="" className='w-6' />
                    <div className="text-xs mt-1">{articleData.dislikes}</div>
                </button>
            </div>

            {/* Nội dung bài viết */}
            <div className="max-w-3xl w-full mx-auto px-4">
                <h1 className="text-4xl font-bold mt-6 mb-4">{articleData.title}</h1>
                <div className="flex items-center gap-3 mb-2 text-gray-600">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                        <span role="img" aria-label="avatar">👤</span>
                    </div>
                    <span className="font-semibold">{articleData.authorId.name}</span>
                    <span>•</span>
                    <span className="text-sm">

                        {moment().diff(moment(articleData.createdAt), 'days') === 0
                            ? moment(articleData.createdAt).fromNow()
                            : moment(articleData.createdAt).format('DD/MM/YYYY HH:mm')}
                    </span>
                </div>
                <div className="mb-4">
                    <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-500">
                        Theo dõi Báo Lao Động trên <span className="text-blue-500 font-semibold">Google News</span>
                    </span>
                </div>
                <div className="text-lg mb-4" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(articleData.excerpt) }}></div>
                <div className='flex w-full h-auto rounded-lg mb-6 justify-center items-center'>
                    <img src={articleData.thumbnail} alt="" className="min-w-80 max-w-full h-auto rounded-lg" />
                </div>
                <div className="prose max-w-none text-lg mb-10" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(articleData.content) }}>
                </div>
            </div>
        </div>
    ) : <div className='opacity-0'></div>
}

export default Article