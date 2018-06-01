import * as mongoose from 'mongoose';
import * as request from 'request-promise-native';
import * as schedule from 'node-schedule';
import * as Decimal from 'decimal';

import mailer from '../mailer';
import debug from '../debug';

const orderSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderType: {
    type: String,
    enum: ['bid', 'ask']
  },
  price: Number,
  amount: Number,
  filled: {
    type: Number,
    default: 0
  },
  executionType: {
    type: String,
    enum: ['market', 'limit']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

export {
  Order,
  orderSchema
};