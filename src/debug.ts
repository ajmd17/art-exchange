import * as util from 'util';
import * as assert from 'assert';
import * as objectAssign from 'object-assign';

import * as config from './config';

const debug = {
  log(...args) {
    console.log.apply(console, args);

    /*if (process.env.NODE_ENV === 'production') {
      slack.send({
        text: args.join('\n'),
        channel: config.SLACK_CHANNEL,
        username: 'Server Logger'
      });
    }*/
  },

  error(msg, err) {
    console.error(msg, err);

    /*if (process.env.NODE_ENV === 'production') {
      let obj = {
        text: `Oh noes! \`${msg}\``,
        channel: config.SLACK_CHANNEL,
        username: 'Server Logger',
        attachments: []
      };

      if (err) {
        obj.attachments = [
          {
            text: `${util.inspect(err)}`,
            color: '#cc0000'
          }
        ];
      }

      slack.send(obj);
    }*/
  },

  assert(cond, msg) {
    try {
      assert(cond, msg);
    } catch (err) {
      this.error(msg, err);
      throw err;
    }
  },

  logEvent: objectAssign(function (...args) {
    debug.log('*New event logged!*', ...args);
  }, {
    forUser(uid, ...args) {
      const { User } = require('../models/user');

      User.findById(uid, { email: 1 }).then(({ email }) => {
        debug.log(`*New event logged for user ${uid} (${email})*`, ...args);
      }).catch((err) => {
        debug.log(`*New event logged for user ${uid}*`, ...args);
      });
    },

    forOrganization(organization, ...args) {
      debug.log(`*New event logged for organization with id "${organization._id || organization}"*`, ...args);
    }
  })
};

export default debug;