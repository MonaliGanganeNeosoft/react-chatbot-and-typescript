import axios from 'axios';
import { ECOMMERCES_URL } from './url';
axios.defaults.headers.common['Authorization']=`Basic ${localStorage.getItem('_token')}`
export function AddUser(data){
    return axios.post(`${ECOMMERCES_URL}user/adduser`,data)
}
export function CheckUser(data){
    return axios.post(`${ECOMMERCES_URL}user/loginuser`,data)
}
export function UserSocialLogin(data){
    return axios.post(`${ECOMMERCES_URL}social/usersociallogin`,data)
}
export function ChangeUuid(data){
    return axios.post(`${ECOMMERCES_URL}cart/changeuuid`,data)
}