import { Router } from 'express'
import ProductModel from './schema.js'
import createError from 'http-errors'
// import multer from 'multer'
import { mediaStorage } from '../../utilities/mediaStorage.js'
import q2m from 'query-to-mongo'


const productRouter = Router()


productRouter.get("/", async (req, res, next) => {
    try {
        const query = q2m(req.query)
        const { total, products } = await ProductModel.findProducts(query) // this func populates("reviews")
        res.send({ links: query.links("/products", total), total, products, pageTotal: Math.ceil(total / query.options.limit) })
    } catch (error) {
        console.log(error);
        next(error);
    }
})

productRouter.get("/:id", async (req, res, next) => {
    try {
        const singleData = await ProductModel.findById(req.params.id).populate("reviews")
        if (singleData) {
            res.send(singleData)
        } else {
            next(createError(404, `product with id ${req.params.id} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

productRouter.post("/", async (req, res, next) => {
    try {
        const newData = new ProductModel(req.body)
        const {_id } = await newData.save()
        res.status(201).send({_id})
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// productRouter.post("/:id/img", multer({ storage: mediaStorage }).single("imageUrl"), async (req, res, next) => {
//     try {
//         console.log(req.file.path);
//         const id = req.params.id
//         const product = await ProductModel.findById(id)
//         if (product) {
//             const modifiedProduct = await ProductModel.findByIdAndUpdate(id, { imageUrl: req.file.path }, {
//                 new: true
//             })
//             res.send(modifiedProduct)
//         } else {
//             next(createError(404, `product Post with id ${id} not found!`))
//         }
//     } catch (error) {
//         next(error)
//     }
// })

productRouter.put("/:id", async (req, res, next) => {

    try {

        const updatedData = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })

        if (updatedData) {
            res.send(updatedData)
        } else {
            next(createError(404, `product with id ${req.params.id} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})


productRouter.delete("/:id", async (req, res, next) => {

    try {
        const deletedData = await ProductModel.findByIdAndDelete(req.params.id)

        if (deletedData) {
            res.status(204).send(`The product with ID #${req.params.id} has been successfully deleted!`)
        } else {
            next(createError(404, `product with id ${req.params.id} not found!`))
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
})


export default productRouter