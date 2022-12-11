import { UserSocialLogin } from "../../config/LoginService";

export const USER_SOCIAL_SUCCESS='USER_SOCIAL_SUCCESS';
export const USER_SOCIAL_FAILED='USER_SOCIAL_FAILED'
export function USER_SOCIAL(data) {
    console.log(data);
    return (dispatch) => {
        return UserSocialLogin(data).then(res=>{
            console.log(res.data);
             dispatch({
                type:USER_SOCIAL_SUCCESS,
                payload:res.data
            })
        })
        .catch(error => {
            console.log(error);
            return dispatch({
                type   : USER_SOCIAL_SUCCESS,
                payload: error
            });
        });
    }
}