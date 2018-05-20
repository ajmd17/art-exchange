import * as IPFS from 'ipfs';

export default {
  node: new IPFS(),

  upload(filename, buffer) {
    return new Promise((resolve, reject) => {
      this.node.files.add({
        path: filename,
        content: buffer
      }, (err, files) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(files);
      });
    });
  }
};