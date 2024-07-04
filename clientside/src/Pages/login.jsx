import { useState } from "react";
import axios from "axios";
import { API } from "../APIs/apis.mjs";
import { useDispatch } from "react-redux";
import { addUser, userPost } from "../REDUX_COMPONENTS/Features/userSlice.mjs";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/login.css"
import { toast } from "react-toastify";

const Login = () => {
    const [mail, setMail] = useState()
    const [password, setPassword] = useState()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(API.LOGIN.api, { mail, password })
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    dispatch(addUser(message.user))
                    dispatch(userPost({ _id: message.user._id, posts: message.post.posts }))
                    navigate("/")
                } else {
                    toast(message)
                }
            })
            .catch(err => {
                console.error(`Login error --> ${err}`)
                toast("Network connection error")
            })
    }

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" onChange={(e) => setMail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit">Login</button>
                    <p>
                        Don't have an account? <Link to="/account/signin">Sign up</Link>
                    </p>
                </form>
            </div>
            <div className="login-image">
                <img src={`/banner.jpg`} alt="Login" />
            </div>
        </div>
    );
}

export default Login;