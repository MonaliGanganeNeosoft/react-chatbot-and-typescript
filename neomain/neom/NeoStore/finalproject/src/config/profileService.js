import axios from 'axios';
import { ECOMMERCES_URL } from './url';
axios.defaults.headers.common['Authorization']=`Basic ${localStorage.getItem('_token')}`
export function CHNAGEPASSWORD(data){
    return axios.post(`${ECOMMERCES_URL}user/ChangePassword`,data)
}
export function ProfileUpdate(data){
    return axios.post(`${ECOMMERCES_URL}social/profileupdate`,data)
}