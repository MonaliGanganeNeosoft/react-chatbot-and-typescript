import { DELETEITEM } from "../../config/cartService"
export const Delete_item_SUCCESS = 'Delete_item_SUCCESS';
export const Delete_item_FAILED = 'Delete_item_FAILED'
export function Delete_item(data) {
    return (dispatch) => {
        return DELETEITEM(data).then(res => {
            dispatch({
                type: Delete_item_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: Delete_item_FAILED,
                    payload: error
                });
            });
    }
}