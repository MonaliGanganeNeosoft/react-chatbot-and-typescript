
import * as Actions from '../actions/categoryAction'
const initialState = { Category: '' ,success:false}
export const categoryReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.GET_CATEGORY_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                Category:actions.payload
            };
        }
        case Actions.GET_CATEGORY_FAILED:
        {
            return {
                success: false,
                Category  : actions.payload
            };
        }
        default:
        {
            return state
        }
    }
}