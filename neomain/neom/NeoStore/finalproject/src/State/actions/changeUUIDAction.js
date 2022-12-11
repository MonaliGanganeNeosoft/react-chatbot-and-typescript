import { ChangeUuid } from "../../config/LoginService";

export const CHANGE_UUID_SUCCESS='CHANGE_UUID_SUCCESS';
export const CHANGE_UUID_FAILED='CHANGE_UUID_FAILED'
export function CHANGE_UUID(data) {
    console.log(data);
    return (dispatch) => {
        return ChangeUuid(data).then(res=>{
             dispatch({
                type:CHANGE_UUID_SUCCESS,
                payload:res.data
            })
        })
        .catch(error => {
            return dispatch({
                type   : CHANGE_UUID_FAILED,
                payload: error
            });
        });
    }
}