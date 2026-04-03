import { useAuth } from "../../hooks/useAuth";
import type { UserStatusProps } from "../../types/featureComponents";
import "./UserStatus.scss";

const UserStatus: React.FC<UserStatusProps> = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="user-status">
      <div className="user-status-avatar">
        {user.username.charAt(0).toUpperCase()}
      </div>
      <span className="user-status-username">{user.username}</span>
      <span className="user-status-badge online" title="Online">
        •
      </span>
    </div>
  );
};

export default UserStatus;
