import { ProfilePicUpdate } from "../../config/myAccountService"

export function Update_profile_pic(data) {
    return (dispatch) => {
        return ProfilePicUpdate(data).then(res=>{
             dispatch({
                type:'Profile_pic_Update',
                payload:res.data
            })
        })
    }
}