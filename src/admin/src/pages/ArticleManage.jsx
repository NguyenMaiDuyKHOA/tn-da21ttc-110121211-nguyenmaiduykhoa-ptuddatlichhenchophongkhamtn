import React, { useState, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import giao diện mặc định của React Quill
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { useEffect } from 'react';
import moment from 'moment'; // Thư viện để định dạng ngày tháng
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const ArticleManage = ({ token }) => {
    const [visible, setVisible] = useState('false'); // State để điều khiển hiển thị form
    const [article, setArticle] = useState([]); // State để lưu danh sách bài viết
    const [content, setContent] = useState(''); // State để lưu nội dung bài giới thiệu
    const [thumbnail, setThumbnail] = useState(false)
    const [title, setTitle] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const { capitalizeWords } = useContext(ShopContext);

    const fetchAllArticle = async () => {
        if (!token) {
            return null
        }

        try {
            const response = await axios.get(backendUrl + '/api/article/all')
            if (response.data.success) {
                setArticle(response.data.article)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const statusHandler = async (event, articleId) => {
        try {
            const response = await axios.post(backendUrl + '/api/article/status', { articleId, status: event.target.value }, { headers: { token } })

            if (response.data.success) {
                await fetchAllArticle()
            }
        } catch (error) {
            console.log(error)
            toast.error(response.data.message)
        }
    }

    const setAboutHandler = async (articleId) => {
        try {
            const response = await axios.post(backendUrl + '/api/article/set', { articleId }, { headers: { token } });

            if (response.data.success) {
                toast.success(response.data.message);
                await fetchAllArticle(); // Cập nhật lại danh sách bài viết sau khi thiết lập About thành công
            }
        } catch (error) {
            console.log(error)
            toast.error(response.data.message)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append('content', content);
            formData.append('thumbnail', thumbnail);
            formData.append('title', title);
            formData.append('excerpt', excerpt);

            const response = await axios.post(backendUrl + '/api/article/add', formData, { headers: { token } })
            if (response.data.success) {
                toast.success(response.data.message);
                setContent(''); // Reset nội dung sau khi lưu
                setThumbnail(false); // Reset thumbnail
                setTitle(''); // Reset title
                setExcerpt(''); // Reset excerpt
                await fetchAllArticle(); // Cập nhật lại danh sách bài viết
            }
        } catch (error) {
            console.error("Error submitting article:", error);
        }
    };

    useEffect(() => {
        fetchAllArticle();
    }, [token])

    return (
        <div>
            <div className=' flex justify-end'>
                <img onClick={(e) => setVisible((prev) => (prev === 'true' ? 'false' : 'true'))} src={assets.add_icon} alt="" />
            </div>

            {/* Form for create article */}
            <div className={`w-full mb-10 ${visible === 'false' ? 'hidden' : ''}`}>
                <h1 className="text-2xl font-bold mb-4">WRITE ABOUT</h1>
                <form action="" className='flex flex-col gap-4'>
                    <div className=''>
                        <p className='mb-2'>Upload Thumbnail</p>
                        <div className='flex gap-2'>
                            <label htmlFor="thumbnail">
                                <img src={!thumbnail ? assets.upload_area : URL.createObjectURL(thumbnail)} alt="" className='w-28 h-28 sm:w-20 sm:h-20 lg:w-28 lg:h-28 object-cover border border-gray-300 rounded cursor-pointer' />
                                <input onChange={(e) => setThumbnail(e.target.files[0])} type="file" id="thumbnail" hidden />
                            </label>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='font-bold'>Article title:</p>
                        <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter article title' className='border border-gray-500 rounded px-4 py-2 w-full' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='font-bold'>Article excerpt:</p>
                        <ReactQuill
                            value={excerpt}
                            onChange={setExcerpt}
                            modules={{
                                toolbar: [
                                    [{ header: [1, 2, 3, false] }],
                                    ['bold', 'italic', 'underline', 'strike'], // Các kiểu chữ
                                    [{ list: 'ordered' }, { list: 'bullet' }], // Danh sách
                                    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }], // Căn trái, giữa, phải, đều
                                    ['link', 'image', 'video'], // Chèn liên kết, hình ảnh, video
                                    ['clean'], // Xóa định dạng
                                ],
                            }}
                            formats={[
                                'header', 'bold', 'italic', 'underline', 'strike',
                                'list', 'bullet', 'align', 'link', 'image', 'video',
                            ]}
                            className="h-[300px] mb-5"
                        />
                    </div>
                    <div className='flex flex-col gap-2 mt-5'>
                        <p className='font-bold'>Write content:</p>
                        <ReactQuill
                            value={content}
                            onChange={setContent}
                            modules={{
                                toolbar: [
                                    [{ header: [1, 2, 3, false] }],
                                    ['bold', 'italic', 'underline', 'strike'], // Các kiểu chữ
                                    [{ list: 'ordered' }, { list: 'bullet' }], // Danh sách
                                    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }], // Căn trái, giữa, phải, đều
                                    ['link', 'image', 'video'], // Chèn liên kết, hình ảnh, video
                                    ['clean'], // Xóa định dạng
                                ],
                            }}
                            formats={[
                                'header', 'bold', 'italic', 'underline', 'strike',
                                'list', 'bullet', 'align', 'link', 'image', 'video',
                            ]}
                            className="h-[500px] mb-5"
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-40 mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Lưu bài viết
                    </button>
                </form>
            </div>

            {/* Show only article for About page */}
            <div>
                <Title text1={"About"} text2={"Page"} />
                <div>
                    {
                        article.map((item, index) => (
                            item.isAbout &&
                            <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr] lg:grid-cols-[0.5fr_2fr_2fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'>
                                <img src={item.thumbnail} alt="" />
                                <div>
                                    <p className='mt-3 mb-2 font-bold'>Title: <span className='font-normal'>{item.title}</span></p>
                                    <p className='mt-2 mb-2 font-bold'>Author: <span className='font-normal'>{capitalizeWords(item.authorId.name)}</span></p>
                                </div>
                                <div className=''>
                                    <p className='mt-3 mb-2'>Create: {moment(item.createdAt).format("DD/MM/YYYY")}</p>
                                    <p className='mt-2 mb-2'>Update: {moment(item.update).format("DD/MM/YYYY")}</p>
                                </div>
                                <div className='flex items-center justify-center gap-2 mt-3'>
                                    <img onClick={'#'} src={assets.pen} alt="" className='w-5 mt-3 mb-2 cursor-pointer' />
                                    <button onClick={() => setAboutHandler(item._id)} disabled={item.isAbout} className={`border border-gray-500 px-3 py-2 rounded ${item.isAbout ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>Set About</button>
                                </div>
                                <select onChange={(event) => statusHandler(event, item._id)} value={item.status} className='mt-3 mb-2 p-2 font-semibold'>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* List for all article */}
            <div>
                <Title text1={"All"} text2={"Article"} />
                <div>
                    {
                        article.map((item, index) => (
                            !item.isAbout &&
                            <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr] lg:grid-cols-[0.5fr_2fr_2fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'>
                                <img src={item.thumbnail} alt="" />
                                <div>
                                    <p className='mt-3 mb-2 font-bold'>Title: <span className='font-normal'>{item.title}</span></p>
                                    <p className='mt-2 mb-2 font-bold'>Author: <span className='font-normal'>{capitalizeWords(item.authorId.name)}</span></p>
                                </div>
                                <div className=''>
                                    <p className='mt-3 mb-2'>Create: {moment(item.createdAt).format("DD/MM/YYYY")}</p>
                                    <p className='mt-2 mb-2'>Update: {moment(item.update).format("DD/MM/YYYY")}</p>
                                </div>
                                <div className='flex items-center justify-center gap-2 mt-3'>
                                    <img onClick={'#'} src={assets.pen} alt="" className='w-5 mt-3 mb-2 cursor-pointer' />
                                    <button onClick={() => setAboutHandler(item._id)} disabled={item.isAbout} className={`border border-gray-500 px-3 py-2 rounded ${item.isAbout ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>Set About</button>
                                </div>
                                <select onChange={(event) => statusHandler(event, item._id)} value={item.status} className='mt-3 mb-2 p-2 font-semibold'>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default ArticleManage