const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String 
  },
  emailSent: { 
    type: Boolean, 
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
