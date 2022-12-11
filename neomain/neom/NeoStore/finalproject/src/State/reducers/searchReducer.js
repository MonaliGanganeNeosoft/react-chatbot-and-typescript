const initialState = { searchitem: '' }
export const searchReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case 'search':
            return { ...state, searchitem: actions.payload }
        default:
            return state
    }
}