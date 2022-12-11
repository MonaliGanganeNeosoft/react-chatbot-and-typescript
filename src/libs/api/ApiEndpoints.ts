import {AxiosUrlInterface} from './ApiInterfaces';

export const API_BASE_URL = 'https://wa-token-api-dev.azurewebsites.net/';

//Managed axios URL's
export const AXIOS_URL: AxiosUrlInterface = {
  //   <-------  AUTH URL ------->
  auth: {
    signup: 'signup',
    login: 'login',
  },
  portfolio: {
    portfolio: 'portfolio',
  },
};
export const API_WITHOUT_AUTH = [AXIOS_URL.auth.signup, AXIOS_URL.auth.login];
