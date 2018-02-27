import { Deposit, DepositConfirmResult } from './models/deposit';

import debug from './debug';

export default {
  run() {
    return this.checkUnconfirmedDeposits();
  },

  checkUnconfirmedDeposits() {
    debug.log('Starting unconfirmed deposit schedules...');

    return Deposit.find({
      status: {
        $ne: DepositConfirmResult.FOUND_AND_CONFIRMED
      }
    }).then((deposits) => {
      return Promise.all(deposits.map((deposit) => {
        return (<any>deposit).setupMonitorSchedule();
      }));
    }).catch((err) => {
      debug.log('Error while starting unconfirmed deposit checker:', err);
    });
  }
}