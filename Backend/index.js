import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import User from './models/User.js';
import Expense from './models/Expense.js';
import Plan from './models/Plan.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dinoTracker';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


  app.get('/', (req, res) => {
  res.json({ 
    message: 'DinoTracker API is running!', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Create user
app.post('/api/users', async (req, res) => {
  try {
    const { username, name, email, age } = req.body;
    const user = new User({ username, name, email, age });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { username, name, email, age } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, name, email, age },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete user and all related plans
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Delete all plans and expenses associated with this user's email
    await Plan.deleteMany({ userEmail: user.email });
    await Expense.deleteMany({ userEmail: user.email });
    res.json({ message: 'User and all related data deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { userEmail, name, amount, date } = req.body;
    if (!userEmail || !name || !amount || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const expense = new Expense({ userEmail, name, amount, date });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all expenses for a user
app.get('/api/expenses', async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ error: 'userEmail query required' });
    const expenses = await Expense.find({ userEmail });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit an expense by ID
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { name, amount, date } = req.body;
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { name, amount, date },
      { new: true }
    );
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an expense by ID
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new plan for a user (multiple allowed)
app.post('/api/plans', async (req, res) => {
  try {
    const { userEmail, purpose, amount, budget, deadline } = req.body;
    if (!userEmail || !purpose || !amount || !budget || !deadline) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const plan = new Plan({ userEmail, purpose, amount, budget, deadline });
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all plans for a user
app.get('/api/plans', async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ error: 'userEmail query required' });
    const plans = await Plan.find({ userEmail });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single plan by ID
app.get('/api/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a plan by ID
app.put('/api/plans/:id', async (req, res) => {
  try {
    const { purpose, amount, budget, deadline } = req.body;
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { purpose, amount, budget, deadline },
      { new: true }
    );
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a plan by ID
app.delete('/api/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
