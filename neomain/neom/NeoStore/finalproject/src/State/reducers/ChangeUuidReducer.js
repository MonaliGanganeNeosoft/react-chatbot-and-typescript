import * as Actions from '../actions/changeUUIDAction'
const initialState = { msg: '' ,success:false}
export const ChangeUuidReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.CHANGE_UUID_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                msg:actions.payload
            };
        }
        case Actions.CHANGE_UUID_FAILED:
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