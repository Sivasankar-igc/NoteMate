import mongoose from "mongoose";
import postCol from "../../Models/postModel.mjs";
import { generateDate } from "../../utils/generateDate.mjs";
import { generateTime } from "../../utils/generateTime.mjs";
import allPostCol from "../../Models/generalPostModel.mjs";
import { removeImages } from "../../cloudinaryConfig/handleRemoveAPI.mjs";

export const addPost = async (req, res) => {
    try {
        const id = req.params.id; // the user_id will be passed

        const { username, profilePic, subjectTags, noteDescription, noteImages } = req.body;
        const date = generateDate()
        const time = generateTime()

        const generalPostData = new allPostCol({
            userDetails: {
                username: username,
                userId: id,
                profilePic: profilePic,
            },
            post: {
                subjectTags: subjectTags,
                description: noteDescription,
                images: noteImages,
                noteCreation: {
                    date,
                    time
                },
            }
        })

        const generalPost = await generalPostData.save();

        if (generalPost) {
            const post = await postCol.findOneAndUpdate({ "userDetails.userId": id }, {
                $push: {
                    posts: {
                        generalPostId: generalPost._id,
                        subjectTags: subjectTags,
                        description: noteDescription,
                        images: noteImages,
                        noteCreation: {
                            date,
                            time
                        }
                    }
                }
            }, { new: true });

            post ? res.status(200).json({ status: true, message: post }) : res.status(200).json({ status: false, message: "Something went wrong!!!" })
        } else {
            res.status(200).json({ status: false, message: "Something went wrong!!!" })
        }
    } catch (error) {
        console.error(`Server error : adding post --> ${error}`)
    }
}

export const modifyPost = async (req, res) => {
    try {
        const id = req.params.id; // the user_id will be passed
        const { post_id, subjectTags, noteDescription, noteImages } = req.body.postData;

        const post = await postCol.findOneAndUpdate({ "userDetails.userId": id, "posts._id": post_id }, {
            $set: {
                "posts.$.subjectTags": subjectTags,
                "posts.$.description": noteDescription,
                "posts.$.images": noteImages
            }
        }, { new: true })

        if (post) {
            const updatedPost = post.posts.find(p => p._id === post_id);

            updatedPost ? res.status(200).json({ status: true, message: updatedPost }) : res.status(200).json({ status: false, message: null })
        } else {
            res.status(200).json({ status: false, message: null })
        }

    } catch (error) {
        console.error(`Server error : modifing post --> ${error}`)
    }
} // might be discarded as the user shouldn't modify his/her post once he/she has posted it.

export const removePost = async (req, res) => {
    try {
        const post_id = req.params.id; // the general post id will be passed
        const deletedPost = await postCol.findOneAndUpdate({ "posts.generalPostId": post_id }, {
            $pull: { posts: { generalPostId: post_id } },
        })

        if (deletedPost) {
            const deletedGeneralPost = await allPostCol.findByIdAndDelete(post_id);
            removeImages(deletedGeneralPost.post.images)
            deletedGeneralPost ? res.status(200).json({ status: true, message: "Post has been removed!!!" }) : res.status(200).json({ status: false, message: "Something went wrong!!!" })
        } else {
            res.status(200).json({ status: false, message: "Something went wrong!!!" })
        }
    } catch (error) {
        console.error(`Server error : removing post --> ${error}`)
    }
}

export const likePost = async (req, res) => {
    try {
        const id = req.params.id;  // the user_id will be passed
        const { post_id, val } = req.body; // the general post_id will be passed

        const response = await postCol.updateOne({ "userDetails.userId": id, "posts.generalPostId": post_id }, {
            $inc: { "posts.$.comment_likes.likes": val }
        }) //  val is 1 i.e user likes the video or val is -1 if user again clicks the like button i.e. toggle the like button

        await allPostCol.findByIdAndUpdate(post_id, { $set: { "post.comment_likes.likes": val } })

        res.status(200).send(response.modifiedCount > 0)
    } catch (error) {
        console.error(`Server error : liking post --> ${error}`)
    }
}

export const disLikePost = async (req, res) => {
    try {
        const id = req.params.id; // the user_id will be passed
        const { post_id, val } = req.body;

        const response = await postCol.updateOne({ "userDetails.userId": id, "posts.generalPostId": post_id }, {
            $inc: { "posts.$.comment_likes.dislikes": val }
        }) //  val is 1 i.e user dislikes the video or val is -1 if user again clicks the dislike button i.e. toggle the dislike button

        await allPostCol.findByIdAndUpdate(post_id, { $set: { "post.comment_likes.dislikes": val } })

        res.status(200).send(response.modifiedCount > 0)
    } catch (error) {
        console.error(`Server error : disliking post --> ${error}`)
    }
}

export const addComment = async (req, res) => { // to be modified
    try {
        const id = req.params.id; // the user_id will be passed
        const { post_id, username, profilePic, comment } = req.body;

        const date = generateDate()
        const time = generateTime()

        //         const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb package

        // const commentId = new ObjectId(); // Generate a new, unique ObjectId for the comment

        // const comment = {
        //     _id: commentId, // Include the generated _id
        //     username: username,
        //     profilePic: profilePic,
        //     date: date,
        //     time: time,
        //     comment: comment
        // }

        const response = await postCol.findOneAndUpdate({ "userDetails.userId": id, "posts.generalPostId": post_id }, {
            $push: {
                "posts.$.comment_likes.comments": {
                    username: username,
                    profilePic: profilePic,
                    date: date,
                    time: time,
                    comment: comment
                }
            }
        }, { new: true })

        if (response) {
            const generalPost = await allPostCol.findByIdAndUpdate(post_id, {
                $push: {
                    "post.comment_likes.comments": {
                        username: username,
                        profilePic: profilePic,
                        date: date,
                        time: time,
                        comment: comment
                    }
                }
            }, { new: true })

            if (generalPost) {
                res.status(200).json({ status: true, message: generalPost.post.comment_likes.comments })
            } else {
                res.status(200).json({ status: false, message: "Something went wrong!!!" })
            }

        } else {
            res.status(200).json({ status: false, message: "Something went wrong!!!" })
        }
    } catch (error) {
        console.error(`Server error : adding comment --> ${error}`)
    }
}