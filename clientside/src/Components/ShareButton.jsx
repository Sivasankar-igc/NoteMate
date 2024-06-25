import React from 'react';
import { useSelector } from 'react-redux';
import { statusCode } from '../utils/statusFile.mjs';

const ShareButtons = ({ style, url }) => {

    const { data: userData, status: userStatus } = useSelector(state => state.user);

    const shareViaWebShareAPI = async () => {
        try {
            await navigator.share({
                title: 'Share Example',
                text: 'Check out this awesome content!',
                url: `${window.location.href}${url}`
            });
            // console.log('Successfully shared using Web Share API');
        } catch (error) {
            // console.error('Error sharing using Web Share API:', error);
            // Fallback to other sharing methods
            shareViaCustomLinks();
        }
    };

    const shareViaCustomLinks = () => {
        const shareViaWhatsApp = () => {
            const text = encodeURIComponent('Check out this awesome content!');
            const url = encodeURIComponent(window.location.href);
            const shareUrl = `whatsapp://send?text=${text} ${url}`;
            window.open(shareUrl);
        };

        const shareViaFacebook = () => {
            const url = encodeURIComponent(window.location.href);
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            window.open(shareUrl);
        };

        const shareViaTwitter = () => {
            const text = encodeURIComponent('Check out this awesome content!');
            const url = encodeURIComponent(window.location.href);
            const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            window.open(shareUrl);
        };

        // Example: Open chooser dialog
        const shareViaChooser = () => {
            // Implementing a custom chooser dialog
            const platforms = [
                { name: 'WhatsApp', action: shareViaWhatsApp },
                { name: 'Facebook', action: shareViaFacebook },
                { name: 'Twitter', action: shareViaTwitter },
            ];

            const chosenPlatform = window.confirm('Choose a platform to share:');
            if (chosenPlatform) {
                const platformAction = platforms[chosenPlatform].action;
                platformAction();
            }
        };

        shareViaChooser();
    };

    const handleShareButtonClick = () => {

        if (userStatus === statusCode.IDLE) {
            if (navigator.share) {
                shareViaWebShareAPI();
            } else {
                shareViaCustomLinks();
            }
        } else {
            window.alert("Please login first!!!")
        }
    };

    return (
        <div>
            <button onClick={handleShareButtonClick} style={style}>Share <i className="fa fa-share" aria-hidden="true"></i></button>
        </div>
    );
};

export default ShareButtons;
