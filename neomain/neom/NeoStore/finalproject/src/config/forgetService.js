import axios from 'axios';
import { ECOMMERCES_URL } from './url';
export function GenrateOTP(data){
    return axios.post(`${ECOMMERCES_URL}user/genrateotp`,data)
}
export function Forgettenpass(data){
    return axios.post(`${ECOMMERCES_URL}user/forgettenpass`,data)
}