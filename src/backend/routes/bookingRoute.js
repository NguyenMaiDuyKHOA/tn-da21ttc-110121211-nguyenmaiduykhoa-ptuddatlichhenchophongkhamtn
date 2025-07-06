import express from 'express'
import { addBooking, addToCart, cartData, allBooking, updateBooking, bookListDoc, removeBooking } from '../controllers/bookingController.js'
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const bookingRouter = express.Router();

bookingRouter.post('/add', authUser, addBooking);
bookingRouter.post('/addcart', authUser, addToCart)
bookingRouter.post('/remove', authUser, removeBooking)
bookingRouter.post('/usercart', authUser, cartData)
bookingRouter.post('/booklistdoc', authUser, bookListDoc)

bookingRouter.post('/bookinglist', adminAuth, allBooking)
bookingRouter.post('/update', adminAuth, updateBooking)

export default bookingRouter