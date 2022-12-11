import { SETRATING } from "../../config/setRatingService"

export const Set_Rating_SUCCESS = 'Set_Rating_SUCCESS';
export const Set_Rating_FAILED = 'Set_Rating_FAILED'
export function Set_Rating(data) {
    return (dispatch) => {
        return SETRATING(data).then(res => {
            dispatch({
                type: Set_Rating_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: Set_Rating_FAILED,
                    payload: error
                });
            });
    }
}