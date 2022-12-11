import { CHNAGEPASSWORD } from "../../config/profileService"

export const Change_Password_SUCCESS = 'Change_Password_SUCCESS';
export const Change_Password_FAILED = 'Change_Password_FAILED'
export function Change_Password(data) {
    return (dispatch) => {
        return CHNAGEPASSWORD(data).then(res => {
            dispatch({
                type: Change_Password_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: Change_Password_FAILED,
                    payload: error
                });
            });
    }
}