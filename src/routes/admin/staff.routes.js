import express from 'express'
import { 
    createStaff, 
    deleteStaff, 
    getStaffList,
    resetPasswordStaff, 
} from '../../controllers/admin/staff.controller.js'

const router = express.Router()

// POST /api/admin/staff
router.post('/staff', createStaff)

// DELETE /api/admin/staff
router.delete('/staff', deleteStaff)

// GET /api/admin/staff
router.get('/staff', getStaffList)

// POST /api/admin/staff (resetpasss)
router.post('/staff/reset-password', resetPasswordStaff)

export default router
