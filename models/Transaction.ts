import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);