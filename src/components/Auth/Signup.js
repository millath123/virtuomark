import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { REGISTER_URL } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(REGISTER_URL, { name, email, password });
      alert('Signup successful!');
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-container-inner">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-container">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label className="floating-placeholder">Name</label>
            </div>
          </div>
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
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
