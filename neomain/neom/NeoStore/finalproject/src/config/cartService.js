import axios from 'axios';
import { ECOMMERCES_URL } from './url';
axios.defaults.headers.common['Authorization']=`Basic ${localStorage.getItem('_token')}`
export function GETCART(data){
    return axios.post(`${ECOMMERCES_URL}cart/getCart`,data)
}
export function ADDTOCART(data){
    return axios.post(`${ECOMMERCES_URL}cart/addtocart`,data)
}
export function GETCARTCOUNT(data){
    return axios.post(`${ECOMMERCES_URL}cart/cartcount`,data)
}
export function INCQUANTITY(data){
    return axios.post(`${ECOMMERCES_URL}cart/incquantity`,data)
}
export function DECQUANTITY(data){
    return axios.post(`${ECOMMERCES_URL}cart/decquantity`,data)
}
export function DELETEITEM(data){
    return axios.post(`${ECOMMERCES_URL}cart/deleteItem`,data)
}