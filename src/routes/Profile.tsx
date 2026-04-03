import { useAuth } from "../hooks/useAuth";
import React from "react";
import ProfileInfo from "../components/Profile/ProfileInfo";
import ProfileDanger from "../components/Profile/ProfileDanger";
import AvatarUpload from "../components/Shared/AvatarUpload";
import ErrorMessage from "../components/Shared/ErrorMessage";
import Alert from "../components/Shared/Alert";
import "./Profile.scss";

function Profile() {
  const { user, error, loading, updateUser, deleteUser } = useAuth();
  const [avatarSuccess, setAvatarSuccess] = React.useState(false);
  const [avatarError, setAvatarError] = React.useState<string | null>(null);

  if (!user) {
    return null;
  }

  const handleUpdateUser = async (data: { email: string }) => {
    try {
      await updateUser(data);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser();
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  const handleAvatarSuccess = () => {
    setAvatarSuccess(true);
    setAvatarError(null);
    setTimeout(() => setAvatarSuccess(false), 3000);
  };

  const handleAvatarError = (errorMsg: string) => {
    setAvatarError(errorMsg);
    setTimeout(() => setAvatarError(null), 5000);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p className="profile-username">@{user.username}</p>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => {}}
        />
      )}

      {avatarSuccess && (
        <Alert type="success" message="Avatar uploaded successfully!" />
      )}

      {avatarError && (
        <Alert type="error" message={avatarError} />
      )}

      <div className="profile-section">
        <h2>Profile Picture</h2>
        <AvatarUpload
          currentAvatarUrl={user.avatar_url}
          onSuccess={handleAvatarSuccess}
          onError={handleAvatarError}
        />
      </div>

      <div className="profile-section">
        <h2>Account Information</h2>
        <ProfileInfo user={user} loading={loading} onUpdate={handleUpdateUser} />
      </div>

      <div className="profile-section profile-danger-section">
        <h2>Danger Zone</h2>
        <ProfileDanger loading={loading} onDelete={handleDeleteAccount} />
      </div>
    </div>
  );
}

export default Profile;
