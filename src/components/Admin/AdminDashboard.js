import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Auth/Auth.css';
import { useNavigate } from 'react-router-dom';
import { ADMIN_PROFILE_API, ADMIN_USERS_API } from '../constants'; // Import API URLs from constants

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const profileResponse = await axios.get(ADMIN_PROFILE_API, { withCredentials: true });
        setUser(profileResponse.data);
      } catch (error) {
        console.error('Failed to fetch admin profile', error);
        navigate('/login');
      }
    };

    const fetchUsers = async () => {
      try {
        const usersResponse = await axios.get(ADMIN_USERS_API, { withCredentials: true });
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchAdminProfile();
    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    // Implement logout logic
    navigate('/login');
  };

  if (!user) {
    return null; // or a loading spinner if you want
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
