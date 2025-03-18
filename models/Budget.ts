import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      'Housing',
      'Transportation',
      'Food',
      'Utilities',
      'Insurance',
      'Healthcare',
      'Entertainment',
      'Shopping',
      'Education',
      'Other'
    ]
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Budget || mongoose.model('Budget', budgetSchema);