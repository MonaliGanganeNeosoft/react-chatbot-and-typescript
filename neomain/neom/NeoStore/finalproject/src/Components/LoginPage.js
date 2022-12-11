import React, { useRef, useState ,useEffect } from 'react'
import { Button, Col, Form, FormControl, InputGroup, FormLabel, Row } from 'react-bootstrap'
import { Facebook, Google, Phone } from 'react-bootstrap-icons';
import SocialButton from './SocialButton'
import { Link, useNavigate } from 'react-router-dom';
import { ChangeUuid, CheckUser, UserSocialLogin, GETCARTCOUNT } from '../config/myService';
import jwt_decode from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux';
import '../Css/LoginResponsive.css'
import { loginEnable } from '../State/actions/loginAction'
import { cartActions } from '../State/actions/cartActions'
import { useSnackbar } from 'react-simple-snackbar'
import { USER_SOCIAL } from '../State/actions/UserSocialLoginAction';
import { CHANGE_UUID } from '../State/actions/changeUUIDAction';
import { GET_CART } from '../State/actions/getCartAction';
import { USER_LOGIN } from '../State/actions/UserLoginAction';
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
export default function LoginPage() {
    const Email = useRef('')
    const Password = useRef('')
    const [Error, setError] = useState({ Erroremail: '', ErrorPassword: '' })
    const history = useNavigate()
    const dispatch = useDispatch()
    const [openSnackbar] = useSnackbar(options)
    const Uuid = useSelector(state => state.loginReducer.uuid)
    const USERSOCIAL = useSelector(state => state.UserSocialReducer)
    const USERLOGIN = useSelector(state => state.UserLoginReducer)
    const CHNAGEUUID = useSelector(state => state.ChangeUuidReducer)
    const GetCart = useSelector(state => state.cartReducer)
    const regForEmail = RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/);
    const regForPassword = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/);
    const [HttpStatus, setHttpStatus] = useState();
    const handle = (event) => {
        const name = event.target.name;
        switch (name) {
            case "Email":
                let error_for_email = regForEmail.test(Email.current.value) ? '' : 'Enter Valid Email';
                setError({
                    ...Error, Erroremail: error_for_email
                })
                break;
            case "Password":
                let error_for_password = regForPassword.test(Password.current.value) ? '' : 'Enter Valid patterin '
                setError({
                    ...Error, ErrorPassword: error_for_password
                })
                break;
        }
    }
    const setnull = (event) => {
        const name = event.target.name;
        switch (name) {
            case "Email":
                setError({
                    ...Error, Erroremail: ''
                })
                break;
            case "Password":
                setError({
                    ...Error, ErrorPassword: ''
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
            if(USERSOCIAL.msg){
            let decode = jwt_decode(USERSOCIAL.msg.token);
            let data = { id: decode.uid[0]._id, cartid: Uuid }
            dispatch(GET_CART(data))
            history("/");
            }
            else{
                let decode = jwt_decode(USERLOGIN.msg.token);
                let data = { id: decode.uid[0]._id, cartid: Uuid }
                dispatch(GET_CART(data))
                history("/");
            }
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
    const handleSocialLoginFailure = (err) => {
        openSnackbar('Unable to Login')
    };
    useEffect(() => {
        if (USERLOGIN.success) {
            localStorage.removeItem('uuid')
            localStorage.setItem('_token', USERLOGIN.msg.token)
            openSnackbar(USERLOGIN.msg.msg)
            let decode = jwt_decode(USERLOGIN.msg.token);
            let data = { id: decode.uid[0]._id, cartid: Uuid }
            dispatch(CHANGE_UUID(data))

        }
        else if (USERLOGIN.success == false && USERLOGIN.msg) {
            openSnackbar(USERLOGIN.msg.msg)
        }
    }, [USERLOGIN.success]);
    const checkuser = () => {
        let data = { email: Email.current.value, password: Password.current.value }
        console.log(data);
        dispatch(USER_LOGIN(data))
        // CheckUser(data)
        //     .then((res) => {
        //         console.log(res);
        //         setHttpStatus(res.data.status)
        //         if (res.data.err == 0) {
        //             console.log(res);
        //             localStorage.removeItem('uuid')
        //             localStorage.setItem('_token', res.data.token)
        //             let decode = jwt_decode(res.data.token);
        //             console.log(decode.uid[0]);
        //             let data = { id: decode.uid[0]._id, cartid: Uuid }
        //             openSnackbar(res.data.msg)
        //             ChangeUuid(data)
        //                 .then(res => {
        //                     if (res.data.err == 0) {
        //                         dispatch(loginEnable())
        //                         // dispatch({ type: 'enable' })
        //                         let data = { id: decode.uid[0]._id }
        //                         GETCARTCOUNT(data)
        //                             .then(res => {
        //                                 console.log(res.data.count);
        //                                 dispatch(cartActions(res.data.count))
        //                                 // dispatch({ type: 'cart', payload: res.data.count })
        //                             })
        //                             .catch(err => {
        //                                 if (err) {
        //                                     history('/ServerError')
        //                                 }
        //                             })
        //                         history("/");
        //                     }

        //                 })
        //                 .catch(err => {
        //                     if (err) {
        //                         localStorage.clear()
        //                         history('/ServerError')
        //                     }
        //                 })

        //         }
        //         else {
        //             console.log(res.data.msg);
        //             openSnackbar(res.data.msg)
        //         }
        //     })
        // .catch(err => {
        //     console.log(err.StatusCode);
        //     console.log(err.message);
        //     // if (err) {
        //     //     history('/ServerError')
        //     // }
        // })

        if (HttpStatus === 401) {
            console.log(HttpStatus);
        }
    }
    return (
        <>

            <div className='container-fluid allpadding'>
                <Row className='paddingfooter marginlogin mt-5'>
                    <Col lg={6} className='text-center loginpad'>

                        <SocialButton
                            provider="facebook"
                            appId={process.env.REACT_APP_FACEBOOKID}
                            onLoginSuccess={handleSocialLogin}
                            onLoginFailure={handleSocialLoginFailure}
                            className='SocialButton facebook text-white'
                            size="lg"
                        >
                            <Facebook /> sign in with Facebook
                        </SocialButton><br />
                        <SocialButton
                            provider="google"
                            appId={process.env.REACT_APP_GOOGLEID}
                            onLoginSuccess={handleSocialLogin}
                            onLoginFailure={handleSocialLoginFailure}
                            className='SocialButton google'
                            size="lg"
                        >
                            <Google /> sign in with Google
                        </SocialButton>
                    </Col>
                    <Col lg={6} className='verticalline bg-light'>
                        <Form>
                            <FormLabel ><h3>Login To NeoSTORE</h3></FormLabel>
                            <InputGroup className='p-2 mt-2 mb-2'>
                                <FormControl type='text' placeholder='Email Address' name='Email' ref={Email} onBlur={handle} onFocus={setnull} />
                                <InputGroup.Text><Phone /></InputGroup.Text>
                            </InputGroup>
                            {Error.Erroremail ?
                                <FormLabel style={{ color: 'red' }} >{Error.Erroremail}</FormLabel> : ''}
                            <InputGroup className='p-2 mt-2 mb-2'>
                                <FormControl type='password' placeholder='Password ' name='Password' ref={Password} onBlur={handle} onFocus={setnull} />
                            </InputGroup>
                            {Error.ErrorPassword ?
                                <FormLabel style={{ color: 'red' }} >{Error.ErrorPassword}</FormLabel> : ''}
                            <br />
                            <Button className='p-2 mt-2 mb-2' onClick={checkuser} >Login</Button>
                        </Form>
                    </Col>
                    <Col lg={12} className='mt-3'>
                        <Row>
                            <Col lg={6} xs={6} sm={6} md={6} className='text-end'>
                                <Link to='/RegisterPage' className='nav-link'>Register Page</Link>
                            </Col>
                            <Col lg={6} xs={6} sm={6} md={6} className='verticallinesmall'>
                                <Link to='/Forgotten' className='nav-link'>Forgotten?</Link>
                            </Col>
                        </Row>
                    </Col>
                </Row>


            </div>
        </>
    )
}
