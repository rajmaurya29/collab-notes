import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="logo">
      <svg 
        className="logo-icon" 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect 
          x="4" 
          y="4" 
          width="24" 
          height="24" 
          rx="4" 
          fill="currentColor"
        />
        <path 
          d="M10 12h12M10 16h12M10 20h8" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </svg>
      <span className="logo-text">Collab-Notes</span>
    </div>
  );
};

export default Logo;
