import * as express from 'express';
import * as httpStatus from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as twilio from 'twilio';

import config from '../../config';
import debug from '../../debug';

import { User } from '../../models/user';
import { PhoneNumber } from '../../models/phone-number';
import { Deposit } from '../../models/deposit';

const twilioClient = new twilio(config.TWILIO_SID, config.TWILIO_AUTH_TOKEN);

const apiRouter = express.Router();

/*apiRouter.post('/smsVerification', (req, res) => {
  if (req.body.phoneNumber === undefined) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'phoneNumber unprovided'
    });
  }

  PhoneNumber.findOne({ phoneNumber: req.body.phoneNumber }).then((phoneNumber) => {
    if (phoneNumber == null) {
      phoneNumber = new PhoneNumber({
        phoneNumber
      })
    }
  })
});*/

apiRouter.get('/deposits/:id', (req, res) => {
  Deposit.findById(req.params.id)
  .select('coinSymbol depositAddress depositAmount status timestamp')
  .then((deposit) => {
    if (deposit == null) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    res.json({ deposit });
  }).catch((err) => {
    debug.error(`Failed to get deposit with id "${req.params.id}"`, err);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  });
});

apiRouter.post('/deposits', (req, res) => {
  if (req.body.emailAddress === undefined) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'emailAddress unprovided'
    });
  }

  if (req.body.depositAddress === undefined) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'depositAddress unprovided'
    });
  }

  if (req.body.depositAmount === undefined) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'depositAmount unprovided'
    });
  }

  if (req.body.coinSymbol === undefined) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'coinSymbol unprovided'
    });
  }

  if (req.body.partialSeed === undefined) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'partialSeed unprovided'
    });
  }

  new Deposit({
    emailAddress: req.body.emailAddress,
    depositAddress: req.body.depositAddress,
    depositAmount: req.body.depositAmount,
    coinSymbol: req.body.coinSymbol,
    partialSeed: req.body.partialSeed
  }).save().then((deposit) => {
    debug.logEvent('New deposit created:', JSON.stringify(deposit, null, ' '));

    // setup a schedule to monitor the deposit
    (<any>deposit).setupMonitorSchedule().then(() => {
      // next, send an email to the email address confirming, and set up a routine checker to check wallet deposits, etc.
      res.json({ deposit });
    }).catch((err) => {
      debug.error(`Failed to set up monitor schedule for deposit with id: "${deposit._id}": `, err);
      res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    });
  }).catch((err) => {
    debug.error('Failed to create deposit:', err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to create deposit.'
    });
  });
});

apiRouter.post('/login', (req, res) => {
  if (req.body.email === undefined) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'email unprovided'
    });
  }
  if (req.body.password === undefined) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'password unprovided'
    });
  }
  
  User.findOne({
    email: new RegExp('^' + req.body.email + '$', 'i')
  }).then((user) => {
    if (user == null) {
      return res.json({
        error: 'Not a registered account'
      });
    }

    bcrypt.compare(req.body.password, (<any>user).passwordHash, (err, success) => {
      if (err) {
        debug.error('Error comparing passwords:', err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          error: err.message
        });
      }
      
      if (!success) {
        return res.json({
          error: 'Password incorrect'
        });
      }

      user.update({ $set: { lastLoginDate: new Date } }).then(() => {
        const token = jwt.sign({
          uid: user._id,
          email: (<any>user).email
        }, config.JWT_TOKEN_SECRET);

        res.json({ user, token });
      }).catch(err => debug.error(`Failed to update lastLoginDate for user ${user._id}`, err));
    });
  }).catch((err) => {
    debug.error('Error finding user:', err);
    res.status(httpStatus.BAD_REQUEST).json({
      error: err.message
    });
  });
});

apiRouter.post('/register', (req, res) => {
  if (req.body.email === undefined) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'email unprovided'
    });
  }

  if (req.body.password === undefined) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'password unprovided'
    });
  }

  (<any>User).findByEmailAddress(req.body.email).then((user) => {
    if (user != null) {
      return res.status(httpStatus.CONFLICT).json({
        error: 'Email already registered'
      });
    }

    bcrypt.genSalt(10).then((salt) => {
      bcrypt.hash(req.body.password, salt).then((hash) => {
        new User({
          email: req.body.email,
          passwordHash: hash
        }).save().then((user) => {
          debug.log('New user registration!', JSON.stringify(user, null, ' '));
          res.sendStatus(httpStatus.OK);
        }).catch((err) => {
          debug.error('Error saving the user:', err);
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
          });
        });
      }).catch((err) => {
        debug.error('Error hashing password:', err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          error: err.message
        });
      });
    }).catch((err) => {
      debug.error('Error generating salt:', err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: err.message
      });
    });
  }).catch((err) => {
    debug.error('Error looking up user:', err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message
    });
  });
});

export default apiRouter;