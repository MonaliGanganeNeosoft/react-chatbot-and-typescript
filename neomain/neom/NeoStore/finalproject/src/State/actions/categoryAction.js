import { GetCategory } from "../../config/categoryService"

export const GET_CATEGORY_SUCCESS = 'GET_CATEGORY_SUCCESS';
export const GET_CATEGORY_FAILED = 'GET_CATEGORY_FAILED'
export function GET_CATEGORY(data) {
    return (dispatch) => {
        return GetCategory(data).then(res => {
            dispatch({
                type: GET_CATEGORY_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: GET_CATEGORY_FAILED,
                    payload: error
                });
            });
    }
}