import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth/Auth.css';
import { ADMIN_PROFILE_API, ADMIN_USERS_API } from '../../constants';

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
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
    const fetchAdminProfile = async () => {
      const token = getTokenFromCookies();
      if (!token) {
        navigate('/login'); // Redirect to login if token is missing
        return;
      }
      try {
        const response = await fetch(ADMIN_PROFILE_API, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            handleLogout(); // If unauthorized, log out and redirect to login
          } else {
            throw new Error('Network response was not ok');
          }
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch admin profile', error);
      }
    };

    const fetchUsers = async () => {
      const token = getTokenFromCookies();
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await fetch(ADMIN_USERS_API, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            handleLogout();
          } else {
            throw new Error('Network response was not ok');
          }
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchAdminProfile();
    fetchUsers();
  }, []);

  const handleLogout = () => {
    // Clear the token from cookies
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>; // Show loading message or spinner while data is being fetched
  }

  return (
    <div className="auth-container">
      <div className="auth-container-inner">
        <h2>Admin Profile</h2>
        <p>Name: {user.name || 'N/A'}</p>
        <p>Role: {user.role || 'N/A'}</p>
        <h3>Users List:</h3>
        <ul>
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user._id}>{user.name} - {user.email}</li>
            ))
          ) : (
            <li>No users found.</li>
          )}
        </ul>
        <button onClick={handleLogout} className="btn btn-primary">
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
