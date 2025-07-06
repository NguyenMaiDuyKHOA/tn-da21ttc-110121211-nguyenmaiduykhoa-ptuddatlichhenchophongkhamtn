import express from 'express';
import { loginUser, getInfoUser, adminLogin, sendOtp, doctorLogin, getInfoDoctor, sendSMS } from '../controllers/userController.js';
import authUser from '../middleware/auth.js'

const userRouter = express.Router();

userRouter.post('/getuser', authUser, getInfoUser)
userRouter.post('/getdoctor', authUser, getInfoDoctor)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/sendotp', sendOtp)
userRouter.post('/sendsms', sendSMS)
userRouter.post('/doctor', doctorLogin)

export default userRouter;