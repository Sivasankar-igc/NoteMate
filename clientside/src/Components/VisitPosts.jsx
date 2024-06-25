export default ({ props }) => {
    const { userPosts: posts, isAdmin, CBMethod } = props;
    return (
        posts.length > 0
            ? posts.map(post => (
                <section key={post._id}>
                    {
                        isAdmin && <button onClick={() => CBMethod(post.generalPostId)}>Delete</button>
                    }
                    <div>
                        <label>Subject Tags</label>
                        {
                            post.subjectTags.map((tag, index) => (
                                <p>{tag}</p>
                            ))
                        }
                    </div>
                    <div>
                        <label>Descripton</label>
                        <p> {post.description}</p>
                    </div>
                    <div>
                        <label>Creation Date</label>
                        <p>{post.noteCreation.date}</p>
                    </div>
                    <div>
                        {
                            post.images.map((image, index) => (
                                <img src={image} key={`${post._id}${index}`} />
                            ))
                        }
                    </div>
                </section>
            ))
            : <>
                User has not posted yet.
            </>
    )
}