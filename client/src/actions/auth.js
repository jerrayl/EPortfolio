import api from '../utils/api';
import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  SIGN_IN,
  SIGN_OUT,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get('/auth');
    dispatch({
      type: USER_LOADED,
      //payload is user data including email, googleId, name
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//google sign in
export const signIn = (idToken) => async (dispatch) => {
  try {

    api.defaults.headers.common['x-auth-token'] = idToken;
    sessionStorage.setItem('token', idToken);
    const res = await api.post('/auth');

    dispatch({
      type: SIGN_IN,
      //payload is token
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//google sign out
export const signOut = () => async (dispatch) => {
  try {

    //clear token
    setAuthToken();
    delete api.defaults.headers.common['x-auth-token'];
    sessionStorage.removeItem('token');

    dispatch({
      type: SIGN_OUT,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
