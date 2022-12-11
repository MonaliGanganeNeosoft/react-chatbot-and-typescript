import axios from 'axios';
import { ECOMMERCES_URL } from './url';
axios.defaults.headers.common['Authorization']=`Basic ${localStorage.getItem('_token')}`
export function SETRATING(data){
    return axios.post(`${ECOMMERCES_URL}product/setrating`,data)
}