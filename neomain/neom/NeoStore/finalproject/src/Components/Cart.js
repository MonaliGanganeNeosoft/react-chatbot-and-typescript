import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { DECQUANTITY, DELETEITEM, GETCART, INCQUANTITY, GETCARTCOUNT } from '../config/myService'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import '../Css/Cart.css'
import { Trash } from 'react-bootstrap-icons'
import { useSnackbar } from 'react-simple-snackbar'
import { cartActions } from '../State/actions/cartActions'
import { GET_CART } from '../State/actions/getCartAction'
import { Add_Quantity } from '../State/actions/addQuantityAction'
import { Sub_Quantity } from '../State/actions/subQuantityAction'
import { Delete_item } from '../State/actions/deleteItemAction'
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
export default function Cart() {
    const uuid = useSelector(state => state.loginReducer.uuid)
    const [CartItems, setCartItems] = useState([])
    const Login = useSelector(state => state.loginReducer.Login)
    const [openSnackbar] = useSnackbar(options)
    const history = useNavigate()
    const dispatch = useDispatch()
    const CartDAta = useSelector(state => state.getCartReducer.cartData)
    const AddQuanMsg = useSelector(state => state.addQuantityReducer)
    const SubQuanMsg = useSelector(state => state.DecQuantityReducer)
    const DeleteIetmMsg = useSelector(state => state.deleteItemReducer)
    const [Review, setReview] = useState({ Subtotal: 0, GST: 0, OrderTotal: 0 })

    useEffect(() => {
        if (Login) {
            let token = localStorage.getItem('_token')
            let decode = jwt_decode(token);
            let data = decode.uid[0]._id;
            let id = { id: data }
            dispatch(GET_CART(id))
        }
        else {
            let id = { id: uuid }
            dispatch(GET_CART(id))
        }
    }, [])
    useEffect(() => {
        if (CartDAta) {
            setCartItems(CartDAta.cartData)
            let Subtotal = 0;
            let GST = 0;
            let OrderTotal = 0;
            CartDAta.cartData.forEach(element => {
                Subtotal = Subtotal + element.total_Productcost;
            });
            GST = (Subtotal * (5 / 100)) / 100;
            OrderTotal = Subtotal + GST;
            setReview({
                ...Review, Subtotal: Subtotal, GST: GST, OrderTotal: OrderTotal
            })
            dispatch(cartActions(CartDAta.cartData.length))
        }
    }, [CartDAta.cartData]);
    useEffect(() => {
        if (AddQuanMsg.msg) {
            openSnackbar(AddQuanMsg.msg.msg)
            if (Login) {
                let token = localStorage.getItem('_token')
                let decode = jwt_decode(token);
                let data = decode.uid[0]._id;
                let id = { id: data }
                dispatch(GET_CART(id))
            }
            else {
                let id = { id: uuid }
                dispatch(GET_CART(id))
            }
        }
    }, [AddQuanMsg.msg]);

    useEffect(() => {
        if (SubQuanMsg.msg) {
            openSnackbar(SubQuanMsg.msg.msg)
            if (Login) {
                let token = localStorage.getItem('_token')
                let decode = jwt_decode(token);
                let data = decode.uid[0]._id;
                let id = { id: data }
                dispatch(GET_CART(id))
            }
            else {
                let id = { id: uuid }
                dispatch(GET_CART(id))
            }
        }
    }, [SubQuanMsg.msg]);

    useEffect(() => {
        if (DeleteIetmMsg.msg) {
            openSnackbar(DeleteIetmMsg.msg.msg)
            if (Login) {
                let token = localStorage.getItem('_token')
                let decode = jwt_decode(token);
                let data = decode.uid[0]._id;
                let id = { id: data }
                dispatch(GET_CART(id))
            }
            else {
                let id = { id: uuid }
                dispatch(GET_CART(id))
            }
        }
    }, [DeleteIetmMsg.msg]);
    const AddQuantity = (element) => {
        let id = { id: element._id }
        dispatch(Add_Quantity(id))
        // INCQUANTITY(id)
        //     .then(res => {
        //         if (res.data.err == 0) {
        //             let cid = { id: element.customer_id }
        //             openSnackbar(res.data.msg)
        //             GETCART(cid)
        //                 .then(res => {
        //                     setCartItems(res.data.cartData)
        //                     let Subtotal = 0;
        //                     let GST = 0;
        //                     let OrderTotal = 0;
        //                     res.data.cartData.forEach(element => {
        //                         Subtotal = Subtotal + element.total_Productcost;
        //                     });
        //                     GST = (Subtotal * (5 / 100)) / 100;
        //                     OrderTotal = Subtotal + GST;
        //                     setReview({
        //                         ...Review, Subtotal: Subtotal, GST: GST, OrderTotal: OrderTotal
        //                     })
        //                 })
        //                 .catch(err => {
        //                     if (err) {
        //                         history('/ServerError')
        //                     }
        //                 })
        //         }
        //         else {
        //             openSnackbar(res.data.msg)
        //         }
        //     })
        //     .catch(err => {
        //         if (err) {
        //             history('/ServerError')
        //         }
        //     })

    }
    const DecQuantity = (element) => {
        let id = { id: element._id }
        dispatch(Sub_Quantity(id))
        // DECQUANTITY(id)
        //     .then(res => {
        //         if (res.data.err == 0) {
        //             let cid = { id: element.customer_id }
        //             openSnackbar(res.data.msg)
        //             GETCART(cid)
        //                 .then(res => {
        //                     setCartItems(res.data.cartData)
        //                     let Subtotal = 0;
        //                     let GST = 0;
        //                     let OrderTotal = 0;
        //                     res.data.cartData.forEach(element => {
        //                         Subtotal = Subtotal + element.total_Productcost;
        //                     });
        //                     GST = (Subtotal * (5 / 100)) / 100;
        //                     OrderTotal = Subtotal + GST;
        //                     setReview({
        //                         ...Review, Subtotal: Subtotal, GST: GST, OrderTotal: OrderTotal
        //                     })
        //                 })
        //                 .catch(err => {
        //                     if (err) {
        //                         history('/ServerError')
        //                     }
        //                 })
        //         }
        //         else {
        //             openSnackbar(res.data.msg)
        //         }
        //     })
        //     .catch(err => {
        //         if (err) {
        //             history('/ServerError')
        //         }
        //     })
    }
    const checkout = () => {
        if (CartItems[0]) {
            if (Login) {
                history('/CheckOut')
            }
            else {
                openSnackbar('Need to Login First')
                history('/LoginPage')
            }
        }
        else {
            openSnackbar('Please Select items')
        }

    }
    const deleteItem = (element) => {
        let id = { id: element._id }
        dispatch(Delete_item(id))

        // DELETEITEM(id)
        //     .then(res => {
        //         if (res.data.err == 0) {
        //             let cid = { id: element.customer_id }
        //             openSnackbar(res.data.msg)
        //             GETCART(cid)
        //                 .then(res => {
        //                     setCartItems(res.data.cartData)
        //                     let Subtotal = 0;
        //                     let GST = 0;
        //                     let OrderTotal = 0;
        //                     res.data.cartData.forEach(element => {
        //                         Subtotal = Subtotal + element.total_Productcost;
        //                     });
        //                     GST = (Subtotal * (5 / 100)) / 100;
        //                     OrderTotal = Subtotal + GST;
        //                     setReview({
        //                         ...Review, Subtotal: Subtotal, GST: GST, OrderTotal: OrderTotal
        //                     })
        //                     let data = { id: element.customer_id }
        //                     GETCARTCOUNT(data)
        //                         .then(res => {
        //                             dispatch(cartActions(res.data.count))
        //                             // dispatch({ type: 'cart', payload: res.data.count })
        //                         })
        //                         .catch(err => {
        //                             if (err) {
        //                                 history('/ServerError')
        //                             }
        //                         })
        //                 })
        //                 .catch(err => {
        //                     if (err) {
        //                         history('/ServerError')
        //                     }
        //                 })
        //         }
        //         else {
        //             openSnackbar(res.data.msg)
        //         }
        //     })
        //     .catch(err => {
        //         if (err) {
        //             history('/ServerError')
        //         }
        //     })
    }
    return (
        <div className='allpadding'>
            <Container fluid>
                <Row className='mt-2'>

                    <Col lg={8}>
                        <Table className='Carts' responsive>
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
                                            {element.quantity == 1 ?
                                                <Button variant='danger' className='butn' disabled>-</Button>
                                                :
                                                <Button variant='danger' className='butn' onClick={() => DecQuantity(element)}>-</Button>
                                            }
                                            <span className='border'> {element.quantity}</span>
                                            {
                                                element.quantity == 10 ?
                                                    <Button variant='danger' className='butn' disabled>+</Button> :
                                                    <Button variant='danger' className='butn' onClick={() => AddQuantity(element)}>+</Button>
                                            }
                                        </td>
                                        <td >
                                            {element.product_cost}
                                        </td>
                                        <td>
                                            {element.total_Productcost}
                                        </td>
                                        <td>
                                            <Button variant='light' onClick={() => deleteItem(element)}>
                                                <Trash style={{ color: 'red' }} />
                                            </Button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                    <Col lg={4} className='mb-5'>
                        <Card className='review'>
                            <Card.Header>
                                <h3 className='text-center revie'> Review Order</h3>
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
                                <div className="d-grid gap-2">

                                    <Button onClick={checkout} >Procedd To Buy</Button>
                                </div>
                            </Card.Body>

                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
