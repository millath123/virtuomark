import jwt from 'jsonwebtoken';

// Function to generate JWT with user ID and role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export default generateToken;