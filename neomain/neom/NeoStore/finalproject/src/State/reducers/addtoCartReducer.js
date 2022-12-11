import * as Actions from '../actions/addToCart'
const initialState = { msg: '', success: false }
export const addtoCartReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case Actions.Add_To_Cart_SUCCESS:
            {
                return {
                    ...initialState,
                    success: true,
                    msg: actions.payload
                };
            }
        case Actions.Add_To_Cart_FAILED:
            {
                return {
                    success: false,
                    msg: actions.payload
                };
            }
        default:
            {
                return state
            }
    }
}