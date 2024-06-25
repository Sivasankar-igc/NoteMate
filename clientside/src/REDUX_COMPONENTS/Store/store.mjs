import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../Features/userSlice.mjs";
import postSlice from "../Features/postSlice.mjs";

const store = configureStore({
    reducer:{
        user:userSlice,
        posts:postSlice
    }
})

export default store;