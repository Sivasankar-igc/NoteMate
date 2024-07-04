import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProfileManager from "../Components/ProfileManager";
import VisitProfile from "../Components/VisitProfile";
import PostManager from "../Components/PostManager";
import VisitPosts from "../Components/VisitPosts";
import axios from "axios";
import { API } from "../APIs/apis.mjs";
import { statusCode } from "../utils/statusFile.mjs";
import { removeUser } from "../REDUX_COMPONENTS/Features/userSlice.mjs";
import "../CSS/visitProfile.css"
import "../CSS/manager.css"
import "../CSS/profileManager.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import PopWindow from "../Components/PopWindow";
import Error from "../Pages/Error.jsx"
import { Link } from "react-router-dom";

export default () => {

    const [currentSection, setCurrentSection] = useState("profile")
    const { data, post, status } = useSelector(state => state.user);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const user_id = searchParams.get('userId');

    const [userData, setUserData] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const [sidebarActive, setSidebarActive] = useState(false);
    const [canShowPopUp, setCanShowPopUp] = useState(false)

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
    };


    const logout = () => {
        axios.get(API.LOGOUT.api)
            .then(res => {
                if (res.data) {
                    dispatch(removeUser())
                    navigate("/")
                } else {
                    toast("Something went wrong!!!")
                }
            })
            .catch(err => {
                console.error(`logout error --> ${err}`)
                toast("Network connection error")
            })
    }

    const deactivateAccount = () => {
        axios.delete(`${API.DEACTIVATE.api}/${user_id}`)
            .then(res => {
                if (res.data) {
                    dispatch(removeUser())
                    navigate("/")
                } else {
                    toast("Something went wrong!!!")
                }
            })
            .catch(err => {
                console.error(`account deactivation error --> ${err}`)
                toast("Network connection error")
            })
    }

    useEffect(() => {
        if (status === statusCode.IDLE && user_id !== data._id) {
            axios.get(`${API.VISIT_PROFILE.api}?userId=${user_id}`)
                .then(res => {
                    const { status, message } = res.data;
                    if (status) {
                        setUserData(message.user)
                        setUserPosts(message.posts)
                    } else {
                        toast("User doesn't exist")
                    }
                })
                .catch(err => {
                    console.error(`Error : visiting profile --> ${err}`)
                    toast("Network connection error")
                })
        }
    }, [data, user_id])

    if (status === statusCode.IDLE) {
        if (user_id === data._id) {
            return (

                <div className="admin-container">
                    <PopWindow isOpen={canShowPopUp} onClose={() => setCanShowPopUp(false)}>
                        <div className="content">
                            <h3>Are You Sure?</h3>
                            <div className="btn" style={{ display: "flex", width: "100%", justifyContent: "center" }}>
                                <button onClick={deactivateAccount} style={{ backgroundColor: "red", marginRight: "10px" }}>Yes</button>
                                <button onClick={() => setCanShowPopUp(false)} style={{ backgroundColor: "#00ff00" }}>No</button>
                            </div>
                        </div>
                    </PopWindow>
                    <div className="hamburger-menu">
                        <button className="hamburger-button" onClick={toggleSidebar}>
                            <FontAwesomeIcon icon={faCompass} spin />
                        </button>
                    </div>
                    <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
                        <h2>User DashBoard</h2>
                        <button onClick={() => setCurrentSection("profile")}>My Profile</button>
                        <button onClick={() => setCurrentSection("posts")}>My Posts</button>
                        <button onClick={() => setCurrentSection("managePost")}>Post Manager</button>
                        <button onClick={logout}>Logout</button>
                        <button onClick={() => setCanShowPopUp(true)}>Deactivate Account</button>
                    </div>
                    <div className="main-content">
                        {currentSection === "profile" && <ProfileManager props={data} />}
                        {currentSection === "posts" && <VisitPosts props={{ userId: data._id, userDetails: data.userDetails, userPosts: post, isAdmin: true }} />}
                        {currentSection === "managePost" && <PostManager props={{ userId: data._id, post }} />}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="admin-container">
                    <div className="hamburger-menu">
                        <button className="hamburger-button" onClick={toggleSidebar}>
                            <FontAwesomeIcon icon={faCompass} spin />
                        </button>
                    </div>
                    <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
                        <button onClick={() => setCurrentSection('profile')}>Profile</button>
                        <button onClick={() => setCurrentSection('posts')}>Posts</button>
                    </div>
                    <div className="main-content">
                        {currentSection === 'profile' && <VisitProfile props={userData} />}
                        {currentSection === 'posts' && <VisitPosts props={{ userId: userData._id, userDetails: userData.userDetails, userPosts: userPosts.posts, isAdmin: false, CBMethod: null }} />}
                    </div>
                </div>
            );
        }
    }
    else {
        return (
            <Error>
                <div className="error-content">
                    <h2 className="error-heading"></h2>
                    <p className="error-text">Login To Access This Page</p>
                    <Link to="/account/login" className="error-link">Login</Link>
                </div>
            </Error>
        )
    }
}