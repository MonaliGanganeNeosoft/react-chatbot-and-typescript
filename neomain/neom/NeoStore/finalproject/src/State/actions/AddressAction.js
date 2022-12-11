import { UserAddress } from "../../config/AddressService"
export const ADD_Address_SUCCESS = 'ADD_Address_SUCCESS';
export const ADD_Address_FAILED = 'ADD_Address_FAILED'
export function ADD_Address(data) {
    return (dispatch) => {
        return UserAddress(data).then(res => {
            dispatch({
                type: ADD_Address_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: ADD_Address_FAILED,
                    payload: error
                });
            });
    }
}