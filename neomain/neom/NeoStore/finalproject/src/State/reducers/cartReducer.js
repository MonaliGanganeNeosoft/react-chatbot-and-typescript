const initialState = { cart: 0 }
export const cartReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case 'cart':
            return { ...state, cart: actions.payload }
        default:
            return state
    }
}