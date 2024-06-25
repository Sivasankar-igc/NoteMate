import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userDetails: {
        username: String,
        userId: mongoose.Schema.Types.ObjectId,
        profilePic: String,
    },
    posts: [
        {
            generalPostId: mongoose.Schema.Types.ObjectId, // to hold the post id of general posts
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
    ]
}, {
    timestamps: true
})

const postCol = new mongoose.model("postcolllection", postSchema);

export default postCol;