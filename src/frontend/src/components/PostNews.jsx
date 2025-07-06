import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ArticleItems from './ArticleItems';

const PostNews = () => {
    const { articles } = useContext(ShopContext);
    const [postNews, setPostNews] = useState([]);

    useEffect(() => {
        setPostNews(articles.slice(0, 10));
    }, [articles])

    return (
        <div className='my-10'>
            <hr />
            <div className='text-center py-8 text-3xl'>
                <Title text1={'POST'} text2={'NEWS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique, quisquam?
                </p>
            </div>
            {/* Grid nâng cao */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {postNews.map((item, index) => (
                    <div
                        key={index}
                        className={
                            index === 0
                                ? "relative col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 row-span-2 bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                                : "bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                        }
                        style={index === 0 ? { minHeight: 340 } : {}}
                    >
                        {item.status === 'published' &&
                            <ArticleItems
                                slug={item.slug}
                                thumbnail={item.thumbnail}
                                title={item.title}
                                excerpt={item.excerpt}
                                createdAt={item.createdAt}
                                likes={item.likes}
                                isFeatured={index === 0}
                            />
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PostNews