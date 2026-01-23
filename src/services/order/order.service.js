import supabaseAdmin from '../../config/supabaseAdmin.js'
import { getSizeExtraPrice } from '../../helper.js'

export async function createOrderService(table_id, items) {
  if (!table_id || !Array.isArray(items) || items.length === 0) {
    throw new Error('Invalid payload')
  }

  /* ============================================================
     STEP 1: FIND / CREATE OPEN BILL
  ============================================================ */

  let { data: bill, error: billErr } = await supabaseAdmin
    .from('bills')
    .select('*')
    .eq('table_id', table_id)
    .eq('status', 'open')
    .maybeSingle()

  if (billErr) throw billErr

  if (!bill) {
    const { data: newBill, error } = await supabaseAdmin
      .from('bills')
      .insert({ table_id })
      .select()
      .single()

    if (error) throw error
    bill = newBill
  }

  /* ============================================================
     STEP 2: CREATE NEW ORDER
  ============================================================ */

  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .insert({ bill_id: bill.id })
    .select()
    .single()

  if (orderErr) throw orderErr

  /* ============================================================
     STEP 3: LOAD MENU DATA
  ============================================================ */

  const menuIds = items.map(i => i.menu_item_id)

  const { data: menus, error: menuErr } = await supabaseAdmin
    .from('menu_items')
    .select('id, name, price')
    .in('id', menuIds)

  if (menuErr) throw menuErr

  /* ============================================================
     STEP 4: INSERT ORDER ITEMS
  ============================================================ */

  let totalAdded = 0
  const orderItemsPayload = []

  for (const item of items) {
    const menu = menus.find(m => m.id === item.menu_item_id)
    if (!menu) {
      throw new Error(`Menu item not found: ${item.menu_item_id}`)
    }

    const sizeText = item.selected_options?.size
    const sizeExtra = getSizeExtraPrice(item.selected_options, sizeText)

    const finalUnitPrice = menu.price + sizeExtra
    const itemTotal = finalUnitPrice * item.quantity

    totalAdded += itemTotal

    orderItemsPayload.push({
      order_id: order.id,
      menu_item_id: menu.id,
      base_item_name: menu.name,
      unit_price: finalUnitPrice,
      quantity: item.quantity,
      note: item.note || null,
      selected_options: {
        ...item.selected_options,
        size_extra: sizeExtra
      }
    })
  }

  const { error: insertItemsErr } = await supabaseAdmin
    .from('order_items')
    .insert(orderItemsPayload)

  if (insertItemsErr) throw insertItemsErr

  /* ============================================================
     STEP 5: UPDATE BILL TOTAL
  ============================================================ */

  const { error: updateBillErr } = await supabaseAdmin
    .from('bills')
    .update({
      total_amount: bill.total_amount + totalAdded
    })
    .eq('id', bill.id)

  if (updateBillErr) throw updateBillErr

  return {
    bill_id: bill.id,
    order_id: order.id
  }
}

export async function deleteOrderService(orderId) {
  if (!orderId) {
    throw new Error('orderId is required')
  }

  /* ============================================================
     STEP 1: FETCH ORDER + BILL_ID
  ============================================================ */
  const { data: order, error: orderFetchError } = await supabaseAdmin
    .from('orders')
    .select('id, bill_id')
    .eq('id', orderId)
    .single()

  if (orderFetchError || !order) {
    throw new Error('Order not found')
  }

  const billId = order.bill_id

  /* ============================================================
     STEP 2: DELETE ORDER_ITEMS
  ============================================================ */
  const { error: deleteItemsError } = await supabaseAdmin
    .from('order_items')
    .delete()
    .eq('order_id', orderId)

  if (deleteItemsError) throw deleteItemsError

  /* ============================================================
     STEP 3: DELETE ORDER
  ============================================================ */
  const { error: deleteOrderError } = await supabaseAdmin
    .from('orders')
    .delete()
    .eq('id', orderId)

  if (deleteOrderError) throw deleteOrderError

  /* ============================================================
     STEP 4: CHECK REMAINING ORDERS IN BILL
  ============================================================ */
  const { data: remainOrders, error: remainError } = await supabaseAdmin
    .from('orders')
    .select('id')
    .eq('bill_id', billId)
    .limit(1)

  if (remainError) throw remainError

  /* ============================================================
     STEP 5: DELETE BILL IF EMPTY
  ============================================================ */
  if (remainOrders.length === 0) {
    const { error: deleteBillError } = await supabaseAdmin
      .from('bills')
      .delete()
      .eq('id', billId)

    if (deleteBillError) throw deleteBillError
  }

  return {
    success: true
  }
}

export async function getPendingOrdersService() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      id,
      created_at,
      status,
      order_items (
        id,
        menu_item_id,
        base_item_name,
        quantity,
        unit_price,
        note,
        selected_options
      ),
      bills (
        id,
        table_id,
        total_amount,
        tables!inner (
          id,
          name
        )
      )
    `)
    .in('status', ['pending_staff_approval', 'accepted'])
    .order('created_at', { ascending: true })

  if (error) throw error

  return data || []
}

export async function updateOrderStatusService(orderId, status) {
  if (!orderId || !status) {
    throw new Error('orderId and status are required')
  }

  const { data: updatedOrder, error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select('*')
    .single()

  if (error) throw error

  return updatedOrder
}
