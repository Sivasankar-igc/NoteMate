import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { statusCode } from "../../utils/statusFile.mjs";
import axios from "axios"
import { API } from "../../APIs/apis.mjs";

const initialState = {
    data: null,
    post: [],
    status: statusCode.EMPTY
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.data = action.payload // if user signin or login
            state.status = statusCode.IDLE;
        },
        removeUser: (state, action) => {
            state.data = null;
            state.post = [];
            state.status = statusCode.EMPTY
        },
        modifyUserDetails: (state, action) => {
            state.data = action.payload
        },
        modifyPassword: (state, action) => {
            state.data.userDetails.password = action.payload;
        },
        modifyAbout: (state, action) => {
            state.data.userDetails.description = action.payload;
        },
        modifyProfile: (state, action) => {
            state.data.userDetails.profilePic = action.payload;
        },
        userPost: (state, action) => {
            // two parameters will be passed 1 - the user_id and 2 - all post data

            const { _id, posts } = action.payload;
            state.post = posts;
        },
        add_userPost: (state, action) => {
            state.post = action.payload.posts;
        },
        remove_userPost: (state, action) => {
            state.post = state.post.filter(p => p.generalPostId !== action.payload)
        },
        modify_userPost: (state, action) => {
            let old_post = state.post.find(p => p._id === action.payload._id);
            if (old_post) {
                old_post = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUser.fulfilled, (state, action) => {
                const { status, message } = action.payload;
                state.data = message.user;
                state.post = message.post.posts;
                state.status = status ? statusCode.IDLE : statusCode.EMPTY;
            })
            .addCase(getUser.pending, (state, action) => {
                state.status = statusCode.LOADING;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.status = statusCode.ERROR;
            })
    }
})

export const { addUser, removeUser, modifyAbout, modifyPassword, modifyProfile, modifyUserDetails, userPost, add_userPost, modify_userPost, remove_userPost } = userSlice.actions;
export default userSlice.reducer;

export const getUser = createAsyncThunk(
    "getUser/get",
    async () => {
        try {
            const response = await axios.get(API.GET_USER.api)
            return response.data;
        } catch (error) {
            console.error(`Clientside error : couldn't fetch user details --> ${error}`)
        }
    }
) 