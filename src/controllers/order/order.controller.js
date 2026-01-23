import { 
    createOrderService,
    deleteOrderService,
    getPendingOrdersService, 
    updateOrderStatusService
} from '../../services/order/order.service.js'

export async function createOrder(req, res, next) {
  try {
    const { table_id, items } = req.body

    const result = await createOrderService(table_id, items)

    res.status(201).json({
      success: true,
      bill_id: result.bill_id,
      order_id: result.order_id
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteOrder(req, res, next) {
  try {
    const { orderId } = req.body

    if (!orderId) {
      return res.status(400).json({
        message: 'orderId is required'
      })
    }

    await deleteOrderService(orderId)

    res.status(200).json({
      success: true,
      message: 'Delete success'
    })
  } catch (err) {
    next(err)
  }
}

export async function getPendingOrders(req, res, next) {
  try {
    const orders = await getPendingOrdersService()

    res.status(200).json(orders)
  } catch (err) {
    next(err)
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { orderId, status } = req.body

    if (!orderId || !status) {
      return res.status(400).json({
        message: 'orderId and status are required'
      })
    }

    const updatedOrder = await updateOrderStatusService(orderId, status)

    res.status(200).json(updatedOrder)
  } catch (err) {
    next(err)
  }
}