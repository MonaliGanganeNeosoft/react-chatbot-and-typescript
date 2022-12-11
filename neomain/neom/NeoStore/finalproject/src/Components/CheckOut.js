import React, { useEffect, useState, useRef } from 'react'
import jwt_decode from 'jwt-decode'
import { CONFIRMORDER, DELETECONFIRMEDORDER, GETCART, GETCARTCOUNT } from '../config/myService';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Nav, Row, Tab, Table, Card, Button, Form, Modal, FormGroup } from 'react-bootstrap'
import { CreditCard, X } from 'react-bootstrap-icons';
import { UserAddress, DELETEAddress, EDITADDRESS } from '../config/myService'
import '../Css/CheckOut.css'
import { useSnackbar } from 'react-simple-snackbar'
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { EDIT_Address } from '../State/actions/editAddressAction'
import { DELETE_Address } from '../State/actions/deleteAddressAction'
import { ADD_Address } from '../State/actions/AddressAction'
import { cartActions } from '../State/actions/cartActions';
import { GET_CART } from '../State/actions/getCartAction'
import { Confirm_Order } from '../State/actions/confirmOrderAction';
import { DELETE_Confrim_order } from '../State/actions/deleteConfirmAction';
import { loginDisable } from '../State/actions/loginAction';
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
export default function CheckOut() {
    const [openSnackbar] = useSnackbar(options)
    const [CartItems, setCartItems] = useState('')
    const [UserData, setUserData] = useState('')
    const dispatch = useDispatch()
    const [SelectedAddress, setSelectedAddress] = useState('')
    const history = useNavigate()
    const [Review, setReview] = useState({ Subtotal: 0, GST: 0, OrderTotal: 0 })
    const [Show, setShow] = useState('')
    const [EditShow, setEditShow] = useState(false)
    const [UpdateAddress, setUpdateAddress] = useState('')
    const [CreditCardError, setCreditCardError] = useState({ cvc: '', cardname: '', cardnumber: '', cardexpiry: '' });
    const [show, setshow] = useState(false)
    const Address = useRef('')
    const Pincode = useRef('')
    const City = useRef('')
    const State = useRef('')
    const Country = useRef('')
    const UserAddress = useSelector(state => state.addAddressReducer)
    const EditAddres = useSelector(state => state.editAddressReducer)
    const DeleteAddress = useSelector(state => state.deleteAddressReducer)
    const cart = useSelector(state => state.getCartReducer.cartData)
    const OrderMsg = useSelector(state => state.confirmOrderReducer.msg)
    const [CardDetails, setCardDetails] = useState({ cvc: '', expiry: '', focused: '', name: '', number: '', issuer: "" });
    const regForCVC = RegExp(/^[0-9]{3}$/)
    const regFoCardNumber = RegExp(/^[0-9]{16}$/)
    const regForDate = RegExp(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/)
    const regForCardName = RegExp(/[A-Za-z ]+/)
    useEffect(() => {
        let token = localStorage.getItem('_token')
        let decode = jwt_decode(token);
        let data = decode.uid[0]._id;
        setUserData(decode.uid[0])
        let id = { id: data }
        dispatch(GET_CART(id))
        // GETCART(id)
        //     .then(res => {
        //         setCartItems(res.data.cartData)
        //         let Subtotal = 0;
        //         let GST = 0;
        //         let OrderTotal = 0;
        //         res.data.cartData.forEach(element => {
        //             Subtotal = Subtotal + element.total_Productcost;
        //         });
        //         GST = (Subtotal * (5 / 100)) / 100;
        //         OrderTotal = Subtotal + GST;
        //         setReview({
        //             ...Review, Subtotal: Subtotal, GST: GST, OrderTotal: OrderTotal
        //         })
        //     })
        //     .catch(err => {
        //         console.log(err.message);
        //         if (err.message != 'Network Error') {
        //             localStorage.clear()
        //             dispatch({ type: 'disable' })
        //             openSnackbar('Session expired Login again please')
        //             history('/LoginPage')
        //         }
        //         else {
        //             history('/ServerError')
        //         }
        //     })
    }, [])
    useEffect(() => {
        if (cart.cartData) {
            setCartItems(cart.cartData)
            let Subtotal = 0;
            let GST = 0;
            let OrderTotal = 0;
            cart.cartData.forEach(element => {
                Subtotal = Subtotal + element.total_Productcost;
            });
            GST = (Subtotal * (5 / 100)) / 100;
            OrderTotal = Subtotal + GST;
            setReview({
                ...Review, Subtotal: Subtotal, GST: GST, OrderTotal: OrderTotal
            })
            dispatch(cartActions(cart.cartData.length))
        }
    }, [cart.cartData]);
    useEffect(() => {
        if (OrderMsg.msg) {
            openSnackbar(OrderMsg.msg)
            let id = { id: UserData._id }
            dispatch(DELETE_Confrim_order(id))
            dispatch(GET_CART(id))
            handleClose()
        }
    }, [OrderMsg.msg]);



    const orderconfirm = async () => {
        if (SelectedAddress) {
            let data = { delivery_address: SelectedAddress, product_id: CartItems, total_Productcost: Review.OrderTotal, customer_id: UserData._id, email: UserData.email, cart: CartItems, Subtotal: Review.Subtotal }
            dispatch(Confirm_Order(data))
            // CONFIRMORDER(data)
            //     .then((res) => {
            //         if (res.data.err == 0) {
            //             console.log(res.data.err);
            //             let id1 = { id: UserData._id }
            //             console.log(id1);
            //             openSnackbar(res.data.msg)
            //             DELETECONFIRMEDORDER(id1).then(res => {
            //                 console.log(res.data);
            //                 if (res.data.err == 0) {
            //                     console.log(res.data);
            //                     let id2 = { id: UserData._id }
            //                     GETCARTCOUNT(id2)
            //                         .then((res) => {
            //                             console.log(res.data.count);
            //                             let count = res.data.count
            //                             dispatch({ type: 'cart', payload: count })
            //                             handleClose()
            //                         })
            //                 }
            //             })
            //                 .catch(err => {
            //                     console.log(err);
            //                     if (err.message != 'Network Error') {
            //                         localStorage.clear()
            //                         dispatch({ type: 'disable' })
            //                         openSnackbar('Session expired Login again please')
            //                         history('/LoginPage')
            //                     }
            //                     else {
            //                         history('/ServerError')
            //                     }
            //                 })
            //         }

            //     })
            //     .catch(err => {
            //         console.log(err);
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
        else {
            openSnackbar('Please select Address')
        }
    }
    const handleClose = () => {
        setshow(false)
        history('/Order')
    };
    const handleShow = () => setshow(true);
    const NewAddress = () => {
        setShow(true)
    }
    useEffect(() => {
        if (UserAddress.success) {
            localStorage.setItem('_token', UserAddress.Address.token)
            let decode = jwt_decode(UserAddress.Address.token);
            let data = decode.uid[0];
            setUserData(data)
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
    }, [UserAddress.success]);
    useEffect(() => {
        if (EditAddres.success) {
            localStorage.setItem('_token', EditAddres.Address.token)
            let decode = jwt_decode(EditAddres.Address.token);
            let data = decode.uid[0];
            setUserData(data)
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
    }, [EditAddres.success]);

    useEffect(() => {
        if (DeleteAddress.success) {
            localStorage.setItem('_token', DeleteAddress.Address.token)
            let decode = jwt_decode(DeleteAddress.Address.token);
            let data = decode.uid[0];
            setUserData(data)
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
    }, [DeleteAddress.success]);


    const AddAddress = () => {
        let data = { address: Address.current.value, PinCode: Pincode.current.value, City: City.current.value, State: State.current.value, Country: Country.current.value }
        let finalData = { email: UserData.email, ADDRESS: data }
        dispatch(ADD_Address(finalData))
        // UserAddress(finalData)
        //     .then(res => {
        //         if (res.data.err == 1) {
        //             openSnackbar(res.data.msg)
        //         }
        //         else {
        //             localStorage.setItem('_token', res.data.token)
        //             let decode = jwt_decode(res.data.token);
        //             let data = decode.uid[0];
        //             setUserData(data)
        //             openSnackbar(res.data.msg)
        //         }
        //     })
        //     .catch(err => {
        //         console.log(err.message);
        //         if (err.message != 'Network Error') {
        //             localStorage.clear()
        //             dispatch({ type: 'disable' })
        //             dispatch({ type: 'cart', payload: 0 })
        //             openSnackbar('Session expired Login again please')
        //             history('/LoginPage')
        //         }
        //         else {
        //             history('/ServerError')
        //         }
        //     })
        setShow(false)
    }
    const deleteAddress = (element) => {
        let data = { email: UserData.email, address_id: element }
        console.log(data);
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
        //             openSnackbar(res.data.msg)
        //             setUserData(data)
        //         }
        //     })
        //     .catch(err => {
        //         if (err.message != 'Network Error') {
        //             localStorage.clear()
        //             dispatch({ type: 'disable' })
        //             dispatch({ type: 'cart', payload: 0 })
        //             openSnackbar('Session expired Login again please')
        //             history('/LoginPage')
        //         }
        //         else {
        //             history('/ServerError')
        //         }
        //     })
    }
    const Editstart = (element) => {
        console.log(element);
        setEditShow(true)
        setUpdateAddress(element)
    }
    const Updateaddress = () => {
        console.log(UpdateAddress);
        let data = { email: UserData.email, address: UpdateAddress }
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
        //             setUserData(data)
        //             setEditShow(false)
        //             openSnackbar(res.data.msg)
        //         }
        //     })
        //     .catch(err => {
        //         if (err.message != 'Network Error') {
        //             dispatch({ type: 'disable' })
        //             dispatch({ type: 'cart', payload: 0 })
        //             openSnackbar('Session expired Login again please')
        //             history('/LoginPage')
        //             localStorage.clear()
        //         }
        //         else {
        //             history('/ServerError')
        //         }
        //     })
    }

    const handleCallback = ({ issuer }, isValid) => {
        if (isValid) {
            setCardDetails({ issuer });
        }
    };
    const handleInputFocus = ({ target }) => {
        setCardDetails({
            ...CardDetails, focused: target.name
        });
    };

    const handleInputChange = ({ target }) => {
        setCardDetails({ ...CardDetails, [target.name]: target.value });
    };
    const handleerror = ({ target }) => {
        switch (target.name) {
            case 'name':
                let error_for_cardname = regForCardName.test(target.value) ? '' : 'Enter Valid Card Name';
                setCreditCardError({
                    ...CreditCardError, cardname: error_for_cardname
                })
                break;
            case 'number':
                let error_for_cardnumber = regFoCardNumber.test(target.value) ? '' : 'Enter Valid Card Number';
                setCreditCardError({
                    ...CreditCardError, cardnumber: error_for_cardnumber
                })
                break;
            case 'expiry':
                let date = new Date()
                let month = date.getMonth() + 1;
                let year = date.getFullYear().toString().slice(2)
                let getMonth = parseInt(target.value / 100)
                let getYear = target.value.toString().slice(2)
                let error_for_expiry = regForDate.test(target.value) && ((year < getYear) || (year == getYear && month < getMonth)) ? '' : 'Enter Valid expiry date (month/year)';
                setCreditCardError({
                    ...CreditCardError, cardexpiry: error_for_expiry
                })
                break;
            case 'cvc':
                let error_for_cvc = regForCVC.test(target.value) ? '' : 'CVC should be 3 ';
                setCreditCardError({
                    ...CreditCardError, cvc: error_for_cvc
                })
                break;
            default:
                break;
        }
    }
    return (
        <div className='allpadding'>
            <Container fluid>
                <Tab.Container id="left-tabs-example" defaultActiveKey="Order">
                    <Row>
                        <Col lg={3} className='text-center mt-2'>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="Order" className='bottom-border'>Order</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Address" className='bottom-border '>Address</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col lg={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="Order">
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Qauntity</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {CartItems && CartItems.map((element) =>
                                                <tr key={element._id}>
                                                    <td>
                                                        <table >
                                                            <tbody >
                                                                <tr>
                                                                    <td>
                                                                        <img src={`/Image/${element.product_id.product_image}`} className='imagesize' />
                                                                    </td>
                                                                    <td>
                                                                        <span className='productname'>{element.product_id.product_name}</span> <br />
                                                                        <span className='margincheck'>Status :<span className='stock '>In Stock</span></span>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                    <td>
                                                        <span > {element.quantity}</span>
                                                    </td>
                                                    <td >
                                                        {element.product_cost}
                                                    </td>
                                                    <td>
                                                        {element.total_Productcost}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                    <Card className='review'>
                                        <Card.Header>
                                            <h3 className='revie text-center' > Review Order</h3>
                                        </Card.Header>
                                        <Card.Body>
                                            <Table>
                                                <tr>
                                                    <td height='50px'>Subtotal</td>
                                                    <td className='text-end'> {Review.Subtotal} </td>
                                                </tr>
                                                <tr>
                                                    <td height='50px'>GST (5%)</td>
                                                    <td className='text-end'> {Review.GST} </td>
                                                </tr>
                                                <tr>
                                                    <td height='50px'>OrderTotal</td>
                                                    <td className='text-end'> {Review.OrderTotal} </td>
                                                </tr>
                                            </Table>
                                        </Card.Body>

                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Address">
                                    <div className='addresstab'>

                                        <h3>Shipping Address</h3>
                                        <hr />
                                        <Form>{
                                            UserData.Address && UserData.Address.map((ele) =>
                                                <Form.Check
                                                    type='radio'
                                                    name='address'
                                                    key={ele._id}
                                                    onChange={() => setSelectedAddress(ele)}
                                                    id={ele}
                                                    className='mt-3 mb-3'
                                                    label={
                                                        <Card className='p-3 addresssec'  >
                                                            <Row>
                                                                <Col lg={10} className='orderaddress'>
                                                                    {ele.address}<br />
                                                                    {ele.City}-{ele.PinCode}<br />
                                                                    {ele.State},{ele.Country}<br />
                                                                    <Button className='buton' onClick={() => Editstart(ele)}>Edit</Button>
                                                                </Col>
                                                                <Col lg={2} className='float-end'>
                                                                    <Button variant='danger' className='buton' onClick={() => deleteAddress(ele.Address_id)}><X /></Button>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                    } />
                                            )}
                                        </Form>
                                        <Button variant='outline-dark' onClick={NewAddress} className='buttonmargin'>Add Address</Button>

                                    </div>
                                    <div className='text-center m-3'>
                                        <Button onClick={() => setshow(true)} >Confirm Order</Button>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
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
                        <Button variant="outline-dark" onClick={AddAddress}>Add Address</Button>
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
                <Modal show={show} onHide={() => setshow(false)} centered>
                    <Modal.Body className='text-center'>
                        <div id="PaymentForm">
                            <Cards
                                cvc={CardDetails.cvc}
                                expiry={CardDetails.expiry}
                                focused={CardDetails.focused}
                                name={CardDetails.name}
                                number={CardDetails.number}
                            />
                            <form action="" className="form-class">
                                <input
                                    type="text"
                                    name="name"
                                    className="input-class"
                                    placeholder="Your Name"
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    onBlur={handleerror}
                                />
                                {
                                    CreditCardError.cardname ?
                                        <div className="red text-start">
                                            {CreditCardError.cardname}
                                        </div> : ''
                                }
                                <input
                                    type="number"
                                    name="number"
                                    className="input-class"
                                    placeholder="Card Number"
                                    maxLength={16}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    onBlur={handleerror}
                                />
                                {
                                    CreditCardError.cardnumber ?
                                        <div className="red text-start">
                                            {CreditCardError.cardnumber}
                                        </div> : ''
                                }
                                <input
                                    type="number"
                                    name="expiry"
                                    className="input-class"
                                    placeholder="Expire Date"
                                    maxLength={4}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    onBlur={handleerror}
                                />
                                {
                                    CreditCardError.cardexpiry ?
                                        <div className="red text-start">
                                            {CreditCardError.cardexpiry}
                                        </div> : ''
                                }
                                <input
                                    type="number"
                                    name="cvc"
                                    className="input-class"
                                    placeholder="CVC"
                                    maxLength={3}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    onBlur={handleerror}
                                />

                                {
                                    CreditCardError.cvc ?
                                        <div className="red text-start">
                                            {CreditCardError.cvc}
                                        </div> : ''
                                }
                            </form>
                        </div>
                        <div className="d-grid">
                            <Button variant="primary" size="lg" onClick={orderconfirm}>
                                <CreditCard /> Pay  CheckOut
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    )
}
