import express from "express"
import createError from "http-errors"
import UserModel from "./schema.js"

const usersRouter = express.Router()

usersRouter.post("/", async(req,res,next) => {
    // adminusers>index => performs PUT and POST to users
  try {
    const newUser = new UserModel(req.body) 
    const {_id} = await newUser.save()
    res.status(201).send({_id})    
  } catch (error) {
    next(error)
  }
})
usersRouter.get("/", async(req,res,next) => {
    // dropdowns>index => UsersDropdown fetches users
    // adminusers>index => fetches users
  try {    
    const users = await UserModel.find({})
    res.send(users)    
  } catch (error) {
    next(error)
  }
})
usersRouter.get("/:id", async(req,res,next) => {
  try {
    const id = req.params.id
    const user = await UserModel.findById(id) 
    if(user){
      res.send(user)
    } else {
      next(createError(404, `User with id ${id} not found!`))
    }    
  } catch (error) {
    next(error)
  }
})
usersRouter.put("/:id", async(req,res,next) => {
    // adminusers>index => performs PUT and POST to users
  try {
    const id = req.params.id
    const modifiedUser = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true 
    })
    if(modifiedUser){
      res.send(modifiedUser)
    } else {
      next(createError(404, `User with id ${id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
usersRouter.delete("/:id", async(req,res,next) => {
    // adminusers>table => performs DELETE to users by userId
  try {
    const id = req.params.id
    const deletedUser = await UserModel.findByIdAndDelete(id)
    if(deletedUser){
      res.status(204).send()
    } else {
      next(createError(404, `User with id ${id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter