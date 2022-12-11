import * as Actions from '../actions/addQuantityAction'
const initialState = { msg: '', success: false }
export const addQuantityReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case Actions.Add_Quantity_SUCCESS:
            {
                return {
                    ...initialState,
                    success: true,
                    msg: actions.payload
                };
            }
        case Actions.Add_Quantity_FAILED:
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