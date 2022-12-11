import { DELETECONFIRMEDORDER } from "../../config/orderService"
export const DELETE_Confrim_order_SUCCESS = 'DELETE_Confrim_order_SUCCESS';
export const DELETE_Confrim_order_FAILED = 'DELETE_Confrim_order_FAILED'
export function DELETE_Confrim_order(data) {
    return (dispatch) => {
        return DELETECONFIRMEDORDER(data).then(res => {
            dispatch({
                type: DELETE_Confrim_order_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: DELETE_Confrim_order_FAILED,
                    payload: error
                });
            });
    }
}