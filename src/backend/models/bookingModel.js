import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    session: { type: String, required: true },
    note: { type: String, required: false },
    doc: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
    status: { type: Boolean, required: true, default: false },
    date: { type: Date, required: true },
    datebook: { type: Date, default: Date.now }
})

const bookingModel = mongoose.models.booking || mongoose.model("booking", bookingSchema);

export default bookingModel