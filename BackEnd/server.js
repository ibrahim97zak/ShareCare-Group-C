import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import { config } from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
//import notificationRoutes from './routes/notificationRoutes.js';

// Import error handler middleware
import authMiddleware from './middlewares/authMiddleware.js';
import {errorHandler} from './middlewares/errorHandler.js';

// connect to DB
import connectDB from './dbConfig/db.js';

// Load environment variables
config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // Replace with your React app's URL
    credentials: true, // Allow cookies or authentication tokens to be sent
  }));

app.use(express.json()); // to parse the incoming requests with JSON payloads(from req.body)
app.use(cookieParser())//to handle cookies and be able to access them


connectDB();


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/requests', requestRoutes);
// app.use('/api/notifications', notificationRoutes);

// middlewares
app.use(errorHandler);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT};
    `));

export default app;