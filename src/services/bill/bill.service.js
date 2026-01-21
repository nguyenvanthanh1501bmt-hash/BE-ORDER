import supabaseAdmin from "../../config/supabaseAdmin.js";

export async function closeBillService(tableId) {
  if (!tableId) {
    throw new Error("Table id is required");
  }

  // 1. Lấy bill đang mở
  const { data: bill, error: billError } = await supabaseAdmin
    .from("bills")
    .select(`
      id,
      table_id,
      status,
      created_at,
      orders (
        id,
        status,
        order_items (
          id,
          quantity,
          menu_items ( name, price )
        )
      )
    `)
    .eq("status", "open")
    .eq("table_id", tableId)
    .single();

  if (billError || !bill) {
    const err = new Error("Không có hóa đơn đang mở cho bàn này");
    err.status = 404;
    throw err;
  }

  // 2. Tính tổng tiền
  const totalAmount = bill.orders
    .flatMap(o => o.order_items)
    .reduce(
      (sum, item) => sum + item.quantity * item.menu_items.price,
      0
    );

  // 3. Đóng bill
  const { data: closedBill, error: updateError } = await supabaseAdmin
    .from("bills")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
      total_amount: totalAmount,
    })
    .eq("id", bill.id)
    .select(`
      id,
      table_id,
      status,
      total_amount,
      created_at,
      closed_at,
      orders (
        id,
        status,
        order_items (
          id,
          quantity,
          menu_items ( name, price )
        )
      )
    `)
    .single();

  if (updateError) {
    throw updateError;
  }

  return closedBill;
}

export async function getBillDetailService(billId) {
  if (!billId) {
    throw new Error('billId is required')
  }

  const { data, error } = await supabaseAdmin
    .from('bills')
    .select(`
      id,
      table_id,
      status,
      total_amount,
      created_at,
      closed_at,
      orders (
        id,
        status,
        created_at,
        order_items (
          id,
          quantity,
          unit_price,
          note,
          base_item_name,
          selected_options,
          menu_item_id
        )
      )
    `)
    .eq('id', billId)
    .maybeSingle()

  if (error) throw error

  if (!data) {
    const err = new Error('Bill not found')
    err.status = 404
    throw err
  }

  return data
}

export async function getBillOpenService() {
  const { data, error } = await supabaseAdmin
    .from('bills')
    .select(`
      id,
      status,
      table_id,
      tables (
        id,
        name
      )
    `)
    .eq('status', 'open')

  if (error) throw error

  return data
}

export async function updateBillStatusService(bill_id) {
  if (!bill_id) {
    throw new Error("BILL_ID_REQUIRED");
  }

  const { data, error } = await supabaseAdmin
    .from("bills")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
    })
    .eq("id", bill_id)
    .eq("status", "open")
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("BILL_NOT_FOUND_OR_CLOSED");
  }

  return data;
}
