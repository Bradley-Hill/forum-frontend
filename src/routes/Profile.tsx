import { useAuth } from "../hooks/useAuth";
import ProfileInfo from "../components/Profile/ProfileInfo";
import ProfileDanger from "../components/Profile/ProfileDanger";
import ErrorMessage from "../components/Shared/ErrorMessage";
import "./Profile.scss";

function Profile() {
  const { user, error, loading, updateUser, deleteUser } = useAuth();

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
