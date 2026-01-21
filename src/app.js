import express from 'express'
import corsMiddleware from './middlewares/cors.middleware.js'

import staffRoutes from './routes/admin/staff.routes.js'
import billRouters from './routes/bill/bill.routes.js'

import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(corsMiddleware)
app.use(express.json())

//admin
app.use('/api/admin', staffRoutes)

//bill
app.use('/api/bill', billRouters)

// luôn đặt CUỐI
app.use(errorHandler)

export default app
