import * as mongoose from 'mongoose';

import { Deposit, depositSchema } from './deposit';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  depositHistory: [depositSchema],

  // TODO: 2FA, GMC addresses

  walletAddresses: {
    type: [String],
    default: []
  },

  balances: mongoose.Schema.Types.Mixed
});

userSchema.methods.getPendingDeposits = function () {
  return this.populate('depositHistory').execPopulate().then((user) => {
    return user.depositHistory.filter((deposit) => !deposit.isCompleted);
  });
};

userSchema.statics.findByEmailAddress = function (emailAddress) {
  return User.findOne({
    email: new RegExp('^' + emailAddress + '$', 'i'),
    isTemporary: false
  });
};

const User = mongoose.model('User', userSchema);

export { User, userSchema };