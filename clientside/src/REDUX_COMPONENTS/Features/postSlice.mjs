import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { statusCode } from "../../utils/statusFile.mjs";
import axios from "axios"
import { API } from "../../APIs/apis.mjs";

const initialState = {
    data: [],
    status: statusCode.EMPTY,
}

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        addPost: (state, action) => {
            state.data = [...state.data, ...action.payload]
            state.status = statusCode.IDLE
        },
        removePost: (state, action) => {
            // this method will be called with two parameter. 1 - the post collection id and 2 - the post id
            const { _id, post_id } = action.payload;
            const post = state.data.find(d => d._id === _id)
            post.posts = post.posts.filter(d => d._id !== post_id)
        },
        modifyPost: (state, action) => {
            // yet to be developed
        },
        add_comment: (state, action) => {
            const post = state.data.find(d => d._id === action.payload.id);
            post.post.comment_likes.comments = action.payload.comments;
        }
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(getAllPosts.fulfilled, (state, action) => {
    //             const { status, message, hasMore } = action.payload;
    //             state.data = message
    //             state.hasMore = hasMore
    //             state.status = status ? statusCode.IDLE : statusCode.EMPTY;
    //         })
    //         .addCase(getAllPosts.pending, (state, action) => {
    //             state.status = statusCode.LOADING;
    //         })
    //         .addCase(getAllPosts.rejected, (state, action) => {
    //             state.status = statusCode.ERROR
    //         })
    // }
})

export const { addPost, removePost, modifyPost, add_comment } = postSlice.actions;
export default postSlice.reducer;