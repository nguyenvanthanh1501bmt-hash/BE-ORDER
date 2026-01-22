import { uploadFoodImageService } from "../../services/image/image.service.js"

export async function uploadFoodImage(req, res, next) {
  try {
    console.log('HEADERS:', req.headers)
    console.log('FILE:', req.file)
    console.log('BODY:', req.body)

    const result = await uploadFoodImageService(req.file)

    return res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}
