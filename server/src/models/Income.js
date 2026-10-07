import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required for income entry'],
      index: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client is required for income entry'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    paymentDate: {
      type: Date,
      default: Date.now,
      required: [true, 'Payment date is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Paid',
    },
    paymentMethod: {
      type: String,
      enum: [
        'Bank Transfer',
        'Stripe',
        'PayPal',
        'Credit Card',
        'Crypto',
        'Cash',
        'Other',
      ],
      default: 'Bank Transfer',
    },
    invoiceNumber: {
      type: String,
      trim: true,
      default: function () {
        return `INV-${Date.now().toString().slice(-6)}`;
      },
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

incomeSchema.index({ userId: 1, paymentDate: -1 });
incomeSchema.index({ userId: 1, paymentStatus: 1 });

const Income = mongoose.model('Income', incomeSchema);

export default Income;
