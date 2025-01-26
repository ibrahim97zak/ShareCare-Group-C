import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { config } from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import path from "path";

// Load environment variables
config();

// connect to DB
import connectDB from './BackEnd/dbConfig/db.js';

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://sharecare-group-c.onrender.com"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files
const staticPath = path.join(path.dirname(import.meta.url), './FrontEnd/dist');
app.use(express.static(staticPath));

// Import routes
import authRoutes from './BackEnd/routes/authRoutes.js';
import userRoutes from './BackEnd/routes/userRoutes.js';
import donationRoutes from './BackEnd/routes/donationRoutes.js';
import notificationRoutes from './BackEnd/routes/notificationRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Centralized error handling middleware
import { errorHandler } from './BackEnd/utils/errorHandler.js';
app.use(errorHandler);

// Handle unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(staticPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send(err);
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

// Export server and socket.io instance
export { server, io };
