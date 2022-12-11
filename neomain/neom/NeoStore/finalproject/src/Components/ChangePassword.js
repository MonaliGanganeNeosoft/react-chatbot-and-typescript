import React, { useRef, useState, useEffect } from 'react'
import { Button, Form, FormGroup, FormLabel } from 'react-bootstrap'
import { CHNAGEPASSWORD } from '../config/myService'
import jwt_decode from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'react-simple-snackbar'
import { loginDisable } from '../State/actions/loginAction'
import { Change_Password } from '../State/actions/changePasswordAction'
const options = {
    position: 'top-center',
    style: {
        fontSize: '20px',
        textAlign: 'center',
        color: 'white',
    },
    closeStyle: {
        color: 'lightcoral',
        fontSize: '16px',
    },
}
export default function ChangePassword() {
    const Oldpassword = useRef('')
    const NewPassword = useRef('')
    const ConfirmPassword = useRef('')
    const [User, setUser] = useState('')
    const [openSnackbar] = useSnackbar(options)
    const regForPassword = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/);
    const history = useNavigate()
    const dispatch = useDispatch()
    const ChangePasswordMsg = useSelector(state => state.ChangePasswordReducer.msg)
    const [ErrorChangePass, setErrorChangePass] = useState({ erroroldpass: '', errornewpass: '', errorconfirmpass: '' })
    useEffect(() => {
        if (localStorage.getItem('_token')) {
            let token = localStorage.getItem('_token')
            let decode = jwt_decode(token);
            let data = decode.uid[0];
            setUser(data)
        }
    }, [])
    const handle = (event) => {
        const name = event.target.name;
        switch (name) {
            case "oldpassword":
                let error_for_oldpassword = regForPassword.test(Oldpassword.current.value) ? '' : 'Enter Valid pattern '
                setErrorChangePass({
                    ...ErrorChangePass, erroroldpass: error_for_oldpassword
                })
                break;
            case "newpassword":
                let error_for_newpassword = regForPassword.test(NewPassword.current.value) ? '' : 'Enter Valid pattern '
                setErrorChangePass({
                    ...ErrorChangePass, errornewpass: error_for_newpassword
                })
                break;
            case "confirmpassword":
                let error_for_confpassword = NewPassword.current.value == ConfirmPassword.current.value ? '' : 'Enter Valid pattern '
                setErrorChangePass({
                    ...ErrorChangePass, errorconfirmpass: error_for_confpassword
                })
                break;
        }
    }
    const setnull = (event) => {
        const name = event.target.name;
        switch (name) {

            case "newpassword":
                setErrorChangePass({
                    ...ErrorChangePass, errornewpass: ''
                })
                break;
            case "oldpassword":
                setErrorChangePass({
                    ...ErrorChangePass, erroroldpass: ''
                })
                break;
            case "confirmpassword":
                setErrorChangePass({
                    ...ErrorChangePass, errorconfirmpass: ''
                })
                break;
        }
    }
    useEffect(() => {
        console.log(ChangePasswordMsg);
        if (ChangePasswordMsg.success) {
            localStorage.setItem('_token', ChangePasswordMsg.msg.token)
            openSnackbar(ChangePasswordMsg.msg.msg)
            history("/MyAccount");
        }
    }, [ChangePasswordMsg]);

    const changePassword = () => {
        let data = { email: User.email, password: Oldpassword.current.value, newpassword: NewPassword.current.value };
        dispatch(Change_Password(data))
        // CHNAGEPASSWORD(data)
        //     .then(res => {
        //         if (res.data.err == 1) {
        //             console.log(res.data.msg);
        //             openSnackbar(res.data.msg)
        //         }
        //         else {
        //             localStorage.setItem('_token', res.data.token)
        //             let decode = jwt_decode(res.data.token);
        //             openSnackbar(res.data.msg)
        //             history("/MyAccount");
        //         }
        //     })
        //     .catch(err => {
        //         console.log(err.message);
        //         if (err.message != 'Network Error') {
        //             openSnackbar('Session expired Login again please')
        //             localStorage.clear()
        //             dispatch(loginDisable(''))
        //             // dispatch({ type: 'disable' })
        //             history('/LoginPage')
        //         }
        //         else {
        //             openSnackbar('Server Error')
        //             history('/ServerError')
        //         }
        //     })
    }
    return (
        <div className='allpadding'>
            <h3 className='text-center'>Change Password</h3><hr />
            <Form className='ps-5 pe-5'>
                <FormGroup className='mt-2'>
                    <Form.Control type='password' name='oldpassword' placeholder='Old Password' ref={Oldpassword} onBlur={handle} onFocus={setnull} />
                </FormGroup>
                <FormLabel style={{ color: 'red' }} >{ErrorChangePass.erroroldpass}</FormLabel>
                <FormGroup className='mt-2'>
                    <Form.Control type='password' name='newpassword' placeholder='New Password' ref={NewPassword} onBlur={handle} onFocus={setnull} />
                </FormGroup>
                <FormLabel style={{ color: 'red' }} >{ErrorChangePass.errornewpass}</FormLabel>
                <FormGroup className='mt-2'>
                    <Form.Control type='password' name='confirmpassword' placeholder='Confirm Password' ref={ConfirmPassword} onBlur={handle} onFocus={setnull} />
                </FormGroup>
                <FormLabel style={{ color: 'red' }} >{ErrorChangePass.errorconfirmpass}</FormLabel>
                <FormGroup className='mt-2 text-center'>
                    <Button onClick={changePassword}>Submit</Button>
                </FormGroup>
            </Form>

        </div>
    )
}
