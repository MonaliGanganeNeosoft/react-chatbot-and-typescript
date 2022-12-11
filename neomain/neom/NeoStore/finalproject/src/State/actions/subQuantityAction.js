import { DECQUANTITY } from "../../config/cartService"
export const Sub_Quantity_SUCCESS = 'Sub_Quantity_SUCCESS';
export const Sub_Quantity_FAILED = 'Sub_Quantity_FAILED'
export function Sub_Quantity(data) {
    return (dispatch) => {
        return DECQUANTITY(data).then(res => {
            dispatch({
                type: Sub_Quantity_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: Sub_Quantity_FAILED,
                    payload: error
                });
            });
    }
}