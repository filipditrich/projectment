import React from 'react';
import logo from '../assets/img/logo-projectment-text.png';

/**
 * Page Pre Loader Component
 * @author filipditrich
 */
export default () => {
  return (
      <div className="preloader">

          <div className="preloader-spinner" />

          <div className="preloader-text">
              <span>Loading components...</span>
          </div>

          <div className="preloader-logo">
              <img src={ logo } alt="ProjectMent Logo" />
          </div>
      </div>
  );
};
