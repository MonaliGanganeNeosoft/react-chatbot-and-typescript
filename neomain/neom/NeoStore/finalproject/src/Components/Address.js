import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, FormGroup, Modal, Card, Col, Row } from 'react-bootstrap'
import { X } from 'react-bootstrap-icons'
import { DELETEAddress, EDITADDRESS, UserAddress } from '../config/myService'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-simple-snackbar'
import { EDIT_Address } from '../State/actions/editAddressAction'
import { DELETE_Address } from '../State/actions/deleteAddressAction'
import { ADD_Address } from '../State/actions/AddressAction'
import { loginDisable } from '../State/actions/loginAction'
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
export default function Address() {
    const [Show, setShow] = useState(false)
    const [User, setUser] = useState('')
    const [EditShow, setEditShow] = useState(false)
    const [UpdateAddress, setUpdateAddress] = useState('')
    const [openSnackbar] = useSnackbar(options)
    const UserAddress = useSelector(state => state.addAddressReducer)
    const EditAddres = useSelector(state => state.editAddressReducer)
    const DeleteAddress = useSelector(state => state.deleteAddressReducer)
    const Address = useRef('')
    const Pincode = useRef('')
    const City = useRef('')
    const State = useRef('')
    const Country = useRef('')
    const dispatch = useDispatch()
    const history = useNavigate()
    useEffect(() => {
        if (localStorage.getItem('_token')) {
            let token = localStorage.getItem('_token')
            let decode = jwt_decode(token);
            let data = decode.uid[0];
            setUser(data)
        }
    }, [])
    const NewAddress = () => {
        setShow(true)
    }
    useEffect(() => {
        if (UserAddress.success) {
            localStorage.setItem('_token', UserAddress.Address.token)
            let decode = jwt_decode(UserAddress.Address.token);
            let data = decode.uid[0];
            setUser(data)
            openSnackbar(UserAddress.Address.msg)
        }
        else if(UserAddress.success==false && UserAddress.Address.msg){
            if (UserAddress.Address.msg != 'Network Error') {
                openSnackbar('Session expired Login again please')
                localStorage.clear()
                dispatch(loginDisable())
                history('/LoginPage')
            }
            else {
                openSnackbar('Server Error')
                history('/ServerError')
            }
        }
    }, [UserAddress.Address.token]);
    useEffect(() => {
        if (EditAddres.success) {
            localStorage.setItem('_token', EditAddres.Address.token)
            let decode = jwt_decode(EditAddres.Address.token);
            let data = decode.uid[0];
            setUser(data)
            openSnackbar(EditAddres.Address.msg)
        }
        else  if(EditAddres.success==false && EditAddres.Address.msg){
            if (EditAddres.Address.msg != 'Network Error') {
                openSnackbar('Session expired Login again please')
                localStorage.clear()
                dispatch(loginDisable())
                history('/LoginPage')
            }
            else {
                openSnackbar('Server Error')
                history('/ServerError')
            }
        }
    }, [EditAddres.Address.token]);

    useEffect(() => {
        if (DeleteAddress.success) {
            localStorage.setItem('_token', DeleteAddress.Address.token)
            let decode = jwt_decode(DeleteAddress.Address.token);
            let data = decode.uid[0];
            setUser(data)
            openSnackbar(DeleteAddress.Address.msg)
        }
        else  if(DeleteAddress.success==false && DeleteAddress.Address.msg){
            if (DeleteAddress.Address.msg != 'Network Error') {
                openSnackbar('Session expired Login again please')
                localStorage.clear()
                dispatch(loginDisable())
                history('/LoginPage')
            }
            else {
                openSnackbar('Server Error')
                history('/ServerError')
            }
        }
    }, [DeleteAddress.Address.token]);


    const AddAddress = () => {
        let data = { address: Address.current.value, PinCode: Pincode.current.value, City: City.current.value, State: State.current.value, Country: Country.current.value }
        let finalData = { email: User.email, ADDRESS: data }
        dispatch(ADD_Address(finalData))
        setShow(false)
        // UserAddress(finalData)
        //     .then(res => {
        //         if (res.data.err == 1) {
        //             openSnackbar(res.data.msg)
        //         }
        //         else {
        //             localStorage.setItem('_token', res.data.token)
        //             let decode = jwt_decode(res.data.token);
        //             let data = decode.uid[0];
        //             setUser(data)
        //             openSnackbar(res.data.msg)
        //         }
        //     })
        //     .catch(err => {
        //         console.log(err.message);
        //         if (err.message != 'Network Error') {
        //             openSnackbar('Session expired Login again please')
        //             localStorage.clear()
        //             dispatch({ type: 'disable' })
        //             history('/LoginPage')
        //         }
        //         else {
        //             openSnackbar('Server Error')
        //             history('/ServerError')
        //         }
        //     })
        // setShow(false)
    }
    const deleteAddress = (element) => {
        let data = { email: User.email, address_id: element }
        dispatch(DELETE_Address(data))
        // DELETEAddress(data)
        //     .then(res => {
        //         if (res.data.err == 1) {
        //             openSnackbar(res.data.msg)
        //         }
        //         else {
        //             localStorage.setItem('_token', res.data.token)
        //             let decode = jwt_decode(res.data.token);
        //             let data = decode.uid[0];
        //             setUser(data)
        //             openSnackbar(res.data.msg)
        //         }
        //     })
        //     .catch(err => {
        //         if (err.message != 'Network Error') {
        //             openSnackbar('Session expired Login again please')
        //             localStorage.clear()
        //             dispatch({ type: 'disable' })
        //             history('/LoginPage')
        //         }
        //         else {
        //             history('/ServerError')
        //         }
        //     })
    }
    const Editstart = (element) => {
        setEditShow(true)
        setUpdateAddress(element)
    }
    const Updateaddress = () => {
        let data = { email: User.email, address: UpdateAddress }
        dispatch(EDIT_Address(data))
        setEditShow(false)
        // EDITADDRESS(data)
        //     .then(res => {
        //         if (res.data.err == 1) {
        //             openSnackbar(res.data.msg)
        //         }
        //         else {
        //             localStorage.setItem('_token', res.data.token)
        //             let decode = jwt_decode(res.data.token);
        //             let data = decode.uid[0];
        //             setUser(data)
        //             setEditShow(false)
        //             openSnackbar(res.data.msg)
        //         }
        //     })
        //     .catch(err => {
        //         if (err.message != 'Network Error') {
        //             openSnackbar('Session expired Login again please')
        //             localStorage.clear()
        //             dispatch({ type: 'disable' })
        //             history('/LoginPage')
        //         }
        //         else {
        //             history('/ServerError')
        //         }
        //     })
    }
    return (
        <div className='allpadding'>
            <h3>Address</h3>
            <hr />
            <table width='100%' className='border-bottom'>
                <tbody>
                    {
                        User.Address && User.Address.map((ele) =>
                            <Card className='p-3' key={ele.Address_id}>
                                <Row>
                                    <Col lg={10}>
                                        {ele.address}<br />
                                        {ele.City}-{ele.PinCode}<br />
                                        {ele.State},{ele.Country}<br />
                                        <Button onClick={() => Editstart(ele)}>Edit</Button>
                                    </Col>
                                    <Col lg={2} className='float-end'>
                                        <Button variant='danger' onClick={() => deleteAddress(ele.Address_id)}><X /></Button>
                                    </Col>
                                </Row>
                            </Card>
                        )
                    }
                </tbody>
            </table>

            <Button variant='outline-dark' className='mt-3' onClick={NewAddress}>Add Address</Button>
            <Modal centered
                show={Show}
                onHide={() => setShow(false)}>

                <Form className='m-5'>
                    <h3>Add new Address</h3><hr />
                    <FormGroup className='m-2'>
                        <Form.Control as='textarea' name='address' ref={Address} placeholder='Address' />
                        <Form.Text className="text-muted">
                            Max 100 characters
                        </Form.Text>
                    </FormGroup>
                    <FormGroup className='m-2'>
                        <Form.Control type='text' name='pincode' ref={Pincode} placeholder='pincode' />
                    </FormGroup>
                    <FormGroup className='m-2'>
                        <Form.Control type='text' name='city' ref={City} placeholder='City' />
                    </FormGroup >
                    <FormGroup className='m-2'>
                        <Form.Control type='text' name='state' ref={State} placeholder='State' />
                    </FormGroup>
                    <FormGroup className='m-2'>
                        <Form.Control type='text' name='country' ref={Country} placeholder='Country' />
                    </FormGroup>
                    <Button onClick={AddAddress}>Add Address</Button>
                </Form>
            </Modal>
            <Modal centered
                show={EditShow}
                onHide={() => setEditShow(false)}>

                <Form className='m-5'>
                    <h3>Edit Address</h3><hr />
                    <FormGroup className='m-2'>
                        <Form.Control as='textarea' name='address' value={UpdateAddress.address} onChange={(e) => setUpdateAddress({ ...UpdateAddress, address: e.target.value })} placeholder='Address' />
                        <Form.Text className="text-muted">
                            Max 100 characters
                        </Form.Text>
                    </FormGroup>
                    <FormGroup className='m-2'>
                        <Form.Control type='text' name='pincode' value={UpdateAddress.PinCode} onChange={(e) => setUpdateAddress({ ...UpdateAddress, PinCode: e.target.value })} placeholder='pincode' />
                    </FormGroup>
                    <FormGroup className='m-2'>
                        <Form.Control type='text' name='city' value={UpdateAddress.City} onChange={(e) => setUpdateAddress({ ...UpdateAddress, City: e.target.value })} placeholder='City' />
                    </FormGroup >
                    <FormGroup className='m-2'>
                        <Form.Control type='text' name='state' value={UpdateAddress.State} onChange={(e) => setUpdateAddress({ ...UpdateAddress, State: e.target.value })} placeholder='State' />
                    </FormGroup>
                    <FormGroup className='m-2'>
                        <Form.Control type='text' name='country' value={UpdateAddress.Country} onChange={(e) => setUpdateAddress({ ...UpdateAddress, Country: e.target.value })} placeholder='Country' />
                    </FormGroup>
                    <Button onClick={Updateaddress}>Edit Address</Button>
                </Form>
            </Modal>
        </div>
    )
}
