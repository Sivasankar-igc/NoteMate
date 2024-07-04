import PostContainer from "./PostContainer";
import Error from "../Pages/Error";

export default ({ props }) => {
    const { userId, userDetails, userPosts: posts, isAdmin } = props;
    if (posts.length > 0) {
        return (
            <>
                {
                    posts.map(post => (
                        <PostContainer
                            userId={userId}
                            postId={post.generalPostId}
                            isAdmin={isAdmin}
                            profilePic={userDetails.profilePic}
                            username={userDetails.username}
                            post={post}
                            showPopUp={null}
                        />
                    ))
                }
            </>
        );
    } else {
        return (
            <Error>
                <div className="error-content">
                    <p className="error-text">User Has Not Posted Anything.</p>
                </div>
            </Error>
        )
    }
}