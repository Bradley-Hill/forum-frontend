import { useState } from "react";
import { uploadAvatarApi } from "../../api/userApi";
import { useAuth } from "../../hooks/useAuth";
import { resizeImage } from "../../utils/resizeImage";
import type { AvatarUploadProps } from "../../types/sharedComponents";
import "./AvatarUpload.scss";

export default function AvatarUpload({
  currentAvatarUrl,
  onSuccess,
  onError,
}: AvatarUploadProps) {
  const { csrfToken } = useAuth();
  const [preview, setPreview] = useState<string | null>(
    currentAvatarUrl || null,
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      const errorMsg = "Only JPEG, PNG, and WebP images are allowed";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      const errorMsg = "File size must be less than 5MB";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      const resizedFile = await resizeImage(selectedFile);
      setFile(resizedFile);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(resizedFile);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to process image";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }
  };

  const handleUpload = async () => {
    if (!file) {
      const errorMsg = "Please select a file first";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await uploadAvatarApi(file, csrfToken ?? undefined);
      setFile(null);
      onSuccess(result.avatar_url);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to upload avatar";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(currentAvatarUrl || null);
    setError(null);
  };

  return (
    <div className="avatar-upload-container">
      <div className="avatar-upload-preview">
        {preview ? (
          <img src={preview} alt="Avatar preview" />
        ) : (
          <div className="placeholder">No image selected</div>
        )}
      </div>

      <div className="avatar-upload-controls">
        <input
          type="file"
          id="avatar-file-input"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={loading}
          className="file-input"
        />
        <label htmlFor="avatar-file-input" className="file-input-label">
          Choose Image
        </label>

        {error && <p className="error-message">{error}</p>}

        <div className="upload-actions">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="upload-button"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
          {file && (
            <button
              onClick={handleCancel}
              disabled={loading}
              className="cancel-button"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
