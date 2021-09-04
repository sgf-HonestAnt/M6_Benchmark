import mongoose from 'mongoose'


const { Schema, model } = mongoose

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, enum: ["CategoryOne", "CategoryTwo", "CategoryTree"] },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
}, {
    timestamps: true
})

productSchema.static("findProducts", async function(query) {
    const total = await this.countDocuments(query.criteria)
    const products = await this.find(query.criteria, query.options.fields)
        .limit(query.options.limit)
        .skip(query.options.skip)
        .sort(query.options.sort) // no matter how I write them, mongo is going to apply  ALWAYS sort skip limit in this order
        .populate("reviews")

    return { total, products }
})


export default model("Product", productSchema)