import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import screenReducer from './screen';
import surveyReducer from './survey';
import dashboardReducer from './dashboard';
import optionReducer from './options';

const rootReducer = combineReducers({
  router: routerReducer,
    screenReducer,
    surveyReducer,
    dashboardReducer,
    optionReducer
});

export default rootReducer;
