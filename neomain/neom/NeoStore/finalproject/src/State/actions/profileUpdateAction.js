import { ProfileUpdate } from "../../config/profileService"

export const Update_Profile_SUCCESS = 'Update_Profile_SUCCESS';
export const Update_Profile_FAILED = 'Update_Profile_FAILED'
export function Update_Profile(data) {
    return (dispatch) => {
        return ProfileUpdate(data).then(res => {
            dispatch({
                type: Update_Profile_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: Update_Profile_FAILED,
                    payload: error
                });
            });
    }
}