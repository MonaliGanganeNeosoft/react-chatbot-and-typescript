import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Form, FormControl, InputGroup, Row, FormLabel, Button, Alert } from 'react-bootstrap'
import SocialButton from './SocialButton'
import { useNavigate } from 'react-router-dom'
import { Facebook, Google, Mailbox, Phone, TextareaT } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { AddUser, UserSocialLogin } from '../config/myService';
import '../Css/RegisterResponsive.css'
import { useSnackbar } from 'react-simple-snackbar'
import { useDispatch, useSelector } from 'react-redux';
import { ADD_USER } from '../State/actions/AddUserAction';
import { USER_SOCIAL } from '../State/actions/UserSocialLoginAction';
import { CHANGE_UUID } from '../State/actions/changeUUIDAction';
import { GET_CART } from '../State/actions/getCartAction';
import { cartActions } from '../State/actions/cartActions'
import { loginEnable } from '../State/actions/loginAction'
import jwt_decode from 'jwt-decode'
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
export default function RegisterPage() {
    const FirstName = useRef('');
    const LastName = useRef('');
    const Email = useRef('');
    const Password = useRef('');
    const ConfirmPassword = useRef('');
    const MobileNo = useRef('')
    const [openSnackbar] = useSnackbar(options)
    const regForEmail = RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/);
    const regForPassword = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/);
    const regFoMob = RegExp(/^[0-9]{10}$/)
    const regForName = RegExp(/[A-Za-z ]+/)
    const history = useNavigate()
    const dispatch = useDispatch()
    const ADDUSER = useSelector(state => state.addUserReducer)
    const Uuid = useSelector(state => state.loginReducer.uuid)
    const USERSOCIAL = useSelector(state => state.UserSocialReducer)
    const CHNAGEUUID = useSelector(state => state.ChangeUuidReducer)
    const GetCart = useSelector(state => state.cartReducer)
    const [ErrorRegister, setErrorRegister] = useState({ Errorfirstname: '', Errorlastname: '', ErrorEmail: '', ErrorPassword: '', ErrorConfirm: '', ErrorMobile: '' })
    const handle = (event) => {
        const name = event.target.name;
        switch (name) {
            case "FirstName":
                let error_for_firstname = regForName.test(FirstName.current.value) ? '' : 'Enter Valid First Name';
                setErrorRegister({
                    ...ErrorRegister, Errorfirstname: error_for_firstname
                })
                break;
            case "LastName":
                let error_for_lastname = regForName.test(LastName.current.value) ? '' : 'Enter Valid Last  Name';
                setErrorRegister({
                    ...ErrorRegister, Errorlastname: error_for_lastname
                })
                break;
            case "MobileNo":
                let error_for_mobile = regFoMob.test(MobileNo.current.value) ? '' : 'Enter Valid mobile number';
                setErrorRegister({
                    ...ErrorRegister, ErrorMobile: error_for_mobile
                })
                break;
            case "ConfirmPassword":
                let error_for_confirm = Password.current.value === ConfirmPassword.current.value ? '' : 'Password must be match';
                setErrorRegister({
                    ...ErrorRegister, ErrorConfirm: error_for_confirm
                })
                break;
            case "Email":
                let error_for_email = regForEmail.test(Email.current.value) ? '' : 'Enter Valid Email';
                setErrorRegister({
                    ...ErrorRegister, ErrorEmail: error_for_email
                })
                break;
            case "Password":
                let error_for_password = regForPassword.test(Password.current.value) ? '' : 'Enter Valid patterin '
                setErrorRegister({
                    ...ErrorRegister, ErrorPassword: error_for_password
                })
                break;
        }
    }
    const setnull = (event) => {
        const name = event.target.name;
        switch (name) {
            case "FirstName":
                setErrorRegister({
                    ...ErrorRegister, Errorfirstname: ''
                })
                break;
            case "LastName":
                setErrorRegister({
                    ...ErrorRegister, Errorlastname: ''
                })
                break;
            case "MobileNo":
                setErrorRegister({
                    ...ErrorRegister, ErrorMobile: ''
                })
                break;
            case "ConfirmPassword":
                setErrorRegister({
                    ...ErrorRegister, ErrorConfirm: ''
                })
                break;
            case "Email":
                setErrorRegister({
                    ...ErrorRegister, ErrorEmail: ''
                })
                break;
            case "Password":
                setErrorRegister({
                    ...ErrorRegister, ErrorPassword: ''
                })
                break;
        }
    }
    useEffect(() => {
        if (USERSOCIAL.success) {
            localStorage.removeItem('uuid')
            localStorage.setItem('_token', USERSOCIAL.msg.token)
            openSnackbar(USERSOCIAL.msg.msg)
            let decode = jwt_decode(USERSOCIAL.msg.token);
            let data = { id: decode.uid[0]._id, cartid: Uuid }
            dispatch(CHANGE_UUID(data))

        }
        else if (USERSOCIAL.success == false && USERSOCIAL.msg) {
            openSnackbar(USERSOCIAL.msg.msg)
        }
    }, [USERSOCIAL.success]);
    useEffect(() => {
        if (GetCart.msg) {
            dispatch(cartActions(GetCart.msg.cartData.count))
        }
    }, [GetCart]);

    useEffect(() => {
        if (CHNAGEUUID.success) {
            dispatch(loginEnable())
            let decode = jwt_decode(USERSOCIAL.msg.token);
            let data = { id: decode.uid[0]._id, cartid: Uuid }
            dispatch(GET_CART(data))
            history("/");
        }
        else if (CHNAGEUUID.success == false && CHNAGEUUID.msg) {
            openSnackbar(CHNAGEUUID.msg.msg)
        }
    }, [CHNAGEUUID.success]);

    const handleSocialLogin = (user) => {
        if (user) {
            console.log(user);
            dispatch(USER_SOCIAL(user._profile))
        }
    };
    useEffect(() => {
        if (ADDUSER.success) {
            openSnackbar(ADDUSER.msg.msg)
            history('/LoginPage')
        }
        else if (ADDUSER.success == false && ADDUSER.msg) {
            openSnackbar(ADDUSER.msg.msg)
        }
    }, [ADDUSER.success]);

    const handleSocialLoginFailure = (err) => {
        openSnackbar('Unable to login')
    };
    const RegisterUser = () => {
        let data = { firstname: FirstName.current.value, lastname: LastName.current.value, email: Email.current.value, password: Password.current.value, mobileno: MobileNo.current.value }
        console.log(data);
        if (ErrorRegister.ErrorConfirm == '' && ErrorRegister.ErrorEmail == '' && ErrorRegister.ErrorPassword == '' && ErrorRegister.Errorfirstname == '' && ErrorRegister.Errorlastname == '' && ErrorRegister.ErrorMobile == '') {
            dispatch(ADD_USER(data))
            // AddUser(data)
            //     .then(res => {
            //         console.log(res);
            //         if (res.data.err == 0) {
            //             openSnackbar(res.data.msg)
            //             history('/LoginPage')
            //         }
            //         else {
            //             openSnackbar(res.data.msg)
            //             console.log('error occured');
            //         }
            //     })
            //     .catch(err => {
            //         if (err) {
            //             history('/ServerError')
            //         }
            //     })
        }
    }
    return (<>

        <div className=' container-fluid allpadding'>

            <Row className='padding marginlogin mt-3'>
                <Col lg={12} className='text-center mr-3 socialsec'>
                    <SocialButton
                        provider="facebook"
                        appId={process.env.REACT_APP_FACEBOOKID}
                        onLoginSuccess={handleSocialLogin}
                        onLoginFailure={handleSocialLoginFailure}
                        className='SocialButton facebook text-white  mb-5'
                        size="lg"
                    >
                        <Facebook /> sign in with Facebook
                    </SocialButton>
                    <SocialButton
                        provider="google"
                        appId={process.env.REACT_APP_GOOGLEID}
                        onLoginSuccess={handleSocialLogin}
                        onLoginFailure={handleSocialLoginFailure}
                        className='SocialButton google ms-3 '

                        size="lg"
                    >
                        <Google /> sign in with Google
                    </SocialButton>
                </Col>
                <Col lg={3} />
                <Col lg={6} className='formdata'>
                    <Card className='bg-light'>
                        <Form className='p-3 formdata'>
                            <FormLabel ><h3>Register To NeoSTORE</h3></FormLabel>
                            <InputGroup className=' mt-2 mb-2'>
                                <FormControl type='text' placeholder='First Name' aria-describedby="basic-addon2" name='FirstName' /* className=' mt-2 mb-2' */ ref={FirstName} onBlur={handle} onFocus={setnull} />
                                <InputGroup.Text id="basic-addon2" className="bg-light"><TextareaT /></InputGroup.Text>
                            </InputGroup>
                            {ErrorRegister.Errorfirstname ? <FormLabel style={{ color: 'red' }} >{ErrorRegister.Errorfirstname}</FormLabel> : ''}
                            <InputGroup className=' mt-2 mb-2'>
                                <FormControl type='text' placeholder='Last Name ' name='LastName' /* className='p-2 mt-2 mb-2' */ ref={LastName} onBlur={handle} onFocus={setnull} />
                                <InputGroup.Text id="basic-addon2" className="bg-light"> <TextareaT /> </InputGroup.Text>
                            </InputGroup>
                            {ErrorRegister.Errorlastname ? <FormLabel style={{ color: 'red' }} >{ErrorRegister.Errorlastname}</FormLabel> : ''}
                            <InputGroup className=' mt-2 mb-2'>
                                <FormControl type='text' placeholder='Email Address ' name='Email' /* className='p-2 mt-2 mb-2' */ ref={Email} onBlur={handle} onFocus={setnull} />
                                <InputGroup.Text id="basic-addon2" className="bg-light"><Mailbox /></InputGroup.Text>
                            </InputGroup>
                            {ErrorRegister.ErrorEmail ? <FormLabel style={{ color: 'red' }} >{ErrorRegister.ErrorEmail}</FormLabel>
                                : ''}                          <InputGroup className='mt-2 mb-2'>
                                <FormControl type='password' placeholder='Password ' name='Password' /* className='p-2 mt-2 mb-2' */ ref={Password} onBlur={handle} onFocus={setnull} />

                            </InputGroup>
                            {ErrorRegister.ErrorPassword ? <FormLabel style={{ color: 'red' }} >{ErrorRegister.ErrorPassword}</FormLabel> : ''}
                            <InputGroup className='mt-2 mb-2'>
                                <FormControl type='password' placeholder='Confirm Password ' name='ConfirmPassword' /* className='p-2 mt-2 mb-2' */ ref={ConfirmPassword} onBlur={handle} onFocus={setnull} />

                            </InputGroup>
                            {ErrorRegister.ErrorConfirm ? <FormLabel style={{ color: 'red' }} >{ErrorRegister.ErrorConfirm}</FormLabel>
                                : ''}                            <InputGroup className=' mt-2 mb-2'>
                                <FormControl type='text' placeholder='Mobile No. ' name='MobileNo' /* className='p-2 mt-2 mb-2' */ ref={MobileNo} onBlur={handle} onFocus={setnull} />
                                <InputGroup.Text id="basic-addon2" className="bg-light"><Phone />  </InputGroup.Text>
                            </InputGroup>
                            {ErrorRegister.ErrorMobile ? <FormLabel style={{ color: 'red' }} >{ErrorRegister.ErrorMobile}</FormLabel> : ''}<br />
                            <Button onClick={RegisterUser} className='mt-1'>Register</Button>
                        </Form>
                        <Link to='/LoginPage' className='nav-link'>Existing User?</Link>
                    </Card>
                </Col>
                <Col lg={3} />
            </Row>
        </div>
    </>
    )
}
