import type { AlertProps } from '../../types/sharedComponents';
import { useState, useEffect } from 'react';
import { MdClose, MdCheckCircle, MdError, MdWarning, MdInfo } from 'react-icons/md';
import './Alert.scss';

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  message,
  onClose,
  closeable = true,
  autoDismiss = false,
  autoDismissTime = 5000,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoDismissTime);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, autoDismissTime, isVisible, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) {
    return null;
  }

  const alertClasses = ['alert', `alert--${type}`, className]
    .filter(Boolean)
    .join(' ');

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <MdCheckCircle className="alert-icon" />;
      case 'error':
        return <MdError className="alert-icon" />;
      case 'warning':
        return <MdWarning className="alert-icon" />;
      case 'info':
      default:
        return <MdInfo className="alert-icon" />;
    }
  };

  const getRole = () => {
    return type === 'error' ? 'alert' : 'status';
  };

  return (
    <div
      className={alertClasses}
      role={getRole()}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {getIcon()}
      <span className="alert-message">{message}</span>
      {closeable && (
        <button
          className="alert-close"
          onClick={handleClose}
          aria-label="Close alert"
          type="button"
        >
          <MdClose />
        </button>
      )}
    </div>
  );
};

export default Alert;
