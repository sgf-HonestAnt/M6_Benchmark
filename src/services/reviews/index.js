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
    const product = await productModel.findByIdAndUpdate(req.body.product[0], { $push: { reviews: _id } })
    res.status(201).send({ _id, product })
  } catch (error) {
    next(error)
  }
})

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find({}).populate("product")
    res.send(reviews)
  } catch (error) {
    next(error)
  }
})

reviewsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const review = await ReviewModel.findById(id)
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