import { DELETEAddress } from "../../config/AddressService"
export const DELETE_Address_SUCCESS = 'DELETE_Address_SUCCESS';
export const DELETE_Address_FAILED = 'DELETE_Address_FAILED'
export function DELETE_Address(data) {
    return (dispatch) => {
        return DELETEAddress(data).then(res => {
            dispatch({
                type: DELETE_Address_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: DELETE_Address_FAILED,
                    payload: error
                });
            });
    }
}