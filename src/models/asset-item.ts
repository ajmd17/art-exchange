import * as mongoose from 'mongoose';
import * as request from 'request-promise-native';
import * as schedule from 'node-schedule';
import * as Decimal from 'decimal';

import mailer from '../mailer';
import debug from '../debug';

import { Order } from './order';

// @TODO: store images on IPFS, or use S3 for now...
// 
// this will soon be moved into the blockchain,
// right now it is centralized.
const assetItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  // order book
  bids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  asks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],

  // Everything below should be held in the ethereum smart contract.

  totalSupply: Number,
  images: [{
    ipfsHash: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    }
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountBalances: [{
    walletAddress: String,
    amount: Number
  }], // LOL DECENTRALIZED AF
});

const AssetItem = mongoose.model('AssetItem', assetItemSchema);

export {
  AssetItem,
  assetItemSchema
};