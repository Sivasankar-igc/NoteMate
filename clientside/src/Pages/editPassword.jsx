import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../APIs/apis.mjs";
import { useDispatch } from "react-redux";
import { modifyPassword } from "../REDUX_COMPONENTS/Features/userSlice.mjs";
import "../CSS/editPassword.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faRotate, faSpinner } from "@fortawesome/free-solid-svg-icons";

const EditPassword = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const url = new URLSearchParams(location.search)
    const userId = url.get("userId")
    const password = location.state.password;

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isloading, setIsloading] = useState(false)

    const changePassword = () => {
        if (newPassword === confirmPassword) {
            setIsloading(true)
            axios.put(`${API.EDIT_PASSWORD.api}/${userId}`, { oldPassword, newPassword })
                .then(res => {
                    if (res.data === "not matched") {
                        toast("Old password is not correct!!!")
                        setIsloading(false)
                    } else if (res.data === true) {
                        dispatch(modifyPassword(newPassword))
                        setIsloading(false)
                        toast("Password modified successfully!!!")
                        navigate(`/user_account/?userId=${userId}`)
                    } else {
                        toast("Something went wrong!!!")
                    }
                })
                .catch(err => {
                    console.error(`editing password --> ${err}`)
                    toast("Network connection error")
                })
        } else {
            toast("New password and confirm password must be same!!!")
        }
    }

    return (
        <div className="edit-password-container">
            <input
                className="edit-password-input"
                type="password"
                placeholder="Old Password"
                onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
                className="edit-password-input"
                type="password"
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
                className="edit-password-input"
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="edit-password-buttons">
                <button className="edit-password-button save" onClick={() => { !isloading && changePassword() }}>
                    {isloading ? "Saving Changes..." : "Save Changes"}
                    <FontAwesomeIcon icon={isloading ? faSpinner : faRotate} style={{ marginLeft: "5px" }} spin />
                </button>
                <button className="edit-password-button cancel" onClick={() => { !isloading && navigate(`/user_account/?userId=${userId}`) }}>Cancel
                    <FontAwesomeIcon icon={faBan} style={{ marginLeft: "5px" }} spin />
                </button>
            </div>
        </div>
    )
}

export default EditPassword;