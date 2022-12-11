
import { GetProduct } from "../../config/productService";
export function GetProductALLData() {
    return (dispatch) => {
        return GetProduct().then(res => {
            dispatch({
                type: 'Popular_Product_All',
                payload: res.data
            })
        })
    }
}