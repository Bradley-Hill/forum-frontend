import type { LoaderProps } from '../../types/components';
import React, { use } from 'react';
import './Loader.scss';
import { useAuth } from '../../hooks/useAuth';

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  message,
  fullScreen = false,
  className = '',
}) => {
  const {loadingMessage} = useAuth();
  const wrapperClasses = [
    'loader-wrapper',
    fullScreen ? 'loader-wrapper--full-screen' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const spinnerClasses = ['loader-spinner', `loader-spinner--${size}`]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={wrapperClasses}
      role="progressbar"
      aria-busy="true"
      aria-label={message || 'Loading'}
    >
      <div className={spinnerClasses}>
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
      </div>
      <p className="loader-message">{message || loadingMessage}</p>
    </div>
  );
};

export default Loader;
