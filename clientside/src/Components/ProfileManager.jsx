import axios from "axios";
import { useState } from "react"
import { useDispatch } from "react-redux"
import { API } from "../APIs/apis.mjs";
import { modifyAbout, modifyUserDetails } from "../REDUX_COMPONENTS/Features/userSlice.mjs";

export default ({ props: userData }) => {
    const dispatch = useDispatch()

    const [canEdit, setCanEdit] = useState(false);
    const [userDetails, setUserDetails] = useState({
        firstName: userData ? userData.userDetails.firstName : "",
        lastName: userData ? userData.userDetails.lastName : "",
        education: userData ? userData.userDetails.education : "",
        gender: userData ? userData.userDetails.gender : ""
    })
    const [description, setDescription] = useState("");
    const [canEditDescription, setCanEditDescription] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({
            ...userDetails,
            [name]: value
        })
    }

    const handleEdit = () => {
        axios.put(`${API.EDIT_DETAILS.api}/${userData._id}`, userDetails)
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    dispatch(modifyUserDetails(message))
                    window.alert("done")
                    setCanEdit(false)
                } else {
                    window.alert(message)
                }
            })
            .catch(err => {
                window.alert("Network connection error")
                console.error(`Editing user details --> ${err}`)
            })
    }

    const handleDescriptionSubmit = () => {
        axios.put(`${API.EDIT_ABOUT.api}/${userData._id}`, { description })
            .then(res => {
                if (res.data) {
                    dispatch(modifyAbout(description))
                    setCanEditDescription(false)
                    window.alert("done")
                } else {
                    window.alert("Something went wrong!!!")
                }
            })
            .catch(err => {
                window.alert("Network connection error")
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
        { type: "text", name: "phno", defaultValue: userData.userDetails.phno, editable: false, label: "Mobile No." },
        { type: "select", name: "education", defaultValue: userData.userDetails.education, editable: true, label: "Education", options: ["Standard 6-10", "11th/12th", "Graduation", "Diploma", "Prefer not to say"], optionValues: ["Standard 6-10", "11th/12th", "Graduation", "Diploma", "N/A"] },
        { type: "select", name: "gender", defaultValue: userData.userDetails.gender, editable: true, label: "Gender", options: ["Male", "Female", "Others", "Prefer Not to say"], optionValues: ["Male", "Female", "Others", "N/A"] }
    ]

    return (
        <>
            <div>
                {
                    inputFields.map(({ type, name, defaultValue, editable, label, options, optionValues }) => (
                        <div key={name}>
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
                                                        <option value={optionValues[index]}>{option}</option>
                                                    ))
                                                }
                                            </select>
                                        : <input type="text" name={name} id={name} disabled value={defaultValue} />
                                    : <input type="text" name={name} id={name} disabled value={defaultValue} />
                            }
                        </div>
                    ))
                }
                <button>Edit Password</button> {/* will redirect to another page to change the password */}
                {
                    canEdit
                        ? <div>
                            <button onClick={handleEdit}>Save Changes</button>
                            <button onClick={handleEditCancel}>Cancel</button>
                        </div>
                        : <div>
                            <button onClick={() => setCanEdit(true)}>Edit</button>
                        </div>
                }
            </div>
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
                        ? <div>
                            <button onClick={handleDescriptionSubmit}>Save Changes</button>
                            <button onClick={() => {
                                setCanEditDescription(false)
                                setDescription(userData.userDetails.description)
                            }}>Cancel</button>
                        </div>
                        : <div>
                            <button onClick={() => setCanEditDescription(true)}>Edit</button>
                        </div>
                }
            </div>
        </>
    )
}