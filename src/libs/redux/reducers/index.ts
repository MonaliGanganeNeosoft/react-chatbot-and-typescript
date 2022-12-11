import {combineReducers} from 'redux';
import portfolioApiReducer from '../../../container/screens/portfolio/api/PortfolioState';
import authApiReducer from '../../../navigators/stack/api/AuthState';

const rootReducer = combineReducers({
  auth: authApiReducer,
  portfolio: portfolioApiReducer,
});

export default rootReducer;
