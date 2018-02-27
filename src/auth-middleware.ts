import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as httpStatus from 'http-status-codes';

import { User } from './models/user';
import config from './config';

function getToken(req) {
  return req.body.accessToken ||
    req.query.accessToken ||
    req.headers['x-access-token'] ||
    req.cookies.accessToken;
}

function authMiddleware(req, res, next) {
  const token = getToken(req);

  if (token) {
    jwt.verify(token, config.JWT_TOKEN_SECRET, (err, decoded) => {      
      if (err) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          error: 'Authentication failed.'
        });
      }

      User.findById(decoded.uid)
      .then((user) => {
        decoded.user = user;
        req.decoded = decoded;
        next();
      }).catch((err) => {
        console.error(`Failed to find user with id "${decoded.uid}"`, err);
        res.status(httpStatus.UNAUTHORIZED).json({
          error: `User not found with id "${decoded.uid}"`
        });
      });
    });
  } else {
    res.status(httpStatus.UNAUTHORIZED).json({ 
      error: 'No authentication token provided.'
    });
  }
}

(<any>authMiddleware).optional = function (req, res, next) {
  const token = getToken(req);

  if (token) {
    jwt.verify(token, config.JWT_TOKEN_SECRET, (err, decoded) => {      
      if (!err) {
        User.findById(decoded.uid)
        .then((user) => {
          decoded.user = user;
          req.decoded = decoded;
          next();
        }).catch((err) => {
          console.error(`Failed to find user with id "${decoded.uid}"`, err);

          req.decoded = {};
          next();
        });
      } else {
        req.decoded = {};
        next();
      }
    });
  } else {
    req.decoded = {};
    next();
  }
};

export default authMiddleware;