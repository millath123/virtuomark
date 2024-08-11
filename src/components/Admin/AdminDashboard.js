import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Auth/Auth.css';
import { useNavigate } from 'react-router-dom';

const AdminProfile = ({ user }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      // Redirect to login if user is not available or not admin
      navigate('/login');
    } else {
      const fetchUsers = async () => {
        try {
          const response = await axios.get('/api/admin/users');
          setUsers(response.data);
        } catch (error) {
          console.error('Failed to fetch users', error);
        }
      };

      fetchUsers();
    }
  }, [user, navigate]);

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
