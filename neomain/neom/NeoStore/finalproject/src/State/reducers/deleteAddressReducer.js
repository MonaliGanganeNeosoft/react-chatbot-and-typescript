
import * as Actions from '../actions/deleteAddressAction'
const initialState = { Address: '', success: false }
export const deleteAddressReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case Actions.DELETE_Address_SUCCESS:
            {
                return {
                    ...initialState,
                    success: true,
                    Address: actions.payload
                };
            }
        case Actions.DELETE_Address_FAILED:
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