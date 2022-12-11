import { GenrateOTP } from "../../config/forgetService"

export const Genrate_OTP_SUCCESS = 'Genrate_OTP_SUCCESS';
export const Genrate_OTP_FAILED = 'Genrate_OTP_FAILED'
export function Genrate_OTP(data) {
    return (dispatch) => {
        return GenrateOTP(data).then(res => {
            console.log(res.data);
            dispatch({
                type: Genrate_OTP_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: Genrate_OTP_FAILED,
                    payload: error
                });
            });
    }
}