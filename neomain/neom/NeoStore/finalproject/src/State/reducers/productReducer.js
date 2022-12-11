const initialState = { product: '', FilterProduct: '' }
export const productReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case 'Popular_Product':
            return { ...state, product: actions.payload }
        case 'Popular_Product_All':
            return { ...state, product: actions.payload }
        case 'Filter_Product':
            return { ...state, FilterProduct: actions.payload }
        default:
            return state
    }
}