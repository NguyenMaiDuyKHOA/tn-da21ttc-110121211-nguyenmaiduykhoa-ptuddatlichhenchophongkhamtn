import jwt from 'jsonwebtoken';
import doctorModel from '../models/doctorModel.js';

const adminAuth = async (req, res, next) => {
    const { token } = req.headers;

    const decryptPassword = (encryptedPassword, secretKey) => {
        const [iv, encrypted] = encryptedPassword.split(':');
        const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, '0').slice(0, 32));
        const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: CryptoJS.enc.Hex.parse(iv) });
        return decrypted.toString(CryptoJS.enc.Utf8);
    };

    if (!token) {
        return res.json({ success: false, message: "Not Authorized. Login Again." });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(token_decode)

        // Trường hợp admin mặc định từ biến môi trường
        if (token_decode === process.env.ADMIN_USERNAME + process.env.ADMIN_PASSWORD) {
            return next();
        }
        // Trường hợp kiểm tra trong doctor
        // Giả sử token_decode chứa userId hoặc username
        let doctor;
        if (token_decode.userId) {
            doctor = await doctorModel.findOne({ _id: token_decode.userId });
        }

        if (doctor.admin === true) {
            req.admin = { userId: doctor.id, role: doctor.role };
            next();
        } else {
            return res.json({ success: false, message: "Not Authorized. Admin only." });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default adminAuth;
