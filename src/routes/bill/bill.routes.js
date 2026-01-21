import express from 'express'

import { 
    closeBill,
    getBillDetail,
    getBillOpen, 
    updateBillStatus,
} from '../../controllers/bill/bill.controller.js'

const router = express.Router()

// close bill
router.patch('/close', closeBill);

//get detail bill
router.post('/detail', getBillDetail)

//get bill open
router.get('/open', getBillOpen)

//update bill status
router.patch('/update', updateBillStatus)

export default router