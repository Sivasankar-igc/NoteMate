import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useEffect } from "react";
import axios from "axios"
import { API } from "../APIs/apis.mjs";
import SearchedUsers from "./SearchedUsers";
import "../CSS/searchBar.css"
import PopWindow from "./PopWindow";
import { useNavigate } from "react-router-dom";

export default () => {

    const navigate = useNavigate()

    const [trackSearch, setTrackSearch] = useState("")
    const [searchedUsers, setSearchedUsers] = useState([])
    const [canShowSearchedUsers, setCanShowSearchedUsers] = useState(false)
    const [canShowPopUp, setCanShowPop] = useState(false)

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 470);
    const [showSearch, setShowSearch] = useState(!isMobile);

    const handleResize = () => {
        const mobile = window.innerWidth <= 470;
        setIsMobile(mobile);
        if (!mobile) {
            setShowSearch(true);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            axios.get(`${API.SEARCH_USER.api}?username=${trackSearch}`)
                .then(res => {
                    setSearchedUsers(res.data)
                })
                .catch(err => {
                    console.log(`searching user --> ${err}`)
                })
        }, 800)
    }, [trackSearch])

    const handleClose = () => {
        setCanShowSearchedUsers(false)
        setTrackSearch("")
        setShowSearch(false)
    }

    return (
        <div className="search-bar-container">
            <PopWindow isOpen={canShowPopUp} onClose={() => setCanShowPop(false)}>
                <div className="content">
                    <h3>Login To Access</h3>
                    <button onClick={() => { navigate("/account/login"); setCanShowPop(false) }}>Login</button>
                </div>
            </PopWindow>
            {
                isMobile && !showSearch
                    ? (
                        <div className="search-icon-container">
                            <button className="search-icon" onClick={() => setShowSearch(true)}>
                                <FontAwesomeIcon icon={faSearch} color="white" />
                            </button>
                        </div>
                    )
                    : <div className="search-bar">
                        <FontAwesomeIcon icon={faSearch} />
                        <input
                            value={trackSearch}
                            type="text"
                            placeholder="Search By Username"
                            onChange={(e) => {
                                setTrackSearch(e.target.value);
                                setCanShowSearchedUsers(true);
                            }}
                        // onBlur={() => isMobile && setShowSearch(false)}
                        />
                        <FontAwesomeIcon icon={faClose} onClick={handleClose} />
                    </div>
            }
            {canShowSearchedUsers && <SearchedUsers users={searchedUsers} showPopUp={() => setCanShowPop(true)} hideSearchedUsers={() => handleClose()} />}
        </div>
    )
}