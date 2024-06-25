import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userDetails: {
        firstName: String,
        lastName: String,
        fullName: String,
        email: { type: String, unique: true, required: true },
        phno: { type: String, unique: true, required: true },
        password: String,
        gender: String,
        education: String,
        description: { type: String, default: "" },
        profilePic: { type: String, default: "" }
    },
    accountCreation: {
        date: String,
        time: String
    },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
}, {
    timestamps: true
})

const userCol = new mongoose.model("usercollection", userSchema)

export default userCol;