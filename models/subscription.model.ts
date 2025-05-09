import { Schema, model, models } from 'mongoose';

const SubscriptionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true,
    enum: ['monthly', 'yearly'],
  },
  type: {
    type: String,
    required: true,
    enum: ['cv', 'cover-letter', 'both'],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'expired', 'cancelled'],
  },
  paymentReference: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const Subscription = models.Subscription || model('Subscription', SubscriptionSchema);

export default Subscription; 