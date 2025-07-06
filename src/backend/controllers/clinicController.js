import clinicModel from "../models/clinicModel.js";

const setClinicInfo = async (req, res) => {
    try {
        const { clinicCode, name, phone, email, address, openHours, closeHours } = req.body

        const code = await clinicModel.findOne({ code: clinicCode });

        if (!code) {
            await clinicModel.deleteMany({});

            const clinicInfo = {
                code: clinicCode,
                name,
                phone,
                email,
                address,
                open: openHours,
                close: closeHours
            }

            const clinic = new clinicModel(clinicInfo);
            await clinic.save();

            return res.json({ success: true, message: "Set clinic infomation success" })
        }

        await clinicModel.findOneAndUpdate(
            { code: clinicCode },
            { name, phone, email, address, open: openHours, close: closeHours },
            { upsert: true, new: true }
        )

        res.json({ success: true, message: "Change clinic infomation success" })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

const getClinic = async (req, res) => {
    try {
        const info = await clinicModel.find({});
        res.json({ success: true, info })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { setClinicInfo, getClinic }