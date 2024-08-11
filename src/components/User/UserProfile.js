import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_PROFILE_API } from '../constants'; // Import your API URL from constants
import '../Auth/Auth.css';

const UserProfile = () => {
  const [user, setUser] = useState({ name: '', role: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(USER_PROFILE_API, { withCredentials: true }) // 'withCredentials' allows sending cookies with the request
      .then(response => {
        setUser(response.data);
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-container-inner">
        <h2>User Profile</h2>
        <div className="form-group">
          <p><strong>Name:</strong> {user.name}</p>
        </div>
        <div className="form-group">
          <p><strong>Role:</strong> {user.role}</p>
        </div>
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
