import validator from "validator";
import bcrypt from "bcrypt";
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
import axios from "axios"
import otpModel from "../models/otpModel.js";
import doctorModel from "../models/doctorModel.js";
import { Vonage } from '@vonage/server-sdk'

// const createToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET)
// }

const sendSMS = async (req, res) => {
    const vonage = new Vonage({
        apiKey: "ffaacdbd",
        apiSecret: "1CDFHCaQNIoq8PLL"
    })

    try {
        const { phone } = req.body

        const from = "Vonage APIs"
        const to = "84" + phone.slice(1)
        const verifyOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const text = 'Your verify OTP is: ' + verifyOtp + '. OTP will expires at 1 minute'

        // Call API from Vonage to send OTP
        const response = await vonage.sms.send({ to, from, text })

        if (response.messages.status === "0") {
            // Hashing otp
            const salt = await bcrypt.genSalt(10)
            const hashedOtp = await bcrypt.hash(verifyOtp, salt)

            const newOtp = new otpModel({
                phone: phone,
                otp: hashedOtp,
            })

            const otp = await newOtp.save()

            const otpId = otp._id

            res.json({ success: true, otpId })
        } else {
            res.json({ success: false, message: "Fail to send OTP" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for Send - OTP
const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        const to = "84" + phone.slice(1);
        const verifyOtp = Math.floor(100000 + Math.random() * 900000).toString();

        if (!phone) {
            return res.json({ success: false, message: "Phone number not found" })
        }

        await axios.post('https://messages-sandbox.nexmo.com/v1/messages', {
            from: "14157386102",
            to: to,
            message_type: 'text',
            text: 'Your verify OTP is: ' + verifyOtp + '. OTP will expires at 1 minute',
            channel: 'whatsapp',
        }, {
            auth: {
                username: process.env.VONAGE_API_KEY,
                password: process.env.VONAGE_API_SECRET
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // Hashing otp
        const salt = await bcrypt.genSalt(10)
        const hashedOtp = await bcrypt.hash(verifyOtp, salt)

        const newOtp = new otpModel({
            phone: phone,
            otp: hashedOtp,
        })

        const otp = await newOtp.save()

        const otpId = otp._id

        res.json({ success: true, otpId })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user login
const loginUser = async (req, res) => {
    const { phone, otp, otpId } = req.body;
    try {
        const exists = await userModel.findOne({ phone });
        const otpChecked = await otpModel.findById(otpId);
        const isMatch = await bcrypt.compare(otp, otpChecked.otp)

        if (!exists && phone === otpChecked.phone && isMatch) {

            const newUser = new userModel({
                phone,
            })

            const user = await newUser.save()

            // const token = createToken(user._id, user.role)
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET)

            return res.json({ success: true, token })
        }

        if (exists && phone === otpChecked.phone && isMatch) {
            // const token = createToken(exists._id, exists.role)
            const token = jwt.sign({ userId: exists._id, role: exists.role }, process.env.JWT_SECRET)
            return res.json({ success: true, token })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}



// Route for get infomation user
const getInfoUser = async (req, res) => {
    try {
        const { userId } = req.body

        const info = await userModel.findOne({ _id: userId })

        if (!info) {
            return res.json({ success: false, message: "Don't exist user" })
        }

        res.json({ success: true, info })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for get infomation user
const getInfoDoctor = async (req, res) => {
    try {
        const { userId } = req.body

        const info = await doctorModel.findOne({ _id: userId })

        if (!info) {
            return res.json({ success: false, message: "Don't exist user" })
        }

        res.json({ success: true, info })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body
        const decryptPassword = (encryptedPassword, secretKey) => {
            const [iv, encrypted] = encryptedPassword.split(':');
            const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, '0').slice(0, 32));
            const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: CryptoJS.enc.Hex.parse(iv) });
            return decrypted.toString(CryptoJS.enc.Utf8);
        };

        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(username + password, process.env.JWT_SECRET);
            return res.json({ success: true, token })
        }

        const user = await doctorModel.findOne({ username: username })

        if (user && password === decryptPassword(user.password, process.env.SECRET_KEY) && user.admin === true) {
            const token = jwt.sign({ userId: user._id, password }, process.env.JWT_SECRET);
            return res.json({ success: true, token })

        }

        res.json({ success: false, message: "Invalid credentials" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for doctor login
const doctorLogin = async (req, res) => {
    try {
        const { username, password } = req.body
        const exists = await doctorModel.findOne({ username })

        if (!exists) {
            return res.json({ success: false, message: "Username or password incorrect" })
        }

        const decryptPassword = (encryptedPassword, secretKey) => {
            const [iv, encrypted] = encryptedPassword.split(':');
            const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, '0').slice(0, 32));
            const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: CryptoJS.enc.Hex.parse(iv) });
            return decrypted.toString(CryptoJS.enc.Utf8);
        };

        if (exists && password === decryptPassword(exists.password, process.env.SECRET_KEY)) {
            // const token = createToken(exists._id, exists.role)
            const token = jwt.sign({ userId: exists._id, role: exists.role }, process.env.JWT_SECRET)
            return res.json({ success: true, token })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { loginUser, getInfoUser, adminLogin, sendOtp, doctorLogin, getInfoDoctor, sendSMS }