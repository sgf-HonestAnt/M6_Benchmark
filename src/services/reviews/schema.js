import mongoose from "mongoose"

const {Schema, model} = mongoose

const reviewSchema = new Schema({
  comment: { type: String, required: true},
  rate: { type: Number, required: true, enum: [1,2,3,4,5] },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { 
  timestamps: true 
})

reviewSchema.static("findReviews", async function(query) {
  const total = await this.countDocuments(query.criteria)
  const reviews = await this.find(query.criteria, query.options.fields)
      .limit(query.options.limit)
      .skip(query.options.skip)
      .sort(query.options.sort) // no matter how I write them, mongo is going to apply  ALWAYS sort skip limit in this order
      .populate("product").populate("user")

  return { total, reviews }
})

export default model("Review", reviewSchema) 

// {
//     "_id": "123455", //SERVER GENERATED
//     "comment": "A good book but definitely I don't like many parts of the plot", //REQUIRED
//     "rate": 3, //REQUIRED, max 5
//     "productId": "5d318e1a8541744830bef139", //REQUIRED reference to Products Table
//     "createdAt": "2019-08-01T12:46:45.895Z"  //SERVER GENERATED
// }
