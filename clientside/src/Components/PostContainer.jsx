import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux"
import { statusCode } from "../utils/statusFile.mjs";
import jsPDF from "jspdf";
import { useRef, useState } from "react";
import axios from "axios"
import { API } from "../APIs/apis.mjs";
import { useNavigate } from 'react-router-dom';
import ShareButtons from "./ShareButton";
import "../CSS/post.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { remove_userPost } from "../REDUX_COMPONENTS/Features/userSlice.mjs";
import { add_comment } from "../REDUX_COMPONENTS/Features/postSlice.mjs";

export default ({ userId, postId, isAdmin, profilePic, username, post, showPopUp }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const { data: userData, status: userStatus } = useSelector(state => state.user);
    const pageRef = useRef()

    const [canComment, setCanComment] = useState(null)
    const [comment, setComment] = useState("")
    const [generatingPdf, setGeneratingPdf] = useState(false) // to check whether the user is generating the pdf or not

    const [trackPostImageIndex, setTrackPostImageIndex] = useState(0) // to keep the track of the image indices (prev image and next image)
    const [showComment, setShowComment] = useState(false);

    const [commentCollection, setCommentCollection] = useState(post.comment_likes.comments)

    // Generate pdf method
    const generatePDF = async (imageUrls) => {
        if (userStatus === statusCode.IDLE) {
            setGeneratingPdf(true)
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
            setGeneratingPdf(false)
        } else {
            showPopUp()
        }
    }
    // End


    // Visiting profile
    const visitUserProfile = (user_id) => {
        if (userStatus === statusCode.IDLE) {
            navigate(`/user_account/?userId=${user_id}`)
        } else {
            showPopUp()
        }
    }
    // End

    // Handling the comment section
    const handleComment = (post_id) => {
        if (userStatus === statusCode.IDLE) {
            setCanComment(true)
        } else {
            showPopUp()
        }
    }
    // End

    // Adding comment
    const addComment = (creatorId, post_id) => {
        axios.put(`${API.ADD_COMMENT_POST.api}/${creatorId}`, { post_id, username: userData.userDetails.fullName, profilePic: userData.userDetails.profilePic, comment })
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    dispatch(add_comment({ id: post_id, comments: message }))
                    setCommentCollection(message)
                    setCanComment(null)
                    setComment("")
                } else {
                    toast(message)
                }
            })
            .catch(err => {
                console.error(`Adding comment error --> ${err}`)
                toast("Network connection error")
            })
    }
    // End

    // Removing Post
    const removePost = (post_id) => {
        axios.delete(`${API.HANDLE_POST.api}/${post_id}`)
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    dispatch(remove_userPost(post_id))
                }

                toast(message)
            })
            .catch(err => {
                console.error(`Removing post error --> ${err}`)
                toast("Network connection error!!!")
            })
    }
    // End

    //Handle Pagination
    const handlePagination = (val, length) => {
        const index = parseInt(val, 10);
        if (!isNaN(index)) {
            if (index <= 0) {
                setTrackPostImageIndex(0);
            } else if (index > length) {
                setTrackPostImageIndex(length - 1);
            } else {
                setTrackPostImageIndex(index - 1);
            }
        }
    }
    //End

    const prevImage = () => {
        setTrackPostImageIndex(index => {
            if (index > 0) {
                pageRef.current.value = index;
                return index - 1;
            } else {
                pageRef.current.value = 1;
                return index
            }
        })
    }

    const nextImage = (length) => {
        setTrackPostImageIndex(index => {
            if (index < length - 1) {
                pageRef.current.value = parseInt(pageRef.current.value) + 1;
                return index + 1;
            } else {
                pageRef.current.value = length;
                return index
            }
        })
    }

    return (
        <div key={postId} className="post-container">
            {
                isAdmin && <button
                    onClick={() => removePost(postId)}
                    className="delete-post-button"
                >
                    Delete</button>
            }
            <div className="post-header">
                <div className="post-header-left">
                    <img src={profilePic || `/user.png`} alt="Profile" className="profile-picture" />

                    <div className="user-info">
                        <label onClick={() => visitUserProfile(userId)} className="username">
                            {username}
                        </label>
                        <span className="post-date">
                            {post.noteCreation.date}
                        </span>
                    </div>
                </div>
                <div className="post-header-right">
                    {
                        generatingPdf
                            ? <button className="action-button" >
                                <FontAwesomeIcon icon={faSpinner} spin />
                            </button>
                            : <button className="action-button" onClick={() => generatePDF(post.images)}>
                                PDF <FontAwesomeIcon icon={faDownload} />
                            </button>

                    }
                    <ShareButtons showPopUp={() => showPopUp()} className={"action-button"} url={`user_post/?userId=${userId}&postId=${postId}`} />
                </div>
            </div>
            <div className="post-content">
                <div className="tags-container">
                    {
                        post.subjectTags.map(tag => (
                            <p key={tag} className="tag">{tag}</p>
                        ))
                    }
                </div>
                <p className="description">{post.description}</p>
                <div className="carousel">
                    {
                        post.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Post Image ${index + 1}`}
                                className={index === trackPostImageIndex ? "active-image" : "carousel-image"}
                            />
                        ))
                    }
                    <div className="pagination">
                        <input key={postId} ref={pageRef} type="number" defaultValue={1} onChange={(e) => handlePagination(e.target.value, post.images.length)} />
                        <div>/</div>
                        <div>{post.images.length}</div>
                    </div>
                    <div className="carousel-controls">
                        <button onClick={() => prevImage()} className="carousel-button">&#10094;</button>
                        <button onClick={() => nextImage(post.images.length)} className="carousel-button">&#10095;</button>
                    </div>
                </div>
            </div>
            <div>
                <button className="comment-button" onClick={() => handleComment(postId)}>Add Comment</button>
                <button className="comment-button" onClick={() => setShowComment(prev => !prev)}>{showComment ? "Hide" : "Show"} Comment</button>
                {
                    canComment && (
                        <div className="add-comment-container">
                            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="comment-input" />
                            <div>
                                <button className="post-button" onClick={() => addComment(userId, postId)}>POST</button>
                                <button className="cancel-button" onClick={() => { setComment(''); setCanComment(false); }}>CANCEL</button>
                            </div>
                        </div>
                    )
                }
                <div className="comment-wrapper">

                    {
                        showComment
                            ? commentCollection.length > 0
                                ? commentCollection.map(comment => (
                                    <div key={comment._id} className="comment-container">
                                        <div className="comment-header">
                                            <img src={comment.profilePic || `/user.png`} alt="Default Commenter Profile" className="comment-profile-picture" />
                                            <div className="comment-info">
                                                <label className="comment-username">{comment.username}</label>
                                                <label className="comment-date">{comment.date}</label>
                                            </div>
                                        </div>
                                        <div className="comment-text">{comment.comment}</div>
                                    </div>
                                ))
                                : <p style={{ textAlign: "center" }}>Nothing to show</p>
                            : ""
                    }
                </div>
            </div>
        </div>
    )
}