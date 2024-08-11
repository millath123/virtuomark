import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth/Auth.css';

const UserProfile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-container-inner">
        <h2>User Profile</h2>
        <div className="form-group">
          <p><strong>Name:</strong> John Doe</p> {/* Replace with dynamic data */}
        </div>
        <div className="form-group">
          <p><strong>Role:</strong> User</p> {/* Replace with dynamic data */}
        </div>
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
