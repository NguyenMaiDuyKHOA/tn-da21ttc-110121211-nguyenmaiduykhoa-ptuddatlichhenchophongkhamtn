import express from 'express';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import { addDoctor, doctorList, removeDoctor, singleDoctor, changeDoctor } from '../controllers/doctorContronller.js';
import upload from '../middleware/multer.js';

const doctorRouter = express.Router()

doctorRouter.post('/add', adminAuth, upload.fields([{ name: 'image', maxCount: 1 }]), addDoctor)
doctorRouter.put('/change', adminAuth, upload.fields([{ name: 'image', maxCount: 1 }]), changeDoctor)
doctorRouter.get('/doctorlist', doctorList)
doctorRouter.post('/single', adminAuth, singleDoctor)
doctorRouter.post('/remove', adminAuth, removeDoctor)

export default doctorRouter;