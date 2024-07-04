import React from 'react';
import { useSelector } from 'react-redux';
import { statusCode } from '../utils/statusFile.mjs';

const ShareButtons = ({ showPopUp, className, url }) => {

    const { data: userData, status: userStatus } = useSelector(state => state.user);

    const shareViaWebShareAPI = async () => {
        try {
            await navigator.share({
                title: 'Share Example',
                text: 'Check out this awesome content!',
                url: `${window.location.protocol}//${window.location.host}${window.location.pathname}${url}`
            });
        } catch (error) {
            shareViaCustomLinks();
        }
    };

    const shareViaCustomLinks = () => {
        const shareViaWhatsApp = () => {
            const text = encodeURIComponent('Check out this awesome content!');
            const shareUrl = `whatsapp://send?text=${text} ${window.location.href}`;
            window.open(shareUrl);
        };

        const shareViaFacebook = () => {
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
            window.open(shareUrl);
        };

        const shareViaTwitter = () => {
            const text = encodeURIComponent('Check out this awesome content!');
            const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`;
            window.open(shareUrl);
        };

        const shareViaChooser = () => {
            // Example implementation of a chooser dialog
            const platforms = [
                { name: 'WhatsApp', action: shareViaWhatsApp },
                { name: 'Facebook', action: shareViaFacebook },
                { name: 'Twitter', action: shareViaTwitter },
            ];

            // For simplicity, let's just call the first platform's action
            platforms[0].action();
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
            showPopUp()
        }
    };

    return (
        <div>
            <button onClick={handleShareButtonClick} className={className}>
                Share <i className="fa fa-share" aria-hidden="true"></i>
            </button>
        </div>
    );
};

export default ShareButtons;
