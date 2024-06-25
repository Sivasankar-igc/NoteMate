import { uploadStream } from "./uploadStream.mjs";

export default async (req, res) => {
    try {
        const uploadPromises = req.files.map(file => {
            return uploadStream(file.buffer, {
                folder: 'uploads',
                public_id: file.originalname.split('.')[0],
            });
        });
        const uploadResults = await Promise.all(uploadPromises);

        const imageUrls = uploadResults.map(result => result.secure_url);
        res.status(200).json({ message: 'Images uploaded successfully!', imageUrls });
    } catch (err) {
        res.status(500).json({ message: 'Failed to upload images', error: err.message });
    }
}