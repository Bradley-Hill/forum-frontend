import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Modal from "../components/Shared/Modal";
import Button from "../components/Shared/Button";
import Loader from "../components/Shared/Loader";
import ErrorMessage from "../components/Shared/ErrorMessage";
import "./Logout.scss";

function Logout() {
  const navigate = useNavigate();
  const { logout, error, user } = useAuth();
  const [isConfirmOpen, _setIsConfirmOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (user === null && !isLoggingOut) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, isLoggingOut, navigate]);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    setLocalError(null);
    try {
      await logout();
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Logout error:", err);
      setLocalError(err instanceof Error ? err.message : "Failed to logout");
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleRetry = async () => {
    setIsLoggingOut(true);
    setLocalError(null);
    try {
      await logout();
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Logout error:", err);
      setLocalError(err instanceof Error ? err.message : "Failed to logout");
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

  const displayError = localError || error;
  if (displayError) {
    return (
      <div className="logout-container">
        <ErrorMessage
          message="Failed to log out"
          details={displayError}
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
