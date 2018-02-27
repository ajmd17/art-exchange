import axios from 'axios';

import auth from './auth';

const client = {
  deposit: {
    create(data) {
      return axios.post('/api/deposits', data).then(({ data }) => data);
    },

    get(id) {
      return axios.get(`/api/deposits/${id}`).then(({ data }) => data);
    }
  },

  auth,

  account: {
    register(data) {
      return axios.post('/api/register', data).then(({ data }) => data);
    }
  }
};

export default client;