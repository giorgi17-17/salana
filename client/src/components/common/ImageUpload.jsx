import React, { useState, useRef } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { uploadImage, deleteImage } from "../../lib/storageUtils";
import "./ImageUpload.css";

function ImageUpload({
  currentImageUrl = null,
  onImageChange,
  folder,
  className = "",
  placeholder = "Upload Image",
  maxSize = 5 * 1024 * 1024, // 5MB default
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);

    // Validate file size
    if (file.size > maxSize) {
      setError(
        `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      );
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);

    // Upload to Supabase
    setIsUploading(true);
    try {
      // Delete old image if exists
      if (currentImageUrl && currentImageUrl !== previewUrl) {
        await deleteImage(currentImageUrl);
      }

      const { url, error: uploadError } = await uploadImage(file, folder);

      if (uploadError) {
        throw new Error(uploadError);
      }

      setPreviewUrl(url);
      onImageChange(url);
    } catch (err) {
      setError(err.message);
      setPreviewUrl(currentImageUrl); // Revert to original
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (currentImageUrl) {
      try {
        await deleteImage(currentImageUrl);
      } catch (err) {
        console.warn("Failed to delete image:", err);
      }
    }

    setPreviewUrl(null);
    onImageChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`image-upload ${className}`}>
      <div className="image-upload-container">
        {previewUrl ? (
          <div className="image-preview">
            <img src={previewUrl} alt="Preview" className="preview-image" />
            <div className="image-overlay">
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={isUploading}
                className="upload-btn change"
              >
                {isUploading ? <Loader2 className="spinning" /> : <Camera />}
                Change
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isUploading}
                className="upload-btn remove"
              >
                <X />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder" onClick={triggerFileInput}>
            <div className="upload-content">
              {isUploading ? (
                <Loader2 className="upload-icon spinning" />
              ) : (
                <Upload className="upload-icon" />
              )}
              <span className="upload-text">
                {isUploading ? "Uploading..." : placeholder}
              </span>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        disabled={isUploading}
      />

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default ImageUpload;
