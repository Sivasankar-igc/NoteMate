import userCol from "../../Models/userModel.mjs";

export default async (req, res) => {
    try {
        const username = req.query.username;
        const users = await userCol.find({ "userDetails.fullName": { $regex: new RegExp(`^${username}`, 'i') } })

        res.status(200).send(users)
    } catch (error) {
        console.error(`Server error : searching user --> ${error}`)
    }
}