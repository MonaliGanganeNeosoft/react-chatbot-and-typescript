import {Dispatch} from 'redux';
import {successResponse} from '../../../../helper/ApiHelper';
import {AXIOS_URL} from '../../../../libs/api/ApiEndpoints';
import {get} from '../../../../libs/api/ApiService';
import {PORTFOLIO_DETAILS} from './PortfolioTypes';

export const portfolioApi = async (dispatch: Dispatch) => {
  try {
    const response = await get(AXIOS_URL.portfolio.portfolio);
    if (!!successResponse(response?.status)) {
      dispatch({type: PORTFOLIO_DETAILS, payload: response.data.data});
    }
  } catch (err) {
    console.error(err);
  }
};
