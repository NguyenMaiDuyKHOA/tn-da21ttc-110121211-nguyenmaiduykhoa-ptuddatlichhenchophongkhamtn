import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    open: { type: String, required: false },
    close: { type: String, required: false },
})

const clinicModel = mongoose.models.clinic || mongoose.model('clinic', clinicSchema);

export default clinicModel