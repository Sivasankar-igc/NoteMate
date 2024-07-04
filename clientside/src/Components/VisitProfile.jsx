import Error from "../Pages/Error";
import CopyButton from "./CopyButton";
import { Link } from "react-router-dom";

export default ({ props: userData }) => {

    if (userData) {
        const inputFields = [
            { type: "text", name: "firstName", defaultValue: userData.userDetails.firstName, label: "First Name" },
            { type: "text", name: "lastName", defaultValue: userData.userDetails.lastName, label: "Last Name" },
            { type: "text", name: "email", defaultValue: userData.userDetails.email, label: "E Mail" },
            { type: "copyUrl", name: "userUrl", defaultValue: String(window.location.href), label: "URL" },
            { type: "text", name: "phno", defaultValue: userData.userDetails.phno, label: "Mobile No." },
            { type: "select", name: "education", defaultValue: userData.userDetails.education, label: "Education", options: ["Standard 6-10", "11th/12th", "Graduation", "Diploma", "Prefer not to say"], optionValues: ["Standard 6-10", "11th/12th", "Graduation", "Diploma", "N/A"] },
            { type: "select", name: "gender", defaultValue: userData.userDetails.gender, label: "Gender", options: ["Male", "Female", "Others", "Prefer Not to say"], optionValues: ["Male", "Female", "Others", "N/A"] }
        ];

        return (

            <div className="profile-manager">
                <div className="profile-header">
                    <div className="profile-image-container">
                        <img src={userData.userDetails.profilePic || `/user.png`} alt="Profile" />
                    </div>
                    <h2>{userData.userDetails.fullName}</h2>
                </div>
                <form onSubmit={(e) => e.preventDefault()} className="profile-form">
                    {
                        inputFields.map(({ type, name, defaultValue, label }) => (
                            <div key={name} className="form-group">
                                <label htmlFor={name}>{label}</label>
                                {
                                    type === "copyUrl"
                                        ? <div style={{ position: "relative" }}>
                                            <input type="text" name={name} id={name} disabled value={defaultValue} />
                                            <CopyButton text={defaultValue} />
                                        </div>
                                        : <input type="text" value={defaultValue} name={name} disabled />
                                }
                            </div>
                        ))
                    }
                </form>
                <div className="feedback-section">
                    <label>About Me</label>
                    <textarea disabled>{userData.userDetails.description}</textarea>
                </div>
            </div>
        );
    } else {
        return (
            <Error>
                <div className="error-content">
                    <h2 className="error-heading">404</h2>
                    <p className="error-text">Oops! User Not Found.</p>
                    <Link onClick={() => window.location.reload()} className="error-link">Reload Page</Link>
                </div>
            </Error>
        );
    }

}