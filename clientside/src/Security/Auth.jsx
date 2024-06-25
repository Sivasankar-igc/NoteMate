import { Navigate, useParams } from "react-router-dom"
import Login from "../Pages/login";
import Signin from "../Pages/Signin";

export default () => {
    const type = useParams().type;

    if (type) {
        return (
            type === "login"
                ? <Login />
                : <Signin />
        )
    }

}