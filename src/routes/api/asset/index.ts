import * as express from 'express';
import * as httpStatus from 'http-status-codes';
import * as path from 'path';
import * as fs from 'fs';

import * as multer from 'multer';

import debug from '../../../debug';
import ipfs from '../../../services/ipfs';

import authMiddleware from '../../../auth-middleware';

import { User } from '../../../models/user';
import { AssetItem } from '../../../models/asset-item';

const UPLOADS_PATH = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_PATH)) {
  fs.mkdirSync(UPLOADS_PATH);
}

const upload = multer({
  storage: multer.memoryStorage() // @TODO: do something about this so large files don't kill the app.
});

const assetRouter = express.Router();

// @TODO a way to block attacks via timeouts.
// @TODO "I am not a robot"
assetRouter.post('/uploadImages', upload.any(), (req, res) => {
  Promise.all(req.files.map((file, index) => {
    // upload each file to IPFS
    return ipfs.upload(file.originalname, file.buffer);
  })).then((ipfsObjects) => {
    let imageObjects = [];

    ipfsObjects.forEach((el) => {
      el.forEach((imageObject) => {
        imageObjects.push(imageObject);
      });
    });

    res.json({ images: imageObjects });
  }).catch((err) => {
    debug.error('Failed to upload images:', err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Images could not be uploaded'
    });
  });
});

assetRouter.get('/all', (req, res) => {
  // @TODO decentralize on ethereum
  try {
    let queryObj = AssetItem.find({});

    if (req.query.by) {
      switch (req.query.by) {
        case 'volume':
          queryObj = queryObj.sort({ volume: 1 }); 
          break;
        default:
          throw Error('Unknown "by" query type');
      }
    }

    // @TODO pagination
    // @TODO populate name
    queryObj.populate('creator', 'email').then((assets) => {
      res.json(assets);
    }).catch((err) => {
      debug.error('Failed to load query objects', err);
      res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    });
  } catch (err) {
    debug.error('Failed to query for active assets', err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message
    });
  }
});

// @TODO: think about allowing descriptions to be edit-able,
// by holding the description+metadata in the actual db,
// and the Ethereum smart contract just holds a hash to this object

assetRouter.post('/', authMiddleware, (req, res) => {
  if (req.body.title === undefined) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'title unprovided'
    });
  }

  if (req.body.description === undefined) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'title unprovided'
    });
  }

  if (req.body.totalSupply === undefined) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'totalSupply unprovided'
    });
  }

  if (typeof req.body.totalSupply !== 'number' || isNaN(req.body.totalSupply)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'totalSupply should be a number'
    });
  }

  // @TODO upload to ethereum blockchain smart contract

  // upload metadata object to IPFS
  console.log('req.decoded = ', (<any>req).decoded);

  new AssetItem({
    title: req.body.title,
    description: req.body.description,
    creator: (<any>req).decoded.uid,
    totalSupply: req.body.totalSupply
  }).save().then((assetItem) => {
    res.json({ assetItem });
  }).catch((err) => {
    debug.error('Failed to save asset item', err);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  });
});

export default assetRouter;