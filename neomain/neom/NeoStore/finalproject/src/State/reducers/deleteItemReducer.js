import * as Actions from '../actions/deleteItemAction'
const initialState = { msg: '', success: false }
export const deleteItemReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case Actions.Delete_item_SUCCESS:
            {
                return {
                    ...initialState,
                    success: true,
                    msg: actions.payload
                };
            }
        case Actions.Delete_item_FAILED:
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