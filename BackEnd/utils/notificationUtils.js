import { Server } from 'socket.io';
import nodemailer from 'nodemailer';

let io;

export const initializeSocketIO = (server) => {
  // Initialize Socket.IO with the server
   io = new Server(server);

  // Setup socket.io connection event
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle event when a new notification is sent
    socket.on('newNotification', (notification) => {
      // Emit the notification to all connected clients
      io.emit('receiveNotification', notification);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Return the io instance if needed elsewhere
  return io;
};


// Set up nodemailer transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send in-app notification
export const sendInAppNotification = (userId, message) => {
    if (io) {
      io.to(userId).emit('notification', { userId, message });
      console.log(`In-app notification sent to user ${userId}: ${message}`);
    } else {
      console.error('Socket.IO not initialized');
    }
  };

// Send email notification
export const sendEmailNotification = async (email, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"ShareCare" <noreply@sharecare.com>',
      to: email,
      subject: subject,
      text: text
    });
    console.log(`Email notification sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Generic function to send both in-app and email notifications
export const sendNotification = async (userId, email, subject, message) => {
  sendInAppNotification(userId, message);
  await sendEmailNotification(email, subject, message);
};


export const notifyConfrimEmail = async (userId) => {
  const message = 'Please confirm your email address.';
   sendInAppNotification(userId, message);
}
// Specific notification functions (Donations)
export const notifyDonationMatch = async (userId, email, donationType) => {
  const subject = 'Donation Match Found';
  const message = `A match has been found for your ${donationType} donation request!`;
  await sendNotification(userId, email, subject, message);
};

export const notifyDonationFulfilled = async (userId,donationType) => {
  const subject = 'Donation Fulfilled';
  const message = `Your ${donationType} donation has been fulfilled successfully!`;
  sendInAppNotification(userId, message);
};

export const notifyDonationUpdated = async (userId, donationType) => {
  const subject = 'Donation Updated';
  const message = `Your ${donationType} donation has been updated successfully!`;
  sendInAppNotification(userId, message);
    
}

export const notifyDonationDeleted = async (userId, donationType) => {
  const subject = 'Donation Deleted';
  const message = `Your ${donationType} donation has been deleted successfully!`;
  sendInAppNotification(userId, message);
}

// Specific notification functions (Offers)
export const notifyNewOffer = async (userId) => {
  const subject = 'New Offer';
  const message = 'You created a new offer succsessfully.';
  sendInAppNotification(userId, message);
}

export const notifyOfferUpdated = async (userId) => {
    const subject = 'Offer Updated';
    const message = 'Your offer has been updated.';
    sendInAppNotification(userId, message);
  }

export const notifyOfferDeleted = async (userId) => {
  const subject = 'Offer Deleted';
  const message = 'Your offer has been deleted.';
  sendInAppNotification(userId, message);
}
  // Specific notification functions (Requests)

export const notifyNewRequest = async (userId) => {
  const subject = 'New Request';
  const message = 'You created a new request succsessfully.';
  sendInAppNotification(userId, message);
}


export const notifyRequestUpdated = async (userId) => {
  const subject = 'Request Updated';
  const message = 'Your request has been updated.';
  sendInAppNotification(userId, message);
}

export const notifyRequestDeleted = async (userId) => {
  const subject = 'Request Deleted';
  const message = 'Your request has been deleted.';
  sendInAppNotification(userId, message);
}