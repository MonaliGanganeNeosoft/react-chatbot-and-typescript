import * as Actions from '../actions/subQuantityAction'
const initialState = { msg: '', success: false }
export const DecQuantityReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case Actions.Sub_Quantity_SUCCESS:
            {
                return {
                    ...initialState,
                    success: true,
                    msg: actions.payload
                };
            }
        case Actions.Sub_Quantity_FAILED:
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