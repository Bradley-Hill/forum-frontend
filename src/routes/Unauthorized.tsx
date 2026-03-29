import { useNavigate } from "react-router-dom";
import Button from "../components/Shared/Button";
import "./Unauthorized.scss";

function Unauthorized() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1 className="unauthorized-title">403 - Access Denied</h1>
        <p className="unauthorized-message">
          You don't have permission to access this page.
        </p>
        <p className="unauthorized-description">
          If you believe this is a mistake, please contact an administrator.
        </p>
        <Button onClick={handleGoHome} variant="primary">
          Go to Home
        </Button>
      </div>
    </div>
  );
}

export default Unauthorized;
