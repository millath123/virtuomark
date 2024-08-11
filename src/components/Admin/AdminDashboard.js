import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth/Auth.css';
import { ADMIN_PROFILE_API, ADMIN_USERS_API } from '../../constants'; // Import API URLs from constants
import { getTokenFromCookies } from '../../utils/cookieUtils'; // Optional: use a utility function to get the token

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = getTokenFromCookies();
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const [profileResponse, usersResponse] = await Promise.all([
          fetch(ADMIN_PROFILE_API, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(ADMIN_USERS_API, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        if (!profileResponse.ok || !usersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const profileData = await profileResponse.json();
        const usersData = await usersResponse.json();

        setUser(profileData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
        setError('Failed to load data. Please try again later.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []); // Empty array ensures this effect runs only once

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>; // You could replace this with a spinner component
  }

  if (error) {
    return <div>{error}</div>;
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
