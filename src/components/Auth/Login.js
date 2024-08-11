import React, { useState } from 'react';
import axios from 'axios';
import '../Auth/Auth.css';
import { LOGIN_URL } from '../../constants'; // Import the URL from constants file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(LOGIN_URL, { email, password });
      if (data.role === 'admin') {
        navigate('/admin-profile');
      } else {
        navigate('/user-profile');
      }
    } catch (error) {
      console.error('Login failed!', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-container-inner">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-container">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="floating-placeholder">Email</label>
            </div>
          </div>
          <div className="form-group">
            <div className="input-container">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="floating-placeholder">Password</label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
