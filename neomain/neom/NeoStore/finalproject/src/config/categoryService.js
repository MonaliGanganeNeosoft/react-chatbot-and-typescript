import axios from 'axios';
import { ECOMMERCES_URL } from './url';
export function GetCategory(){
    return axios.get(`${ECOMMERCES_URL}category/getcategory`)
}