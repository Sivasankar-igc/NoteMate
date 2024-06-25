import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import handleUploadAPI from "./cloudinaryConfig/handleUploadAPI.mjs";
import { cloudinary_upload } from "./cloudinaryConfig/storage.mjs";
import mongoose from "mongoose";
import { router as userRouter } from "./Routes/userRoute.mjs";
import { router as generalRouter } from "./Routes/otherRoutes.mjs";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";

dotenv.config()

const PORT = process.env.PORT || 8000;
const web = express();
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

web.use(cors());
web.use(express.json());
web.use(express.urlencoded({ extended: false }));
web.use(cookieParser())

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("NoteMate Database connected"))
    .catch(err => {
        console.error(err)
        process.exit(1)
    })

web.post('/api/uploadImage', cloudinary_upload.array("images"), handleUploadAPI);
web.use("/api/user", userRouter)
web.use("/api", generalRouter)

web.use(express.static(path.join(__dirname, "./dist")))
web.get("*", (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "./dist/index.html"))
    } catch (error) {
        console.error(`Server error : couldn't get clientside files --> ${error}`)
    }
})

web.listen(PORT, () => console.log(`Server listening at port number ${PORT}`))