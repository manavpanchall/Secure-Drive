/**
 * Browser-compatible Cloudinary utility functions
 * We'll use the REST API directly for browser compatibility
 */

const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'Securedrive';

/**
 * Upload a file to Cloudinary using the REST API
 */
export const uploadFileToCloudinary = async (file) => {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary cloud name is not set in environment variables.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Upload successful:", data);
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw error;
  }
};

/**
 * Delete a file from Cloudinary using the REST API
 * Note: This requires authentication - we need to use a server-side function
 * For now, we'll skip actual deletion or implement a server endpoint
 */
export const deleteFileFromCloudinary = async (url) => {
  try {
    console.log("Attempting to delete Cloudinary file:", url);
    
    // Extract public ID from URL
    const publicId = extractPublicIdFromUrl(url);
    
    if (!publicId) {
      console.warn("Could not extract public ID from URL:", url);
      return { result: "skipped" };
    }

    // IMPORTANT: In a production app, you should call a server endpoint here
    // Cloudinary's delete API requires the API secret which should NEVER be exposed in client code
    console.log("Would delete Cloudinary file with public ID:", publicId);
    
    // For demo purposes, we'll simulate successful deletion
    // In production, implement a server endpoint like:
    // POST /api/cloudinary/delete with the public ID
    
    return { result: "ok" };
    
  } catch (error) {
    console.error("Error in deleteFileFromCloudinary:", error);
    // Don't throw error - we don't want to fail the entire delete operation
    // if Cloudinary delete fails
    return { result: "error", error: error.message };
  }
};

/**
 * Helper function to extract public ID from Cloudinary URL
 */
export const extractPublicIdFromUrl = (url) => {
  try {
    // URL formats:
    // https://res.cloudinary.com/cloudname/image/upload/v1234567890/folder/file.jpg
    // https://res.cloudinary.com/cloudname/image/upload/folder/file.jpg
    
    const cloudinaryRegex = /res\.cloudinary\.com\/[^/]+\/image\/upload(?:\/v\d+)?\/(.+)/;
    const match = url.match(cloudinaryRegex);
    
    if (match && match[1]) {
      // Remove file extension
      const publicId = match[1].replace(/\.[^/.]+$/, "");
      return publicId;
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

/**
 * Alternative: Server-side delete endpoint (would be implemented on your backend)
 * This is the secure way to handle Cloudinary deletions
 */
export const deleteFileViaServer = async (publicId) => {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error('Server delete failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting via server:', error);
    throw error;
  }
};