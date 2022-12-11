import axios from 'axios';
import { ECOMMERCES_URL } from './url';
export function GetColor() {
    return axios.get(`${ECOMMERCES_URL}color/getcolor`)
}