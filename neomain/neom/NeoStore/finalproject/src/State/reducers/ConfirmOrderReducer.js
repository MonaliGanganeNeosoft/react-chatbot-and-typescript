
import * as Actions from '../actions/confirmOrderAction'
const initialState = { msg: '' ,success:false}
export const confirmOrderReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.Confirm_Order_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                msg:actions.payload
            };
        }
        case Actions.Confirm_Order_FAILED:
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