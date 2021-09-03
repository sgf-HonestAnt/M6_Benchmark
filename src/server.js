import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import mongoose from 'mongoose'
import { badRequestErrorHandler, notFoundErrorHandler, catchAllErrorHandler } from './utilities/errorHandlers.js'

import productRouter from './services/products/index.js'
import reviewsRouter from './services/reviews/index.js'
import usersRouter from './services/users/index.js'
import cartsRouter from './services/carts/index.js'

const server = express()

server.use(cors())
server.use(express.json())

server.use("/products", productRouter)
server.use("/reviews", reviewsRouter)
server.use("/users", usersRouter)
server.use('/carts', cartsRouter)

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)

const { PORT } = process.env

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
    console.log("✅ Successfully connected to MONGO!");
    server.listen(PORT, () => {
        console.log(`✅ Server is up and running on PORT: ${PORT}`)
        console.table(listEndpoints(server))
    })
})

mongoose.connection.on("error", (err) => {
    console.log(`The connection is unsuccessful!, ${err}`);
})