import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Modal from "../components/Shared/Modal";
import Button from "../components/Shared/Button";
import Loader from "../components/Shared/Loader";
import ErrorMessage from "../components/Shared/ErrorMessage";
import "./Logout.scss";

function Logout() {
  const navigate = useNavigate();
  const { logout, error } = useAuth();
  const [isConfirmOpen, _setIsConfirmOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Logout error:", err);
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleRetry = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Logout error:", err);
      setIsLoggingOut(false);
    }
  };

  if (isLoggingOut) {
    return (
      <div className="logout-container">
        <Loader />
        <p className="logout-message">Logging out...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="logout-container">
        <ErrorMessage
          message="Failed to log out"
          details={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={isConfirmOpen}
      onClose={handleCancel}
      title="Confirm Logout"
      size="small"
    >
      <div className="logout-confirm">
        <p className="logout-confirm-message">
          Are you sure you want to log out?
        </p>
        <div className="logout-confirm-actions">
          <Button onClick={handleCancel} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} variant="danger">
            Log Out
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default Logout;
