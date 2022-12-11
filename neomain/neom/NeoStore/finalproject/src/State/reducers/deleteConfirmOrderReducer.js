
import * as Actions from '../actions/deleteConfirmAction'
const initialState = { msg: '' ,success:false}
export const deleteconfirmOrderReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.DELETE_Confrim_order_SUCCESS:
        {
            return {
                ...initialState,
                success: true
            };
        }
        case Actions.DELETE_Confrim_order_FAILED:
        {
            return {
                success: false
            };
        }
        default:
        {
            return state
        }
    }
}