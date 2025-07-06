import express from 'express'
import { setClinicInfo, getClinic } from "../controllers/clinicController.js"
import adminAuth from '../middleware/adminAuth.js'

const clinicRouter = express.Router()

clinicRouter.post('/setclinic', adminAuth, setClinicInfo)
clinicRouter.get('/getclinic', getClinic)

export default clinicRouter