import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_PROFILE_API } from '../constants'; // Import your API URL from constants
import '../Auth/Auth.css';

const UserProfile = () => {
  const [user, setUser] = useState({ name: '', role: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(USER_PROFILE_API, {
          method: 'GET',
          credentials: 'include', // Allows sending cookies with the request
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        navigate('/login');
      }
    };

    fetchUserProfile();
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
