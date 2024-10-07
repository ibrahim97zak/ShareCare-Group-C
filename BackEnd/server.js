// server.js

import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import { config } from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Import error handler middleware
import { errorHandler } from './utils/errorHandler.js';

// connect to DB
import connectDB from './dbConfig/db.js';


import { initializeSocketIO, sendInAppNotification } from './utils/notificationUtils.js';

// Load environment variables
config();

// Initialize express app
const app = express();

const server = http.createServer(app);
const io = new Server(server);

//initializeSocketIO(server);

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // Replace with your React app's URL
    credentials: true, // Allow cookies or authentication tokens to be sent
}));
  origin: "http://localhost:5173", // Replace with your React app's URL
  credentials: true, // Allow cookies or authentication tokens to be sent
}));

app.use(express.json()); // to parse the incoming requests with JSON payloads(from req.body)
app.use(cookieParser())//to handle cookies and be able to access them

try {
    connectDB();
} catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1); // Exit the process with a non-zero status code
}
//connectDB();


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// middlewares
app.use(errorHandler);



// Socket.io connection handling
io.on('connection', (socket) => {
    
    console.log('A user connected:', socket.id);

    // Handle event when a new notification is sent
    socket.on('newNotification', (notification) => {
        // Emit the notification to all connected clients
        sendInAppNotification(socket.id, notification);
      });
  
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
    console.log(`Server running on port ${PORT};
    `));

export {server, io};