import supabaseAdmin from '../../config/supabaseAdmin.js'

export async function deleteOrderItemService(id) {
   if (!id) {
     throw new Error("order item ID is required");
   } 

   const { data, error } = await supabaseAdmin
     .from("order_items")
     .delete()
     .eq("id", id)
     .select(); // trả về bản ghi vừa xóa
    if (error) {
        throw error;    
    }
    return data;
}