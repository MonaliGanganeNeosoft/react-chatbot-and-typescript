const initialState = { NewProfile: '' }
export const myAccountReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case 'Profile_pic_Update':
            return { ...state, NewProfile: actions.payload }
        default:
            return state
    }
}