import { Link } from "react-router-dom";
import Alert from "../components/Shared/Alert";
import "./NotFound.scss";

function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">Page Not Found</h1>
      <Alert
        type="error"
        message="The page you're looking for doesn't exist or has been moved."
        closeable={false}
      />
      <Link to="/" className="not-found__link">Back to Forum</Link>
    </div>
  );
}
export default NotFound;