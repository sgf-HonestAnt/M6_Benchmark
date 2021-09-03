import express from 'express'
import CartModel from './schema.js'
import createError from 'http-errors'
import ProductModel from '../products/schema.js'

const cartsRouter = express.Router()

cartsRouter.post('/:userId/addProduct', async(req, res, next) => {

    try {
        const productId = req.body.productId

        const purchasedProduct = await ProductModel.findById(productId)

        if (purchasedProduct) {
            const isProductPresent = await CartModel.findOne({ userId: req.params.userId, status: 'active', "products._id": purchasedProduct._id })
            if (isProductPresent) {
                const updatedCart = await CartModel.findOneAndUpdate({ userId: req.params.userId, status: 'active', "products._id": purchasedProduct._id }, {
                    $inc: {
                        "products.$.quantity": req.body.quantity
                    }
                }, {
                    new: true,
                    runValidators: true
                })
                res.send(updatedCart)
            } else {
                const productToInsert = {...purchasedProduct.toObject(), quantity: req.body.quantity }

                const updatedCart = await CartModel.findOneAndUpdate({ userId: req.params.userId, status: 'active' }, {
                    $push: {
                        products: productToInsert
                    }
                }, {
                    new: true,
                    runValidators: true,
                    upsert: true
                })
                res.send(updatedCart)
            }
        } else {
            next(createError(404, `Product with id ${productId} not found`))
        }
    } catch (error) {
        next(error)
    }
})

//cartsRouter.get('')

export default cartsRouter