import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import http from 'http';
import { Server} from 'socket.io';
import mongoose from 'mongoose';



// Import routes
import authRoutes from './routes/authRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Import error handler middleware
import authMiddleware from './middlewares/authMiddleware.js';
import errorHandler from './middlewares/errorHandler.js';

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
app.use(cors());
app.use(bodyParser.json());

//connectDB();


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/notifications', notificationRoutes);

// middlewares
app.use(authMiddleware);
app.use(errorHandler);

connectDB();

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