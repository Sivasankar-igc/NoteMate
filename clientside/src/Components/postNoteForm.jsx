import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../APIs/apis.mjs";
import { useSelector } from "react-redux";

const PostNoteForm = () => {
    const { data: userData } = useSelector(state => state.user)
    const subjectTags = ["science", "math", "english", "IT", "Computer Science", "Environment Science", "JavaScript"]

    const [selectedImages, setSelectedImages] = useState([]);
    const [selection, setSelection] = useState("")
    const [postData, setPostData] = useState({
        subjectTags: [],
        noteDescription: "",
        noteImages: []
    })
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
    }
 
    const uploadNote = (imgURLS) => {
        axios.post(`${API.HANDLE_POST.api}/${userData.postId}`, { subjectTags: postData.subjectTags, noteDescription: postData.noteDescription, noteImages: imgURLS }) // creator information yet to be added
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    console.log(message)
                } else {
                    window.alert(message)
                }
            })
            .catch(err => {
                console.error(`Uploading note error : ${err}`)
                window.alert("Note upload error")
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
                window.alert("something went wrong")
            }
        } catch (error) {
            window.alert("image uploading error")
            console.error(`${error}`)
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        uploadImages(e)
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                {
                    postData.subjectTags.map(tag => (
                        <div>
                            <p>{tag}</p>
                            <button onClick={() => handleTagDelete(tag)}>delete</button>
                        </div>
                    ))
                }
                <select onChange={(e) => {
                    setSelection(e.target.value)
                    handleSubjectTag(e)
                }} value={selection}>
                    <option value="" disabled>choose sub tag</option>
                    {
                        displaySubjectTags.map(tag => (
                            <option value={tag}>{tag.toUpperCase()}</option>
                        ))
                    }
                </select>

                <input type="file" multiple accept="image/*" onChange={handleImageChange} required />
                <div>
                    {
                        selectedImages.map((image, index) => (
                            <div style={{ display: "flex" }}>
                                <img key={index} src={image} alt={`Selected ${index}`} style={{ width: "100px", height: "100px", margin: "10px" }} />
                                <button type="button" onClick={(e) => removeImage( index)}>delete</button>
                            </div>
                        ))
                    }
                </div>

                <input type="text" value={postData.noteDescription} onChange={(e) => setPostData({ ...postData, "noteDescription": e.target.value })} required />
                <button>Submit</button>
            </form>
        </>
    )
}

export default PostNoteForm;