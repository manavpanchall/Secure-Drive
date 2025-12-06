import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadFileToCloudinary = async (file) => {
  if (!process.env.REACT_APP_CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary cloud name is not set in environment variables.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "Securedrive");

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

// FIXED: Enhanced delete function
export const deleteFileFromCloudinary = async (url) => {
  try {
    // Extract public ID from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloudname/image/upload/v1234567890/public_id.jpg
    const urlParts = url.split('/');
    const publicIdWithExtension = urlParts.slice(-2).join('/'); // Get the last two parts
    const publicId = publicIdWithExtension.split('.')[0]; // Remove extension
    
    // Delete the file using the public ID
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result !== 'ok') {
      throw new Error(`Failed to delete from Cloudinary: ${result.result}`);
    }
    
    return result;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw error;
  }
};

// Helper function to extract public ID from Cloudinary URL
export const extractPublicIdFromUrl = (url) => {
  try {
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.\w+$/);
    return matches ? matches[1] : null;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};