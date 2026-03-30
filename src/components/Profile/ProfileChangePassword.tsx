import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../Shared/Button";
import PasswordInput from "../Shared/PasswordInput";
import Modal from "../Shared/Modal";
import Alert from "../Shared/Alert";
import ErrorMessage from "../Shared/ErrorMessage";

function ProfileChangePassword() {
  const { changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const validatePasswords = (): string | null => {
    if (!currentPassword || !newPassword || !confirmPassword)
      return "All fields are required.";
    if (newPassword.length < 8)
      return "New password must be at least 8 characters.";
    if (newPassword !== confirmPassword) return "New passwords do not match.";
    if (currentPassword === newPassword)
      return "New password must be different from current password.";
    return null;
  };

  const handleSubmitClick = () => {
    const err = validatePasswords();
    if (err) {
      setPasswordError(err);
      return;
    }
    setPasswordError(null);
    setShowConfirmModal(true);
  };

  const handleConfirmChange = async () => {
    setShowConfirmModal(false);
    setPasswordLoading(true);
    setPasswordError(null);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(true);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Password change failed.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const clearError = () => setPasswordError(null);

  return (
    <>
      {passwordSuccess && (
        <Alert
          type="success"
          message="Password changed successfully."
          closeable
          onClose={() => setPasswordSuccess(false)}
        />
      )}
      {passwordError && (
        <ErrorMessage message={passwordError} onRetry={clearError} />
      )}
      <div className="profile-danger-item profile-danger-item--form">
        <div className="profile-danger-info">
          <h3>Change Password</h3>
          <p>
            Update your password. You will need your current password to
            confirm.
          </p>
        </div>

        <form
          className="profile-danger-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitClick();
          }}
        >
          <div className="profile-danger-form-fields">
            <PasswordInput
              id="current-password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                clearError();
              }}
              required
              disabled={passwordLoading}
            />
            <PasswordInput
              id="new-password"
              label="New Password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                clearError();
              }}
              required
              disabled={passwordLoading}
            />
            <PasswordInput
              id="confirm-password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearError();
              }}
              required
              disabled={passwordLoading}
            />
          </div>
          <Button type="submit" variant="primary" disabled={passwordLoading}>
            {passwordLoading ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Change Password"
        size="small"
      >
        <div className="modal-content">
          <p>Are you sure you want to change your password?</p>
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmChange}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ProfileChangePassword;
