import axios from 'axios';
import { ECOMMERCES_URL } from './url';
axios.defaults.headers.common['Authorization']=`Basic ${localStorage.getItem('_token')}`
export function UserAddress(data){
    return axios.post(`${ECOMMERCES_URL}social/addAddress`,data)
}
export function DELETEAddress(data){
    return (axios.post(`${ECOMMERCES_URL}user/deleteAddress`,data))
}
export function EDITADDRESS(data){
    return (axios.post(`${ECOMMERCES_URL}user/editAddress`,data))
}