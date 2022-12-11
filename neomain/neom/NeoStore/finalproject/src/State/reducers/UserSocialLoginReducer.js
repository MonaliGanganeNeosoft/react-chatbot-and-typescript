import * as Actions from '../actions/UserSocialLoginAction'
const initialState = { msg: '' ,success:false}
export const UserSocialReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.USER_SOCIAL_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                msg:actions.payload
            };
        }
        case Actions.USER_SOCIAL_FAILED:
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