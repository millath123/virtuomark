import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  admin: adminReducer,
  user: userReducer,
});

export default rootReducer;
