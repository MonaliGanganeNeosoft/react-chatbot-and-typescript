import { Forgettenpass } from "../../config/forgetService"

export const Forget_password_SUCCESS = 'Forget_password_SUCCESS';
export const Forget_password_FAILED = 'Forget_password_FAILED'
export function Forget_password(data) {
    return (dispatch) => {
        return Forgettenpass(data).then(res => {
            dispatch({
                type: Forget_password_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: Forget_password_FAILED,
                    payload: error
                });
            });
    }
}