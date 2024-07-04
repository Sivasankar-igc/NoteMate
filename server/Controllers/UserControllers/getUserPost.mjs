import allPostCol from "../../Models/generalPostModel.mjs";

export default async (req, res) => {
    try {
        const userId = req.query.userId;
        const postId = req.query.postId;

        const post = await allPostCol.findOne({ "userDetails.userId": userId, _id: postId })

        res.status(200).json({
            status: post !== null && post !== undefined,
            message: post
        })
    } catch (error) {
        console.error(`Server error : getting user post --> ${error}`)
    }
}