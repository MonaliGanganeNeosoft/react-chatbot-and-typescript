import * as Actions from '../actions/UserLoginAction'
const initialState = { msg: '' ,success:false}
export const UserLoginReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.USER_LOGIN_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                msg:actions.payload
            };
        }
        case Actions.USER_LOGIN_FAILED:
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