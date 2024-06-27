import jwt from "jsonwebtoken";
import userCol from "../../Models/userModel.mjs";
import dotenv from "dotenv"
import postCol from "../../Models/postModel.mjs";

dotenv.config()

const JWT_SECRET = process.env.JWT_TOKEN;

export default async (req, res) => {
    try {
        const token = req.cookies.notemate;

        if (token) {
            const verifiedToken = jwt.verify(token, JWT_SECRET)
            const user = await userCol.findOne({ _id: verifiedToken.tokenId })

            if (user) {
                const post = await postCol.findOne({ "userDetails.userId": user._id })

                res.status(200).json({
                    status: user !== null && user !== undefined,
                    message: { user, post }
                })
            }
        }
    } catch (error) {
        console.error(`Server error : retrieving user detatils from cookies : ${error}`)
    }
}