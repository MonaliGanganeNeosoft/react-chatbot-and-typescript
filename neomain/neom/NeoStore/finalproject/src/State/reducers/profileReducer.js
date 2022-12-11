
import * as Actions from '../actions/profileUpdateAction'
const initialState = { msg: '' ,success:false}
export const profileUpdateReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.Update_Profile_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                msg:actions.payload
            };
        }
        case Actions.Update_Profile_FAILED:
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