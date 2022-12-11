
import * as Actions from '../actions/forgetPasswordAction'
const initialState = { forgetpass: '' ,success:false}
export const forgetReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.Forget_password_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                forgetpass:actions.payload
            };
        }
        case Actions.Forget_password_FAILED:
        {
            return {
                success: false,
                forgetpass  : actions.payload
            };
        }
        default:
        {
            return state
        }
    }
}