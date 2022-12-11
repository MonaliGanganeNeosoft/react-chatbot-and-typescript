import * as Actions from '../actions/AddUserAction'
const initialState = { msg: '' ,success:false}
export const addUserReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.ADDUSER_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                msg:actions.payload
            };
        }
        case Actions.ADDUSER_FAILED:
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