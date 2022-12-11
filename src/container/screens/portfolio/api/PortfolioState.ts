import {PORTFOLIO_DETAILS} from './PortfolioTypes';

//TODO: chnage interface
const initialState: any = {
  portfolioDetails: '',
};
const portfolioApiReducer = (state = initialState, action: any) => {
  switch (action.type) {
    //TODO: need to change
    case PORTFOLIO_DETAILS: {
      return {
        ...state,
        portfolioDetails: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
export default portfolioApiReducer;
