import * as Actions from '../actions/AddressAction'
const initialState = { Address: '', success: false }
export const addAddressReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case Actions.ADD_Address_SUCCESS:
            {
                return {
                    ...initialState,
                    success: true,
                    Address: actions.payload
                };
            }
        case Actions.ADD_Address_FAILED:
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