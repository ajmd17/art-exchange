export default {
  error(msg, err) {
    // @TODO send error to server
    console.error(msg, err);
  },

  log(msg) {
    console.log(msg);
  }
};