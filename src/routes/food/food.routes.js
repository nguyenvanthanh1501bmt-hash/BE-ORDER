import express from 'express'

import { 
    createFood, 
    deleteFood,
    getAllFoods, 
    updateFood
} from '../../controllers/food/food.controller.js'

const router = express.Router()

router.post('/create', createFood)

router.delete("/delete", deleteFood);

router.get('/', getAllFoods)

router.put("/update", updateFood);

export default router