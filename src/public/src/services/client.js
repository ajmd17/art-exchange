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
    },

    fetchProfileData() {
      return axios.get('/api/profileData', {
        headers: {
          'x-access-token': auth.accessToken
        }
      }).then(res => res.data);
    },

    reloadProfileData() {
      const accessToken = auth.accessToken;
      
      if (accessToken) {
        return this.fetchProfileData().then((res) => {
          auth.state = auth.AuthState.SignedIn;
          console.log('res: ', res);
          auth.user.id = res.user._id;
          auth.user.name = res.user.name;
          auth.user.email = res.user.email;
          auth.user.balances = res.user.balances;
  
          //Client.events.getEmitter().emit(Client.events.UPDATE_NAV_AUTH, auth);
  
          return auth;
        }).catch(err => client.logger.error('Failed to load profile data.', err));
      } else {
        auth.state = auth.AuthState.NotSignedIn;
        auth.user.id = null;
        auth.user.name = null;
        auth.user.email = null;
        auth.user.balances = res.balances;
  
        //Client.events.getEmitter().emit(Client.events.UPDATE_NAV_AUTH, auth);
  
        return Promise.resolve(auth);
      }
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
    },

    getOrderBook(assetId, limit=10) {
      return axios.get(`/api/assets/${assetId}/orderBook?limit=${limit}`).then(res => res.data);
    }
  }
};

if (typeof window !== 'undefined') {
  window.client = client;
}

export default client;