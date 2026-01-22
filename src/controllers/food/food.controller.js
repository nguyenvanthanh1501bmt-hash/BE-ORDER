import { 
    createFoodService,
    deleteFoodService,
    getAllFoodsService,
    updateFoodService
} from "../../services/food/food.service.js";

export async function createFood(req, res, next) {
  try {
    const {
      name,
      price,
      category,
      sub_category,
      options,
      image_url,
    } = req.body;

    // basic validation
    if (!name || !price || !category) {
      return res.status(400).json({
        message: "name, price and category are required",
      });
    }

    const menuItem = await createFoodService({
      name,
      price,
      category,
      sub_category,
      options,
      image_url,
    });

    res.status(201).json({
      menuItem,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteFood(req, res, next) {
  try {
    const { menuItemId, imageurl } = req.body;

    const deleted = await deleteFoodService(menuItemId, imageurl);

    res.status(200).json({
      message: "Món ăn và ảnh đã xóa thành công",
      deleted,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllFoods(req, res, next) {
  try {
    const menuItemList = await getAllFoodsService()

    res.status(200).json(menuItemList)
  } catch (err) {
    next(err)
  }
}

export async function updateFood(req, res, next) {
  try {
    const {
      id,
      name,
      price,
      category,
      sub_category,
      options,
      image_url,
    } = req.body;

    const updatedFood = await updateFoodService({
      id,
      name,
      price,
      category,
      sub_category,
      options,
      image_url,
    });

    res.status(200).json({
      message: "Cập nhật món ăn thành công",
      updatedFood,
    });
  } catch (err) {
    next(err);
  }
}
