import { FILTERPRODUCT } from "../../config/filterProductService"

export function FilterProductS(data) {
    return (dispatch) => {
        return FILTERPRODUCT(data).then(res => {
            dispatch({
                type: 'Filter_Product',
                payload: res.data
            })
        })
    }
}