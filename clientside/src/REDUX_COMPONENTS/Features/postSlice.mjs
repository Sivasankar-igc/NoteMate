import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { statusCode } from "../../utils/statusFile.mjs";
import axios from "axios"
import { API } from "../../APIs/apis.mjs";

const initialState = {
    data: [],
    status: statusCode.EMPTY
}

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        addPost: (state, action) => {
            // this method will be called with two parameter. 1- the post collection id and 2 - the post
            const { _id, new_post } = action.payload
            const post = state.data.find(d => d._id === _id)
            post.posts.push(new_post)
        },
        removePost: (state, action) => {
            // this method will be called with two parameter. 1 - the post collection id and 2 - the post id
            const { _id, post_id } = action.payload;
            const post = state.data.find(d => d._id === _id)
            post.posts = post.posts.filter(d => d._id !== post_id)
        },
        modifyPost: (state, action) => {
            // yet to be developed
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPosts.fulfilled, (state, action) => {
                const { status, message } = action.payload;
                state.data = message;
                state.status = status ? statusCode.IDLE : statusCode.EMPTY;
            })
            .addCase(getAllPosts.pending, (state, action) => {
                state.status = statusCode.LOADING;
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.status = statusCode.ERROR
            })
    }
})

export const { addPost, removePost, modifyPost } = postSlice.actions;
export default postSlice.reducer;


export const getAllPosts = createAsyncThunk(
    "getAllPosts/get",
    async () => {
        try {
            const response = await axios.get(API.GET_ALL_POSTS.api);
            return response.data;
        } catch (error) {
            console.error(`Couldn't get the posts --> ${error}`)
        }
    }
)