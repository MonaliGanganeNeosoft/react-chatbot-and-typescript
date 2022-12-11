
import * as Actions from '../actions/getOrderAction'
const initialState = { Order: '' ,success:false}
export const getOrderReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.Get_Order_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                Order:actions.payload
            };
        }
        case Actions.Get_Order_FAILED:
        {
            return {
                success: false,
                error  : actions.payload
            };
        }
        default:
        {
            return state
        }
    }
}