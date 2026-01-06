import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Logo = () => {
  return (
    <Link to="/" className="logo">
      <div className="logo-icon">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="url(#logoGradient)"/>
          <path d="M20 12L15 18H20V28L25 22H20V12Z" fill="white"/>
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981"/>
              <stop offset="1" stopColor="#34d399"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="logo-text">FreelanceHub</span>
    </Link>
  );
};

export default Logo;

