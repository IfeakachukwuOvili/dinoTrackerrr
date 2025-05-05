import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: false }, // new field, not required for backward compatibility
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
