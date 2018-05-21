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
    get(id) {
      return axios.get(`/api/assets/${id}`).then(({ data }) => data);
    },

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
    },

    getImage(imageHash) {
      return axios.get(`/api/assets/images/${imageHash}`).then(res => res.data);
    },

    submit(data) {
      return axios.post('/api/assets', data, {
        headers: {
          'x-access-token': auth.accessToken
        }
      }).then(res => res.data);
    }
  }
};

if (typeof window !== 'undefined') {
  window.client = client;
}

export default client;