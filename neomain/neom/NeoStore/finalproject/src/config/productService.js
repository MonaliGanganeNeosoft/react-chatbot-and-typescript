import axios from 'axios';
import { ECOMMERCES_URL } from './url';
axios.defaults.headers.common['Authorization']=`Basic ${localStorage.getItem('_token')}`
export function GetPopularProduct(){
    return axios.get(`${ECOMMERCES_URL}product/getpopularproduct`)
}
export function GetProduct(){
    return axios.get(`${ECOMMERCES_URL}product/getProduct`)
}