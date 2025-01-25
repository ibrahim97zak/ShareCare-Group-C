import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { config } from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from "url";
import path from "path";

const __dirname=path.resolve()


// Import routes
import authRoutes from './BackEnd/routes/authRoutes.js';
import userRoutes from './BackEnd/routes/userRoutes.js';
import donationRoutes from './BackEnd/routes/donationRoutes.js';
import notificationRoutes from './BackEnd/routes/notificationRoutes.js';


// Import error handler middleware
import {errorHandler} from './BackEnd/utils/errorHandler.js';

// connect to DB
import connectDB from './BackEnd/dbConfig/db.js';



// Load environment variables
config();

// Initialize express app
const app = express();

const server = http.createServer(app);
const io = new Server(server);

//initializeSocketIO(server);

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://sharecare-group-c.onrender.com"], // Frontend origins
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"], // Allowed headers
  })
);
app.use(express.json()); // to parse the incoming requests with JSON payloads(from req.body)
app.use(cookieParser())//to handle cookies and be able to access them

//connectDB();


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// middlewares
app.use(errorHandler);
// Serve static files from the correct dist directory
const staticPath = path.join(__dirname, './FrontEnd/dist');


app.options("*", cors());


app.use(express.static(staticPath));

// Handle all unmatched routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(staticPath, 'index.html'), (err) => {
        if (err) {
            console.error('Error serving  index.html:', err); // Log any errors
            res.status(500).send(err);
        }
    });
});

// Socket.io connection handling

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`)
  console.log("hi",__dirname)
});

export {server, io};