import type { LoaderProps } from '../../types/components';
import React from 'react';
import './Loader.scss';

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  message,
  fullScreen = false,
  className = '',
}) => {
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
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;
