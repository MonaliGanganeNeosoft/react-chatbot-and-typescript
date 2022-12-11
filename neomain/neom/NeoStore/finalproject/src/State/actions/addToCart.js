import { ADDTOCART } from "../../config/cartService"

export const Add_To_Cart_SUCCESS = 'Add_To_Cart_SUCCESS';
export const Add_To_Cart_FAILED = 'Add_To_Cart_FAILED'
export function Add_To_Cart(data) {
    return (dispatch) => {
        return ADDTOCART(data).then(res => {
            dispatch({
                type: Add_To_Cart_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: Add_To_Cart_FAILED,
                    payload: error
                });
            });
    }
}