import CookieManager from '@react-native-cookies/cookies';
import {DOMAIN_URL} from '../constants/CommonConstants';

export const authorizationToken = async (): Promise<string> => {
  const cookies: any = await CookieManager.get(DOMAIN_URL);
  return cookies?.Authorization?.value || '';
};

export const removeAuthorizationToken = async () => {
  await CookieManager.clearAll();
};
