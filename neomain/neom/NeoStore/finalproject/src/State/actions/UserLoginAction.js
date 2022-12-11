import { CheckUser } from "../../config/LoginService";

export const USER_LOGIN_SUCCESS='USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILED='USER_LOGIN_FAILED'
export function USER_LOGIN(data) {
    return (dispatch) => {
        return CheckUser(data).then(res=>{
             dispatch({
                type:USER_LOGIN_SUCCESS,
                payload:res.data
            })
        })
        .catch(error => {
            return dispatch({
                type   : USER_LOGIN_SUCCESS,
                payload: error
            });
        });
    }
}