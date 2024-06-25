import { useSelector } from "react-redux"
import { statusCode } from "../utils/statusFile.mjs";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import axios from "axios"
import { API } from "../APIs/apis.mjs";
import { useNavigate } from 'react-router-dom';
import ShareButtons from "./ShareButton";


export default () => {
    const styles = {
        postContainer: {
            marginBottom: '50px',
            border: '1px solid #dddddd',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
        },
        postHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
        },
        postHeaderLeft: {
            display: 'flex',
            alignItems: 'center'
        },
        profilePicture: {
            width: '50px',
            height: '50px',
            borderRadius: '50%'
        },
        userInfo: {
            marginLeft: '10px'
        },
        username: {
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'block',
            fontFamily: "Verdana, Geneva, Tahoma, sans-serif"
        },
        postDate: {
            fontSize: '14px',
            color: '#888888',
            fontFamily: "Verdana, Geneva, Tahoma, sans-serif"
        },
        postHeaderRight: {
            display: 'flex',
            gap: '10px'
        },
        actionButton: {
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: '#007bff',
            color: '#ffffff',
            border: 'none'
        },
        postContent: {
            marginBottom: '20px'
        },
        tagsContainer: {
            display: 'flex',
        },
        tag: {
            marginRight: '5px',
            backgroundColor: '#e0e0e0',
            padding: '5px',
            borderRadius: '4px'
        },
        description: {
            display: 'block',
            marginBottom: '10px'
        },
        carousel: {
            position: 'relative',
            width: '100%',
            height: '300px',
            overflow: 'hidden'
        },
        carouselImage: {
            display: 'none',
            width: '100%',
            height: '300px',
            objectFit: 'cover'
        },
        activeImage: {
            display: 'block',
            width: '100%',
            height: '300px',
            objectFit: 'cover'
        },
        carouselControls: {
            position: 'absolute',
            top: '50%',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            transform: 'translateY(-50%)'
        },
        carouselButton: {
            background: 'rgba(0, 0, 0, 0.5)',
            color: '#ffffff',
            border: 'none',
            padding: '10px',
            cursor: 'pointer'
        },
        likesDislikesContainer: {
            marginBottom: '10px'
        },
        likesDislikesButton: {
            marginRight: '5px',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: '#007bff',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer'
        },
        commentButton: {
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: '#007bff',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            marginBottom: "15px"
        },
        addCommentContainer: {
            marginTop: '10px'
        },
        commentInput: {
            marginRight: '5px',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #dddddd',
            width: '80%'
        },
        postButton: {
            marginRight: '5px',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: '#007bff',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer'
        },
        cancelButton: {
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: '#d9534f',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
        },
        commentContainer: {
            marginBottom: '10px',
            padding: '10px',
            border: '1px solid #dddddd',
            borderRadius: '8px'
        },
        commentHeader: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '5px'
        },
        commentProfilePicture: {
            width: '30px',
            height: '30px',
            borderRadius: '50%'
        },
        commentInfo: {
            marginLeft: '10px',
            display: "flex",
            flexDirection: "column"
        },
        commentUsername: {
            fontWeight: 'bold',
            fontSize: '14px',
            marginRight: '5px',
            fontFamily: "Verdana, Geneva, Tahoma, sans-serif"
        },
        commentDate: {
            color: '#888888',
            fontSize: '12px',
            fontFamily: "Verdana, Geneva, Tahoma, sans-serif"
        },
        commentText: {
            marginTop: '10px',
            marginLeft: "10px",
            fontSize: '15px',
            fontFamily: "Verdana, Geneva, Tahoma, sans-serif"
        }
    };

    const navigate = useNavigate()

    const { data: posts, status: postStatus } = useSelector(state => state.posts)

    const { data: userData, status: userStatus } = useSelector(state => state.user);

    const [canComment, setCanComment] = useState(null)
    const [comment, setComment] = useState("")
    const [activeImageIndex, setActiveImageIndex] = useState({});

    const addComment = (creatorId, post_id) => {
        axios.put(`${API.ADD_COMMENT_POST.api}/${creatorId}`, { post_id, username: userData.userDetails.fullName, profilePic: userData.userDetails.profilePic, comment })
            .then(res => {
                location.reload()
            })
            .catch(err => {
                console.error(`Adding comment error --> ${err}`)
                window.alert("Network connection error")
            })
    }

    const visitUserProfile = (user_id) => {
        if (userStatus === statusCode.IDLE) {
            navigate(`/user_account/?userId=${user_id}`)
        } else {
            window.alert("Please login first!!!");
        }
    }

    const handleComment = (post_id) => {
        if (userStatus === statusCode.IDLE) {
            setCanComment(post_id)
        } else {
            window.alert("Please login first")
        }
    }

    const generatePDF = async (imageUrls) => {
        if (userStatus === statusCode.IDLE) {
            const pdf = new jsPDF();
            for (let i = 0; i < imageUrls.length; i++) {
                const url = imageUrls[i];
                const img = new Image();
                img.crossOrigin = 'Anonymous'; // This is essential for cross-origin images. We have to set it anonymous as we are loading the images from different origin i.e. cloudinary
                img.src = url;
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, img.width, img.height);
                        const imgData = canvas.toDataURL('image/*');
                        const imgProps = pdf.getImageProperties(imgData);
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                        if (i > 0) {
                            pdf.addPage();
                        }
                        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                        resolve();
                    };
                    img.onerror = reject;
                });
            }
            pdf.save('images.pdf');
        } else {
            window.alert("Please login first")
        }
    }

    const nextImage = (postId) => {
        setActiveImageIndex(prevState => {
            const newIndex = (prevState[postId] + 1) % posts.find(post => post._id === postId).post.images.length;
            return { ...prevState, [postId]: newIndex };
        });
    };

    const prevImage = (postId) => {
        setActiveImageIndex(prevState => {
            const postImages = posts.find(post => post._id === postId).post.images.length;
            const newIndex = (prevState[postId] - 1 + postImages) % postImages;
            return { ...prevState, [postId]: newIndex };
        });
    };
    // useEffect(() => {
    //     console.log(activeImageIndex)
    // })

    if (postStatus === statusCode.IDLE) {
        return (
            <div>
                {posts.map(post => (
                    <div key={post._id} style={styles.postContainer}>
                        <div style={styles.postHeader}>
                            <div style={styles.postHeaderLeft}>
                                {post.userDetails.profilePic !== ""
                                    ? <img src={post.userDetails.profilePic} alt="Profile" style={styles.profilePicture} />
                                    : <img src="user.png" alt="Default Profile" style={styles.profilePicture} />
                                }
                                <div style={styles.userInfo}>
                                    <label onClick={() => visitUserProfile(post.userDetails.userId)} style={styles.username}>
                                        {post.userDetails.username}
                                    </label>
                                    <span style={styles.postDate}>
                                        {post.post.noteCreation.date}
                                    </span>
                                </div>
                            </div>
                            <div style={styles.postHeaderRight}>
                                <button style={styles.actionButton} onClick={() => generatePDF(post.post.images)}> PDF<i className="fa fa-download" aria-hidden="true"></i></button>
                                <ShareButtons style={styles.actionButton} url={`user_account/?userId=${post.userDetails.userId}`}/>
                            </div>
                        </div>
                        <div style={styles.postContent}>
                            <div style={styles.tagsContainer}>
                                {post.post.subjectTags.map(tag => (
                                    <p key={tag} style={styles.tag}>{tag}</p>
                                ))}
                            </div>
                            <p style={styles.description}>{post.post.description}</p>
                            <div className="carousel" style={styles.carousel}>
                                {post.post.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Post Image ${index + 1}`}
                                        className={index === (activeImageIndex[post._id] || 0) ? 'active' : ''}
                                        style={index === (activeImageIndex[post._id] || 0) ? styles.activeImage : styles.carouselImage}
                                    />
                                ))}
                                <div className="carousel-controls" style={styles.carouselControls}>
                                    <button onClick={() => prevImage(post._id)} style={styles.carouselButton}>&#10094;</button>
                                    <button onClick={() => nextImage(post._id)} style={styles.carouselButton}>&#10095;</button>
                                </div>
                            </div>
                        </div>
                        {/* <div style={styles.likesDislikesContainer}>
                            <button style={styles.likesDislikesButton}>Likes {post.post.comment_likes.likes}</button>
                            <button style={styles.likesDislikesButton}>Dislikes {post.post.comment_likes.dislikes}</button>
                        </div> */}
                        <div>
                            <button style={styles.commentButton} onClick={() => handleComment(post._id)}>Add Comment</button>
                            {canComment === post._id && (
                                <div style={styles.addCommentContainer}>
                                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} style={styles.commentInput} />
                                    <button style={styles.postButton} onClick={() => addComment(post.userDetails.userId, post._id)}>POST</button>
                                    <button style={styles.cancelButton} onClick={() => { setComment(''); setCanComment(null); }}>CANCEL</button>
                                </div>
                            )}
                            {post.post.comment_likes.comments.map(comment => (
                                <div key={comment._id} style={styles.commentContainer}>
                                    <div style={styles.commentHeader}>
                                        {comment.profilePic !== ""
                                            ? <img src={comment.profilePic} alt="Commenter Profile" style={styles.commentProfilePicture} />
                                            : <img src="user.png" alt="Default Commenter Profile" style={styles.commentProfilePicture} />
                                        }
                                        <div style={styles.commentInfo}>
                                            <label style={styles.commentUsername}>{comment.username}</label>
                                            <label style={styles.commentDate}>{comment.date}</label>
                                        </div>
                                    </div>
                                    <div style={styles.commentText}>{comment.comment}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    else if (postStatus === statusCode.EMPTY) {
        return (
            <>
                Nothing to show
            </>
        )
    } else {
        return (
            <>
                Something went wrong!!!
            </>
        )
    }
}