import supabaseAdmin from "../../config/supabaseAdmin.js";

export async function createFoodService({
  name,
  price,
  category,
  sub_category,
  options,
  image_url,
}) {
  const { data: menuItem, error } = await supabaseAdmin
    .from("menu_items")
    .insert({
      name,
      price,
      category,
      sub_category,
      options,
      image_url,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return menuItem;
}

export async function deleteFoodService(menuItemId, imageurl) {
  if (!menuItemId) {
    throw new Error("Không tìm thấy món ăn cần xóa");
  }

  // 1. Xóa ảnh trong bucket (nếu có)
  if (imageurl) {
    const bucketPath = imageurl.split(
      "/storage/v1/object/public/food-images/"
    )[1];

    if (bucketPath) {
      const { error: storageError } = await supabaseAdmin
        .storage
        .from("food-images")
        .remove([bucketPath]);

      if (storageError) {
        // không throw để vẫn xóa DB
        console.warn("Xóa file hình thất bại:", storageError.message);
      }
    }
  }

  // 2. Xóa record trong DB
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .delete()
    .eq("id", menuItemId)
    .select();

  if (error) throw error;

  if (!data || data.length === 0) {
    throw new Error("Món ăn không tồn tại");
  }

  return data;
}

export async function getAllFoodsService() {
  const { data, error } = await supabaseAdmin
    .from('menu_items')
    .select('*')

  if (error) {
    throw error
  }

  return data
}

export async function updateFoodService({
  id,
  name,
  price,
  category,
  sub_category,
  options,
  image_url,
}) {
  if (!id) {
    throw new Error("Không tìm thấy món ăn cần cập nhật");
  }

  // 1. Lấy image_url cũ
  const { data: existingData, error: fetchError } = await supabaseAdmin
    .from("menu_items")
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;
  if (!existingData) throw new Error("Món ăn không tồn tại");

  // 2. Xóa ảnh cũ nếu đổi ảnh mới
  if (
    existingData.image_url &&
    image_url &&
    existingData.image_url !== image_url
  ) {
    const bucketPath = existingData.image_url.split(
      "/storage/v1/object/public/food-images/"
    )[1];

    if (bucketPath) {
      const { error: storageError } = await supabaseAdmin
        .storage
        .from("food-images")
        .remove([bucketPath]);

      if (storageError) {
        console.warn("Xóa file hình cũ thất bại:", storageError.message);
      }
    }
  }

  // 3. Check có field nào update không
  if (
    name == null &&
    price == null &&
    category == null &&
    sub_category == null &&
    options == null &&
    image_url == null
  ) {
    throw new Error("Không có trường nào để cập nhật");
  }

  // 4. Update DB
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .update({
      ...(name != null && { name }),
      ...(price != null && { price }),
      ...(category != null && { category }),
      ...(sub_category != null && { sub_category }),
      ...(options != null && { options }),
      ...(image_url != null && { image_url }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}
