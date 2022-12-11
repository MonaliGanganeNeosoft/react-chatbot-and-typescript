
import * as Actions from '../actions/colorAction'
const initialState = { Color: '' ,success:false}
export const colorReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.GET_COLOR_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                Color:actions.payload
            };
        }
        case Actions.GET_COLOR_FAILED:
        {
            return {
                success: false,
                Color  : actions.payload
            };
        }
        default:
        {
            return state
        }
    }
}