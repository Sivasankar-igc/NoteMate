import { toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../APIs/apis.mjs";
import { useDispatch, useSelector } from "react-redux";
import { add_userPost, remove_userPost } from "../REDUX_COMPONENTS/Features/userSlice.mjs";
import { faClose, faCloud, faCross, faDeleteLeft, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "../CSS/postManager.css"

export default ({ props }) => {
    const { userId, post } = props;
    const dispatch = useDispatch()

    const { data: userData, post: userPosts } = useSelector(state => state.user)
    const subjectTags = [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Computer Science",
        "History",
        "Geography",
        "English",
        "Literature",
        "Economics",
        "Political Science",
        "Sociology",
        "Psychology",
        "Philosophy",
        "Art",
        "Music",
        "Physical Education",
        "Business Studies",
        "Accounting",
        "Marketing",
        "Finance",
        "Law",
        "Engineering",
        "Medicine",
        "Environmental Science",
        "Astronomy",
        "Linguistics",
        "Education",
        "Anthropology",
        "Architecture",
        "Media Studies",
        "Journalism",
        "Graphic Design",
        "Statistics",
        "Religious Studies",
        "Ethics",
        "Theology",
        "Cultural Studies",
        "Film Studies"
      ].sort();
      
    const [selectedImages, setSelectedImages] = useState([]);
    const [selection, setSelection] = useState("")
    const [postData, setPostData] = useState({
        subjectTags: [],
        noteDescription: "",
        noteImages: []
    })
    const [isloading, setIsloading] = useState(false);
    const [canAddTag, setCanAddTag] = useState(false);
    const [trackPostImageIndex, setTrackPostImageIndex] = useState(0)


    const displaySubjectTags = subjectTags.filter(sub_tag => !postData.subjectTags.includes(sub_tag))

    const handleTagDelete = (t) => {
        let temp = [...postData.subjectTags]
        temp.splice(temp.indexOf(t), 1)
        setPostData({
            ...postData,
            "subjectTags": [...temp]
        })
    }

    const handleSubjectTag = (e) => {
        setPostData({
            ...postData,
            "subjectTags": [...postData.subjectTags, e.target.value]
        })
        setSelection("")
        setCanAddTag(false)
    }

    const handleImageChange = (e) => {
        e.preventDefault()
        const files = Array.from(e.target.files);
        setPostData({
            ...postData,
            "noteImages": [...postData.noteImages, ...files]
        })
        const imagePromises = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises).then(images => {
            setSelectedImages([...selectedImages, ...images]);
        }).catch(error => console.error("Error reading files:", error));
    }

    const removeImage = (index) => {
        let temp = [...selectedImages]
        temp.splice(index, 1)
        setSelectedImages([...temp])
        temp = [...postData.noteImages]
        temp.splice(index, 1)
        setPostData({
            ...postData,
            "noteImages": [...temp]
        })
        setTrackPostImageIndex(0)
    }

    const uploadNote = (imgURLS) => {
        axios.post(`${API.HANDLE_POST.api}/${userId}`, {
            username: userData.userDetails.fullName,
            profilePic: userData.userDetails.profilePic,
            subjectTags: postData.subjectTags,
            noteDescription: postData.noteDescription,
            noteImages: imgURLS
        })
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    dispatch(add_userPost(message))
                    toast("Note uploaded successfully!!!")
                    setPostData({
                        subjectTags: [],
                        noteDescription: "",
                        noteImages: []
                    })
                    setSelection("")
                    setSelectedImages([])
                    setIsloading(false)
                } else {
                    toast(message)
                }
            })
            .catch(err => {
                console.error(`Uploading note error : ${err}`)
                toast("Note upload error")
            })
    }

    const uploadImages = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        postData.noteImages.forEach(img => {
            formData.append("images", img)
        })

        try {
            const response = await axios.post("uploadImage", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data) {
                uploadNote(response.data.imageUrls);
            } else {
                toast("something went wrong")
            }
        } catch (error) {
            toast("image uploading error")
            console.error(`${error}`)
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (postData.noteImages.length === 0) {
            toast("Upload atleast one image")
            return;
        } else if (postData.subjectTags.length === 0) {
            toast("Add atleast one subject tag")
            return;
        } else {
            setIsloading(true)
            uploadImages(e)
        }
    }

    const prevImage = () => {
        setTrackPostImageIndex(prev => prev > 0 ? prev - 1 : prev);
    }

    const nextImage = (length) => {
        setTrackPostImageIndex(prev => prev < length - 1 ? prev + 1 : prev);
    }

    return (
        <>

            <div className="post-manager">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <h4>Add Subject Tags <span style={{ color: "red" }}>(*)</span></h4>
                        <button type="button" onClick={() => setCanAddTag(true)}>
                            {isloading ? "Adding..." : "Add"}
                            {!isloading && <FontAwesomeIcon icon={faPlus} style={{ marginLeft: "5px" }} />}
                        </button>
                        <div className="tag-wrapper">
                            {
                                postData.subjectTags.map((tag, index) => (
                                    <div key={index} className="tag-container">
                                        <p>{tag}</p>
                                        <label htmlFor={tag}>
                                            <FontAwesomeIcon icon={faClose} />
                                        </label>
                                        <button type="button" id={tag} style={{ display: "none" }} onClick={() => handleTagDelete(tag)}></button>
                                    </div>
                                ))
                            }
                            {
                                canAddTag && <select onChange={(e) => {
                                    setSelection(e.target.value);
                                    handleSubjectTag(e);
                                }} value={selection}>
                                    <option value="" disabled>choose sub tag</option>
                                    {
                                        displaySubjectTags.map((tag, index) => (
                                            <option key={index} value={tag}>{tag.toUpperCase()}</option>
                                        ))
                                    }
                                </select>
                            }
                        </div>
                    </div>

                    <div className="form-group">
                        <h4>Add Description <span style={{ color: "red" }}>(*)</span></h4>
                        <textarea type="text" placeholder="Type Description...." value={postData.noteDescription} onChange={(e) => setPostData({ ...postData, "noteDescription": e.target.value })} required ></textarea>
                    </div>

                    <div className="form-group">
                        <h4>Add Images <span style={{ color: "red" }}>(*)</span></h4>

                        {
                            !isloading
                                ? <label htmlFor="image">
                                    Upload Images
                                    <FontAwesomeIcon icon={faCloud} style={{ marginLeft: "5px" }} />
                                </label>
                                : <label >
                                    Uploadig...
                                </label>
                        }
                        <input type="file" multiple accept="image/*" id="image" name="image" onChange={handleImageChange} style={{ display: "none" }} />

                        <div className="carousel" style={selectedImages.length > 0 ? { display: "block" } : { display: "none" }}>
                            {
                                selectedImages.map((image, index) => (
                                    <div key={index} className="image-container" style={index === trackPostImageIndex ? { display: "block" } : { display: "none" }}>
                                        <img src={image} alt={`Selected ${index}`} />
                                        <button type="button" onClick={() => removeImage(index)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                ))
                            }
                            {
                                selectedImages.length > 0 && <div className="carousel-controls">
                                    <button type="button" onClick={() => prevImage()} className="carousel-button">&#10094;</button>
                                    <button type="button" onClick={() => nextImage(selectedImages.length)} className="carousel-button">&#10095;</button>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="btn">
                        <button type={isloading ? "button" : "submit"}>
                            {
                                isloading ? "Loading..." : "Submit"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}