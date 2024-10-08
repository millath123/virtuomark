import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();


app.use(cors({
    origin: 'https://virtuomark.vercel.app',
    credentials: true, // Allow credentials
  })); // Enable Cross-Origin Resource Sharing

  // Example in Express.js
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://virtuomark.vercel.app'); // Allow the specific frontend origin
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting middleware to prevent abuse

// Middleware to parse incoming JSON requests and handle cookies
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse and handle cookies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes for authentication and user-related functionality
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Start the server on the specified port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
