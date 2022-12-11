import { AddUser } from "../../config/LoginService";

export const ADDUSER_SUCCESS='ADDUSER_SUCCESS';
export const ADDUSER_FAILED='ADDUSER_FAILED'
export function ADD_USER(id) {
    return (dispatch) => {
        return AddUser(id).then(res=>{
             dispatch({
                type:ADDUSER_SUCCESS,
                payload:res.data
            })
        })
        .catch(error => {
            return dispatch({
                type   : ADDUSER_FAILED,
                payload: error
            });
        });
    }
}