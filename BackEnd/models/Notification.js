import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['match', 'alert', 'message'],
    required: true 
  },
  content: { 
    type: String 
  },
  isRead: { 
    type: Boolean, 
    default: false
  },
},
  {
    timestamps: true
  });

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
