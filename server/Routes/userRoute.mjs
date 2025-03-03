import express from "express"
import getUser from "../Controllers/UserControllers/getUser.mjs"
import { login, signin, logout, deactiveAccount } from "../Controllers/UserControllers/signin_login.mjs"
import { editDescription, editPassword, editProfilePic, editUserDetails, removeProfilePic } from "../Controllers/UserControllers/handleAccountUpdation.mjs"
import { addComment, addPost, disLikePost, likePost, modifyPost, removePost } from "../Controllers/UserControllers/handlePost.mjs"
import visitProfile from "../Controllers/UserControllers/visitProfile.mjs"
import getUserPost from "../Controllers/UserControllers/getUserPost.mjs"
import handleContactus from "../Controllers/UserControllers/handleContactus.mjs"
import searchUsers from "../Controllers/UserControllers/searchUsers.mjs"

const router = express.Router()

router.get("/", getUser)
router.post("/signin", signin)
router.post("/login", login)
router.get("/logout", logout)
router.delete("/deactivate/:id", deactiveAccount)

router.put("/editPassword/:id", editPassword)
router.put("/editDescription/:id", editDescription)
router.put("/editUserDetails/:id", editUserDetails)
router.put("/editProfilePic/:id", editProfilePic)
router.put("/removeProfilePic", removeProfilePic)

router.route("/handlePost/:id")
    .post(addPost)
    .put(modifyPost)
    .delete(removePost)

router.put("/likePost/:id", likePost)
router.put("/dislikePost/:id", disLikePost)
router.put("/addComment/:id", addComment)


router.get("/visitProfile", visitProfile)
router.get("/getUserPost", getUserPost)

// HANDLING CONTACT US
router.post("/contact", handleContactus)


router.get("/search", searchUsers)
export { router }

// http://example.com/route?key1=value1&key2=value2
