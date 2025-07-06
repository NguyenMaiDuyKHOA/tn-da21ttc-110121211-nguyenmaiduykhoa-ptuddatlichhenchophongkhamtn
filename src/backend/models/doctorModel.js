import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, default: 0, require: true, max: 9 },
    image: { type: String, required: false },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: false, unique: true },
    description: { type: String, required: false },
    workDay: { type: Array, require: false },
    admin: { type: Boolean, default: false },
    cartData: { type: Object, default: {} }
}, { minimize: false })

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema);

export default doctorModel