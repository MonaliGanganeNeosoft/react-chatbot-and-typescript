import axios from 'axios';
import { ECOMMERCES_URL } from './url';
axios.defaults.headers.common['Authorization']=`Basic ${localStorage.getItem('_token')}`
export function AddUser(data){
    return axios.post(`${ECOMMERCES_URL}user/adduser`,data)
}
export function CheckUser(data){
    return axios.post(`${ECOMMERCES_URL}user/loginuser`,data)
}
export function GenrateOTP(data){
    return axios.post(`${ECOMMERCES_URL}user/genrateotp`,data)
}
export function Forgettenpass(data){
    return axios.post(`${ECOMMERCES_URL}user/forgettenpass`,data)
}
export function UserSocialLogin(data){
    return axios.post(`${ECOMMERCES_URL}social/usersociallogin`,data)
}
export function ProfileUpdate(data){
    return axios.post(`${ECOMMERCES_URL}social/profileupdate`,data)
}
export function CHNAGEPASSWORD(data){
    return axios.post(`${ECOMMERCES_URL}user/ChangePassword`,data)
}
export function ProfilePicUpdate(data){
    return axios.post(`${ECOMMERCES_URL}social/UpdateProfilePic`,data)
}
export function UserAddress(data){
    return axios.post(`${ECOMMERCES_URL}social/addAddress`,data)
}
export function DELETEAddress(data){
    return (axios.post(`${ECOMMERCES_URL}user/deleteAddress`,data))
}
export function EDITADDRESS(data){
    return (axios.post(`${ECOMMERCES_URL}user/editAddress`,data))
}
export function GetProduct(){
    return axios.get(`${ECOMMERCES_URL}product/getProduct`)
}
export function GetCategory(){
    return axios.get(`${ECOMMERCES_URL}category/getcategory`)
}
export function GetColor(){
    return axios.get(`${ECOMMERCES_URL}color/getcolor`)
}
export function FILTERPRODUCT(data){
    return axios.post(`${ECOMMERCES_URL}product/FilterProduct`,data)
}
// export function GetPopularProduct(){
//     return axios.get(`${ECOMMERCES_URL}product/getpopularproduct`)
// }
export function SETRATING(data){
    return axios.post(`${ECOMMERCES_URL}product/setrating`,data)
}
export function ADDTOCART(data){
    return axios.post(`${ECOMMERCES_URL}cart/addtocart`,data)
}
export function GETCARTCOUNT(data){
    return axios.post(`${ECOMMERCES_URL}cart/cartcount`,data)
}
export function ChangeUuid(data){
    return axios.post(`${ECOMMERCES_URL}cart/changeuuid`,data)
}
export function GETCART(data){
    return axios.post(`${ECOMMERCES_URL}cart/getCart`,data)
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
export function CONFIRMORDER(data){
    return axios.post(`${ECOMMERCES_URL}order/confirmorder`,data)
}
export function DELETECONFIRMEDORDER(data){
    return axios.post(`${ECOMMERCES_URL}cart/orderDone`,data)
}
export function GETORDER(data){
    return axios.post(`${ECOMMERCES_URL}order/orderdetails`,data)
}
