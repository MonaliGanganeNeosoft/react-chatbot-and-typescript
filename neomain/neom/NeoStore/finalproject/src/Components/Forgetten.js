import React, { useRef, useState, useEffect } from 'react'
import { Button, Card, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap'
import CardHeader from 'react-bootstrap/esm/CardHeader'
import { Forgettenpass, GenrateOTP } from '../config/myService'
import { useNavigate } from 'react-router-dom'
import PageHeader from './PageHeader'
import { useSnackbar } from 'react-simple-snackbar'
import { useDispatch, useSelector } from 'react-redux'
import { Forget_password } from '../State/actions/forgetPasswordAction'
import { Genrate_OTP } from '../State/actions/genrateOtpAction'
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

export default function Forgetten() {
    const [flag, setflag] = useState(true)
    const [GenratedOtp, setGenratedOtp] = useState('')
    const [openSnackbar] = useSnackbar(options)
    const [UserEmail, setUserEmail] = useState('')
    const Email = useRef('')
    const NewPassword = useRef('')
    const ConfirmPassword = useRef('')
    const OTP = useRef('')
    const history = useNavigate()
    const dispatch = useDispatch()
    const GenratedOTP = useSelector(state => state.genrateOtpReducer.msg)
    const ForgetMsg = useSelector(state => state.forgetReducer.forgetpass)
    const [ErrorForgetten, setErrorForgetten] = useState({ ErrorNewPassword: '', ErrorConfirmPassword: '' })
    const regForPassword = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/);
    const sendotp = () => {
        let email = { email: Email.current.value }
        dispatch(Genrate_OTP(email))
        // GenrateOTP(email)
        //     .then(res => {
        //         if (res.data.err === 1) {
        //             openSnackbar(res.data.msg)
        //         }
        //         else {
        //             setUserEmail(email)
        //             console.log(res.data.otp);
        //             setGenratedOtp(res.data.otp)
        //             openSnackbar(res.data.msg)
        //             setflag(false)
        //         }
        //     })
        //     .catch(err => {
        //         if (err) {
        //             history('/ServerError')
        //         }
        //     })

    }
    useEffect(() => {
        if (GenratedOTP.otp) {
            setUserEmail(Email.current.value)
            setGenratedOtp(GenratedOTP.otp)
            openSnackbar(GenratedOTP.msg)
            setflag(false)
        }
    }, [GenratedOTP]);

    const handle = (event) => {
        const name = event.target.name;
        switch (name) {
            case "confirmpass":
                let error_for_confirm = NewPassword.current.value === ConfirmPassword.current.value ? '' : 'Password must be match';
                setErrorForgetten({
                    ...ErrorForgetten, ErrorConfirmPassword: error_for_confirm
                })
                break;

            case "newpass":
                let error_for_password = regForPassword.test(NewPassword.current.value) ? '' : 'Enter Valid pattern '
                setErrorForgetten({
                    ...ErrorForgetten, ErrorNewPassword: error_for_password
                })
                break;
        }
    }
    const setnull = (event) => {
        const name = event.target.name;
        switch (name) {

            case "confirmpass":
                setErrorForgetten({
                    ...ErrorForgetten, ErrorConfirmPassword: ''
                })
                break;

            case "newpass":
                setErrorForgetten({
                    ...ErrorForgetten, ErrorNewPassword: ''
                })
                break;
        }
    }
    useEffect(() => {
        if (ForgetMsg) {
            openSnackbar(ForgetMsg.msg)
            history('/LoginPage')
        }
    }, [ForgetMsg]);

    const changepass = () => {
        let otp = OTP.current.value;
        if (otp === GenratedOtp) {
            if (NewPassword.current.value != '' && ConfirmPassword.current.value != '') {
                let data = { email: UserEmail, password: NewPassword.current.value }
                dispatch(Forget_password(data))
                // Forgettenpass(data)
                //     .then(res => {
                //         if (res.data.err == 1) {
                //             openSnackbar(res.data.msg)
                //         }
                //         else {
                //             openSnackbar(res.data.msg)
                //             history('/LoginPage')
                //         }
                //     })
                //     .catch(err => {
                //         if (err) {
                //             history('/ServerError')
                //         }
                //     })
            }
            else {

                openSnackbar('Enter new password and confirm password')
            }
        }
        else {

            openSnackbar('Enter Valid Otp')
        }
    }
    return (<>

        <div className='container-fluid allpadding'>
            <Row>
                <Col lg={3} />
                <Col lg={6} className='text-center'>
                    <Card className='bg-light p-3'>
                        <CardHeader className='mb-3'>
                            <FormLabel ><h3>Recover Password</h3></FormLabel>
                        </CardHeader>
                        <Card.Text>

                            <FormGroup>
                                <FormControl type='email' name='email' placeholder='Enter Email here' className='mt-3 mb-3 inputotp' ref={Email} />
                            </FormGroup>
                            {
                                flag ?
                                    <Button variant='dark' className='m-3 ' onClick={sendotp}>Send OTP</Button> :
                                    <FormControl type='text' name='otp' placeholder='Enter OTP here' className='mt-3 mb-3 ' ref={OTP} />
                            }

                            <Form className='text-start'>
                                <FormControl type='password' name='newpass' placeholder='Enter New Password ' ref={NewPassword} onBlur={handle} onFocus={setnull} className='' />
                                {ErrorForgetten.ErrorNewPassword ? <FormLabel style={{ color: 'red' }} >{ErrorForgetten.ErrorNewPassword}</FormLabel> : ''}<br />
                                <FormControl type='password' name='confirmpass' placeholder='Enter confirm Password' ref={ConfirmPassword} onBlur={handle} onFocus={setnull} className='' />
                                {ErrorForgetten.ErrorConfirmPassword ? <FormLabel style={{ color: 'red' }} >{ErrorForgetten.ErrorConfirmPassword}</FormLabel> : ''}<br />
                                <div className='text-center'>
                                    <Button variant='dark' className='m-3' onClick={changepass}>Submit</Button>
                                </div>

                            </Form>
                        </Card.Text>
                    </Card>
                </Col>
                <Col lg={3} />
            </Row>
        </div>
    </>
    )
}
