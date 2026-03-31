import { Link } from "react-router-dom";
import "./Unauthorized.scss";

function Unauthorized() {
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
        <Link to="/" className="btn btn--primary btn--medium">Go to Forum</Link>
      </div>
    </div>
  );
}

export default Unauthorized;
