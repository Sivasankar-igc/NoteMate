import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import { API } from "../APIs/apis.mjs"
import { statusCode } from "../utils/statusFile.mjs"
import { toast } from "react-toastify"
import PostContainer from "../Components/PostContainer"
import Error from "../Pages/Error.jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

export default () => {

    const location = useLocation()
    const url = new URLSearchParams(location.search)
    const user_id = url.get("userId")
    const post_id = url.get("postId")

    const { data: user, post, status } = useSelector(state => state.user)
    const [postData, setPostData] = useState(null);
    const [userDetails, setUserDetails] = useState(null)

    useEffect(() => {
        if (status === statusCode.IDLE) {
            if (user_id !== user._id) {
                axios.get(`${API.GET_USER_POST.api}?userId=${user_id}&postId=${post_id}`)
                    .then(res => {
                        const { status, message } = res.data;
                        if (status) {
                            setPostData(message.post)
                            setUserDetails(message.userDetails)
                        } else {
                            toast("Something went wrong")
                        }
                    })
                    .catch(err => {
                        console.error(`getting user post --> ${err}`)
                        toast("Network connection error")
                    })
            } else {
                let user_post = post.find(p => p.generalPostId === post_id)
                setPostData(user_post);
                setUserDetails({ username: user.userDetails.fullName, userId: user._id, profilePic: user.userDetails.profilePic })
            }
        }

    }, [status])

    if (status === statusCode.IDLE) {
        return (
            <>
                {
                    userDetails !== null && postData !== null
                        ? <div>
                            <PostContainer
                                userId={user_id}
                                postId={post_id}
                                isAdmin={user_id === "user._id"}
                                profilePic={userDetails.profilePic}
                                username={userDetails.username}
                                post={postData}
                                showPopUp={null}
                                key={post._id}
                            />
                        </div>
                        : ""
                }
            </>
        )
    } else if (status === statusCode.ERROR) {
        return (
            <Error>
                <div className="error-content">
                    <h2 className="error-heading">404</h2>
                    <p className="error-text">Oops! Something went wrong.</p>
                    <Link onClick={() => window.location.reload()} className="error-link">Reload Page</Link>
                </div>
            </Error>
        )
    } else if (status === statusCode.EMPTY) {
        return (
            <Error>
                <div className="error-content">
                    <h2 className="error-heading"></h2>
                    <p className="error-text">Login To Access This Page</p>
                    <Link to="/account/login" className="error-link">Login</Link>
                </div>
            </Error>
        )
    } else if (status === statusCode.LOADING) {
        return (
            <div style={{ display: "flex", width: "100%", height: "100dvh", justifyContent: "center", alignItems: "center" }}>
                <FontAwesomeIcon icon={faSpinner} spin size="5x" color="#818181" />
            </div>
        )
    }
}