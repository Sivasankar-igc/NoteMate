import { Navigate, useParams } from "react-router-dom"
import Login from "../Pages/login";
import Signin from "../Pages/Signin";
import Error from "../Pages/Error";

export default () => {
    const type = useParams().type;

    switch (type) {
        case "login":
            return <Login />
        case "signin":
            return <Signin />
        default:
            return <Error />
    }
}