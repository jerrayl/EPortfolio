//we create redux store in this file
//all code in this file is basically boilerplate bring in a createStore function

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

//what is redux AND what is reducer:
//redux --> a state manager --> make app level state accessible everywhere, every component
//reducer --> take previous state and action and return the new state --> data from server will be put into the redux store
//--> from every component we can call actions to do delete, update etc through redux store to the server ...
//there are multiples reducers , this rootReducer below brings all reducers together

//In conclusion: what redux do -->
//takes in action -->dispatch action to reducer --> reducer decide how to handle state --> send state back to all components need it
import rootReducer from './reducers';
import setAuthToken from './utils/setAuthToken';

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  //dont know what's this
  composeWithDevTools(applyMiddleware(...middleware))
);

// set up a store subscription listener
// to store the users token in sessionStorage

// initialize current state from redux store for subscription comparison
// preventing undefined error
let currentState = store.getState();

store.subscribe(() => {
  // keep track of the previous and current state to compare changes
  let previousState = currentState;
  currentState = store.getState();
  // if the token changes set the value in sessionStorage and axios headers
  if (previousState.auth.token !== currentState.auth.token) {
    const token = currentState.auth.token;
    setAuthToken(token);
  }
});

export default store;
