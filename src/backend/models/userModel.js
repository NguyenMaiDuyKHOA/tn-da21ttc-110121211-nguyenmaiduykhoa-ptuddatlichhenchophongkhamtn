import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    email: { type: String, required: false, unique: true },
    role: { type: Number, default: 9, require: true },
    cartData: { type: Object, default: {} }
}, { minimize: false })


const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel
