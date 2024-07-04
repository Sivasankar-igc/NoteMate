import axios from "axios";
import { useState } from "react"
import { useDispatch } from "react-redux"
import { API } from "../APIs/apis.mjs";
import { modifyAbout, modifyProfile, modifyUserDetails } from "../REDUX_COMPONENTS/Features/userSlice.mjs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import CopyButton from "./CopyButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default ({ props: userData }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [canEdit, setCanEdit] = useState(false);
    const [userDetails, setUserDetails] = useState({
        firstName: userData ? userData.userDetails.firstName : "",
        lastName: userData ? userData.userDetails.lastName : "",
        education: userData ? userData.userDetails.education : "",
        gender: userData ? userData.userDetails.gender : ""
    })
    const [description, setDescription] = useState("");
    const [canEditDescription, setCanEditDescription] = useState(false)
    const [isEditingImage, setIsEditingImage] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({
            ...userDetails,
            [name]: value
        })
    }



    const updateProfileImage = (url) => {
        axios.put(`${API.EDIT_PROFILE.api}/${userData._id}`, { profilePic: url[0] })
            .then(res => {
                if (res.data) {
                    toast("Profile picture updated!!!")
                    dispatch(modifyProfile(url[0]))
                } else {
                    toast("Something went wrong")
                }
            })
            .catch(err => {
                console.log(`profile update --> ${err}`)
                toast("Network connection error")
            })
    }

    const handleProfileImage = async (e) => {
        const files = Array.from(e.target.files)
        const formData = new FormData()
        files.forEach(file => {
            formData.append("images", file)
        })

        try {
            const response = await axios.post("uploadImage", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data) {
                axios.put(API.REMOVE_PROFILE.api, { profilePic: userData.userDetails.profilePic })
                    .then(res => res.data ? updateProfileImage(response.data.imageUrls) : toast("Something went wrong!!!"))
                    .catch(err => { console.error(`removing profile picture : ${err}`) })
            } else {
                toast("something went wrong")
            }
        } catch (error) {
            toast("image uploading error")
            console.error(`${error}`)
        }
    }

    const handleEdit = () => {
        axios.put(`${API.EDIT_DETAILS.api}/${userData._id}`, userDetails)
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    dispatch(modifyUserDetails(message))
                    toast("done")
                    setCanEdit(false)
                } else {
                    toast(message)
                }
            })
            .catch(err => {
                toast("Network connection error")
                console.error(`Editing user details --> ${err}`)
            })
    }

    const handleDescriptionSubmit = () => {
        axios.put(`${API.EDIT_ABOUT.api}/${userData._id}`, { description })
            .then(res => {
                if (res.data) {
                    dispatch(modifyAbout(description))
                    setCanEditDescription(false)
                    toast("done")
                } else {
                    toast("Something went wrong!!!")
                }
            })
            .catch(err => {
                toast("Network connection error")
                console.error(`Editing user about --> ${err}`)
            })

    }

    const handleEditCancel = () => {
        setCanEdit(false)
        setUserDetails({
            firstName: userData.userDetails.firstName,
            lastName: userData.userDetails.lastName,
            education: userData.userDetails.education,
            gender: userData.userDetails.gender
        })
    }

    const inputFields = [
        { type: "text", name: "firstName", defaultValue: userData.userDetails.firstName, editable: true, label: "First Name" },
        { type: "text", name: "lastName", defaultValue: userData.userDetails.lastName, editable: true, label: "Last Name" },
        { type: "email", name: "email", defaultValue: userData.userDetails.email, editable: false, label: "E Mail" },
        { type: "copyUrl", name: "userUrl", defaultValue: String(window.location.href), editable: false, label: "URL" },
        { type: "text", name: "phno", defaultValue: userData.userDetails.phno, editable: false, label: "Mobile No." },
        { type: "select", name: "education", defaultValue: userData.userDetails.education, editable: true, label: "Education", options: ["Standard 6-10", "11th/12th", "Graduation", "Diploma", "Prefer not to say"], optionValues: ["Standard 6-10", "11th/12th", "Graduation", "Diploma", "N/A"] },
        { type: "select", name: "gender", defaultValue: userData.userDetails.gender, editable: true, label: "Gender", options: ["Male", "Female", "Others", "Prefer Not to say"], optionValues: ["Male", "Female", "Others", "N/A"] }
    ]

    return (
        <>
            <div className="profile-manager">
                <div className="profile-header">
                    <div className="profile-image-container">
                        <img src={userData.userDetails.profilePic || `/user.png`} alt="Profile" />
                        <label htmlFor="profile-image-input" className="edit-icon" onClick={() => setIsEditingImage(true)}>
                            <FontAwesomeIcon icon={faPen} />
                        </label>
                        {
                            isEditingImage && (
                                <input id="profile-image-input" type="file" accept="image/*" onChange={handleProfileImage} style={{ display: "none" }} />
                            )
                        }
                    </div>
                    <h2>{userData.userDetails.fullName}</h2>
                </div>
                <form onSubmit={(e) => e.preventDefault()} className="profile-form">
                    {
                        inputFields.map(({ type, name, defaultValue, editable, label, options, optionValues }) => (
                            <div key={name} className="form-group">
                                <label htmlFor={name}>{label}</label>
                                {
                                    editable
                                        ? canEdit
                                            ? type === "text" || type === "email"
                                                ? <input type={type} name={name} id={name} defaultValue={defaultValue} onChange={handleChange} />
                                                : <select defaultValue={defaultValue} onChange={handleChange} name={name} id={name}>
                                                    <option value="" disabled>{label}</option>
                                                    {
                                                        options.map((option, index) => (
                                                            <option key={index} value={optionValues[index]}>{option}</option>
                                                        ))
                                                    }
                                                </select>
                                            : <input type="text" name={name} id={name} disabled value={defaultValue} />
                                        : type === "copyUrl"
                                            ? <div style={{ position: "relative" }}>
                                                <input type="text" name={name} id={name} disabled value={defaultValue} />
                                                <CopyButton text={defaultValue} />
                                            </div>
                                            : <input type="text" name={name} id={name} disabled value={defaultValue} />
                                }
                            </div>
                        ))
                    }
                    <button type="button" onClick={() => navigate(`/edit_password?userId=${userData._id}`, { state: { password: userData.userDetails.password } })} style={{ backgroundColor: "#7400ff" }}>Edit Password</button>
                    {
                        canEdit
                            ? <div className="edit-buttons">
                                <button type="button" onClick={handleEdit}>Save Changes</button>
                                <button type="button" onClick={handleEditCancel} style={{ backgroundColor: "#ff0000" }}>Cancel</button>
                            </div>
                            : <button type="button" onClick={() => setCanEdit(true)}>Edit</button>
                    }
                </form>
                <div className="feedback-section">
                    <label>About Me</label>
                    {
                        canEditDescription
                            ? userData.userDetails.description === ""
                                ? <textarea placeholder="Type something about yourself." onChange={(e) => setDescription(e.target.value)}></textarea>
                                : <textarea defaultValue={userData.userDetails.description} onChange={(e) => setDescription(e.target.value)}></textarea>
                            : <textarea defaultValue={userData.userDetails.description === "" ? "Type something about yourself." : userData.userDetails.description} disabled></textarea>
                    }
                    {
                        canEditDescription
                            ? <div className="edit-buttons">
                                <button type="button" onClick={handleDescriptionSubmit}>Save Changes</button>
                                <button type="button" onClick={() => {
                                    setCanEditDescription(false);
                                    setDescription(userData.userDetails.description);
                                }}
                                    style={{ backgroundColor: "#ff0000" }}>Cancel</button>
                            </div>
                            : <button type="button" onClick={() => setCanEditDescription(true)}>Edit</button>
                    }
                </div>
            </div>
        </>
    )
}