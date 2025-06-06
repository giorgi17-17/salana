import { supabase } from "./supabaseClient";

/**
 * Upload image to Supabase storage bucket
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder path (e.g., 'businesses', 'stylists', 'locations')
 * @param {string} fileName - Optional custom filename (auto-generated if not provided)
 * @returns {Promise<{url: string | null, error: any}>}
 */
export async function uploadImage(file, folder, fileName = null) {
  try {
    if (!file) {
      return { url: null, error: "No file provided" };
    }

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return { url: null, error: "User not authenticated" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { url: null, error: "File must be an image" };
    }

    // Generate filename if not provided
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const finalFileName = fileName || `${timestamp}.${fileExt}`;
    const filePath = `${folder}/${finalFileName}`;

    console.log("Uploading to path:", filePath);
    console.log("File size:", file.size, "bytes");
    console.log("File type:", file.type);

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from("salana-storage")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return { url: null, error: error.message };
    }

    console.log("Upload successful:", data);

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("salana-storage").getPublicUrl(filePath);

    console.log("Public URL generated:", publicUrl);

    // Verify the file exists by listing it
    const { data: files, error: listError } = await supabase.storage
      .from("salana-storage")
      .list(folder);

    if (listError) {
      console.warn("Could not verify file upload:", listError);
    } else {
      console.log("Files in folder:", files);
    }

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error("Upload function error:", error);
    return { url: null, error: error.message };
  }
}

/**
 * List all files in a folder to verify uploads
 * @param {string} folder - The folder to list files from
 * @returns {Promise<{files: any[] | null, error: any}>}
 */
export async function listFiles(folder) {
  try {
    const { data, error } = await supabase.storage
      .from("salana-storage")
      .list(folder);

    if (error) {
      return { files: null, error: error.message };
    }

    return { files: data, error: null };
  } catch (error) {
    return { files: null, error: error.message };
  }
}

/**
 * Delete image from Supabase storage
 * @param {string} imageUrl - The full URL of the image to delete
 * @returns {Promise<{success: boolean, error: any}>}
 */
export async function deleteImage(imageUrl) {
  try {
    if (!imageUrl) {
      return { success: false, error: "No image URL provided" };
    }

    // Extract file path from URL
    const urlParts = imageUrl.split("/");
    const bucketIndex = urlParts.indexOf("salana-storage");
    if (bucketIndex === -1) {
      return { success: false, error: "Invalid image URL" };
    }

    const filePath = urlParts.slice(bucketIndex + 1).join("/");
    console.log("Deleting file at path:", filePath);

    const { error } = await supabase.storage
      .from("salana-storage")
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return { success: false, error: error.message };
    }

    console.log("File deleted successfully");
    return { success: true, error: null };
  } catch (error) {
    console.error("Delete function error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate a unique filename with timestamp and random string
 * @param {string} originalName - Original filename
 * @returns {string} - Unique filename
 */
export function generateUniqueFileName(originalName) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const fileExt = originalName.split(".").pop();
  return `${timestamp}_${randomString}.${fileExt}`;
}

/**
 * Get public URL for an image in Supabase storage
 * @param {string} imagePath - The full path to the image in storage or full URL
 * @returns {string|null} - The public URL or null if no path provided
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return null;

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Get public URL from Supabase storage
  const { data } = supabase.storage
    .from("salana-storage")
    .getPublicUrl(imagePath);

  return data?.publicUrl || null;
}
