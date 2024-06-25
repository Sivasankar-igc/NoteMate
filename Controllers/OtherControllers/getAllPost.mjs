import allPostCol from "../../Models/generalPostModel.mjs"

export const getAllPosts = async (req, res) => {
    try {
        const posts = await allPostCol.find()
        posts.length > 0 ? res.status(200).json({ status: true, message: posts }) : res.status(200).json({ status: false, message: [] })
    } catch (error) {
        console.error(`Server error : getting all post --> ${error}`)
    }
}