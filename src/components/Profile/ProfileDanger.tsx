import Button from "../Shared/Button";
import "./ProfileDanger.scss";

interface ProfileDangerProps {
  loading: boolean;
  onDelete: () => void;
}

function ProfileDanger({ loading, onDelete }: ProfileDangerProps) {
  return (
    <div className="profile-danger">
      <div className="profile-danger-item">
        <div className="profile-danger-info">
          <h3>Delete Account</h3>
          <p>
            Permanently delete your account and all associated data. This cannot
            be undone.
          </p>
        </div>
        <Button variant="danger" onClick={onDelete} disabled={loading}>
          Delete Account
        </Button>
      </div>
    </div>
  );
}

export default ProfileDanger;
