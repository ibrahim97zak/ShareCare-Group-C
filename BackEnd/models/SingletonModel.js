import mongoose from 'mongoose';

// Singleton utility function to ensure only one instance of a model
const singletonModel = (modelName, schema) => {
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }
  return mongoose.model(modelName, schema);
};

export default singletonModel;
