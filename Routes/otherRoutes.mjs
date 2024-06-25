import express from "express"
import { getAllPosts } from "../Controllers/OtherControllers/getAllPost.mjs"

const router = express.Router()

router.get("/getAllPosts", getAllPosts)

export { router }