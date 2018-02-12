import {
  combineReducers,
  createStore
} from 'redux';

import * as reducers from './reducers';

export const initialState = {
  data: []
};

export const store = createStore(combineReducers(reducers));

export default store;