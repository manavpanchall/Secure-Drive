import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
    api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * Uploads a file to Cloudinary.
 * @param {File} file - The file to upload.
 * @returns {Promise<string>} - The secure URL of the uploaded file.
 * @throws {Error} - If the upload fails or environment variables are missing.
 */
export const uploadFileToCloudinary = async (file) => {
    if (!process.env.REACT_APP_CLOUDINARY_CLOUD_NAME) {
        throw new Error("Cloudinary cloud name is not set in environment variables.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "Securedrive");

    console.log("Uploading file:", file.name);
    console.log("Cloudinary cloud name:", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    console.log("Upload preset:", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        throw error;
    }
};

export const deleteFileFromCloudinary = async (url) => {
    try {
        // Extract the public ID from the Cloudinary URL
        const publicId = url.split("/").pop().split(".")[0];

        // Delete the file using the public ID
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        throw error;
    }
};