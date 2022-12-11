import * as Actions from '../actions/getCartAction'
const initialState = { cartData: '', success: false }
export const getCartReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case Actions.GET_CART_SUCCESS:
            {
                return {
                    ...initialState,
                    success: true,
                    cartData: actions.payload
                };
            }
        case Actions.GET_CART_FAILED:
            {
                return {
                    success: false,
                    cartData: actions.payload
                };
            }
        default:
            {
                return state
            }
    }
}