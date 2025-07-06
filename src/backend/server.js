import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import bookingRouter from './routes/bookingRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import slideRouter from './routes/slideRoute.js'
import clinicRouter from './routes/clinicRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import articleRouter from './routes/articleRoute.js';

// App Config
const app = express();
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middleWares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


// api endpoints
app.use('/api/user', userRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/slide', slideRouter)
app.use('/api/clinic', clinicRouter)
app.use('/api/article', articleRouter)

app.get('/', (req, res) => {
    res.send("API Working")
})

app.listen(port, () => console.log('Server started on PORT : ' + port))