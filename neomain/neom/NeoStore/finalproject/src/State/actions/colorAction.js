import { GetColor } from "../../config/colorService"
export const GET_COLOR_SUCCESS = 'GET_COLOR_SUCCESS';
export const GET_COLOR_FAILED = 'GET_COLOR_FAILED'
export function GET_COLOR(data) {
    return (dispatch) => {
        return GetColor(data).then(res => {
            dispatch({
                type: GET_COLOR_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: GET_COLOR_FAILED,
                    payload: error
                });
            });
    }
}