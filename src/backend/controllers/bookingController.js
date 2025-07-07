import { v2 as cloudinary } from "cloudinary"
import bookingModel from "../models/bookingModel.js"
import userModel from "../models/userModel.js"

// Funtion for add booking
const addBooking = async (req, res) => {
    try {
        const { userId, name, phone, date, session, doc, note } = req.body

        // Check exist
        const existed = await bookingModel.findOne({ userId, date, session })
        if (existed) {
            return res.json({ success: false, message: "Bạn đã đặt lịch cho ngày và buổi này rồi!" });
        }

        // Check misscount
        const count = await bookingModel.countDocuments({ doc, date, session })
        if (count >= 10) {
            return res.json({ success: false, message: "Lịch khám của bác sĩ đã đầy" })
        }

        const bookingInfo = {
            userId,
            name,
            phone,
            session,
            doc,
            date,
            note
        }

        const booking = new bookingModel(bookingInfo);
        await booking.save()

        res.json({ success: true, message: "Đặt hẹn thành công", booking })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Funtion for remove booking
const removeBooking = async (req, res) => {
    try {
        const { bookingId } = req.body

        await bookingModel.findByIdAndDelete(bookingId)
        res.json({ success: true, message: "Booking Removed" })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

// Funtion for add booking to cart
const addToCart = async (req, res) => {
    try {
        const { userId, bookingId } = req.body

        const userData = await userModel.findById(userId)
        const cartData = await userData.cartData;

        cartData[bookingId] = bookingId

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Added To Cart" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Funtion for update cart
const updateCart = async (req, res) => {

    try {
        const { userId, bookingId } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//User booking data for frontend
const cartData = async (req, res) => {
    try {
        const { userId, userRole } = req.body
        console.log(req.body)

        const booking = await bookingModel.find({ userId }).populate('doc')
        res.json({ success: true, booking })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Doctor booking data for frontend
const bookListDoc = async (req, res) => {
    try {
        const { userId } = req.body

        const booking = await bookingModel.find({ doc: userId }).populate('doc')

        if (booking) {
            res.json({ success: true, booking })
        } else {
            res.json({ success: false, message: "List not found" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//All booking data for admin panel
const allBooking = async (req, res) => {
    try {
        const booking = await bookingModel.find({}).populate('doc')
        res.json({ success: true, booking })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//Update booking from Admin panel
const updateBooking = async (req, res) => {
    try {
        const { bookingId, status } = req.body
        await bookingModel.findByIdAndUpdate(bookingId, { status })
        res.json({ success: true, message: 'Booking Updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addBooking, addToCart, cartData, allBooking, updateBooking, bookListDoc, removeBooking }