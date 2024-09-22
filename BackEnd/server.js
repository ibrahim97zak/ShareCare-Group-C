import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Import error handler middleware
import errorHandler from './middlewares/errorHandler.js';

// Load environment variables
config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;