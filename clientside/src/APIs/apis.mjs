export const API = {
    GET_USER: {
        api: "user/",
        method: "get",
        description: "to retrieve the user details based on the cookie if available"
    },
    SIGN_IN: {
        api: "user/signin",
        method: "post",
        description: "to create an account"
    },
    LOGIN: {
        api: "user/login",
        method: "post",
        description: "to log into his/her account"
    },
    LOGOUT: {
        api: "user/logout",
        method: "get",
        description: "to log out of his/her account"
    },
    DEACTIVATE: {
        api: "user/deactivate",
        method: "delete",
        description: "the user id will be passed as a parameter to this api to deactivate the user account"
    },
    EDIT_PASSWORD: {
        api: "user/editPassword",
        method: "put",
        description: "the user id will be passed as a parameter to this api to edit password"
    },
    EDIT_ABOUT: {
        api: "user/editDescription",
        method: "put",
        description: "the user id will be passed as a parameter to this api to edit the about section"
    },
    EDIT_DETAILS: {
        api: "user/editUserDetails",
        method: "put",
        description: "the user id will be passed as a parameter to this api to edit the details about the user"
    },
    EDIT_PROFILE: {
        api: "user/editProfilePic",
        method: "put",
        description: "the user id will be passed as a parameter to this api to edit the profile of the user"
    },
    HANDLE_POST: {
        api: "user/handlePost",
        method: "put, post, delete",
        description: "the user_id will be passed to this api as a parameter to handle creation, modification and deletion of a post with post, put and delete method respectively"
    },
    LIKE_POST: {
        api: "user/likePost",
        method: "put",
        description: "the user_id will be passed to this api as a parameter and in the body part the post id will be passed to increase the like count"
    },
    DISLIKE_POST: {
        api: "user/dislikePost",
        method: "put",
        description: "the user_id will be passed to this api as a parameter and in the body part the post id will be passed to increase the dislike count"
    },
    ADD_COMMENT_POST: {
        api: "user/addComment",
        method: "put",
        description: "the user_id will be passed to this api as a parameter and in the body part the post id will be passed to add the comment to the post"
    },
    VISIT_PROFILE: {
        api: "user/visitProfile",
        method: "get",
        description: "the user id will be passed as a query (visitProfile?userId='userid') to search a particular user"
    },
    GET_ALL_POSTS: {
        api: "getAllPosts",
        method: "get",
        description: "To get all the posts"
    }
}