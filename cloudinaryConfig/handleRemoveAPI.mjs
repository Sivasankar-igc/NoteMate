import { v2 as cloudinary } from "cloudinary"
import cloudinaryConfig from "./config.mjs";

cloudinary.config(cloudinaryConfig)

export const removeImages = (images) => {
    images.forEach(image => {
        let publicId = "uploads" + image.split("uploads")[1].split(".")[0];

        cloudinary.uploader.destroy(publicId, function (error, result) {

            if (error) {
                console.log('Error deleting image:', error);
            }
        });
    })
}

// uploads/247163-amazing-naruto-hd-wallpaper-2560x1600-for-desktop