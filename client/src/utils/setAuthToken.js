import api from './api';

const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
    sessionStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['x-auth-token'];
    sessionStorage.removeItem('token');
  }
};

export default setAuthToken;
