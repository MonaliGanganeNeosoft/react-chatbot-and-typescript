import CookieManager from '@react-native-cookies/cookies';
import {DOMAIN_URL} from '../../../constants/CommonConstants';
import {successResponse} from '../../../helper/ApiHelper';
import {AXIOS_URL} from '../../../libs/api/ApiEndpoints';
import {post} from '../../../libs/api/ApiService';

export const signupApi = async (fields: any, cb: Function) => {
  try {
    const response = await post(AXIOS_URL.auth.signup, fields);
    if (successResponse(response?.status)) cb();
  } catch (err) {
    console.error(err);
  }
};

export const loginApi = async (fields: any, cb: Function) => {
  try {
    const response = await post(AXIOS_URL.auth.login, fields);
    if (successResponse(response?.status)) {
      const {token} = response.data;
      CookieManager.setFromResponse(
        DOMAIN_URL,
        `user_session=${token}; path=/`,
      ).then(() => {
        cb();
      });
    }
  } catch (err) {
    console.error(err);
  }
};
