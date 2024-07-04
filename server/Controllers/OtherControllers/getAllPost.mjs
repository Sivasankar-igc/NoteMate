import allPostCol from "../../Models/generalPostModel.mjs"

export const getAllPosts = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const pageNumber = parseInt(page)
        const pageSizeNumber = parseInt(pageSize)


        const totalPosts = await allPostCol.countDocuments()
        const posts = await allPostCol
            .find()
            .sort({ _id: -1 }) // Sort posts by _id in descending order
            .skip((pageNumber - 1) * pageSizeNumber) // Skip the posts of previous pages
            .limit(totalPosts > pageSizeNumber ? pageSizeNumber : totalPosts) // Limit the number of posts returned
            .lean()

        const hasMore = (pageNumber * pageSizeNumber) < totalPosts;
        
        posts.length > 0 ? res.status(200).json({ status: true, message: posts, hasMore }) : res.status(200).json({ status: false, message: [] })
    } catch (error) {
        console.error(`Server error : getting all post --> ${error}`)
    }
}