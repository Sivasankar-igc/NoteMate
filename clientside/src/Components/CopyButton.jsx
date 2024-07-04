import React, { useEffect, useState } from 'react';
import clipboardCopy from 'clipboard-copy'; // Import the clipboard-copy library if using
import { faCopy } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';

const CopyButton = ({ text }) => {

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500)

    useEffect(() => {
        window.addEventListener("resize", () => {
            setIsMobile(window.innerWidth <= 500)
        })
    }, [])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text); // Use navigator.clipboard API
            toast('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            style={{
                position: "absolute",
                right: "0%",
                top: "0%",
                backgroundColor: "#b9b2b2",
                color: "#4f4545",
                transform: isMobile ? "translateX(10px)" : ""
            }}
        > <FontAwesomeIcon icon={faCopy} /></button >
    );
};

export default CopyButton;
