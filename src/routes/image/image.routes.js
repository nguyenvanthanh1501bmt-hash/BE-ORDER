import express from 'express'
import multer from 'multer'
import { uploadFoodImage } from '../../controllers/image/image.controller.js'

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
})

// POST /api/image/upload
router.post(
  '/upload',
  upload.single('file'),   
  uploadFoodImage
)

export default router
