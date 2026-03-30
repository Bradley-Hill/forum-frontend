import { useState, useEffect } from "react";
import type { User } from "../../types/api";
import TextInput from "../Shared/TextInput";
import Button from "../Shared/Button";
import Alert from "../Shared/Alert";
import Modal from "../Shared/Modal";
import "./ProfileInfo.scss";

interface ProfileInfoProps {
  user: User;
  loading: boolean;
  onUpdate: (data: { email: string }) => Promise<void>;
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function ProfileInfo({ user, loading, onUpdate }: ProfileInfoProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEmail(newValue);
    setEmailError(null);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess(false);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Email is required");
      return;
    }

    if (trimmedEmail === user?.email) {
      setEmailError("Email is the same as current email");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError(null);
    setNewEmail(trimmedEmail);
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = async () => {
    try {
      await onUpdate({ email: newEmail });
      setUpdateSuccess(true);
      setShowConfirmModal(false);
    } catch (err) {
      console.error("Failed to update email:", err);
    }
  };

  const isEmailValid = email.trim() && isValidEmail(email.trim()) && email.trim() !== user?.email;

  return (
    <>
      {updateSuccess && (
        <Alert
          type="success"
          message={`Email updated to ${newEmail}. Please use this email to log in from now on.`}
          closeable
        />
      )}

      <form onSubmit={handleEmailSubmit} className="profile-form">
        <div className="profile-field">
          <label className="profile-label">Username</label>
          <p className="profile-value">{user.username}</p>
          <small className="profile-help">Usernames cannot be changed</small>
        </div>

        <div>
          <TextInput
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          {emailError && (
            <p className="email-error">{emailError}</p>
          )}
        </div>

        <div className="profile-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !isEmailValid}
          >
            {loading ? "Updating..." : "Update Email"}
          </Button>
        </div>
      </form>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Email Update"
        size="small"
      >
        <div className="modal-content">
          <p>Are you sure you want to change your email to:</p>
          <p className="new-email"><strong>{newEmail}</strong></p>
          <p>Please verify this is correct before confirming.</p>
          
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmUpdate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Confirm"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ProfileInfo;
