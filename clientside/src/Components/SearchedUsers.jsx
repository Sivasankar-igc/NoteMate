import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { statusCode } from "../utils/statusFile.mjs"

export default ({ users, showPopUp, hideSearchedUsers }) => {

    const navigate = useNavigate()
    const { status: userStatus } = useSelector(state => state.user)

    const visitUserProfile = (e, user_id) => {
        e.preventDefault()
        if (userStatus === statusCode.IDLE) {
            hideSearchedUsers()
            navigate(`/user_account/?userId=${user_id}`)
        } else {
            showPopUp()
        }
    }

    if (users.length > 0) {
        return (
            <div className="searched-users">
                {
                    users.map((user) => (
                        <div key={user._id} className="user-item">
                            <img src={user.userDetails.profilePic || `/user.png`} alt="profile" />
                            <Link onClick={(e) => visitUserProfile(e, user._id)}>{user.userDetails.fullName}</Link>
                        </div>
                    ))
                }
            </div>
        )
    } else {
        return (
            <div className="searched-users">
                <p style={{ textAlign: "center" }}>User Not Found</p>
            </div>
        )
    }
}