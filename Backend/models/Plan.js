import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  purpose: { type: String, required: true },
  amount: { type: Number, required: true },
  budget: { type: Number, required: true },
  deadline: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Plan', planSchema);
