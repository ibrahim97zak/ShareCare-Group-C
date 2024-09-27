import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    await connect('mongodb+srv://sahem:2024@sahem.uhod4.mongodb.net/');
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); 
  }
};

export default connectDB;