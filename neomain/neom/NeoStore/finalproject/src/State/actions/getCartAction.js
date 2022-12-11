import { GETCART } from "../../config/cartService"
export const GET_CART_SUCCESS='Get_Cart_success';
export const GET_CART_FAILED='Get_Cart_failed'
export function GET_CART(id) {
    return (dispatch) => {
        return GETCART(id).then(res=>{
             dispatch({
                type:GET_CART_SUCCESS,
                payload:res.data
            })
        })
        .catch(error => {
            return dispatch({
                type   : GET_CART_FAILED,
                payload: error
            });
        });
    }
}