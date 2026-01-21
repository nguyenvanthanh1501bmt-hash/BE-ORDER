import { 
    closeBillService,
    getBillDetailService,
    getBillOpenService,
    updateBillStatusService
} from "../../services/bill/bill.service.js";

export async function closeBill(req, res, next) {
    try{
        const { tableId } = req.body

        const result = await closeBillService(tableId)
        res.json(result)
    } catch (err){
        next(err)
    }
}

export async function getBillDetail(req, res, next) {
    try{
        const {billId} = req.body

        const result = await getBillDetailService(billId)
        res.json(result)
    } catch(err){
        next(err)
    }   
}

export async function getBillOpen(req, res, next) {
   try{
    const result = await getBillOpenService()
    res.json(result)
   } catch(err){
    next(err)
   } 
}

export async function updateBillStatus(req, res) {
  try {
    const { bill_id } = req.body;

    const bill = await updateBillStatusService(bill_id);

    return res.status(200).json({
      message: "Bill closed successfully",
      bill,
    });
  } catch (err) {
    switch (err.message) {
      case "BILL_ID_REQUIRED":
        return res.status(400).json({
          message: "bill_id is required",
        });

      case "BILL_NOT_FOUND_OR_CLOSED":
        return res.status(404).json({
          message: "Bill not found or already closed",
        });

      default:
        return res.status(500).json({
          message: err.message || "Internal server error",
        });
    }
  }
}