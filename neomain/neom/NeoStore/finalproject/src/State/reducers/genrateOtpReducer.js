
import * as Actions from '../actions/genrateOtpAction'
const initialState = { msg: '' ,success:false}
export const genrateOtpReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.Genrate_OTP_SUCCESS:
        {
            console.log(actions.payload);
            return {
                ...initialState,
                success: true,
                msg:actions.payload
            };
        }
        case Actions.Genrate_OTP_FAILED:
        {
            return {
                success: false,
                msg  : actions.payload
            };
        }
        default:
        {
            return state
        }
    }
}