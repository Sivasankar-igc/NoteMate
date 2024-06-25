import { Link } from "react-router-dom";

const Links = () => {
    return (
        <>
            <Link to="login">Login</Link>
            <Link to="signin">Signin</Link>
            <Link to="profile">Profile</Link>
            <Link to="noteForm">Note Form</Link>
            <Link to="home">Home Page</Link>

        </>
    )
}

export default Links;