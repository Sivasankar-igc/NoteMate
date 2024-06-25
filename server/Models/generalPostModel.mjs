// This model is designed to represent all the posts 
import mongoose from "mongoose"

const allPostSchema = mongoose.Schema({
    userDetails: {
        username: String,
        userId: mongoose.Schema.Types.ObjectId,
        profilePic: String,
    },
    post:
    {
        subjectTags: [],
        description: String,
        images: [],
        noteCreation: {
            date: String,
            time: String
        },
        comment_likes: {
            likes: { type: Number, default: 0 },
            dislikes: { type: Number, default: 0 },
            comments: [
                {
                    username: String,
                    profilePic: String,
                    date: String,
                    time: String,
                    comment: String
                }
            ]
        }
    }

}, {
    timestamps: true
})


const allPostCol = new mongoose.model("allPostCollection", allPostSchema)

export default allPostCol;