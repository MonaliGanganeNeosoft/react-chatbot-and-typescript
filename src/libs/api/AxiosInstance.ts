import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {authorizationToken} from '../../helper/Authorization';
import {API_BASE_URL, API_WITHOUT_AUTH} from './ApiEndpoints';

let headers = {};

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers,
});

axiosInstance.interceptors.request.use(
  async (config: any) => {
    if (!API_WITHOUT_AUTH.includes(config.url)) {
      const token = await authorizationToken();
      console.log(token);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    console.error(error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: any) =>
    new Promise((resolve, reject) => {
      resolve(response);
    }),
  (error: any) => {
    if (!error.response) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    if (error.response.status === 403) {
      //FIXME:  throgh to login screen
      console.log('Throw on login screen');
    } else {
      console.log('error message');
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  },
);

export default axiosInstance;
