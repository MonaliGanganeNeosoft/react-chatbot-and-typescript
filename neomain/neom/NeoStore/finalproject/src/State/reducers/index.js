import { loginReducer } from "./loginReducer";
import { cartReducer } from "./cartReducer";
import { searchReducer } from "./searchReducer";
import { categoryReducer } from './categoryReducer'
import { combineReducers } from "redux";
import { productReducer } from "./productReducer";
import { colorReducer } from "./colorReducer"
import { getOrderReducer } from "./orderReducer"
import { profileUpdateReducer } from "./profileReducer";
import { forgetReducer } from "./forgetPasswordReducer"
import { myAccountReducer } from "./myAccountReducer";
import { addAddressReducer } from "./addAddressReducer";
import { setRatingReducer } from "./setRatingReducer";
import { addUserReducer } from "./AddUserReducer";
import { editAddressReducer } from "./EditAddressReducer";
import { deleteAddressReducer } from "./deleteAddressReducer";
import { UserSocialReducer } from "./UserSocialLoginReducer";
import { ChangeUuidReducer } from "./ChangeUuidReducer";
import { UserLoginReducer } from "./UserLoginReducer";
import { genrateOtpReducer } from "./genrateOtpReducer";
import { addtoCartReducer } from "./addtoCartReducer";
import { getCartReducer } from "./getCartReducer";
import { DecQuantityReducer } from "./DecQuantityReducer";
import { addQuantityReducer } from "./addQuantityReducer";
import { deleteItemReducer } from "./deleteItemReducer";
import { ChangePasswordReducer } from "./ChangePasswordReducer"
import { confirmOrderReducer } from "./ConfirmOrderReducer";
import { deleteconfirmOrderReducer } from "./deleteConfirmOrderReducer";
const allReducer = combineReducers({
    loginReducer,
    cartReducer,
    searchReducer,
    productReducer,
    categoryReducer,
    colorReducer,
    editAddressReducer,
    deleteAddressReducer,
    getOrderReducer,
    profileUpdateReducer,
    forgetReducer,
    myAccountReducer,
    addAddressReducer,
    setRatingReducer,
    addUserReducer,
    UserSocialReducer,
    ChangeUuidReducer,
    UserLoginReducer,
    genrateOtpReducer,
    addtoCartReducer,
    getCartReducer,
    DecQuantityReducer,
    addQuantityReducer,
    deleteItemReducer,
    ChangePasswordReducer,
    confirmOrderReducer,
    deleteconfirmOrderReducer
})
export default allReducer