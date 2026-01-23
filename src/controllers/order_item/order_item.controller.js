import { deleteOrderItemService } from "../../services/order_item/order_item.service.js";

export async function deleteOrderItem(req, res, next) {
    try{
        const { id } = req.body;

        const result = await deleteOrderItemService(id);

        res.status(200).json({ message: "Order item đã xóa thành công", deleted: result });
    } catch (err) {
        next(err);
    }
}