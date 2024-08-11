import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_PROFILE_API } from '../../constants'; 
import '../Auth/Auth.css';

const UserProfile = () => {
  const [user, setUser] = useState({ name: '', role: '' });
  const navigate = useNavigate();

  // Helper function to get the token from cookies
  const getTokenFromCookies = () => {
    const name = 'token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = getTokenFromCookies();
      try {
        const response = await fetch(USER_PROFILE_API, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Set the token in Authorization header
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Allows sending cookies with the request
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    // Clear the token from cookies
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    
    // Optionally, you might want to call a logout API endpoint if you have one
    // await fetch('/api/logout', { method: 'POST', credentials: 'include' });

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-container-inner">
        <h2>User Profile</h2>
        <div className="form-group">
          <p><strong>Name:</strong> {user.user.name}</p>
        </div>
        <div className="form-group">
          <p><strong>Role:</strong> {user.user.role}</p>
        </div>
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
