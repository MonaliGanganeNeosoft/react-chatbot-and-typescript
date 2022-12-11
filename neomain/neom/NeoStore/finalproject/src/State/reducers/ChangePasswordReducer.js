import * as Actions from '../actions/changePasswordAction'
const initialState = { msg: '' ,success:false}
export const ChangePasswordReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.Change_Password_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                msg:actions.payload
            };
        }
        case Actions.Change_Password_FAILED:
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