import express from "express"
import createError from "http-errors"
import ReviewModel from "./schema.js"
import productModel from "../products/schema.js"

const reviewsRouter = express.Router()

reviewsRouter.post("/", async (req, res, next) => {
  // product-details>index => sends comment by user to product ID { userId to be passed in req.body }
  try {
    const newReview = new ReviewModel(req.body)
    const { _id } = await newReview.save() 
    // this is saving, but not pushing the _id to product model.
    // Err code: 
    // 2021-09-05T12:48:34.497311+00:00 app[web.1]: CastError: Cast to ObjectId failed for value "6" (type string) at path "_id" for model "Product"
    // 2021-09-05T12:48:34.497319+00:00 app[web.1]:     at model.Query.exec (/app/node_modules/mongoose/lib/query.js:4540:21)
    // 2021-09-05T12:48:34.497319+00:00 app[web.1]:     at model.Query.Query.then (/app/node_modules/mongoose/lib/query.js:4639:15)
    // 2021-09-05T12:48:34.497320+00:00 app[web.1]:     at processTicksAndRejections (internal/process/task_queues.js:95:5) {
    // 2021-09-05T12:48:34.497321+00:00 app[web.1]:   messageFormat: undefined,
    // 2021-09-05T12:48:34.497321+00:00 app[web.1]:   stringValue: '"6"',
    // 2021-09-05T12:48:34.497321+00:00 app[web.1]:   kind: 'ObjectId',
    // 2021-09-05T12:48:34.497322+00:00 app[web.1]:   value: '6',
    // 2021-09-05T12:48:34.497322+00:00 app[web.1]:   path: '_id',
    // 2021-09-05T12:48:34.497323+00:00 app[web.1]:   reason: TypeError: Argument passed in must be a Buffer or string of 12 bytes or a string of 24 hex characters
    // 2021-09-05T12:48:34.497340+00:00 app[web.1]:       at new ObjectId (/app/node_modules/bson/lib/objectid.js:61:23)
    // 2021-09-05T12:48:34.497341+00:00 app[web.1]:       at castObjectId (/app/node_modules/mongoose/lib/cast/objectid.js:25:12)
    // 2021-09-05T12:48:34.497343+00:00 app[web.1]:       at ObjectId.cast (/app/node_modules/mongoose/lib/schema/objectid.js:246:12)
    // 2021-09-05T12:48:34.497343+00:00 app[web.1]:       at ObjectId.SchemaType.applySetters (/app/node_modules/mongoose/lib/schematype.js:1122:12)
    // 2021-09-05T12:48:34.497344+00:00 app[web.1]:       at ObjectId.SchemaType._castForQuery (/app/node_modules/mongoose/lib/schematype.js:1553:15)
    // 2021-09-05T12:48:34.497344+00:00 app[web.1]:       at ObjectId.SchemaType.castForQuery (/app/node_modules/mongoose/lib/schematype.js:1543:15)
    // 2021-09-05T12:48:34.497344+00:00 app[web.1]:       at ObjectId.SchemaType.castForQueryWrapper (/app/node_modules/mongoose/lib/schematype.js:1520:20)
    // 2021-09-05T12:48:34.497346+00:00 app[web.1]:       at cast (/app/node_modules/mongoose/lib/cast.js:333:32)
    // 2021-09-05T12:48:34.497346+00:00 app[web.1]:       at model.Query.Query.cast (/app/node_modules/mongoose/lib/query.js:4963:12)
    // 2021-09-05T12:48:34.497347+00:00 app[web.1]:       at castQuery (/app/node_modules/mongoose/lib/query.js:4764:18),
    // 2021-09-05T12:48:34.497347+00:00 app[web.1]:   valueType: 'string'
    // 2021-09-05T12:48:34.497348+00:00 app[web.1]: }
    // 2021-09-05T12:48:34.497326+00:00 heroku[router]: at=info method=POST path="/reviews" host=honestant-m6-benchmark-be.herokuapp.com request_id=0a8df890-055d-49b4-a9fd-fc8b154506cb fwd="86.141.5.12" dyno=web.1 connect=0ms service=114ms status=500 bytes=271 protocol=https
      const product = await productModel.findByIdAndUpdate(req.body.product, { $push: { reviews: _id } })
    res.status(201).send({ _id, product })
  } catch (error) {
    next(error)
  }
})

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find({}).populate("product").populate("user")
    res.send(reviews)
  } catch (error) {
    next(error)
  }
})

reviewsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const review = await ReviewModel.findById(id).populate("product").populate("user")
    if (review) {
      res.send(review)
    } else {
      next(createError(404, `Review with id ${id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

reviewsRouter.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const modifiedReview = await ReviewModel.findByIdAndUpdate(id, req.body, {
      new: true
    })
    if (modifiedReview) {
      res.send(modifiedReview)
    } else {
      next(createError(404, `Review with id ${id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

reviewsRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const deletedReview = await ReviewModel.findByIdAndDelete(id)
    if (deletedReview) {
      res.status(204).send()
    } else {
      next(createError(404, `Review with id ${id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default reviewsRouter