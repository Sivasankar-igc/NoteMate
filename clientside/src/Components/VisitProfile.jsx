export default ({ props: userData }) => {

    if (userData) {
        const inputFields = [
            { type: "text", name: "firstName", defaultValue: userData.userDetails.firstName, label: "First Name" },
            { type: "text", name: "lastName", defaultValue: userData.userDetails.lastName, label: "Last Name" },
            { type: "text", name: "email", defaultValue: userData.userDetails.email, label: "E Mail" },
            { type: "text", name: "phno", defaultValue: userData.userDetails.phno, label: "Mobile No." },
            { type: "select", name: "education", defaultValue: userData.userDetails.education, label: "Education", options: ["Standard 6-10", "11th/12th", "Graduation", "Diploma", "Prefer not to say"], optionValues: ["Standard 6-10", "11th/12th", "Graduation", "Diploma", "N/A"] },
            { type: "select", name: "gender", defaultValue: userData.userDetails.gender, label: "Gender", options: ["Male", "Female", "Others", "Prefer Not to say"], optionValues: ["Male", "Female", "Others", "N/A"] }
        ]

        return (
            <>
                <div>
                    {
                        inputFields.map(({ type, name, defaultValue, label, options, optionValues }) => (
                            <div key={name}>
                                <label htmlFor={name}>{label}</label>
                                <input type="text" value={defaultValue} name={name} disabled />
                            </div>
                        ))
                    }
                </div>
                <div className="feedback-section">
                    <label>About Me</label>
                    <textarea disabled>{userData.userDetails.description}</textarea>
                </div>
            </>
        )
    } else {
        return (
            <>
                User not found
            </>
        )
    }

}