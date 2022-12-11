import axios from 'axios';
import { ECOMMERCES_URL } from './url';
axios.defaults.headers.common['Authorization']=`Basic ${localStorage.getItem('_token')}`
export function GETORDER(data){
    return axios.post(`${ECOMMERCES_URL}order/orderdetails`,data)
}
export function CONFIRMORDER(data){
    return axios.post(`${ECOMMERCES_URL}order/confirmorder`,data)
}
export function DELETECONFIRMEDORDER(data){
    return axios.post(`${ECOMMERCES_URL}cart/orderDone`,data)
}