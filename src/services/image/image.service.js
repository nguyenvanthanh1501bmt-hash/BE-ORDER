import supabaseAdmin from '../../config/supabaseAdmin.js'

export async function uploadFoodImageService(file) {
  if (!file) {
    throw new Error('No file uploaded')
  }

  const fileName = `${Date.now()}-${file.originalname}`
  const filePath = `foods/${fileName}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from('food-images')
    .upload(filePath, file.buffer, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.mimetype,
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const { data } = supabaseAdmin.storage
    .from('food-images')
    .getPublicUrl(filePath)

  return {
    url: data.publicUrl,
    path: filePath,
  }
}
