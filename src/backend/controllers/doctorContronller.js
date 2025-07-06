import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import CryptoJS from 'crypto-js'

// Function to add a new doctor
const addDoctor = async (req, res) => {
    try {
        const { userName, password, role, name, phone, email, description, workDay, admin } = req.body
        const image = req.files.image && req.files.image[0]

        const exist = await doctorModel.findOne({ username: userName })
        if (exist) {
            return res.json({ success: false, message: "Username alrealy exist" })
        }

        const imageUrl = await cloudinary.uploader.upload(image.path, { resource_type: 'image' })

        // Mã hóa password
        const encryptPassword = (password, secretKey) => {
            const iv = CryptoJS.lib.WordArray.random(16);
            const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, '0').slice(0, 32));
            const encrypted = CryptoJS.AES.encrypt(password, key, { iv });
            return `${iv.toString(CryptoJS.enc.Hex)}:${encrypted.toString()}`;
        };
        const encryptedPassword = encryptPassword(password, process.env.SECRET_KEY)

        const doctorData = {
            username: userName,
            password: encryptedPassword,
            role,
            name,
            phone,
            email,
            description,
            workDay: JSON.parse(workDay).sort((a, b) => a - b),
            admin: admin === 'true' ? true : false,
            image: imageUrl.secure_url
        }

        const doctor = new doctorModel(doctorData)
        await doctor.save()

        res.json({ success: true, message: "Add doctor success" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Function to get the list of doctors
const doctorList = async (req, res) => {
    try {
        const doctor = await doctorModel.find()
        res.json({ success: true, doctor })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//// Function to change doctor
const changeDoctor = async (req, res) => {
    try {
        const doctorId = req.body.id
        const { userName, password, role, name, phone, email, description, workDay, admin } = req.body

        // Mã hóa password
        const encryptPassword = (password, secretKey) => {
            const iv = CryptoJS.lib.WordArray.random(16);
            const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, '0').slice(0, 32));
            const encrypted = CryptoJS.AES.encrypt(password, key, { iv });
            return `${iv.toString(CryptoJS.enc.Hex)}:${encrypted.toString()}`;
        };

        // Giải mã
        const decryptPassword = (encryptedPassword, secretKey) => {
            const [iv, encrypted] = encryptedPassword.split(':');
            const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, '0').slice(0, 32));
            const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: CryptoJS.enc.Hex.parse(iv) });
            return decrypted.toString(CryptoJS.enc.Utf8);
        };

        const encryptedPassword = encryptPassword(password, process.env.SECRET_KEY)

        const oldDoctor = await doctorModel.findById(doctorId)
        let updateFields = {};

        if (userName && userName !== oldDoctor.username) updateFields.username = userName;
        if (password && password !== decryptPassword(oldDoctor.password, process.env.SECRET_KEY)) updateFields.password = encryptedPassword;
        if (role && role !== oldDoctor.role) updateFields.role = role;
        if (name && name !== oldDoctor.name) updateFields.name = name;
        if (phone && phone !== oldDoctor.phone) updateFields.phone = phone;
        if (email && email !== oldDoctor.email) updateFields.email = email;
        if (description && description !== oldDoctor.description) updateFields.description = description;
        if (JSON.stringify(JSON.parse(workDay).sort()) !== JSON.stringify(oldDoctor.workDay.sort())) {
            updateFields.workDay = JSON.parse(workDay).sort((a, b) => a - b);
        }
        if (admin !== undefined && admin !== oldDoctor.admin) updateFields.admin = admin === 'true' ? true : false;
        if (req.files.image) {
            const imageUrl = await cloudinary.uploader.upload(req.files.image[0].path, { resource_type: 'image' });
            updateFields.image = imageUrl.secure_url;
        }

        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            { $set: updateFields },
            { new: true, runValidators: true } // new: true để trả về document đã cập nhật
        );

        res.json({ success: true, message: 'Doctor updated successfully' });
    } catch (error) {
        res.json({ success: false, message: 'Failed to update doctor' })
    }
}

//funtion for single doctor info
const singleDoctor = async (req, res) => {
    try {
        const { doctorId } = req.body
        const doctor = await doctorModel.findById(doctorId)
        res.json({ success: true, doctor })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//funtion for removing doctor
const removeDoctor = async (req, res) => {
    try {
        await doctorModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Doctor Removed" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addDoctor, doctorList, removeDoctor, singleDoctor, changeDoctor }