import { EDITADDRESS } from "../../config/AddressService"

export const EDIT_Address_SUCCESS = 'EDIT_Address_SUCCESS';
export const EDIT_Address_FAILED = 'EDIT_Address_FAILED'
export function EDIT_Address(data) {
    return (dispatch) => {
        return EDITADDRESS(data).then(res => {
            dispatch({
                type: EDIT_Address_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: EDIT_Address_FAILED,
                    payload: error
                });
            });
    }
}