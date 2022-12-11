import { CONFIRMORDER } from "../../config/orderService"

export const Confirm_Order_SUCCESS = 'Confirm_Order_SUCCESS';
export const Confirm_Order_FAILED = 'Confirm_Order_FAILED'
export function Confirm_Order(data) {
    return (dispatch) => {
        return CONFIRMORDER(data).then(res => {
            dispatch({
                type: Confirm_Order_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: Confirm_Order_FAILED,
                    payload: error
                });
            });
    }
}