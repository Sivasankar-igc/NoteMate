import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProfileManager from "./ProfileManager";
import VisitProfile from "./VisitProfile";
import PostManager from "./PostManager";
import VisitPosts from "./VisitPosts";
import axios from "axios";
import { API } from "../APIs/apis.mjs";
import { statusCode } from "../utils/statusFile.mjs";
import { removeUser } from "../REDUX_COMPONENTS/Features/userSlice.mjs";

export default () => {

    const [currentSection, setCurrentSection] = useState("profile")
    const { data, post, status } = useSelector(state => state.user);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const user_id = searchParams.get('userId');

    const logout = () => {
        axios.get(API.LOGOUT.api)
            .then(res => {
                if (res.data) {
                    dispatch(removeUser())
                    navigate("/")
                } else {
                    window.alert("Something went wrong!!!")
                }
            })
            .catch(err => {
                console.error(`logout error --> ${err}`)
                window.alert("Network connection error")
            })
    }

    const deactivateAccount = () => {
        axios.delete(`${API.DEACTIVATE.api}/${user_id}`)
            .then(res => {
                if (res.data) {
                    dispatch(removeUser())
                    navigate("/")
                } else {
                    window.alert("Something went wrong!!!")
                }
            })
            .catch(err => {
                console.error(`account deactivation error --> ${err}`)
                window.alert("Network connection error")
            })
    }


    if (status === statusCode.IDLE) {
        if (user_id === data._id) {
            return (
                <>
                    <div>
                        <button onClick={() => setCurrentSection("profile")}>My Profile</button>
                        <button onClick={() => setCurrentSection("posts")}>My Posts</button>
                        <button onClick={logout}>Logout</button>
                        <button onClick={deactivateAccount}>DeActivate Account</button>
                    </div>
                    {currentSection === "profile" && <ProfileManager props={data} />} {/**the user id will be passed as the props */}
                    {currentSection === "posts" && <PostManager props={{ userId: data._id, post }} />}
                </>
            )
        } else {
            const [userData, setUserData] = useState(null)
            const [userPosts, setUserPosts] = useState([])
            useEffect(() => {
                axios.get(`${API.VISIT_PROFILE.api}?userId=${user_id}`)
                    .then(res => {
                        const { status, message } = res.data;
                        if (status) {
                            setUserData(message.user)
                            setUserPosts(message.posts)
                        } else {
                            window.alert("User doesn't exist")
                        }
                    })
                    .catch(err => {
                        console.error(`Error : visiting profile --> ${err}`)
                        window.alert("Network connection error")
                    })
            }, [])

            return (
                <>
                    <div>
                        <button onClick={() => setCurrentSection("profile")}>Profile</button>
                        <button onClick={() => setCurrentSection("posts")}>Posts</button>
                    </div>
                    {currentSection === "profile" && <VisitProfile props={userData} />} {/**the user id will be passed as the props */}
                    {currentSection === "posts" && <VisitPosts props={{ userPosts: userPosts.posts, isAdmin: false, CBMethod: null }} />}
                </>
            )

        }
    }
    else {
        return (
            <>
                login to access
            </>
        )
    }


}