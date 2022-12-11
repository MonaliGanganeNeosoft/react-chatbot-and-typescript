import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import { Button, Form, InputGroup, Table } from 'react-bootstrap'
import { Pen } from 'react-bootstrap-icons'
import { ProfileUpdate } from '../config/myService'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-simple-snackbar'
import { loginDisable } from '../State/actions/loginAction'
import { Update_Profile } from '../State/actions/profileUpdateAction'
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
export default function Profile() {
    const [User, setUser] = useState('')
    const [show, setshow] = useState(true)
    const [openSnackbar] = useSnackbar(options)
    const [UpdateUser, setUpdateUser] = useState('')
    const NewProfile = useSelector(state => state.profileUpdateReducer.msg)
    const history = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        if (localStorage.getItem('_token')) {
            let token = localStorage.getItem('_token')
            let decode = jwt_decode(token);
            let data = decode.uid[0]
            setUser(data)
            setUpdateUser(data)
        }
    }, [])
    const handleClose = () => setshow(true);
    const handleShow = () => {
        setshow(false)
    }
    const profileupdate = () => {
        console.log(UpdateUser);
        dispatch(Update_Profile(UpdateUser))
        // ProfileUpdate(UpdateUser)
        //     .then(res => {
        //         if (res.data.err == 1) {
        //             console.log(res.data.msg);
        //             openSnackbar(res.data.msg)
        //         }
        //         else {
        //             localStorage.setItem('_token', res.data.token)
        //             let decode = jwt_decode(res.data.token);
        //             let updatedata = decode.uid[0]
        //             console.log(updatedata);
        //             setUser(updatedata)
        //             setUpdateUser(updatedata)
        //             setshow(true)
        //             openSnackbar(res.data.msg)
        //         }
        //     })
        //     .catch(err => {
        //         if (err.message != 'Network Error') {
        //             localStorage.clear()
        //             dispatch(loginDisable(''))
        //             // dispatch({ type: 'disable' })
        //             openSnackbar('Session expired Login again please')
        //             history('/LoginPage')
        //         }
        //         else {
        //             history('/ServerError')
        //         }
        //     })
    }
    useEffect(() => {
        if (NewProfile) {
            localStorage.setItem('_token', NewProfile.token)
            let decode = jwt_decode(NewProfile.token);
            let updatedata = decode.uid[0]
            setUser(updatedata)
            setUpdateUser(updatedata)
            setshow(true)
            openSnackbar(NewProfile.msg)
        }
    }, [NewProfile]);

    return (
        <div className='allpadding' >
            <h3>Profile</h3>
            <hr />
            {
                show ?
                    (<>
                        <Table className='p-3'>
                            <tbody>
                                <tr>
                                    <td>First Name</td>
                                    <td>{User.firstname}</td>
                                </tr>
                                <tr>
                                    <td>Last Name</td>
                                    <td>{User.lastname}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{User.email}</td>
                                </tr>
                                <tr>
                                    <td>Mobile Number</td>
                                    {User.mobileno ?
                                        <td>{User.mobileno}</td> : <td>-</td>
                                    }
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <Button variant='outline-dark' onClick={handleShow}> <Pen /> Edit</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table></>) :
                    (<>
                        <Form>
                            <Form.Label>First Name</Form.Label>
                            <InputGroup>
                                <Form.Control type='text' name='FirstName' value={UpdateUser.firstname} onChange={(e) => setUpdateUser({ ...UpdateUser, firstname: e.target.value })} /* ref={firstname} */ />
                            </InputGroup>
                            <Form.Label>Last Name</Form.Label>
                            <InputGroup>
                                <Form.Control type='text' name='LastName' value={UpdateUser.lastname} onChange={(e) => setUpdateUser({ ...UpdateUser, lastname: e.target.value })}   /* ref={lastname}  */ />
                            </InputGroup>
                            <Form.Label>Email</Form.Label>
                            <InputGroup>
                                <Form.Control type='email' name='Email' value={UpdateUser.email}  /* ref={Email} */ disabled />
                            </InputGroup>
                            <Form.Label>Mobile Number</Form.Label>
                            <InputGroup>
                                <Form.Control type='text' name='mobileno' value={UpdateUser.mobile} onChange={(e) => setUpdateUser({ ...UpdateUser, mobileno: e.target.value })} /*  ref={mobileno} */ />
                            </InputGroup>
                            <Button className='mt-2' onClick={profileupdate}> <Pen /> Edit</Button>
                            <Button className='mt-2 ms-2' variant='secondary' onClick={handleClose}>Cancel</Button>
                        </Form></>)}
        </div>
    )
}
