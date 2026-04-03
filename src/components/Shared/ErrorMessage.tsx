import type { ErrorMessageProps } from "../../types/sharedComponents";
import { useState } from "react";
import { MdError, MdExpandMore, MdExpandLess, MdRefresh } from "react-icons/md";
import "./ErrorMessage.scss";

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  code,
  message,
  details,
  onRetry,
  showDetails: initialShowDetails = false,
  className = "",
}) => {
  const [showDetails, setShowDetails] = useState(initialShowDetails);

  const classes = ["error-message", className].filter(Boolean).join(" ");

  const isTimeout = code === "GATEWAY_TIMEOUT";

  return (
    <div className={classes} role="alert" aria-atomic="true">
      <div className="error-message-header">
        <MdError className="error-message-icon" />
        <div className="error-message-content">
          <h3 className="error-message-title">{message}</h3>
          {code && (
            <p className="error-message-code">
              Error code: <code>{code}</code>
            </p>
          )}
        </div>
      </div>

      {details && (
        <div className="error-message-details-section">
          <button
            className="error-message-toggle"
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
            aria-controls="error-details"
            type="button"
          >
            {showDetails ? <MdExpandLess /> : <MdExpandMore />}
            <span>{showDetails ? "Hide" : "Show"} details</span>
          </button>

          {showDetails && (
            <div id="error-details" className="error-message-details">
              {details}
            </div>
          )}
        </div>
      )}

      <div className="error-message-actions">
        {isTimeout ? (
          <button
            className="error-message-refresh"
            onClick={() => window.location.reload()}
            type="button"
          >
            <MdRefresh className="error-message-refresh-icon" />
            Refresh Page
          </button>
        ) : (
          onRetry && (
            <button
              className="error-message-retry"
              onClick={onRetry}
              type="button"
            >
              Try again
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
