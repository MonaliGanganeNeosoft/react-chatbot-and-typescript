import { GETORDER } from "../../config/orderService"
export const Get_Order_SUCCESS = 'Get_Order_SUCCESS';
export const Get_Order_FAILED = 'Get_Order_FAILED'
export function Get_Order(data) {
    return (dispatch) => {
        return GETORDER(data).then(res => {
            dispatch({
                type: Get_Order_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: Get_Order_FAILED,
                    payload: error
                });
            });
    }
}