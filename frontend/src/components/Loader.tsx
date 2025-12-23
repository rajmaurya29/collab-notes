import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  fullScreen = false,
  message 
}) => {
  const sizeClasses = {
    small: 'loader-small',
    medium: 'loader-medium',
    large: 'loader-large'
  };

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className={`loader ${sizeClasses[size]}`}>
          <div className="loader-spinner"></div>
        </div>
        {message && <p className="loader-message">{message}</p>}
      </div>
    );
  }

  return (
    <div className="loader-container">
      <div className={`loader ${sizeClasses[size]}`}>
        <div className="loader-spinner"></div>
      </div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;
