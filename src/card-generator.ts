import * as ejs from 'ejs';
import * as path from 'path';
import * as qrcode from 'qrcode-npm';

import { Deposit } from './models/deposit';

export default {
  generate(deposit: any) {
    const generateIdQr = () => {
      const qr = qrcode.qrcode(4, 'L');
      qr.addData(String(deposit._id));
      qr.make();
      return qr.createImgTag(4);
    };

    const generatePartialSeedQr = () => {
      const qr = qrcode.qrcode(4, 'L');
      qr.addData(deposit.partialSeed);
      qr.make();
      return qr.createImgTag(4);
    };

    const generateFrontHtml = () => new Promise((resolve, reject) => {
      const data = {
        idQrImg: generateIdQr()
      };

      ejs.renderFile(path.join(__dirname, '../assets/templates/card-front.ejs'), data, (err, str) => {
        if (err) {
          reject(err);
        } else {
          resolve(str);
        }
      });
    });

    const generateBackHtml = () => new Promise((resolve, reject) => {
      const data = {
        partialSeedQrImg: generatePartialSeedQr()
      };

      ejs.renderFile(path.join(__dirname, '../assets/templates/card-back.ejs'), data, (err, str) => {
        if (err) {
          reject(err);
        } else {
          resolve(str);
        }
      });
    });

    // TODO: Save on S3?
    return Promise.all([generateFrontHtml(), generateBackHtml()]).then(([frontHtml, backHtml]) => {
      console.log("Front:", frontHtml);
      console.log("Back:", backHtml);
    });
  }
}