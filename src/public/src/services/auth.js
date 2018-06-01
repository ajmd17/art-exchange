import axios from 'axios';
import Cookie from 'react-cookie';

const auth = {
  AuthState: {
    NotSignedIn: 0,
    SignedIn: 1
  },

  state: 0,
  user: {
    id: null,
    name: null,
    email: null,
    balances: {}
  },

  _accessToken: null,

  get isLoggedIn() {
    return this.accessToken != null;
  },

  logIn(email, password) {
    return axios.post('/api/login', { email, password }).then((res) => {
      this.accessToken = res.data.token;
      return res.data;
    });
  },

  logOut() {
    // delete cookie
    this.accessToken = null;
    return this.reloadProfileData();
  },

  get accessToken() {
    if (!auth._accessToken) {
      const accessToken = Cookie.load('accessToken');

      if (accessToken) {
        auth._accessToken = accessToken;
      }
    }

    return auth._accessToken;
  },

  set accessToken(accessToken) {
    console.log(Cookie)
    if (!accessToken) {
      Cookie.remove('accessToken', {
        path: '/'
      });
    } else {
      let expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // 1 week
      Cookie.save('accessToken', accessToken, {
        path: '/',
        expires: expiryDate
      });
    }
    
    auth._accessToken = accessToken;
  }
};

export default auth;