import {AuthStateProps} from '../interfaces';
import {LOGIN_SUCCESS, LOGOUT_SUCCESS} from './types';

const initialState: AuthStateProps = {
  token: '',
};
const authApiReducer = (state = initialState, action: any) => {
  switch (action.type) {
    //TODO: need to change
    case LOGIN_SUCCESS: {
      return {
        ...state,
        token: action.payload,
      };
    }
    case LOGOUT_SUCCESS: {
      return {
        ...state,
        token: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};
export default authApiReducer;
