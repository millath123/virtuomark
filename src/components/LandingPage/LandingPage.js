import React from 'react';
import { Link } from 'react-router-dom';
import '../LandingPage/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="header">
        <h1>Welcome to VirtuoMark</h1>
        <p>Unlock your potential with expert-led digital marketing courses. Shape your future, one click at a time.</p>
      </header>
      <div className="cta-buttons">
        <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        <Link to="/login" className="btn btn-secondary">Login</Link>
      </div>
    </div>
  );
};

export default LandingPage;
