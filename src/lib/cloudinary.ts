import toast from 'react-hot-toast';

// TODO: Replace with your Cloudinary Cloud Name and Upload Preset
const CLOUD_NAME = "da9x9fx3o";
const UPLOAD_PRESET = "vinayak_upload";

export const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to upload image');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error: any) {
        console.error("Cloudinary upload error:", error);
        toast.error(`Image upload failed: ${error.message}`);
        return null;
    }
};
