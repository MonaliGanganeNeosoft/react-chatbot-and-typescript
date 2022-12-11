
import { GetPopularProduct } from "../../config/productService";
export function GetProductData() {
    return (dispatch) => {
        return GetPopularProduct().then(res => {
            dispatch({
                type: 'Popular_Product',
                payload: res.data
            })
        })
    }
}