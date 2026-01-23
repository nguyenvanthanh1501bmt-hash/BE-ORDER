import express from 'express'

import { deleteOrderItem } from '../../controllers/order_item/order_item.controller.js'

const router = express.Router()

router.delete("/delete", deleteOrderItem);

export default router