import mongoose from 'mongoose'

const { Schema, model } = mongoose

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectID, ref: 'User', required: true },
    products: [{ _id: String, name: String, price: String, quantity: Number }],
    status: { type: String, enum: ['active', 'paid'] }
})

export default model('Cart', cartSchema)