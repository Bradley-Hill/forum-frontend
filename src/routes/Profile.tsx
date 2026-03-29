import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import TextInput from "../components/Shared/TextInput";
import Button from "../components/Shared/Button";
import Alert from "../components/Shared/Alert";
import ErrorMessage from "../components/Shared/ErrorMessage";
import "./Profile.scss";

function Profile() {
  const { user, error, loading, updateUser, deleteUser } = useAuth();
  const [email, setEmail] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess(false);

    if (!email.trim() || email === user?.email) {
      return;
    }

    try {
      await updateUser({ email: email.trim() });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update email:", err);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        await deleteUser();
      } catch (err) {
        console.error("Failed to delete account:", err);
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p className="profile-username">@{user.username}</p>
      </div>

      {updateSuccess && (
        <Alert
          type="success"
          message="Update successful!"
          closeable
          autoDismiss
          autoDismissTime={3000}
        />
      )}

      {error && (
        <ErrorMessage
          message="Update failed"
          details={error}
          onRetry={() => {}}
        />
      )}

      <div className="profile-section">
        <h2>Account Information</h2>
        <form onSubmit={handleEmailChange} className="profile-form">
          <div className="profile-field">
            <label className="profile-label">Username</label>
            <p className="profile-value">{user.username}</p>
            <small className="profile-help">Usernames cannot be changed</small>
          </div>

          <div className="profile-field">
            <label className="profile-label">Role</label>
            <p className="profile-value">{user.role}</p>
          </div>

          <TextInput
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="profile-actions">
            <Button
              type="submit"
              variant="primary"
              disabled={loading || email === user.email}
            >
              {loading ? "Updating..." : "Update Email"}
            </Button>
          </div>
        </form>
      </div>

      <div className="profile-section profile-danger">
        <h2>Danger Zone</h2>
        <div className="profile-danger-item">
          <div className="profile-danger-info">
            <h3>Delete Account</h3>
            <p>Permanently delete your account and all associated data. This cannot be undone.</p>
          </div>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
