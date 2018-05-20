import axios from 'axios';

import auth from './auth';
import logger from './logger';

const client = {
  auth,
  logger,

  deposit: {
    create(data) {
      return axios.post('/api/deposits', data).then(({ data }) => data);
    },

    get(id) {
      return axios.get(`/api/deposits/${id}`).then(({ data }) => data);
    }
  },

  account: {
    register(data) {
      return axios.post('/api/register', data).then(({ data }) => data);
    }
  },

  assets: {
    getAll(by=null) {
      return axios.get(`/api/assets/all${by != null ? `?by=${encodeURIComponent(by)}` : ''}`).then(({ data }) => data);
    },

    uploadImages(formData) {
      return axios.post('/api/assets/uploadImages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': auth.accessToken
        }
      }).then(res => res.data);
    }
  }
};

export default client;