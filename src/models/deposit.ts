import * as mongoose from 'mongoose';
import * as request from 'request-promise-native';
import * as schedule from 'node-schedule';
import * as Decimal from 'decimal';

import mailer from '../mailer';
import debug from '../debug';

import cardGenerator from '../card-generator';

const depositSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: true
  },
  depositAddress: {
    type: String,
    required: true,
  },
  coinSymbol: {
    type: String,
    required: true
  },
  depositAmount: {
    type: String, // will be used as a decimal num later
    required: true
  },
  partialSeed: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'NO_STATUS'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },

  processingEmailSent: {
    type: Boolean,
    default: false
  },
  insufficientFundsEmailSent: {
    type: Boolean,
    default: false
  },
  noFundsReceivedEmailSent: {
    type: Boolean,
    default: false
  }
});

const DepositConfirmResult = {
  NO_STATUS: 'NO_STATUS',
  FOUND_BUT_NOT_CONFIRMED: 'FOUND_BUT_NOT_CONFIRMED',
  FOUND_AND_CONFIRMED: 'FOUND_AND_CONFIRMED',
  INSUFFICIENT: 'INSUFFICIENT',
  NO_FUNDS_RECEIVED: 'NO_FUNDS_RECEIVED'
};

depositSchema.methods.checkConfirmed = function () {
  const fetchers = {
    btc: () => { // TODO: Fallback sources
      // blockcypher
      const blockcypher = () => {
        return request.get(`https://api.blockcypher.com/v1/btc/main/addrs/${this.depositAddress}/balance`).then((value) => {
          const obj = JSON.parse(value);

          const amt = Decimal(this.depositAmount);

          if (obj['balance'] >= amt) {
            return DepositConfirmResult.FOUND_AND_CONFIRMED;
          } else if (obj['final_balance'] >= amt) {
            return DepositConfirmResult.FOUND_BUT_NOT_CONFIRMED;
          }

          return obj['final_balance'] == 0
            ? DepositConfirmResult.NO_FUNDS_RECEIVED
            : DepositConfirmResult.INSUFFICIENT;
        });
      };

      // blockexplorer.com
      const blockexplorer = () => {
        return request.get(`https://blockexplorer.com/api/addr/${this.depositAddress}/balance`).then((value) => {
          const balance = Decimal(value) * 100000000;

          const requiredAmt = Decimal(this.depositAmount);

          if (balance >= requiredAmt) {
            return DepositConfirmResult.FOUND_AND_CONFIRMED;
          } else {
            return request.get(`https://blockexplorer.com/api/addr/${this.depositAddress}/unconfirmedBalance`).then((value) => {
              const unconfirmedBalance = Decimal(value) * 100000000;  

              if (unconfirmedBalance >= requiredAmt) {
                return DepositConfirmResult.FOUND_BUT_NOT_CONFIRMED;
              }

              return balance == 0
                ? DepositConfirmResult.NO_FUNDS_RECEIVED
                : DepositConfirmResult.INSUFFICIENT;
            });
          }
        });
      };

      return blockexplorer().catch(() => {
        debug.log('blockexplorer.com error, falling back to blockcypher...');
        return blockcypher();
      });
    }
  };

  const fetcher = fetchers[this.coinSymbol.toLowerCase()];

  if (!fetcher) {
    return Promise.reject(Error('No fetcher for coin with symbol ' + this.coinSymbol));
  }

  return fetcher();
};

depositSchema.methods.setupMonitorSchedule = function () {
  const checkAndHandle = () => {
    return this.checkConfirmed().then((result) => {
      this.status = DepositConfirmResult.FOUND_AND_CONFIRMED;
      this.save();
      return true;

      this.status = result;

      switch (result) {
        case DepositConfirmResult.FOUND_AND_CONFIRMED:
          mailer.send(this.emailAddress, 'Deposit Confirmed', 'Deposit confirmed');
          this.save();
          return true;
        case DepositConfirmResult.FOUND_BUT_NOT_CONFIRMED:
          if (!this.processingEmailSent) {
            mailer.send(this.emailAddress, 'Deposit Processing', 'Deposit is being processed');
            this.processingEmailSent = true;
          }
          break;
        case DepositConfirmResult.INSUFFICIENT:
          if (!this.insufficientFundsEmailSent) {
            mailer.send(this.emailAddress, 'Deposit Incomplete', 'Not enough funds');
            this.insufficientFundsEmailSent = true;
          }
          break;
        case DepositConfirmResult.NO_FUNDS_RECEIVED:
          if (!this.noFundsReceivedEmailSent && Date.now() - this.timestamp > 1000 * 60 * 60 * 24) {
            mailer.send(this.emailAddress, 'Deposit Incomplete', 'No funds have been sent yet');
            this.noFundsReceivedEmailSent = true;
          }
          break;
        default:
          throw Error(`Unimplemented deposit confirm result type: ${result}`);
      }

      this.save();

      return false;
    }).catch((err) => {
      debug.error(`Failed to check if deposit ${this._id} confirmed (symbol: ${this.coinSymbol}, address: ${this.depositAddress}): `, err);
      return false;
    });
  };

  return checkAndHandle().then((isCompleted) => {
    if (isCompleted) {
      // TODO: Send email that it has been confirmed.
      // generate the card HTML
      return cardGenerator.generate(this).then(() => {
        return Promise.resolve();
      }).catch((err) => {
        debug.error(`Failed to generate card html for deposit with id: "${this._id}"`, err);
        return Promise.reject(err);
      });
    } else {
      // TODO: Check if it has been greater than a week and still unconfirmed; send an email to the user and cancel.
      // set up monitor schedule
      const nextDate = new Date();
      nextDate.setMinutes(nextDate.getMinutes() + Math.floor(Math.random() * 6) + 2);

      schedule.scheduleJob(nextDate, () => {
        this.setupMonitorSchedule();
      });

      return Promise.resolve();
    }
  });
};

const Deposit = mongoose.model('Deposit', depositSchema);

export {
  Deposit,
  depositSchema,
  DepositConfirmResult
};