// redux/store.js

import { createStore, combineReducers } from 'redux';
import newsReducer from './reducers';

const rootReducer = combineReducers({
  news: newsReducer
});

const store = createStore(rootReducer);

export default store;
