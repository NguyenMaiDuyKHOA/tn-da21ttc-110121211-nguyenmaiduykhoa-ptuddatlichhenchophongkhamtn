import express from 'express'
import { addArticle, allArticle, singleArticle, removeArticle, updateStatus, setAboutArticle, likeArticle, dislikeArticle } from '../controllers/articleController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const articleRouter = express.Router()

articleRouter.post('/add', adminAuth, upload.fields([{ name: 'thumbnail', maxCount: 1 }]), addArticle)
articleRouter.get('/all', allArticle)
articleRouter.post('/single', authUser, singleArticle)
articleRouter.post('/status', adminAuth, updateStatus)
articleRouter.post('/set', adminAuth, setAboutArticle)
articleRouter.post('/like', authUser, likeArticle)
articleRouter.post('/dislike', authUser, dislikeArticle)
articleRouter.post('/remove', removeArticle)

export default articleRouter