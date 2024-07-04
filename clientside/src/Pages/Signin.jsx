import axios from "axios"
import { useRef, useState } from "react"
import { API } from "../APIs/apis.mjs"
import { useDispatch } from "react-redux";
import { addUser, userPost } from "../REDUX_COMPONENTS/Features/userSlice.mjs";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/signin.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";

export default () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phno: "",
        education: "",
        gender: "",
        password: "",
        againPassword: "",
        description: ""
    })

    const passRef = useRef()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({
            ...userDetails,
            [name]: value
        })
    }

    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (userDetails.password === userDetails.againPassword) {
            axios.post(API.SIGN_IN.api, userDetails)
                .then(res => {
                    const { status, message } = res.data;
                    if (status) {
                        dispatch(addUser(message))
                        dispatch(userPost({ _id: message._id, posts: [] }))
                        navigate("/")
                    } else {
                        toast(message)
                    }
                })
                .catch(err => {
                    console.error(`Signin error : ${err}`)
                    toast("Network connection error")
                })
        } else {
            toast("password and confirm password must be same")
            return;
        }
    }


    const formInputFields = [
        { type: "text", name: "firstName", required: true, label: "First Name" },
        { type: "text", name: "lastName", required: true, label: "Last Name" },
        { type: "email", name: "email", required: true, label: "E Mail" },
        { type: "text", name: "phno", required: true, label: "Mobile No." },
        { type: "select", name: "education", required: true, label: "Education", options: ["Standard 6-10", "11th/12th", "Graduation", "Diploma", "Prefer not to say"], optionValues: ["Standard 6-10", "11th/12th", "Graduation", "Diploma", "N/A"] },
        { type: "select", name: "gender", required: true, label: "Gender", options: ["Male", "Female", "Others", "Prefer Not to say"], optionValues: ["Male", "Female", "Others", "N/A"] },
        { type: "password", name: "password", required: true, label: "Password", toggle: true },
        { type: "password", name: "againPassword", required: true, label: "Again Password", toggle: false }, // if toggle false then don't show the password in string format
        { type: "textarea", name: "description", required: false, label: "About Yourself" }
    ]

    return (
        <div className="signin-container">
            <form onSubmit={handleSubmit} className="signin-form">
                {formInputFields.map(({ type, name, required, label, options, optionValues, toggle }) => (
                    <div key={name} className="form-group">
                        <label htmlFor={name}>{label}</label>
                        {type === "text" || type === "email" ? (
                            <input type={type} id={name} name={name} onChange={handleChange} required={required} />
                        ) : type === "password" ? (
                            <div className="password-input-container">
                                <input type={showPassword && toggle ? "text" : "password"} id={name} name={name} required={required} onChange={handleChange} ref={toggle ? passRef : null} />
                                {toggle && (
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="password-icon"
                                    />
                                )}
                            </div>
                        ) : type === "select" ? (
                            <select name={name} defaultValue="" id={name} required onChange={handleChange}>
                                <option value="" disabled>{label}</option>
                                {options.map((option, index) => (
                                    <option value={optionValues[index]} key={optionValues[index]}>{option}</option>
                                ))}
                            </select>
                        ) : (
                            <textarea name={name} id={name} onChange={handleChange}></textarea>
                        )}
                    </div>
                ))}
                <button>Sign In</button>
                <p>Have an account?<Link to="/account/login"> Login</Link></p>
            </form>
            <div className="signin-image">
                <img src={`/banner.jpg`} alt="Sign In" />
            </div>
        </div>
    );
}