
import * as Actions from '../actions/editAddressAction'
const initialState = { Address: '', success: false }
export const editAddressReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case Actions.EDIT_Address_SUCCESS:
            {
                return {
                    ...initialState,
                    success: true,
                    Address: actions.payload
                };
            }
        case Actions.EDIT_Address_FAILED:
            {
                return {
                    success: false,
                    Address: actions.payload
                };
            }
        default:
            {
                return state
            }
    }
}