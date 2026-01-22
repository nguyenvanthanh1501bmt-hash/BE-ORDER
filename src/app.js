import express from 'express'
import corsMiddleware from './middlewares/cors.middleware.js'

import staffRoutes from './routes/admin/staff.routes.js'
import billRouters from './routes/bill/bill.routes.js'
import imageRouters from './routes/image/image.routes.js'
import foodRouters from './routes/food/food.routes.js'

import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(corsMiddleware)

// upload chạy TRƯỚC express.json()
app.use('/api/image', imageRouters)

// các API JSON
app.use(express.json())

//admin
app.use('/api/admin', staffRoutes)

//bill
app.use('/api/bill', billRouters)

//food
app.use('/api/food', foodRouters)

// luôn đặt CUỐI
app.use(errorHandler)

export default app
