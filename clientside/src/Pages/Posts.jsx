import { useSelector, useDispatch } from "react-redux"
import PopWindow from "../Components/PopWindow";
import { statusCode } from "../utils/statusFile.mjs";
import Error from "./Error";
import PostContainer from "../Components/PostContainer";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { API } from "../APIs/apis.mjs";
import { useEffect, useState } from "react";
import axios from "axios";
import { addPost } from "../REDUX_COMPONENTS/Features/postSlice.mjs";

export default () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {  status: postStatus, hasMore } = useSelector(state => state.posts)
    const [canShowPopUp, setCanShowPop] = useState(false);
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)
    const [canLoadMore, setCanLoadMore] = useState(true)

    useEffect(() => {
        fetchMore()
    }, [])

    const fetchMore = () => {
        axios.get(`${API.GET_ALL_POSTS.api}?page=${page}&pageSize=3`)
            .then(res => {
                const { status, message, hasMore } = res.data;
                if (status) {
                    setPosts([...posts, ...message])
                    setPage(prev => prev + 1)
                    setCanLoadMore(hasMore)
                    dispatch(addPost(message))
                }
            })
            .catch(err => {
                console.error(`Fetching more post : ${err}`)
            })
    }

    if (postStatus === statusCode.IDLE) {
        return (
            <div>
                <PopWindow isOpen={canShowPopUp} onClose={() => setCanShowPop(false)}>
                    <div className="content">
                        <h3>Login To Access</h3>
                        <button onClick={() => navigate("/account/login")}>Login</button>
                    </div>
                </PopWindow>
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchMore}
                    hasMore={canLoadMore}
                    loader={
                        <div style={{ display: "flex", width: "100%", height: "100dvh", justifyContent: "center", alignItems: "center" }}>
                            <FontAwesomeIcon icon={faSpinner} spin size="5x" color="#818181" />
                        </div>
                    }
                    endMessage={
                        <p style={{ textAlign: "center" }}>Nothing to show</p>
                    }
                >
                    {
                        posts.map((post, index) => (
                            <PostContainer
                                userId={post.userDetails.userId}
                                postId={post._id}
                                isAdmin={false}
                                CBMethod={null}
                                profilePic={post.userDetails.profilePic}
                                username={post.userDetails.username}
                                post={post.post}
                                showPopUp={() => setCanShowPop(true)}
                                key={post._id}
                            />
                        ))
                    }
                </InfiniteScroll>
            </div >
        )
    } else if (postStatus === statusCode.LOADING) {
        return (
            <div style={{ display: "flex", width: "100%", height: "100dvh", justifyContent: "center", alignItems: "center" }}>
                <FontAwesomeIcon icon={faSpinner} spin size="5x" color="#818181" />
            </div>
        )
    } else if (postStatus === statusCode.EMPTY) {
        return (
            <Error>
                <div className="error-content">
                    <h2 className="error-heading"></h2>
                    <p className="error-text">Oops! Nothing TO Show Here</p>
                    <Link onClick={() => window.location.reload()} className="error-link">Reload Page</Link>
                </div>
            </Error>
        )
    } else {
        return (
            <Error>
                <div className="error-content">
                    <h2 className="error-heading">404</h2>
                    <p className="error-text">Oops! Something went wrong.</p>
                    <Link onClick={() => window.location.reload()} className="error-link">Reload Page</Link>
                </div>
            </Error>
        )
    }
}