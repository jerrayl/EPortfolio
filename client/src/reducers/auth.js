import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGN_IN,
  SIGN_OUT,
} from '../actions/types';

//initial state --an object
const initialState = {
  //token we got back from server --get token stored in sessionStorage
  token: sessionStorage.getItem('token'),
  //set true once successfully login/registered
  isAuthenticated: null,
  //if user authenticated, wanna make sure loading is done-->already made req to backend and got response
  //once got response, then set to false
  loading: true,
  //get user data from backend then will put user data here
  user: null,
};

//function takes initial state , and action that's dispatched
export default function (state = initialState, action) {
  //destructure aciton.type and action.payload to type and action
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case LOGIN_SUCCESS:
    case SIGN_IN:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };

    //remove token from sessionStorage, set things to null or false
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case SIGN_OUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    default:
      return state;
  }
}
