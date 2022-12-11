
import * as Actions from '../actions/setRatingAction'
const initialState = { rating: '' ,success:false}
export const setRatingReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.Set_Rating_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                rating:actions.payload
            };
        }
        case Actions.Set_Rating_FAILED:
        {
            return {
                success: false,
                rating  : actions.payload
            };
        }
        default:
        {
            return state
        }
    }
}