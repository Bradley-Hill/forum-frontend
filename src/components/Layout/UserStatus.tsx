import { useAuth } from "../../hooks/useAuth";
import { MdAccountCircle, MdCheckCircle } from "react-icons/md";
import "./UserStatus.scss";

const UserStatus: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="user-status">
      <div className="user-status-avatar">
        <MdAccountCircle className="user-status-icon" />
      </div>
      <div className="user-status-info">
        <div className="user-status-username">{user.username}</div>
        <div className="user-status-badge">
          <MdCheckCircle className="user-status-badge-icon" />
          <span>Online</span>
        </div>
      </div>
    </div>
  );
};

export default UserStatus;
