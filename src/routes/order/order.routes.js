import express from 'express'

import { 
    createOrder,
    deleteOrder, 
    getPendingOrders,
    updateOrderStatus
} from '../../controllers/order/order.controller.js'

const router = express.Router()

router.post('/create', createOrder)

router.delete("/delete", deleteOrder);

router.get('/pending', getPendingOrders)

router.patch("/update-status", updateOrderStatus);

export default router