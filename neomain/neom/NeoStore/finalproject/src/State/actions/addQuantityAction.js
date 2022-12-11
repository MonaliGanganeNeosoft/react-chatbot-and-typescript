import { INCQUANTITY } from "../../config/cartService"
export const Add_Quantity_SUCCESS = 'Add_Quantity_SUCCESS';
export const Add_Quantity_FAILED = 'Add_Quantity_FAILED'
export function Add_Quantity(data) {
    return (dispatch) => {
        return INCQUANTITY(data).then(res => {
            dispatch({
                type: Add_Quantity_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: Add_Quantity_FAILED,
                    payload: error
                });
            });
    }
}