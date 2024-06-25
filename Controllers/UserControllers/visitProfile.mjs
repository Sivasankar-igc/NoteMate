import postCol from "../../Models/postModel.mjs";
import userCol from "../../Models/userModel.mjs";

export default async (req, res) => {
    try {
        const userId = req.query.userId;
        const user = await userCol.findById(userId);

        if (user) {
            const posts = await postCol.findOne({ "userDetails.userId": userId });

            if (posts) {
                res.status(200).json({ status: true, message: { posts, user } });
            } else {
                res.status(200).json({ status: false, message: "Something went wrong" });
            }
        } else {
            res.status(200).json({ status: false, message: "User not found" });
        }
    } catch (error) {
        console.error(`Server error : visiting profile --> ${error}`)
    }
}