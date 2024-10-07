import mongoose from 'mongoose';
import singletonModel from './SingletonModel.js'; 

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

  const Notification = singletonModel('Notification', NotificationSchema);
  export default Notification;
